import { IFlowDTKey, IFlowNodeMeta, IFlowNodeOutput, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    DictionaryExpandNode: IFlowNodeMeta<
      'DictionaryExpandNode',
      {
        data: 'Message';
        keys: 'JSON';
      } & BaseInput,
      {
        [x: string]: 'Message';
      }
    >;
  }
}

export const DictionaryExpandNodeRegisterData: IFlowNodeTypeRegisterData<'DictionaryExpandNode'> = {
  define: {
    className: 'DictionaryExpandNode',
    cnName: '数据集展开',
    input: {
      data: { title: '数据', dataType: 'Message' },
      keys: { dataType: 'JSON' },
      ...BaseInput,
    },
    output: {},
  },
  setup(ctx) {
    let isDefineUpdated = false;

    function updateDefineIfNeeded() {
      if (isDefineUpdated) return;

      const dataKeys = (ctx.input.keys as string[]) || Object.keys(ctx.input.data || {});
      if (dataKeys.length === 0) return;

      const oldOutIoKeys = Object.keys(ctx._define.output);
      const toAddOutKeys = dataKeys.filter(k => !oldOutIoKeys.includes(k));

      if (toAddOutKeys.length === 0) return;

      // 添加输出节点定义
      const newOutDef = Object.assign(
        {},
        ctx._define.output,
        toAddOutKeys.reduce((data, key) => {
          let dataType: IFlowDTKey = 'Message';
          return {
            ...data,
            ['output_' + key]: { dataType, title: key } as IFlowNodeOutput<IFlowDTKey>,
          };
        }, {})
      );
      ctx.updateDefine({ output: newOutDef });

      ctx.input.keys = toAddOutKeys;
      isDefineUpdated = true;
    }

    function flush_data() {
      updateDefineIfNeeded();

      if (!ctx.input.data) return;

      for (const outKey of Object.keys(ctx._define.output)) {
        if (!outKey.startsWith('output_')) continue;

        ctx.output[outKey] = ctx.input.data[outKey.replace(/^output_/, '')];
      }
    }

    flush_data();

    ctx.event.listen('input:change:data', flush_data);

    return () => {};
  },
};
