import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    InputPortNode: IFlowNodeMeta<
      'InputPortNode',
      {
        nodeID: 'String';
        outputKey: 'String';
      } & BaseInput,
      {
        data: 'Message';
      }
    >;
  }
}

export const InputPortNodeRegisterData: IFlowNodeTypeRegisterData<'InputPortNode'> = {
  define: {
    className: 'InputPortNode',
    cnName: '输入端口',
    input: {
      nodeID: { title: '节点', dataType: 'String' as const },
      outputKey: { title: '端口', dataType: 'String' as const },
      ...BaseInput,
    },
    output: {
      data: { title: '输出', dataType: 'Message' as const },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
