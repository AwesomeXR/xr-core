import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    Vector3Node: IFlowNodeMeta<
      'Vector3Node',
      {
        x: 'Number';
        y: 'Number';
        z: 'Number';
      } & BaseInput,
      {
        vector: 'Vector3';
      }
    >;
  }
}

export const Vector3NodeRegisterData: IFlowNodeTypeRegisterData<'Vector3Node'> = {
  define: {
    className: 'Vector3Node',
    cnName: '3D 矢量',
    input: {
      x: { dataType: 'Number', defaultValue: 0 },
      y: { dataType: 'Number', defaultValue: 0 },
      z: { dataType: 'Number', defaultValue: 0 },
      ...BaseInput,
    },
    output: {
      vector: { dataType: 'Vector3' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
