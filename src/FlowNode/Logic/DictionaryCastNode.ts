import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    DictionaryCastNode: IFlowNodeMeta<
      'DictionaryCastNode',
      {
        extraTargetIoDefs: 'JSON';
        mode: 'String';
        target_0: 'Message';
      } & BaseInput,
      {
        data: 'Message';
      }
    >;
  }
}

export const DictionaryCastNodeRegisterData: IFlowNodeTypeRegisterData<'DictionaryCastNode'> = {
  define: {
    className: 'DictionaryCastNode',
    cnName: '数据集合并',
    input: {
      extraTargetIoDefs: { dataType: 'JSON' },
      mode: { title: '合并模式', dataType: 'String', defaultValue: 'assign' },
      target_0: { title: '对象_0', dataType: 'Message' },
      ...BaseInput,
    },
    output: {
      data: { title: '数据集', dataType: 'Message' },
    },
  },
  setup(ctx) {
    const flush = () => {
      const mode = ctx.input.mode;
      if (!mode) return;

      const data: any = {};

      Object.keys(ctx._define.input).forEach(ioKey => {
        if (ioKey.startsWith('target_')) {
          const target = (ctx.input as any)[ioKey];

          if (mode === 'assign') {
            if (typeof target !== 'object') return;
            Object.assign(data, target);
          }
          //
          else if (mode === 'set') {
            if (typeof target === 'undefined') return;
            data[ioKey] = target;
          }
        }
      });

      ctx.output.data = data;
    };

    ctx.event.delegate((_type, _ev) => {
      const isSomeTargetChanged = _type.startsWith('input:change:target_');
      if (isSomeTargetChanged) {
        flush();
      }
    });

    ctx.event.listen('connect:change:input', ev => {
      if (ev.action === 'add') {
        const targetIoKeys = Object.keys(ctx._define.input).filter(ioKey => ioKey.startsWith('target_'));

        const isAllConnected = targetIoKeys.every(
          k => ctx.host.flowEdgeManager.filter(undefined, undefined, ctx.ID, k).length > 0
        );

        // 全连接的情况下，要新增 target_n 端口
        if (isAllConnected) {
          const idx = targetIoKeys.length;
          const ioKey = `target_${idx}`;

          const newInputDef = Object.assign({}, ctx._define.input, {
            [ioKey]: { title: `对象_${idx}`, dataType: 'Message' },
          });

          ctx.updateDefine({ input: newInputDef });

          ctx.input.extraTargetIoDefs = {
            ...ctx.input.extraTargetIoDefs,
            [ioKey]: { title: `对象_${idx}`, dataType: 'Message' },
          };
        }
      }
    });

    // 初始化 io define
    if (ctx.input.extraTargetIoDefs) {
      const newInputDef = Object.assign({}, ctx._define.input, ctx.input.extraTargetIoDefs);
      ctx.updateDefine({ input: newInputDef });
    }

    flush();

    return () => {};
  },
};
