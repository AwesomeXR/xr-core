import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    MiniMapNode: IFlowNodeMeta<
      'MiniMapNode',
      {
        BoundBox: 'BoundBox';
        position: 'Vector3';
        imgUrl: 'String';
        size: 'Number';
      } & BaseInput,
      {} & BaseOutput
    >;
  }
}

export const MiniMapNodeRegisterData: IFlowNodeTypeRegisterData<'MiniMapNode'> = {
  define: {
    className: 'MiniMapNode',
    cnName: '小地图',
    input: {
      BoundBox: { title: '地形包围盒', dataType: 'BoundBox' },
      imgUrl: { title: '图片', dataType: 'String' },
      size: { title: '尺寸', dataType: 'Number', defaultValue: 150 },
      position: { title: '位置', dataType: 'Vector3' },
      ...BaseInput,
    },
    output: { ...BaseOutput },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
