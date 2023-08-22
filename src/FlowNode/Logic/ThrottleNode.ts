import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { getCurrentTimestamp } from '../../lib';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ThrottleNode: IFlowNodeMeta<
      'ThrottleNode',
      {
        data: 'Message';
        duration: 'Number';
      } & BaseInput,
      {
        data: 'Message';
      } & BaseOutput
    >;
  }
}

export const ThrottleNodeRegisterData: IFlowNodeTypeRegisterData<'ThrottleNode'> = {
  define: {
    className: 'ThrottleNode',
    cnName: '节流',
    input: {
      data: { title: '数据', dataType: 'Message' },
      duration: { title: '延时', dataType: 'Number', defaultValue: 200 },
      ...BaseInput,
    },
    output: {
      data: { title: '数据', dataType: 'Message' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    let lastCallTime: number | undefined;

    function flush() {
      const { data, duration = 200 } = ctx.input;

      const curTime = getCurrentTimestamp();

      if (lastCallTime) {
        if (curTime - lastCallTime > duration) {
          lastCallTime = curTime;
          ctx.output.data = data;
        }
      } else {
        lastCallTime = curTime;
        ctx.output.data = data;
      }
    }

    ctx.event.listen('input:change:data', flush);
    ctx.event.listen('input:change:duration', flush);

    flush();

    return () => {};
  },
};
