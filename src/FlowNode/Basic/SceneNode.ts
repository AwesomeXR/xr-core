import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    SceneNode: IFlowNodeMeta<
      'SceneNode',
      {
        clearColor: 'Color4';
        activeCamera: 'String';

        fogDensity: 'Number';
        fogColor: 'Color3';

        glow: 'Boolean';
        glowIntensity: 'Number';
      } & BaseInput,
      {}
    >;
  }
}

export const SceneNodeRegisterData: IFlowNodeTypeRegisterData<'SceneNode'> = {
  define: {
    className: 'SceneNode',
    cnName: '场景控制器',
    singleton: true,
    input: {
      clearColor: { title: '清屏颜色', dataType: 'Color4' },
      activeCamera: { title: '活动相机', dataType: 'String' },

      fogDensity: { title: '雾气密度', dataType: 'Number', min: 0, max: 1, step: 0.1 },
      fogColor: { title: '雾气颜色', dataType: 'Color3' },

      glow: { title: '辉光', dataType: 'Boolean' },
      glowIntensity: { title: '辉光强度', dataType: 'Number', defaultValue: 0.5, min: 0, max: 1, step: 0.1 },
      ...BaseInput,
    },
    output: {},
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
