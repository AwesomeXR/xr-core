import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    MeshInstanceNode: IFlowNodeMeta<
      'MeshInstanceNode',
      {
        url: 'String';
        meshName: 'String';
        position: 'Vector3';
        scaling: 'Vector3';
        rotation: 'Vector3';
        visible: 'Boolean';
      } & BaseInput,
      {
        boundBox: 'BoundBox';
        position: 'Vector3';
        scaling: 'Vector3';
        rotation: 'Vector3';
        upVec: 'Vector3';
        forwardVec: 'Vector3';
        rightVec: 'Vector3';
      } & BaseOutput
    >;
  }
}

export const MeshInstanceNodeRegisterData: IFlowNodeTypeRegisterData<'MeshInstanceNode'> = {
  define: {
    className: 'MeshInstanceNode',
    cnName: '网格实例',
    input: {
      url: { title: '源', dataType: 'String', defaultValue: 'https://rshop.tech/gw/cube.glb' },
      meshName: { title: '网格名称', dataType: 'String' },
      position: { title: '位置', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      scaling: { title: '缩放', dataType: 'Vector3', defaultValue: new Vector3(1, 1, 1) },
      rotation: { title: '旋转', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      visible: { title: '可见', dataType: 'Boolean', defaultValue: true },
      ...BaseInput,
    },
    output: {
      boundBox: { title: '包围盒', dataType: 'BoundBox' },
      position: { title: '位置', dataType: 'Vector3' },
      scaling: { title: '缩放', dataType: 'Vector3' },
      rotation: { title: '旋转', dataType: 'Vector3' },
      upVec: { title: '上矢量', dataType: 'Vector3' },
      forwardVec: { title: '前矢量', dataType: 'Vector3' },
      rightVec: { title: '右矢量', dataType: 'Vector3' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
