import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    HDRNode: IFlowNodeMeta<
      'HDRNode',
      {
        url: 'String';
        rotationY: 'Number';
        intensity: 'Number';
      } & BaseInput,
      {}
    >;
  }
}

export const HDRNodeRegisterData: IFlowNodeTypeRegisterData<'HDRNode'> = {
  define: {
    className: 'HDRNode',
    cnName: 'HDR 光照',
    singleton: true,
    input: {
      url: { title: '贴图', dataType: 'String', defaultValue: 'https://rshop.tech/gw/exr/EnvMap_3.0-256.env' },
      rotationY: { title: 'Y轴旋转角度', dataType: 'Number', defaultValue: 0 },
      intensity: { title: '强度', dataType: 'Number', defaultValue: 1 },
      ...BaseInput,
    },
    output: {},
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
