import {
  FlowDTRegistry,
  FlowNodeTypeRegistry,
  IFlowDTKey,
  IFlowDTMap,
  IFlowEdgeSerializerData,
  IFlowHostEventData,
  IFlowNode,
  IFlowNodeClassNames,
  IFlowNodeInput,
  IFlowNodeOutput,
  IFlowNodeSerializerData,
} from 'ah-flow-node';
import {
  AnimatorNodeRegisterData,
  ArcRotateCameraNodeRegisterData,
  AssetContainerNodeRegisterData,
  CurveDriverNodeRegisterData,
  DictionaryCastNodeRegisterData,
  DictionaryExpandNodeRegisterData,
  DirectionalLightNodeRegisterData,
  FrameTimerNodeRegisterData,
  FreeCameraNodeRegisterData,
  HDRNodeRegisterData,
  InputPortNodeRegisterData,
  MeshNodeRegisterData,
  PBRMaterialNodeRegisterData,
  ProceduralPBRMaterialNodeRegisterData,
  ScalarClampNodeRegisterData,
  ScalarOperateNodeRegisterData,
  SceneNodeRegisterData,
  SequenceGeneratorNodeRegisterData,
  ShadowOnlyMaterialNodeRegisterData,
  SkyBoxNodeRegisterData,
  TextureNodeRegisterData,
  Vector3NodeRegisterData,
  JoystickNodeRegisterData,
  NpcNavigateNodeRegisterData,
  ThirdPersonCameraNodeRegisterData,
  BackgroundMusicNodeRegisterData,
  PictureNodeRegisterData,
  PickableShapeNodeRegisterData,
  LODNodeRegisterData,
  FurNodeRegisterData,
  ParticleSystemNodeRegisterData,
  WaterNodeRegisterData,
  MiniMapNodeRegisterData,
  Vector3OperateNodeRegisterData,
  AnimatedTextureNodeRegisterData,
  FunctionNodeRegisterData,
  LerpNodeRegisterData,
  ShadowOnlyNodeRegisterData,
  CameraControllerNodeRegisterData,
  CameraPlacementNodeRegisterData,
  LookAtTargetNodeRegisterData,
  IntersectionNodeRegisterData,
  ConnectorNodeRegisterData,
  DataExpandNodeRegisterData,
  JSONDataNodeRegisterData,
  ThrottleNodeRegisterData,
  MeshInstanceNodeRegisterData,
  ArrayConcatNodeRegisterData,
  BreakerNodeRegisterData,
  DataSwitcherNodeRegisterData,
  MovieClipNodeRegisterData,
} from './FlowNode';
import { Color3, Color4, Vector2, Vector3 } from './Math';
import { IEngine } from './ExternalImpl';

// 类型合并
declare module 'ah-flow-node' {
  interface IFlowDTMap {
    Message: any;

    FlowHost: IFlowHost;
    FlowData: {
      flowNodes: IFlowNodeSerializerData<IFlowNodeClassNames>[];
      flowEdges: IFlowEdgeSerializerData<IFlowNodeClassNames, IFlowNodeClassNames>[];
    };
    InputDefMap: Record<string, IFlowNodeInput<IFlowDTKey>>;
    OutputDefMap: Record<string, IFlowNodeOutput<IFlowDTKey>>;

    Vector2: Vector2;
    Vector3: Vector3;

    Color3: Color3;
    Color4: Color4;

    BoundBox: { center: Vector3; size: Vector3 };

    Material: any;
    'Dictionary<Material>': Record<string, any>;
    'Array<Material>': any[];

    Texture: any;
    'Array<Texture>': any[];

    Animator: any;
    'Dictionary<Animator>': Record<string, any>;
    'Array<Animator>': any[];

    Node: any;
    'Dictionary<Node>': Record<string, any>;
    'Array<Node>': any[];

    Camera: any;
  }

  interface IFlowHost {
    engine: IEngine;

    capture(opt?: { type?: string }): Promise<string>;
    dispose(): void;
  }

  interface IFlowHostEvent {
    beforeRender: IFlowHostEventData<{}>;

    /** shape 选中事件。由 PickableShapeNode 抛出 */
    afterShapePick: IFlowHostEventData<{ nodeID: string; node: IFlowNode<'PickableShapeNode'> }>;

    /** 相机切换事件，由 SceneNode 抛出 */
    ActiveCameraNodeChange: IFlowHostEventData<{ nodeName: string }>;

    __afterCameraPlacementNodeChange: IFlowHostEventData<{ node: IFlowNode<'CameraPlacementNode'> }>;
    __afterTextureUpdated: IFlowHostEventData<{ texture: any }>;
  }
}

let _isSetup = false;

export function setup() {
  if (_isSetup) return;
  _isSetup = true;

  // 注册 IO
  FlowDTRegistry.Default.register('Message', { title: '数据' });

  FlowDTRegistry.Default.register('FlowHost', { title: '节点容器' });
  FlowDTRegistry.Default.register('FlowData', { title: '节点配置', serializer: 'JSON' });
  FlowDTRegistry.Default.register('InputDefMap', { title: '输入配置', serializer: 'JSON' });
  FlowDTRegistry.Default.register('OutputDefMap', { title: '输出配置', serializer: 'JSON' });

  FlowDTRegistry.Default.register('Vector2', {
    title: '二维矢量',
    serializer: { save: (vec: Vector2) => ({ x: vec.x, y: vec.y }), restore: d => Vector2.FromArray([d.x, d.y]) },
    wrap: arg =>
      arg instanceof Vector2 ? arg : Array.isArray(arg) ? Vector2.FromArray(arg) : new Vector2(arg.x, arg.y),
    isEqual: (a: Vector2, b: Vector2) => a.equalsWithEpsilon(b),
  });
  FlowDTRegistry.Default.register('Vector3', {
    title: '三维矢量',
    serializer: {
      save: (vec: Vector3) => ({ x: vec.x, y: vec.y, z: vec.z }),
      restore: d => Vector3.FromArray([d.x, d.y, d.z]),
    },
    wrap: arg =>
      arg instanceof Vector3 ? arg : Array.isArray(arg) ? Vector3.FromArray(arg) : new Vector3(arg.x, arg.y, arg.z),
    isEqual: (a: Vector3, b: Vector3) => a.equalsWithEpsilon(b),
  });

  FlowDTRegistry.Default.register('Color3', {
    title: '颜色',
    serializer: { save: (c: Color3) => c.asArray(), restore: d => Color3.FromArray(d) },
    wrap: arg => {
      return arg instanceof Color3 ? arg : Array.isArray(arg) ? Color3.FromArray(arg) : new Color3(arg.r, arg.g, arg.b);
    },
    isEqual: (a: Color3, b: Color3) => a.equals(b),
  });
  FlowDTRegistry.Default.register('Color4', {
    title: '颜色(alpha)',
    serializer: { save: (c: Color4) => c.asArray(), restore: d => Color4.FromArray(d) },
    wrap: arg => {
      return arg instanceof Color4
        ? arg
        : Array.isArray(arg)
        ? Color4.FromArray(arg)
        : new Color4(arg.r, arg.g, arg.b, arg.a);
    },
    isEqual: (a: Color4, b: Color4) => a.equals(b),
  });

  FlowDTRegistry.Default.register('BoundBox', {
    title: '包围盒',
    serializer: {
      save: (v: IFlowDTMap['BoundBox']) => ({ center: v.center.asArray(), size: v.size.asArray() }),
      restore: d => ({ center: Vector3.FromArray(d.center), size: Vector3.FromArray(d.size) }),
    },
  });

  FlowDTRegistry.Default.register('Material', { title: '材质' });
  FlowDTRegistry.Default.register('Dictionary<Material>', { title: '材质表' });
  FlowDTRegistry.Default.register('Array<Material>', { title: '材质列表' });

  FlowDTRegistry.Default.register('Texture', { title: '纹理' });
  FlowDTRegistry.Default.register('Array<Texture>', { title: '纹理列表' });

  FlowDTRegistry.Default.register('Animator', { title: '动画' });
  FlowDTRegistry.Default.register('Dictionary<Animator>', { title: '动画表' });
  FlowDTRegistry.Default.register('Array<Animator>', { title: '动画列表' });

  FlowDTRegistry.Default.register('Node', { title: '节点' });
  FlowDTRegistry.Default.register('Dictionary<Node>', { title: '节点表' });
  FlowDTRegistry.Default.register('Array<Node>', { title: '节点列' });

  FlowDTRegistry.Default.register('Camera', { title: '相机' });

  // 注册 FlowNode
  FlowNodeTypeRegistry.Default.register('ArcRotateCameraNode', ArcRotateCameraNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('AssetContainerNode', AssetContainerNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('DirectionalLightNode', DirectionalLightNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('HDRNode', HDRNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('SkyBoxNode', SkyBoxNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('SequenceGeneratorNode', SequenceGeneratorNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('InputPortNode', InputPortNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('Vector3Node', Vector3NodeRegisterData);
  FlowNodeTypeRegistry.Default.register('DictionaryExpandNode', DictionaryExpandNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('PBRMaterialNode', PBRMaterialNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('TextureNode', TextureNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('AnimatorNode', AnimatorNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('FrameTimerNode', FrameTimerNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('DictionaryCastNode', DictionaryCastNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('ProceduralPBRMaterialNode', ProceduralPBRMaterialNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('ScalarClampNode', ScalarClampNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('FreeCameraNode', FreeCameraNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('MeshNode', MeshNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('SceneNode', SceneNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('ScalarOperateNode', ScalarOperateNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('CurveDriverNode', CurveDriverNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('ShadowOnlyMaterialNode', ShadowOnlyMaterialNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('JoystickNode', JoystickNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('NpcNavigateNode', NpcNavigateNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('ThirdPersonCameraNode', ThirdPersonCameraNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('BackgroundMusicNode', BackgroundMusicNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('PictureNode', PictureNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('PickableShapeNode', PickableShapeNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('LODNode', LODNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('ParticleSystemNode', ParticleSystemNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('FurNode', FurNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('WaterNode', WaterNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('MiniMapNode', MiniMapNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('Vector3OperateNode', Vector3OperateNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('AnimatedTextureNode', AnimatedTextureNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('FunctionNode', FunctionNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('LerpNode', LerpNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('ShadowOnlyNode', ShadowOnlyNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('CameraControllerNode', CameraControllerNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('CameraPlacementNode', CameraPlacementNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('LookAtTargetNode', LookAtTargetNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('IntersectionNode', IntersectionNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('ConnectorNode', ConnectorNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('DataExpandNode', DataExpandNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('JSONDataNode', JSONDataNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('ThrottleNode', ThrottleNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('MeshInstanceNode', MeshInstanceNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('ArrayConcatNode', ArrayConcatNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('BreakerNode', BreakerNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('DataSwitcherNode', DataSwitcherNodeRegisterData);
  FlowNodeTypeRegistry.Default.register('MovieClipNode', MovieClipNodeRegisterData);
}
