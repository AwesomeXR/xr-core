import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    JSONDataNode: IFlowNodeMeta<
      'JSONDataNode',
      {
        data: 'JSON';
      } & BaseInput,
      {
        data: 'Message';
      } & BaseOutput
    >;
  }
}

export const JSONDataNodeRegisterData: IFlowNodeTypeRegisterData<'JSONDataNode'> = {
  define: {
    className: 'JSONDataNode',
    cnName: '数据源',
    input: {
      data: { title: '源', dataType: 'JSON', defaultValue: {} },
      ...BaseInput,
    },
    output: {
      data: { title: '值', dataType: 'Message' },

      ...BaseOutput,
    },
  },
  setup(ctx) {
    function reload() {
      ctx.output.data = ctx.input.data;
      ctx.output.loaded = true;
    }

    ctx.event.listen('input:change:data', reload);
    reload();

    return () => {};
  },
};
