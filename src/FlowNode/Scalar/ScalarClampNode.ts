import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ScalarClampNode: IFlowNodeMeta<
      'ScalarClampNode',
      {
        value: 'Number';
        min: 'Number';
        max: 'Number';
      } & BaseInput,
      {
        value: 'Number';
      }
    >;
  }
}

export const ScalarClampNodeRegisterData: IFlowNodeTypeRegisterData<'ScalarClampNode'> = {
  define: {
    className: 'ScalarClampNode',
    cnName: '数值钳制',
    input: {
      value: { dataType: 'Number', title: '数值' },
      min: { dataType: 'Number', title: '最小值' },
      max: { dataType: 'Number', title: '最大值' },
      ...BaseInput,
    },
    output: {
      value: { dataType: 'Number', title: '数值' },
    },
  },
  setup(ctx) {
    const flush = () => {
      if (typeof ctx.input.value === 'undefined') return;

      let value = ctx.input.value;
      if (typeof ctx.input.min === 'number' && value < ctx.input.min) value = ctx.input.min;
      if (typeof ctx.input.max === 'number' && ctx.input.max < value) value = ctx.input.max;

      ctx.output.value = value;
    };

    ctx.event.listen('input:change:min', flush);
    ctx.event.listen('input:change:max', flush);
    ctx.event.listen('input:change:value', flush);

    flush();

    return () => {};
  },
};
