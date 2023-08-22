import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ShadowOnlyNode: IFlowNodeMeta<
      'ShadowOnlyNode',
      {
        applyMesh: 'Node';
      } & BaseInput,
      {} & BaseOutput
    >;
  }
}

export const ShadowOnlyNodeRegisterData: IFlowNodeTypeRegisterData<'ShadowOnlyNode'> = {
  define: {
    className: 'ShadowOnlyNode',
    cnName: '仅阴影',
    input: {
      applyMesh: { title: '作用节点', dataType: 'Node' },
      ...BaseInput,
    },
    output: { ...BaseOutput },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
