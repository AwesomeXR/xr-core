import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ProceduralPBRMaterialNode: IFlowNodeMeta<
      'ProceduralPBRMaterialNode',
      {
        configKey: 'String';
      } & BaseInput,
      {
        baseColorTexture: 'Texture';
        metallicRoughnessTexture: 'Texture';
        normalTexture: 'Texture';
        emissiveTexture: 'Texture';
      }
    >;
  }
}

export const ProceduralPBRMaterialNodeRegisterData: IFlowNodeTypeRegisterData<'ProceduralPBRMaterialNode'> = {
  define: {
    className: 'ProceduralPBRMaterialNode',
    cnName: '生成式材质',
    input: { configKey: { title: '配置 ID', dataType: 'String' }, ...BaseInput },
    output: {
      baseColorTexture: { title: '基础色贴图', dataType: 'Texture' },
      metallicRoughnessTexture: { title: '金属/粗糙贴图', dataType: 'Texture' },
      normalTexture: { title: '法线贴图', dataType: 'Texture' },
      emissiveTexture: { title: '自发光贴图', dataType: 'Texture' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
