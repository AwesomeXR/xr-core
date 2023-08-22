import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    FunctionNode: IFlowNodeMeta<
      'FunctionNode',
      {
        code: 'String';
        arg0: 'Message';
        arg1: 'Message';
        arg2: 'Message';
        arg3: 'Message';
        arg4: 'Message';
      } & BaseInput,
      {
        value: 'Message';
      } & BaseOutput
    >;
  }
}

export const FunctionNodeRegisterData: IFlowNodeTypeRegisterData<'FunctionNode'> = {
  define: {
    className: 'FunctionNode',
    cnName: '函数',
    input: {
      code: { title: '代码', dataType: 'String', defaultValue: 'return 0;' },
      arg0: { title: '参数0', dataType: 'Message' },
      arg1: { title: '参数1', dataType: 'Message' },
      arg2: { title: '参数2', dataType: 'Message' },
      arg3: { title: '参数3', dataType: 'Message' },
      arg4: { title: '参数4', dataType: 'Message' },
      ...BaseInput,
    },
    output: {
      value: { title: '值', dataType: 'Message' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    let fn: Function | undefined;

    function reloadAll() {
      if (!ctx.input.code) return;

      fn = new Function('arg0', 'arg1', 'arg2', 'arg3', 'arg4', ctx.input.code);
      ctx.output.loaded = true;

      flushOutput();
    }

    function flushOutput() {
      if (!fn) return;

      const { arg0, arg1, arg2, arg3, arg4 } = ctx.input;

      const value = fn.call({}, arg0, arg1, arg2, arg3, arg4);
      ctx.output.value = value;
    }

    ctx.event.listen('input:change:code', reloadAll);
    ctx.event.listen('input:change:arg0', flushOutput);
    ctx.event.listen('input:change:arg1', flushOutput);
    ctx.event.listen('input:change:arg2', flushOutput);
    ctx.event.listen('input:change:arg3', flushOutput);
    ctx.event.listen('input:change:arg4', flushOutput);

    reloadAll();

    return () => {};
  },
};
