import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    MeshNode: IFlowNodeMeta<
      'MeshNode',
      {
        node: 'Node';
        material: 'Material';
      } & BaseInput,
      {
        position: 'Vector3';
        rotation: 'Vector3';
        material: 'Material';
      }
    >;
  }
}

export const MeshNodeRegisterData: IFlowNodeTypeRegisterData<'MeshNode'> = {
  define: {
    className: 'MeshNode',
    cnName: '节点控制器',
    input: {
      node: { title: '节点', dataType: 'Node' },
      material: { title: '材质', dataType: 'Material' },
      ...BaseInput,
    },
    output: {
      position: { title: '位置', dataType: 'Vector3' },
      rotation: { title: '旋转', dataType: 'Vector3' },
      material: { title: '材质', dataType: 'Material' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
