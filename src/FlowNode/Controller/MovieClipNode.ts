import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    MovieClipNode: IFlowNodeMeta<
      'MovieClipNode',
      {
        frame: 'Number';
        config: 'JSON';
        animators: 'Array<Animator>';
        activeKeys: 'Array<String>';
      } & BaseInput,
      {
        activeAnimators: 'Array<Animator>';
      } & BaseOutput
    >;
  }
}

export type IMovieClipTrackItem = {
  key: string;
  animator: { ID: string; name: string };
  startTime: number;
  duration: number;
  speedRatio?: number;
  extrapolationLoop?: boolean; // 外插循环
};

export type IMovieClipConfig = {
  groups: {
    key: string;
    title: string;
    tracks: IMovieClipTrackItem[];
  }[];
};

export const MovieClipNodeRegisterData: IFlowNodeTypeRegisterData<'MovieClipNode'> = {
  define: {
    className: 'MovieClipNode',
    cnName: '动画剪辑',
    input: {
      animators: { title: '动画列表', dataType: 'Array<Animator>', defaultValue: [] },
      frame: { title: '帧序号', dataType: 'Number', defaultValue: 0 },
      activeKeys: { title: '激活的通道', dataType: 'Array<String>', defaultValue: [] },
      config: { title: '配置', dataType: 'JSON', defaultValue: { groups: [] } as IMovieClipConfig },
      ...BaseInput,
    },
    output: {
      activeAnimators: { title: '激活的动画列表', dataType: 'Array<Animator>' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
