import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    PictureNode: IFlowNodeMeta<
      'PictureNode',
      {
        url: 'String';
        url_middle: 'String';
        url_low: 'String';
        url_minimal: 'String';
        lodDistance: 'Vector3';
        size: 'Number';
        sizeMode: 'String';
        position: 'Vector3';
        rotation: 'Vector3';
        visible: 'Boolean';
      } & BaseInput,
      {
        boundBox: 'BoundBox';
        position: 'Vector3';
        rotation: 'Vector3';
        upVec: 'Vector3';
        forwardVec: 'Vector3';
        rightVec: 'Vector3';
      } & BaseOutput
    >;
  }
}

export const PictureNodeRegisterData: IFlowNodeTypeRegisterData<'PictureNode'> = {
  define: {
    className: 'PictureNode',
    cnName: '图片',
    input: {
      url: { title: '源', dataType: 'String', defaultValue: 'https://rshop.tech/gw/assets/upload/202306171728772.png' },
      url_middle: { title: '降级 L1', dataType: 'String' },
      url_low: { title: '降级 L2', dataType: 'String' },
      url_minimal: { title: '降级 L3', dataType: 'String' },
      lodDistance: { title: '降级距离', dataType: 'Vector3', defaultValue: new Vector3(3, 20, 50) },

      size: { title: '尺寸', dataType: 'Number', defaultValue: 1 },
      sizeMode: {
        title: '尺寸模式',
        dataType: 'String',
        defaultValue: 'width',
        options: [
          { label: '宽度', value: 'width' },
          { label: '高度', value: 'height' },
        ],
      },
      position: { title: '位置', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      rotation: { title: '旋转', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },

      visible: { title: '可见', dataType: 'Boolean', defaultValue: true },
      ...BaseInput,
    },
    output: {
      boundBox: { title: '包围盒', dataType: 'BoundBox' },
      position: { title: '位置', dataType: 'Vector3' },
      rotation: { title: '旋转', dataType: 'Vector3' },
      upVec: { title: '上矢量', dataType: 'Vector3' },
      forwardVec: { title: '前矢量', dataType: 'Vector3' },
      rightVec: { title: '右矢量', dataType: 'Vector3' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
