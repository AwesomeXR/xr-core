import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    NpcNavigateNode: IFlowNodeMeta<
      'NpcNavigateNode',
      {
        position: 'Vector3';
        rotation: 'Vector3';
        ellipsoid: 'Vector3';
        ellipsoidOffset: 'Vector3';

        ground: 'Dictionary<Node>';
        obstacle: 'Dictionary<Node>';

        animator: 'Dictionary<Animator>';
        idleAni: 'String';
        idleAniRange: 'Vector2';
        walkAni: 'String';
        walkAniRange: 'Vector2';

        navTargetMode: 'String';

        targetPosition: 'Vector3';
        targetDirection: 'Vector2';

        speed: 'Number';
      } & BaseInput,
      {
        position: 'Vector3';
        rotation: 'Vector3';

        isIdle: 'Boolean';
        isWalk: 'Boolean';
      } & BaseOutput
    >;
  }
}

export const NpcNavigateNodeRegisterData: IFlowNodeTypeRegisterData<'NpcNavigateNode'> = {
  define: {
    className: 'NpcNavigateNode',
    cnName: 'NPC 控制器',
    input: {
      position: { title: '位置', dataType: 'Vector3' },
      rotation: { title: '旋转', dataType: 'Vector3' },
      ellipsoid: { title: '碰撞体积', dataType: 'Vector3', defaultValue: new Vector3(1, 2, 1) },
      ellipsoidOffset: { title: '碰撞偏移', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },

      ground: { title: '地面', dataType: 'Dictionary<Node>' },
      obstacle: { title: '障碍物', dataType: 'Dictionary<Node>' },

      animator: { title: '动画集', dataType: 'Dictionary<Animator>' },
      idleAni: { title: '待机动画', dataType: 'String' },
      idleAniRange: { title: '待机动画帧范围', dataType: 'Vector2' },
      walkAni: { title: '行走动画', dataType: 'String' },
      walkAniRange: { title: '行走动画帧范围', dataType: 'Vector2' },

      navTargetMode: {
        title: '控制模式',
        dataType: 'String',
        defaultValue: 'direction',
        options: [{ label: '方向', value: 'direction' }],
      },
      targetPosition: { title: '目标位置', dataType: 'Vector3' },
      targetDirection: { title: '目标方向', dataType: 'Vector2' },

      speed: { title: '速度', dataType: 'Number' },
      ...BaseInput,
    },
    output: {
      position: { title: '位置', dataType: 'Vector3' },
      rotation: { title: '旋转', dataType: 'Vector3' },
      isIdle: { title: '待机中', dataType: 'Boolean' },
      isWalk: { title: '行走中', dataType: 'Boolean' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
