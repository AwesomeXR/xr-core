import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { Vector2, Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ParticleSystemNode: IFlowNodeMeta<
      'ParticleSystemNode',
      {
        capacity: 'Number';
        textureUrl: 'String';
        emitter: 'Vector3';
        sizeRange: 'Vector2';
        powerRange: 'Vector2';
        lifetimeRange: 'Vector2';
        color1: 'Color4';
        color2: 'Color4';
        colorDead: 'Color4';
        gravity: 'Vector3';
        emitRate: 'Number';
      } & BaseInput,
      {} & BaseOutput
    >;
  }
}

export const ParticleSystemNodeRegisterData: IFlowNodeTypeRegisterData<'ParticleSystemNode'> = {
  define: {
    className: 'ParticleSystemNode',
    cnName: '粒子系统',
    input: {
      capacity: { title: '容量', dataType: 'Number', defaultValue: 2000 },
      textureUrl: { title: '粒子贴图', dataType: 'String' },
      emitRate: { title: '发射速度', dataType: 'Number', defaultValue: 1000 },
      emitter: { title: '发射起点', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      sizeRange: { title: '尺寸范围', dataType: 'Vector2', defaultValue: new Vector2(0.1, 1) },
      powerRange: { title: '强度范围', dataType: 'Vector2', defaultValue: new Vector2(1, 3) },
      lifetimeRange: { title: '粒子生命周期', dataType: 'Vector2', defaultValue: new Vector2(0.3, 1.5) },
      color1: { title: '混色1', dataType: 'Color4' },
      color2: { title: '混色2', dataType: 'Color4' },
      colorDead: { title: '消失色', dataType: 'Color4' },
      gravity: { title: '重力', dataType: 'Vector3', defaultValue: new Vector3(0, -9.81, 0) },
      ...BaseInput,
    },
    output: { ...BaseOutput },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
