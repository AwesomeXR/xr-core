import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ConnectorNode: IFlowNodeMeta<
      'ConnectorNode',
      {
        nodeID: 'String';
        outputKey: 'String';
      } & BaseInput,
      {
        data: 'Message';
      } & BaseOutput
    >;
  }
}

export const ConnectorNodeRegisterData: IFlowNodeTypeRegisterData<'ConnectorNode'> = {
  define: {
    className: 'ConnectorNode',
    cnName: '连接器',
    input: {
      nodeID: { title: '节点', dataType: 'String' },
      outputKey: { title: '端口', dataType: 'String' },
      ...BaseInput,
    },
    output: {
      data: { title: '输出', dataType: 'Message' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    function flush() {
      const node = ctx.input.nodeID ? ctx.host.flowNodeManager.get(ctx.input.nodeID) : undefined;

      if (node && ctx.input.outputKey && node._define.output[ctx.input.outputKey]) {
        ctx.output.data = node.output[ctx.input.outputKey];
      }
    }

    const removeListen = ctx.host.event.listen('node:output:change', ev => {
      if (ev.key === ctx.input.outputKey && ev.source.ID === ctx.input.nodeID && ev.source.host === ctx.host) {
        ctx.output.data = ev.value;
      }
    });

    ctx.event.listen('input:change:nodeID', flush);
    ctx.event.listen('input:change:outputKey', flush);

    // load right now
    flush();

    ctx.output.loaded = true;

    return () => {
      removeListen();
    };
  },
};
