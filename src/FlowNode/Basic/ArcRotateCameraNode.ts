import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ArcRotateCameraNode: IFlowNodeMeta<
      'ArcRotateCameraNode',
      {
        name: 'String';
        isOrthographic: 'Boolean';
        alpha: 'Number';
        beta: 'Number';
        radius: 'Number';
        fov: 'Number';
        target: 'Vector3';
        allowControl: 'Boolean';
        allowMove: 'Boolean';
      } & BaseInput,
      {
        position: 'Vector3';
        camera: 'Camera';
      }
    >;
  }
}

export const ArcRotateCameraNodeRegisterData: IFlowNodeTypeRegisterData<'ArcRotateCameraNode'> = {
  define: {
    className: 'ArcRotateCameraNode',
    cnName: '轨道相机',
    input: {
      name: { title: '名称', dataType: 'String' },
      isOrthographic: { title: '正交模式', dataType: 'Boolean' },
      allowControl: { title: '允许交互', dataType: 'Boolean', defaultValue: true },
      allowMove: { title: '允许平移', dataType: 'Boolean' },
      alpha: { title: '旋转角', dataType: 'Number' },
      beta: { title: '俯仰角', dataType: 'Number' },
      radius: { title: '距离', dataType: 'Number' },
      fov: { title: '视角', dataType: 'Number' },
      target: { title: '指向目标', dataType: 'Vector3' },
      ...BaseInput,
    },
    output: {
      camera: { dataType: 'Camera' },
      position: { dataType: 'Vector3' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
