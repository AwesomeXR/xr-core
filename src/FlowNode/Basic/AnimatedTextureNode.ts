import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    AnimatedTextureNode: IFlowNodeMeta<
      'AnimatedTextureNode',
      {
        url: 'String';
        play: 'Boolean';
        rate: 'Number';
      } & BaseInput,
      {
        texture: 'Texture';
      } & BaseOutput
    >;
  }
}

export const AnimatedTextureNodeRegisterData: IFlowNodeTypeRegisterData<'AnimatedTextureNode'> = {
  define: {
    className: 'AnimatedTextureNode',
    cnName: '动态纹理',
    input: {
      url: { title: '数据源', dataType: 'String', defaultValue: 'https://rshop.tech/gw/_shared/ball-light.png' },
      play: { title: '播放', dataType: 'Boolean', defaultValue: true },
      rate: { title: '播放速率', dataType: 'Number', defaultValue: 1 },
      ...BaseInput,
    },
    output: {
      texture: { title: '纹理', dataType: 'Texture' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
