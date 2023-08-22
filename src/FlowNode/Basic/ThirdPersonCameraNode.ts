import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ThirdPersonCameraNode: IFlowNodeMeta<
      'ThirdPersonCameraNode',
      {
        name: 'String';
        targetBoundBox: 'BoundBox';
        offsetY: 'Number';
        alpha: 'Number';
        beta: 'Number';
        radius: 'Number';
        springMode: 'String';
        lerpDuration: 'Number';
      } & BaseInput,
      {
        camera: 'Camera';
        position: 'Vector3';
        target: 'Vector3';
      } & BaseOutput
    >;
  }
}

export type IThirdPersonCameraNode_springMode = 'collision' | 'occlusion';

export const ThirdPersonCameraNodeRegisterData: IFlowNodeTypeRegisterData<'ThirdPersonCameraNode'> = {
  define: {
    className: 'ThirdPersonCameraNode',
    cnName: '第三人称相机',
    input: {
      name: { title: '名称', dataType: 'String' },
      targetBoundBox: { title: '目标包围盒', dataType: 'BoundBox' },
      offsetY: { title: 'Y轴偏移', dataType: 'Number' },
      alpha: { title: '旋转角', dataType: 'Number', defaultValue: 0 },
      beta: { title: '俯仰角', dataType: 'Number', defaultValue: 60 },
      radius: { title: '相机距离', dataType: 'Number', defaultValue: 10 },
      springMode: { title: '摇臂模式', dataType: 'String', defaultValue: 'collision' },
      lerpDuration: { title: '缓动时间(ms)', dataType: 'Number', defaultValue: 1000 },
      ...BaseInput,
    },
    output: {
      camera: { dataType: 'Camera' },
      position: { title: '位置', dataType: 'Vector3' },
      target: { title: '指向目标', dataType: 'Vector3' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
