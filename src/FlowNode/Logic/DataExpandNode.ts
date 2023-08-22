import { FlowDTRegistry, IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { getData } from '../../lib/getData';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    DataExpandNode: IFlowNodeMeta<
      'DataExpandNode',
      {
        config: 'InputDefs';
        data: 'Message';
      } & BaseInput,
      {} & BaseOutput
    >;
  }
}

export const DataExpandNodeRegisterData: IFlowNodeTypeRegisterData<'DataExpandNode'> = {
  define: {
    className: 'DataExpandNode',
    cnName: '数据提取',
    input: {
      config: { dataType: 'InputDefs' },
      data: { title: '数据', dataType: 'Message' },
      ...BaseInput,
    },
    output: { ...BaseOutput },
  },
  setup(ctx) {
    const originOutputDef = JSON.parse(JSON.stringify(ctx._define.output));

    function flushOutput() {
      const { config, data } = ctx.input;
      if (!config) return;

      for (const item of config) {
        const dt = FlowDTRegistry.Default.get(item.def.dataType);

        let itemValue = typeof data !== 'undefined' ? getData(data, item.key, item.def.defaultValue) : undefined;
        if (dt && dt.wrap && typeof itemValue !== 'undefined') itemValue = dt.wrap(itemValue);

        // input.data 没有值也输出 undefined
        (ctx.output as any)[item.key] = itemValue;
      }
    }

    function reloadAll() {
      // 设置 io
      const { config } = ctx.input;
      if (!config) return;

      const newOutputDef = { ...originOutputDef } as any;
      for (const item of config) {
        newOutputDef[item.key] = item.def;
      }

      ctx.updateDefine({ output: newOutputDef });

      flushOutput();
      ctx.output.loaded = true;
    }

    ctx.event.listen('input:change:config', reloadAll);
    ctx.event.listen('input:change:data', flushOutput);

    reloadAll();

    return () => {};
  },
};
