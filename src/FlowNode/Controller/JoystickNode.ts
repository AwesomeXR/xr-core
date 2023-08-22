import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    JoystickNode: IFlowNodeMeta<
      'JoystickNode',
      {} & BaseInput,
      {
        vector: 'Vector2';
      }
    >;
  }
}

export const JoystickNodeRegisterData: IFlowNodeTypeRegisterData<'JoystickNode'> = {
  define: {
    className: 'JoystickNode',
    cnName: '摇杆',
    input: { ...BaseInput },
    output: {
      vector: { title: '方向', dataType: 'Vector2' },
    },
  },
  setup(ctx) {
    throw new Error('not implement: ' + ctx._define.className);
  },
};
