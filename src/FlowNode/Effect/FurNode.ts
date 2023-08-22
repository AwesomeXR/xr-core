import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { Color3, Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    FurNode: IFlowNodeMeta<
      'FurNode',
      {
        applyMesh: 'Node';
        length: 'Number';
        color: 'Color3';
        textureUrl: 'String';
        heightTextureUrl: 'String';
        spacing: 'Number';
        density: 'Number';
        speed: 'Number';
        gravity: 'Vector3';
        quality: 'Number';
      } & BaseInput,
      {} & BaseOutput
    >;
  }
}

export const FurNodeRegisterData: IFlowNodeTypeRegisterData<'FurNode'> = {
  define: {
    className: 'FurNode',
    cnName: '毛皮',
    input: {
      applyMesh: { title: '作用节点', dataType: 'Node' },
      textureUrl: { title: '颜色贴图', dataType: 'String' },
      heightTextureUrl: { title: '高度贴图', dataType: 'String' },
      color: { title: '混色', dataType: 'Color3', defaultValue: new Color3(1, 1, 1) },
      length: { title: '附着高度', dataType: 'Number', defaultValue: 1 },
      density: { title: '毛皮密度', dataType: 'Number', defaultValue: 1 },
      speed: { title: '缓动系数', dataType: 'Number', defaultValue: 500 },
      gravity: { title: '重力', dataType: 'Vector3', defaultValue: new Vector3(0, -1, 0) },
      quality: { title: '层次', dataType: 'Number', defaultValue: 20 },
      spacing: { title: '层次间距', dataType: 'Number', defaultValue: 1 },
      ...BaseInput,
    },
    output: { ...BaseOutput },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
