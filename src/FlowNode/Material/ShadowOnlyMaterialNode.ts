import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ShadowOnlyMaterialNode: IFlowNodeMeta<
      'ShadowOnlyMaterialNode',
      {} & BaseInput,
      {
        material: 'Material';
      }
    >;
  }
}

export const ShadowOnlyMaterialNodeRegisterData: IFlowNodeTypeRegisterData<'ShadowOnlyMaterialNode'> = {
  define: {
    className: 'ShadowOnlyMaterialNode',
    cnName: '阴影材质',
    input: {
      ...BaseInput,
    },
    output: {
      material: { title: '材质', dataType: 'Material' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
