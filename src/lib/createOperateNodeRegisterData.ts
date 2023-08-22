import { GetFlowDTType, IDefaultFlowNode, IFlowDTKey, IFlowNodeClassNames } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../FlowNode/base';

export type IOperateNodeInput<T extends IFlowDTKey> = {
  op: 'String';
  argCnt: 'Number';
  arg_0: T;
} & BaseInput;

export type IOperateNodeOutput<_T extends IFlowDTKey> = {
  value: 'Message';
} & BaseOutput;

export function createOperateNodeRegisterData<C extends IFlowNodeClassNames, T extends IFlowDTKey>(
  className: C,
  argDataType: T,
  cnName: string,
  operations: Array<{
    label: string;
    opKey: string;
    opFn: ((args: (GetFlowDTType<T> | undefined)[]) => any) | undefined;
    outDT?: IFlowDTKey;
  }>
) {
  const defineData = {
    className,
    cnName,
    input: {
      op: {
        title: '操作',
        dataType: 'String' as const,
        options: operations.map(d => ({ label: d.label, value: d.opKey })),
      },
      argCnt: { title: '操作数个数', dataType: 'Number' as const, defaultValue: 1 },
      arg_0: { title: '操作数_1', dataType: argDataType },
      ...BaseInput,
    },
    output: {
      value: { title: '结果', dataType: argDataType as any },
      ...BaseOutput,
    },
  };

  function setup(ctx: IDefaultFlowNode) {
    let opFn: ((args: any[]) => any) | undefined;

    function reloadAll() {
      if (typeof ctx.input.op === 'undefined') return;
      opFn = operations.find(d => d.opKey === ctx.input.op)?.opFn;

      const outDt = operations.find(d => d.opKey === ctx.input.op)?.outDT || argDataType;
      const newOutputDefine = { ...ctx._define.output, value: { title: '结果', dataType: outDt } };

      ctx.updateDefine({ output: newOutputDefine });

      flush_argCnt();

      // 重新触发计算
      flush_argX();
    }

    function flush_argCnt() {
      if (typeof ctx.input.argCnt === 'undefined') return;

      const inputDef = { ...ctx._define.input };

      // 先清空 arg ioKey
      Object.keys(inputDef).forEach(ioKey => {
        if (ioKey.match(/^arg_\d+$/)) delete inputDef[ioKey];
      });

      for (let i = 0; i < ctx.input.argCnt; i++) {
        inputDef[`arg_${i}`] = { title: '操作数_' + (i + 1), dataType: argDataType };
      }

      ctx.updateDefine({ input: inputDef });
    }

    function flush_argX() {
      if (!opFn) return;

      const args: any[] = [];

      const ioKeys = Object.keys(ctx._define.input);
      for (let i = 0; i < ioKeys.length; i++) {
        const ioKey = ioKeys[i];
        if (ioKey.startsWith('arg_')) args.push((ctx.input as any)[ioKey]);
      }

      const value = opFn(args);
      ctx.output.value = value;
    }

    ctx.event.listen('input:change:op', reloadAll);
    ctx.event.listen('input:change:argCnt', flush_argCnt);

    ctx.event.delegate((_type, _ev) => {
      if (_type.startsWith('input:change:arg_')) flush_argX();
    });

    ctx.event.listen('connect:change:input', ev => {
      if (ev.action === 'add') {
        const argIoKeys = Object.keys(ctx._define.input).filter(ioKey => ioKey.startsWith('arg_'));

        const isAllConnected = argIoKeys.every(
          k => ctx.host.flowEdgeManager.filter(undefined, undefined, ctx.ID, k).length > 0
        );

        // 全连接的情况下，要新增 arg_n 端口
        if (isAllConnected) ctx.input.argCnt = argIoKeys.length + 1; // 多加一个悬空端口
      }
    });

    reloadAll();

    ctx.output.loaded = true;

    return () => {};
  }

  return { define: defineData, setup: setup as any };
}
