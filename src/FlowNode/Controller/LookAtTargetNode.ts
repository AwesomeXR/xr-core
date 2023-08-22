import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { Quaternion, Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    LookAtTargetNode: IFlowNodeMeta<
      'LookAtTargetNode',
      {
        position: 'Vector3';
        lookAtPosition: 'Vector3';
      } & BaseInput,
      {
        rotation: 'Vector3';
      } & BaseOutput
    >;
  }
}

export const LookAtTargetNodeRegisterData: IFlowNodeTypeRegisterData<'LookAtTargetNode'> = {
  define: {
    className: 'LookAtTargetNode',
    cnName: '目标锁定',
    input: {
      position: { title: '原点', dataType: 'Vector3' },
      lookAtPosition: { title: '指向', dataType: 'Vector3' },
      ...BaseInput,
    },
    output: {
      rotation: { title: '旋转', dataType: 'Vector3' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    const flush = () => {
      if (!ctx.input.position || !ctx.input.lookAtPosition) return;

      const direction = ctx.input.lookAtPosition.subtract(ctx.input.position).normalize();

      // 叉乘构造 up 矢量
      const bNormal = direction.cross(Vector3.UpReadOnly).normalize();
      const up = bNormal.cross(direction).normalize();

      const rotationQuaternion = Quaternion.FromLookDirectionRH(direction, up);
      const rotation = rotationQuaternion.toEulerAngles();

      ctx.output.rotation = rotation.scale(180 / Math.PI);
    };

    ctx.event.listen('input:change:position', flush);
    ctx.event.listen('input:change:lookAtPosition', flush);

    flush();

    return () => {};
  },
};
