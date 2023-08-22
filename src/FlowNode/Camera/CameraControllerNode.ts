import { IFlowNode, IFlowNodeMeta, IFlowNodeTypeRegisterData, Util } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { LerpManager } from '../../lib';
import { Quaternion, Vector2, Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    CameraControllerNode: IFlowNodeMeta<
      'CameraControllerNode',
      {
        activePlacement: 'String';
        duration: 'Number';
        hierarchyFind: 'Boolean';
      } & BaseInput,
      {
        position: 'Vector3';
        target: 'Vector3';
        screenOffset: 'Vector2';
      } & BaseOutput
    >;
  }
}

type ILerpData = { position: Vector3; target: Vector3; screenOffset: Vector2 };

export const CameraControllerNodeRegisterData: IFlowNodeTypeRegisterData<'CameraControllerNode'> = {
  define: {
    className: 'CameraControllerNode',
    cnName: '机位控制器',
    input: {
      activePlacement: { title: '激活机位名称', dataType: 'String' },
      duration: { title: '持续时长(ms)', dataType: 'Number', defaultValue: 1000 },
      hierarchyFind: { title: '子层级查找', dataType: 'Boolean', defaultValue: true },
      ...BaseInput,
    },
    output: {
      position: { title: '位置', dataType: 'Vector3' },
      target: { title: '指向目标', dataType: 'Vector3' },
      screenOffset: { title: '屏幕偏移', dataType: 'Vector2' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    let lerpStartInfo:
      | {
          doLerp: (amount: number) => ILerpData;
        }
      | undefined;

    const camLerpMng = new LerpManager<ILerpData>(
      ctx.host,
      (start, end, amount) => {
        if (!lerpStartInfo) {
          return {
            position: Vector3.Lerp(start.position, end.position, amount),
            target: Vector3.Lerp(start.target, end.target, amount),
            screenOffset: Vector2.Lerp(start.screenOffset, end.screenOffset, amount),
          };
        }

        let ret = lerpStartInfo.doLerp(amount);
        lerpStartInfo = undefined;

        return ret;
      },
      ({ position, target, screenOffset }) => {
        ctx.output.position = position;
        ctx.output.target = target;
        ctx.output.screenOffset = screenOffset;
      },
      (start, end) => {
        lerpStartInfo = calcLerpStartInfo(start, end);
      }
    );

    function reload(forceZeroDuration?: boolean, forceNode?: IFlowNode<'CameraPlacementNode'>) {
      if (!ctx.input.activePlacement) return;

      let placementNode: IFlowNode<'CameraPlacementNode'> | undefined;

      if (forceNode) {
        if (forceNode.input.name === ctx.input.activePlacement) placementNode = forceNode;
      } else {
        const foundNodes: IFlowNode<'CameraPlacementNode'>[] = [];
        ctx.host.event.emit('travelNode', {
          _capture: true,
          tap(n) {
            if (Util.isFlowNode('CameraPlacementNode', n)) foundNodes.push(n);
          },
        });
        placementNode = foundNodes.find(n => n.input.name === ctx.input.activePlacement);
      }

      if (!placementNode || !placementNode.input.position || !placementNode.input.target) return;
      const { position, target, screenOffset } = placementNode.input;

      camLerpMng.update(
        { position, target, screenOffset: new Vector2(screenOffset?.x, screenOffset?.y) },
        forceZeroDuration ? 0 : ctx.input.duration || 0
      );
    }

    const flusher = Util.createNodeFlusher(ctx, {
      activePlacement: function () {
        reload();
      },
      _meta: function () {},
      duration: function () {},
      hierarchyFind: function () {
        reload();
      },
    });

    flusher.bindInputEvent();
    ctx.host.event.listen('__afterCameraPlacementNodeChange', ev => reload(true, ev.node));

    reload();

    return () => {
      camLerpMng.destroy();
    };
  },
};

// function lineIntersection(
//   l1: { x1: number; x2: number; y1: number; y2: number },
//   l2: { x1: number; x2: number; y1: number; y2: number }
// ) {
//   //快速排斥实验
//   if (
//     (l1.x1 > l1.x2 ? l1.x1 : l1.x2) < (l2.x1 < l2.x2 ? l2.x1 : l2.x2) ||
//     (l1.y1 > l1.y2 ? l1.y1 : l1.y2) < (l2.y1 < l2.y2 ? l2.y1 : l2.y2) ||
//     (l2.x1 > l2.x2 ? l2.x1 : l2.x2) < (l1.x1 < l1.x2 ? l1.x1 : l1.x2) ||
//     (l2.y1 > l2.y2 ? l2.y1 : l2.y2) < (l1.y1 < l1.y2 ? l1.y1 : l1.y2)
//   ) {
//     return false;
//   }
//   //跨立实验
//   if (
//     ((l1.x1 - l2.x1) * (l2.y2 - l2.y1) - (l1.y1 - l2.y1) * (l2.x2 - l2.x1)) *
//       ((l1.x2 - l2.x1) * (l2.y2 - l2.y1) - (l1.y2 - l2.y1) * (l2.x2 - l2.x1)) >
//       0 ||
//     ((l2.x1 - l1.x1) * (l1.y2 - l1.y1) - (l2.y1 - l1.y1) * (l1.x2 - l1.x1)) *
//       ((l2.x2 - l1.x1) * (l1.y2 - l1.y1) - (l2.y2 - l1.y1) * (l1.x2 - l1.x1)) >
//       0
//   ) {
//     return false;
//   }

//   return true;
// }

function calcLerpStartInfo(start: ILerpData, end: ILerpData) {
  const p1 = start.position;
  const p2 = end.position;
  const forward = p2.subtract(p1);

  const lookV1 = start.target.subtract(p1).normalize();
  const lookV2 = end.target.subtract(p2).normalize();

  const t1 = forward.subtract(lookV1.scale(Vector3.Dot(forward, lookV1)));
  const t2 = forward.subtract(lookV2.scale(Vector3.Dot(forward, lookV2)));

  const isStartPosTargetEqual = start.position.equalsWithEpsilon(start.target);

  let doLerp: (amount: number) => ILerpData;

  if (!isStartPosTargetEqual) {
    const rotQ = Quaternion.FromUnitVectorsToRef(lookV1, lookV2, Quaternion.Zero());
    const r0 = new Quaternion(0, 0, 0, 1);

    doLerp = amount => {
      const position = Vector3.Hermite(start.position, t1, end.position, t2, amount);
      const r = Quaternion.Slerp(r0, rotQ, amount);
      const target = position.add(lookV1.applyRotationQuaternion(r));
      const screenOffset = Vector2.Lerp(start.screenOffset, end.screenOffset, amount);
      return { position, target, screenOffset };
    };
  }

  //
  else {
    doLerp = amount => {
      const position = Vector3.Hermite(start.position, t1, end.position, t2, amount);
      const target = Vector3.Lerp(start.target, end.target, amount);
      const screenOffset = Vector2.Lerp(start.screenOffset, end.screenOffset, amount);
      return { position, target, screenOffset };
    };
  }

  return { doLerp };
}
