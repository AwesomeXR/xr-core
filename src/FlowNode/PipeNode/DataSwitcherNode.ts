import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    DataSwitcherNode: IFlowNodeMeta<
      'DataSwitcherNode',
      {
        chIdx: 'Number';
        ch0: 'Message';
        ch1: 'Message';
        ch2: 'Message';
        ch3: 'Message';
        ch4: 'Message';
      } & BaseInput,
      {
        data: 'Message';
      } & BaseOutput
    >;
  }
}

export const DataSwitcherNodeRegisterData: IFlowNodeTypeRegisterData<'DataSwitcherNode'> = {
  define: {
    className: 'DataSwitcherNode',
    cnName: '通道切换',
    input: {
      chIdx: { title: '激活编号', dataType: 'Number', defaultValue: 0 },
      ch0: { title: '通道0', dataType: 'Message' },
      ch1: { title: '通道1', dataType: 'Message' },
      ch2: { title: '通道2', dataType: 'Message' },
      ch3: { title: '通道3', dataType: 'Message' },
      ch4: { title: '通道4', dataType: 'Message' },
      ...BaseInput,
    },
    output: {
      data: { title: '数据', dataType: 'Message' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    function flush() {
      const chIdx = ctx.input.chIdx;
      ctx.output.data = ctx.getInput(`ch${chIdx}` as any);
    }

    ctx.event.listen('input:change', ev => {
      if (ev.key.startsWith('ch')) flush();
    });
    flush();

    ctx.output.loaded = true;

    return () => {};
  },
};
