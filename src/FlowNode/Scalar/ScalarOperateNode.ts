import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { Scalar } from '../../Math';
import { IOperateNodeInput, IOperateNodeOutput, createOperateNodeRegisterData } from '../../lib';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ScalarOperateNode: IFlowNodeMeta<'ScalarOperateNode', IOperateNodeInput<'Number'>, IOperateNodeOutput<'Number'>>;
  }
}

export const ScalarOperateNodeRegisterData: IFlowNodeTypeRegisterData<'ScalarOperateNode'> =
  createOperateNodeRegisterData('ScalarOperateNode', 'Number', '数值计算', [
    {
      label: '+',
      opKey: '+',
      opFn: args => args.reduce<number>((v, x) => v + (x || 0), 0),
    },
    {
      label: '-',
      opKey: '-',
      opFn: args => args.reduce<number>((v, x) => v - (x || 0), 0),
    },
    {
      label: '*',
      opKey: '*',
      opFn: args => args.reduce<number>((v, x) => (typeof x === 'number' ? v * x : v), 1),
    },
    {
      label: '/',
      opKey: '/',
      opFn: _args => {
        const args = _args.filter(v => typeof v !== 'undefined') as number[];
        if (args.length === 0) return 0;
        if (args.length === 1) return args[0];
        if (args.length === 2) return args[0] / args[1];
        if (args.length === 3) return args[0] / args[1] / args[2];

        let ret = args[0];
        for (let i = 1; i < args.length; i++) {
          ret /= args[i];
        }
        return ret;
      },
    },
    {
      label: '=',
      opKey: '=',
      outDT: 'Boolean',
      opFn: _args => {
        const args = _args.filter(v => typeof v !== 'undefined') as number[];

        if (args.length === 0) return false;
        if (args.length === 1) return true;
        if (args.length === 2) return Scalar.WithinEpsilon(args[0], args[1]);
        if (args.length === 3) {
          return Scalar.WithinEpsilon(args[0], args[1]) && Scalar.WithinEpsilon(args[1], args[2]);
        }

        for (let i = 0; i < args.length - 1; i++) {
          const _a = args[i];
          const _b = args[i + 1];

          if (!Scalar.WithinEpsilon(_a, _b)) return false;
        }
        return true;
      },
    },
    {
      label: 'InRange',
      opKey: 'InRange',
      outDT: 'Boolean',
      opFn: _args => {
        const args = _args.filter(v => typeof v !== 'undefined') as number[];
        if (args.length === 3) return args[1] <= args[0] && args[0] < args[2];
        return false;
      },
    },
  ]);
