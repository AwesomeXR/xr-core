import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    SkyBoxNode: IFlowNodeMeta<
      'SkyBoxNode',
      {
        url: 'String';
        rotationY: 'Number';
        flipY: 'Boolean';
      } & BaseInput,
      {
        meshes: 'Dictionary<Node>';
      }
    >;
  }
}

export const SkyBoxNodeRegisterData: IFlowNodeTypeRegisterData<'SkyBoxNode'> = {
  define: {
    className: 'SkyBoxNode',
    cnName: '天空盒',
    singleton: true,
    input: {
      url: {
        title: '贴图',
        dataType: 'String',
        defaultValue: 'https://rshop.tech/gw/assets/upload/202210281606560.png',
      },
      rotationY: { title: 'Y轴旋转角度', dataType: 'Number' },
      flipY: { title: 'Y翻转', dataType: 'Boolean', defaultValue: true },
      ...BaseInput,
    },
    output: {
      meshes: { title: '节点集', dataType: 'Dictionary<Node>' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
