import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    FreeCameraNode: IFlowNodeMeta<
      'FreeCameraNode',
      {
        name: 'String';
        position: 'Vector3';
        target: 'Vector3';
        screenOffset: 'Vector2';
      } & BaseInput,
      {
        camera: 'Camera';
      }
    >;
  }
}

export const FreeCameraNodeRegisterData: IFlowNodeTypeRegisterData<'FreeCameraNode'> = {
  define: {
    className: 'FreeCameraNode',
    cnName: '程控相机',
    input: {
      name: { title: '名称', dataType: 'String' },
      position: { title: '位置', dataType: 'Vector3' },
      target: { title: '指向目标', dataType: 'Vector3' },
      screenOffset: { title: '屏幕偏移', dataType: 'Vector2' },
      ...BaseInput,
    },
    output: {
      camera: { dataType: 'Camera' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
