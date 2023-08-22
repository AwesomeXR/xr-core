import { IFlowNodeMeta, IFlowNodeTypeRegisterData, Util } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    ArrayConcatNode: IFlowNodeMeta<
      'ArrayConcatNode',
      {
        _argLength: 'Number';
        item_0: 'Message';
      } & BaseInput,
      {
        value: 'Message';
      } & BaseOutput
    >;
  }
}

export const ArrayConcatNodeRegisterData: IFlowNodeTypeRegisterData<'ArrayConcatNode'> = {
  define: {
    className: 'ArrayConcatNode',
    cnName: '列表拼接',
    input: {
      _argLength: { title: '端口数', dataType: 'Number', defaultValue: 1 },
      item_0: { title: '输入_0', dataType: 'Message' },
      ...BaseInput,
    },
    output: {
      value: { title: '列表', dataType: 'Message' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    const originInputDef = Util.cloneNodeInputDefine(ctx._define.input);

    function reloadAll() {
      const { _argLength } = ctx.input;
      if (!_argLength) return;

      const newInputDef = { ...originInputDef } as any;
      for (let i = 0; i < _argLength; i++) {
        newInputDef[`item_${i}`] = { title: `输入_${i}`, dataType: 'Message' };
      }

      ctx.updateDefine({ input: newInputDef });
      flushValues();

      ctx.output.loaded = true;
    }

    function flushValues() {
      const { _argLength } = ctx.input;
      if (!_argLength) return;

      const outList: any[] = [];

      for (let i = 0; i < _argLength; i++) {
        const item = (ctx.input as any)[`item_${i}`];
        if (typeof item === 'undefined') continue;

        if (Array.isArray(item)) outList.push(...item);
        else outList.push(item);
      }

      ctx.output.value = outList;
    }

    ctx.event.listen('connect:change:input', ev => {
      const { _argLength = 0 } = ctx.input;

      if (ev.action === 'add' && ev.ioKey === `item_${_argLength}`) {
        ctx.setInput('_argLength', _argLength + 1);
      }
    });
    ctx.event.listen('input:change:_argLength', reloadAll);

    ctx.event.listen('input:change', ev => {
      if (ev.key.startsWith('item_')) flushValues();
    });

    reloadAll();

    return () => {};
  },
};
