import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';
import { Vector2 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    TextureNode: IFlowNodeMeta<
      'TextureNode',
      {
        source: 'String';
        uvScale: 'Vector2';
        uvOffset: 'Vector2';
        level: 'Number';
        uvSet: 'Number';
      } & BaseInput,
      {
        texture: 'Texture';
      }
    >;
  }
}

export const TextureNodeRegisterData: IFlowNodeTypeRegisterData<'TextureNode'> = {
  define: {
    className: 'TextureNode',
    cnName: '纹理',
    input: {
      source: { title: '数据源', dataType: 'String' },
      uvScale: { title: 'UV 缩放', dataType: 'Vector2', defaultValue: new Vector2(1, 1) },
      uvOffset: { title: 'UV 偏移', dataType: 'Vector2', defaultValue: new Vector2(0, 0) },
      uvSet: {
        title: 'UV 通道',
        dataType: 'Number',
        defaultValue: 0,
        min: 0,
        max: 3,
        step: 1,
      },
      level: { title: '强度', dataType: 'Number', defaultValue: 1, min: 0, max: 2, step: 0.1 },
      ...BaseInput,
    },
    output: {
      texture: { title: '纹理', dataType: 'Texture' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
