import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    AnimatorNode: IFlowNodeMeta<
      'AnimatorNode',
      {
        active: 'Boolean';
        animator: 'Animator';
        animators: 'Dictionary<Animator>';
        frame: 'Number';
        offset: 'Number';
        clampRange: 'Vector2';
      } & BaseInput,
      {
        frame: 'Number';
      }
    >;
  }
}

export const AnimatorNodeRegisterData: IFlowNodeTypeRegisterData<'AnimatorNode'> = {
  define: {
    className: 'AnimatorNode',
    cnName: '动画控制器',
    input: {
      active: { title: '激活', dataType: 'Boolean', defaultValue: true },
      animator: { title: '动画', dataType: 'Animator' },
      animators: { title: '动画集', dataType: 'Dictionary<Animator>' },
      frame: { title: '帧序号', dataType: 'Number' },
      offset: { title: '偏移', dataType: 'Number', defaultValue: 0 },
      clampRange: { title: '钳制', dataType: 'Vector2' },
      ...BaseInput,
    },
    output: {
      frame: { title: '解算帧序号', dataType: 'Number' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
