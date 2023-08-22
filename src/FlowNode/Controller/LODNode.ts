import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    LODNode: IFlowNodeMeta<
      'LODNode',
      {
        boundBox: 'BoundBox';
        high: 'String';

        middle: 'String';
        middleBreakpoint: 'Number';

        low: 'String';
        lowBreakpoint: 'Number';
      } & BaseInput,
      {
        value: 'String';
      }
    >;
  }
}

export const LODNodeRegisterData: IFlowNodeTypeRegisterData<'LODNode'> = {
  define: {
    className: 'LODNode',
    cnName: '多层次细节',
    input: {
      boundBox: { title: '目标包围盒', dataType: 'BoundBox' },
      high: { title: '高清', dataType: 'String' },

      middle: { title: '中等', dataType: 'String' },
      middleBreakpoint: { title: '中等切换距离', dataType: 'Number', defaultValue: 10 },

      low: { title: '低清', dataType: 'String' },
      lowBreakpoint: { title: '低清切换距离', dataType: 'Number', defaultValue: 20 },
      ...BaseInput,
    },
    output: {
      value: { title: '值', dataType: 'String' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
