import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    PBRMaterialNode: IFlowNodeMeta<
      'PBRMaterialNode',
      {
        material: 'Material';
        alpha: 'Number';

        alphaMode: 'String';
        alphaCutOff: 'Number';

        // color
        baseColor: 'Color3';
        baseColorTexture: 'Texture';

        // mr
        metallic: 'Number';
        roughness: 'Number';
        metallicRoughnessTexture: 'Texture';

        // normal
        normalTexture: 'Texture';

        // emissive
        emissiveTexture: 'Texture';
        emissiveIntensity: 'Number';

        // occlusion
        occlusionTexture: 'Texture';
        occlusionIntensity: 'Number';

        // clearcoat
        clearcoatIntensity: 'Number';
        clearcoatRoughness: 'Number';

        //  highlightShadow
        highlightShadowEnabled: 'Boolean';
        highlightShadowTexture: 'Texture';

        highlightShadow_highlightLevel: 'Number';
        highlightShadow_shadowLevel: 'Number';

        unlit: 'Boolean';
      } & BaseInput,
      BaseOutput
    >;
  }
}

export const PBRMaterialNodeRegisterData: IFlowNodeTypeRegisterData<'PBRMaterialNode'> = {
  define: {
    className: 'PBRMaterialNode',
    cnName: 'PBR 材质',
    input: {
      material: { title: '材质', dataType: 'Material' },
      alpha: { title: '透明度', dataType: 'Number' },

      alphaMode: {
        title: '透明模式',
        dataType: 'String',
        options: [
          { label: '不透明', value: 'OPAQUE' },
          { label: '混合', value: 'BLEND' },
          { label: '剔除', value: 'MASK' },
        ],
      },
      alphaCutOff: { title: '透明剔除阈值', dataType: 'Number' },

      baseColor: { title: '基础色', dataType: 'Color3' },
      baseColorTexture: { title: '基础色贴图', dataType: 'Texture' },

      metallic: { title: '金属度', dataType: 'Number' },
      roughness: { title: '粗糙度', dataType: 'Number' },
      metallicRoughnessTexture: { title: '金属/粗糙贴图', dataType: 'Texture' },

      normalTexture: { title: '法线贴图', dataType: 'Texture' },

      emissiveTexture: { title: '自发光贴图', dataType: 'Texture' },
      emissiveIntensity: { title: '自发光强度', dataType: 'Number' },

      occlusionTexture: { title: 'AO贴图', dataType: 'Texture' },
      occlusionIntensity: { title: 'AO强度', dataType: 'Number' },

      highlightShadowEnabled: { title: '启用高光阴影', dataType: 'Boolean' },
      highlightShadowTexture: { title: '高光阴影贴图', dataType: 'Texture' },
      highlightShadow_highlightLevel: {
        title: '高光强度',
        dataType: 'Number',
        defaultValue: 0.5,
        min: 0,
        max: 3,
        step: 0.1,
      },
      highlightShadow_shadowLevel: {
        title: '阴影强度',
        dataType: 'Number',
        defaultValue: 0.5,
        min: 0,
        max: 3,
        step: 0.1,
      },

      clearcoatIntensity: { title: '清漆强度', dataType: 'Number' },
      clearcoatRoughness: { title: '清漆粗糙度', dataType: 'Number' },

      unlit: { title: '无光照', dataType: 'Boolean' },
      ...BaseInput,
    },
    output: {
      ...BaseOutput,
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
