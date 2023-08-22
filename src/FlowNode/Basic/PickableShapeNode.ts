import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';
import { Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    PickableShapeNode: IFlowNodeMeta<
      'PickableShapeNode',
      {
        name: 'String';
        size: 'Vector3';
        position: 'Vector3';
        rotation: 'Vector3';
        active: 'Boolean';
      } & BaseInput,
      {
        mesh: 'Node';
      }
    >;
  }
}

export const PickableShapeNodeRegisterData: IFlowNodeTypeRegisterData<'PickableShapeNode'> = {
  define: {
    className: 'PickableShapeNode',
    cnName: '交互轮廓',
    input: {
      name: { title: '名称', dataType: 'String', defaultValue: '轮廓' },
      size: { title: '尺寸', dataType: 'Vector3', defaultValue: new Vector3(1, 1, 1) },
      position: { title: '位置', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      rotation: { title: '旋转', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      active: { title: '激活', dataType: 'Boolean', defaultValue: true },
      ...BaseInput,
    },
    output: {
      mesh: { title: '节点', dataType: 'Node' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
