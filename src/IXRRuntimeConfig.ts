import { IComponentDef, IFlowEdgeSerializerData, IFlowNodeClassNames, IFlowNodeSerializerData } from 'ah-flow-node';

export type IXRRuntimeSceneItem = {
  ID: string;
  title?: string;
  poster?: string;

  flowNodes: IFlowNodeSerializerData<IFlowNodeClassNames>[];
  flowEdges: IFlowEdgeSerializerData<IFlowNodeClassNames, IFlowNodeClassNames>[];

  flowComponents: IComponentDef[];
};

export type IXRRuntimeConfig = {
  name: string;
  title?: string;

  /** 主海报 */
  poster?: string;

  scene: {
    entryID?: string;
    list: IXRRuntimeSceneItem[];
  };
};
