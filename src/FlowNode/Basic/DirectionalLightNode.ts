import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { Color3, Vector2, Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    DirectionalLightNode: IFlowNodeMeta<
      'DirectionalLightNode',
      {
        alpha: 'Number';
        beta: 'Number';
        radius: 'Number';
        target: 'Vector3';

        intensity: 'Number';
        color: 'Color3';

        shadow: 'Boolean';
        shadowMeshCollection: 'Dictionary<Node>';
        shadowMapSize: 'Number';
        shadowBias: 'Number';
        shadowNormalBias: 'Number';
        shadowDarkness: 'Number';

        shadowOrthoScale: 'Number';

        shadowAutoCalcShadowZBounds: 'Boolean';
        shadowDepthMinMax: 'Vector2';
      } & BaseInput,
      {
        light: 'Message';
        position: 'Vector3';
      } & BaseOutput
    >;
  }
}

export const DirectionalLightNodeRegisterData: IFlowNodeTypeRegisterData<'DirectionalLightNode'> = {
  define: {
    className: 'DirectionalLightNode',
    cnName: '平行光',
    singleton: true,
    input: {
      alpha: { title: '旋转角', dataType: 'Number', defaultValue: 0, min: 0, max: 359, step: 1 },
      beta: { title: '俯仰角', dataType: 'Number', defaultValue: 40, min: 0, max: 180, step: 1 },
      radius: { title: '半径', dataType: 'Number', defaultValue: 5 },
      target: { title: '指向目标', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },

      intensity: { title: '强度', dataType: 'Number', defaultValue: 1, min: 0, step: 0.5 },
      color: { title: '颜色', dataType: 'Color3', defaultValue: new Color3(1, 1, 1) },

      shadow: { title: '启用投影', dataType: 'Boolean', defaultValue: true },
      shadowDarkness: { title: '投影亮度', dataType: 'Number', defaultValue: 0.7, min: 0, max: 1, step: 0.1 },
      shadowMeshCollection: { title: '投影节点集', dataType: 'Dictionary<Node>' },
      shadowMapSize: {
        title: '投影贴图尺寸',
        dataType: 'Number',
        defaultValue: 1024,
        options: [
          { label: '128', value: 128 },
          { label: '256', value: 256 },
          { label: '512', value: 512 },
          { label: '1024', value: 1024 },
          { label: '2048', value: 2048 },
          { label: '4096', value: 4096 },
        ],
      },
      shadowBias: { title: '投影 bias', dataType: 'Number', defaultValue: 0.01 },
      shadowNormalBias: { title: '投影 normal bias', dataType: 'Number', defaultValue: 0.01 },

      shadowOrthoScale: { title: '投影正交比例', dataType: 'Number', step: 0.1, defaultValue: 0.1 },

      shadowAutoCalcShadowZBounds: { title: '自动投影深度', dataType: 'Boolean', defaultValue: true },
      shadowDepthMinMax: { title: '投影深度', dataType: 'Vector2', defaultValue: new Vector2(1, 10) },

      ...BaseInput,
    },
    output: {
      light: { title: '灯光', dataType: 'Message' },
      position: { title: '位置', dataType: 'Vector3' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
