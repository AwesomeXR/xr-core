import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { IOperateNodeInput, IOperateNodeOutput, createOperateNodeRegisterData } from '../../lib';
import { Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    Vector3OperateNode: IFlowNodeMeta<
      'Vector3OperateNode',
      IOperateNodeInput<'Vector3'>,
      IOperateNodeOutput<'Vector3'>
    >;
  }
}

export const Vector3OperateNodeRegisterData: IFlowNodeTypeRegisterData<'Vector3OperateNode'> =
  createOperateNodeRegisterData('Vector3OperateNode', 'Vector3', '矢量计算', [
    {
      label: '加',
      opKey: '+',
      opFn: vecList => vecList.reduce((pre, cur) => (pre ? (cur ? pre.add(cur) : pre) : undefined)),
    },
    {
      label: '减',
      opKey: '-',
      opFn: vecList => vecList.reduce((pre, cur) => (pre ? (cur ? pre.subtract(cur) : pre) : undefined)),
    },
    {
      label: '乘',
      opKey: '*',
      opFn: vecList => vecList.reduce((pre, cur) => (pre ? (cur ? pre.multiply(cur) : pre) : undefined)),
    },
    {
      label: '除',
      opKey: '/',
      opFn: vecList => vecList.reduce((pre, cur) => (pre ? (cur ? pre.divide(cur) : pre) : undefined)),
    },
    {
      label: '判断相等',
      opKey: '=',
      outDT: 'Boolean',
      opFn: vecList => {
        for (let i = 0; i < vecList.length - 1; i++) {
          const a = vecList[i];
          const b = vecList[i + 1];

          if (!a || !b) return false;
          if (!a.equalsWithEpsilon(b)) return false;
        }

        return true;
      },
    },
    {
      label: '长度',
      opKey: 'length',
      outDT: 'Number',
      opFn: vecList => {
        const vec = vecList.find(v => !!v); // 找第一个有值的参数
        if (!vec) return;
        return vec.length();
      },
    },
    {
      label: '长度平方',
      opKey: 'lengthSquared',
      outDT: 'Number',
      opFn: vecList => {
        const vec = vecList.find(v => !!v);
        if (!vec) return;
        return vec.lengthSquared();
      },
    },
    {
      label: '归一化',
      opKey: 'normalize',
      opFn: vecList => {
        const vec = vecList[0];
        if (!vec) return;
        return vec.normalizeToNew();
      },
    },
    {
      label: '夹角',
      opKey: 'angle',
      opFn: vecList => {
        const [a, b] = vecList;
        if (!a || !b) return;

        return (Math.acos(Vector3.Dot(a, b) / (a.length() * b.length())) * 180) / Math.PI;
      },
    },
  ]);
