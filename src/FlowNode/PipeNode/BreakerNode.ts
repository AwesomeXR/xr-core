import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    BreakerNode: IFlowNodeMeta<
      'BreakerNode',
      {
        connected: 'Boolean';
        flushEmptyWhenDisconnect: 'Boolean';
        data: 'Message';
      } & BaseInput,
      {
        data: 'Message';
      } & BaseOutput
    >;
  }
}

export const BreakerNodeRegisterData: IFlowNodeTypeRegisterData<'BreakerNode'> = {
  define: {
    className: 'BreakerNode',
    cnName: '断路器',
    input: {
      connected: { title: '连通', dataType: 'Boolean', defaultValue: true },
      flushEmptyWhenDisconnect: { title: '断开时清空输出', dataType: 'Boolean', defaultValue: true },
      data: { title: '数据', dataType: 'Message' },
      ...BaseInput,
    },
    output: {
      data: { title: '数据', dataType: 'Message' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    function flush() {
      if (ctx.input.connected) {
        ctx.output.data = ctx.input.data;
      }
      //
      else if (!ctx.input.connected && ctx.input.flushEmptyWhenDisconnect) {
        ctx.output.data = undefined;
      }
    }

    ctx.event.listen('input:change:connected', flush);
    ctx.event.listen('input:change:flushEmptyWhenDisconnect', flush);
    ctx.event.listen('input:change:data', flush);

    flush();

    return () => {};
  },
};
