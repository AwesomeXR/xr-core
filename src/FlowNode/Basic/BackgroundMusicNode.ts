import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    BackgroundMusicNode: IFlowNodeMeta<'BackgroundMusicNode', { url: 'String'; play: 'Boolean' } & BaseInput, {}>;
  }
}

export const BackgroundMusicNodeRegisterData: IFlowNodeTypeRegisterData<'BackgroundMusicNode'> = {
  define: {
    className: 'BackgroundMusicNode',
    singleton: true,
    cnName: '背景音乐',
    input: {
      url: { title: '源', dataType: 'String' },
      play: { title: '播放', dataType: 'Boolean' },
      ...BaseInput,
    },
    output: {},
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
