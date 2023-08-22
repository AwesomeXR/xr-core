import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { Vector3 } from '../../Math';
import { BaseInput, BaseOutput } from '../base';

type CommonProps = { position: 'Vector3'; scaling: 'Vector3'; rotation: 'Vector3' };

export type IAssetContainerInitConfig_MaterialModify = {
  backFaceCulling?: boolean;
  disableDepthWrite?: boolean;
  wireframe?: boolean;
  transparencyMode?: number;
  useAlphaFromAlbedoTexture?: boolean;
  separateCullingPass?: boolean;

  reflectivityColor?: number[];
  emissiveColor?: number[];
  ambientColor?: number[];

  usePhysicalLightFalloff?: boolean;
  indexOfRefraction?: number;
  metallicF0Factor?: number;
  environmentIntensity?: number;
  directIntensity?: number;

  useRadianceOverAlpha?: boolean;
  useSpecularOverAlpha?: boolean;
  enableSpecularAntiAliasing?: boolean;

  realTimeFiltering?: boolean;
  realTimeFilteringQuality?: number;

  debugMode?: number;

  alpha?: number;
  alphaMode?: string;
  alphaCutOff?: number;
  // color
  baseColor?: number[];
  baseColorTexture?: string | null;
  // mr
  metallic?: number;
  roughness?: number;
  metallicRoughnessTexture?: string | null;
  // normal
  normalTexture?: string | null;
  // emissive
  emissiveTexture?: string | null;
  emissiveIntensity?: number;
  // occlusion
  occlusionTexture?: string | null;
  occlusionIntensity?: number;
  // clearcoat
  clearcoatEnabled?: boolean;
  clearcoatIntensity?: number;
  clearcoatRoughness?: number;
  unlit?: boolean;

  // other textures
  reflectionTexture?: string | null;
  refractionTexture?: string | null;
};

export type IAssetContainerInitConfig_TextureModify = {
  url?: string;
  uvScale?: number[];
  uvOffset?: number[];
  level?: number;
  uvSet?: number;
};

export type IAssetContainerInitConfig = {
  add?: {
    materials?: string[];
    textures?: string[];
  };

  modify?: {
    material?: Record<string, IAssetContainerInitConfig_MaterialModify>;
    texture?: Record<string, IAssetContainerInitConfig_TextureModify>;
  };
};

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    AssetContainerNode: IFlowNodeMeta<
      'AssetContainerNode',
      {
        url: 'String';
        url_middle: 'String';
        url_low: 'String';
        url_minimal: 'String';
        lodDistance: 'Vector3';
        visible: 'Boolean';

        _initConfig: 'JSON'; // IAssetContainerInitConfig

        _inDefs: 'InputDefs';
        _outDefs: 'OutputDefs';
      } & BaseInput &
        CommonProps,
      {
        container: 'Message';
        boundBox: 'BoundBox';
        upVec: 'Vector3';
        forwardVec: 'Vector3';
        rightVec: 'Vector3';
        material: 'Dictionary<Material>';
        animator: 'Dictionary<Animator>';
        animators: 'Array<Animator>';
        nodes: 'Dictionary<Node>';
      } & BaseOutput &
        CommonProps
    >;
  }
}

export const AssetContainerNodeRegisterData: IFlowNodeTypeRegisterData<'AssetContainerNode'> = {
  define: {
    className: 'AssetContainerNode',
    cnName: '模型',
    input: {
      url: { title: '模型地址', dataType: 'String', defaultValue: 'https://rshop.tech/gw/cube.glb' },
      url_middle: { title: '降级 L1', dataType: 'String' },
      url_low: { title: '降级 L2', dataType: 'String' },
      url_minimal: { title: '降级 L3', dataType: 'String' },
      lodDistance: { title: '降级距离', dataType: 'Vector3', defaultValue: new Vector3(3, 20, 50) },

      position: { title: '位置', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      scaling: { title: '缩放', dataType: 'Vector3', defaultValue: new Vector3(1, 1, 1) },
      rotation: { title: '旋转', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      visible: { title: '可见', dataType: 'Boolean', defaultValue: true },

      _initConfig: { title: '初始配置', dataType: 'JSON' },

      _inDefs: { title: '输入', dataType: 'InputDefs' },
      _outDefs: { title: '输出', dataType: 'OutputDefs' },

      ...BaseInput,
    },
    output: {
      container: { title: '容器', dataType: 'Message' },
      boundBox: { title: '包围盒', dataType: 'BoundBox' },
      position: { title: '位置', dataType: 'Vector3' },
      scaling: { title: '缩放', dataType: 'Vector3' },
      rotation: { title: '旋转', dataType: 'Vector3' },
      upVec: { title: '上矢量', dataType: 'Vector3' },
      forwardVec: { title: '前矢量', dataType: 'Vector3' },
      rightVec: { title: '右矢量', dataType: 'Vector3' },
      nodes: { title: '节点集', dataType: 'Dictionary<Node>' },
      material: { title: '材质集', dataType: 'Dictionary<Material>' },
      animator: { title: '动画集', dataType: 'Dictionary<Animator>' },
      animators: { title: '动画组', dataType: 'Array<Animator>' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
