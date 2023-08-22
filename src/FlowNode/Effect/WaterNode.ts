import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { Color3, Vector2 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    WaterNode: IFlowNodeMeta<
      'WaterNode',
      {
        applyMesh: 'Node';

        groundTextureUrl: 'String';
        groundTextureScale: 'Number';

        windForce: 'Number';
        deep: 'Number';
        windDirection: 'Vector2';
        waterColor: 'Color3';
        colorBlendFactor: 'Number';
        waveLength: 'Number';

        reflectionMeshes: 'Dictionary<Node>';
      } & BaseInput,
      {} & BaseOutput
    >;
  }
}

export const WaterNodeRegisterData: IFlowNodeTypeRegisterData<'WaterNode'> = {
  define: {
    className: 'WaterNode',
    cnName: '水面',
    input: {
      applyMesh: { title: '作用节点', dataType: 'Node' },
      windForce: { title: '风力', dataType: 'Number', defaultValue: 5 },
      windDirection: { title: '风向', dataType: 'Vector2', defaultValue: new Vector2(1, 1) },
      deep: { title: '水深', dataType: 'Number', defaultValue: 0.5 },
      waveLength: { title: '波长', dataType: 'Number', defaultValue: 0.5 },
      waterColor: { title: '水体颜色', dataType: 'Color3', defaultValue: Color3.FromHexString('#8F96FD') },
      colorBlendFactor: { title: '混色系数', dataType: 'Number', defaultValue: 0.2 },

      groundTextureUrl: {
        title: '水底贴图',
        dataType: 'String',
        defaultValue: 'https://rshop.tech/gw/_shared/model/waterground.png.ktx2',
      },
      groundTextureScale: { title: '水底贴图缩放', dataType: 'Number', defaultValue: 1 },

      reflectionMeshes: { title: '反射节点', dataType: 'Dictionary<Node>' },

      ...BaseInput,
    },
    output: { ...BaseOutput },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
