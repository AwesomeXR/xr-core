import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { Vector3 } from '../../Math/math.vector';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    CameraPlacementNode: IFlowNodeMeta<
      'CameraPlacementNode',
      {
        name: 'String';
        position: 'Vector3';
        target: 'Vector3';
        screenOffset: 'Vector2';
      } & BaseInput,
      {} & BaseOutput
    >;
  }
}

export const CameraPlacementNodeRegisterData: IFlowNodeTypeRegisterData<'CameraPlacementNode'> = {
  define: {
    className: 'CameraPlacementNode',
    cnName: '机位',
    input: {
      name: { title: '名称', dataType: 'String' },
      position: { title: '位置', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      target: { title: '指向目标', dataType: 'Vector3' },
      screenOffset: { title: '屏幕偏移', dataType: 'Vector2' },
      ...BaseInput,
    },
    output: { ...BaseOutput },
  },
  setup(ctx) {
    // 这是个空节点，只记录信息，没有逻辑

    function notice() {
      ctx.host.event.emit('__afterCameraPlacementNodeChange', { node: ctx, _bubble: true });
    }

    ctx.event.listen('input:change:name', notice);
    ctx.event.listen('input:change:position', notice);
    ctx.event.listen('input:change:target', notice);
    ctx.event.listen('input:change:screenOffset', notice);

    notice();

    return () => {};
  },
};
