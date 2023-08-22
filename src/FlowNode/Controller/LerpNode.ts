import { IFlowDTKey, IFlowNodeMeta, IFlowNodeTypeRegisterData, Util } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { LerpManager } from '../../lib';
import { Scalar, Vector2, Vector3, Color3, Color4 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    LerpNode: IFlowNodeMeta<
      'LerpNode',
      {
        dataType: 'String';
        target: 'JSON';
        duration: 'Number';
      } & BaseInput,
      {
        value: 'Message';
      } & BaseOutput
    >;
  }
}

export const LerpNodeRegisterData: IFlowNodeTypeRegisterData<'LerpNode'> = {
  define: {
    className: 'LerpNode',
    cnName: '缓动',
    input: {
      dataType: { title: '数值类型', dataType: 'String' },
      target: { title: '目标值', dataType: 'JSON' },
      duration: { title: '持续毫秒', dataType: 'Number' },
      ...BaseInput,
    },
    output: {
      value: { title: '值', dataType: 'Message' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    let lerpFn: ((start: any, end: any, amount: number) => any) | undefined;

    const lerpMng = new LerpManager<any>(
      ctx.host,
      (start, end, amount) => (lerpFn ? lerpFn(start, end, amount) : start),
      data => {
        ctx.output.value = data;
      }
    );

    function reloadAll() {
      if (!ctx.input.dataType) return;

      const dataType = ctx.input.dataType as IFlowDTKey;

      // 动态更新 input define
      const newInputDef = { ...ctx._define.input };
      newInputDef.target = { title: '目标值', dataType: dataType as any };

      ctx.updateDefine({ input: newInputDef });

      if (dataType === 'Number') lerpFn = Scalar.Lerp.bind(Scalar);
      else if (dataType === 'Vector2') lerpFn = Vector2.Lerp.bind(Vector2);
      else if (dataType === 'Vector3') lerpFn = Vector3.Lerp.bind(Vector3);
      else if (dataType === 'Color3') lerpFn = Color3.Lerp.bind(Color3);
      else if (dataType === 'Color4') lerpFn = Color4.Lerp.bind(Color4);
      else lerpFn = undefined;

      lerpUpdate();

      ctx.output.loaded = true;
    }

    function lerpUpdate() {
      if (typeof ctx.input.target === 'undefined') return;
      lerpMng.update(ctx.input.target, ctx.input.duration || 0);
    }

    const flusher = Util.createNodeFlusher(ctx, {
      _meta: function () {},
      dataType: reloadAll,
      target: lerpUpdate,
      duration: function () {},
    });

    flusher.bindInputEvent();
    reloadAll();

    return () => {
      lerpMng.destroy();
    };
  },
};
