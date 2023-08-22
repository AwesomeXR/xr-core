import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { Scalar } from '../../Math';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    CurveDriverNode: IFlowNodeMeta<
      'CurveDriverNode',
      {
        frame: 'Number';
        ch_keyData_default: 'JSON';
      } & BaseInput,
      {
        ch_evaluated_default: 'Number';
      }
    >;
  }
}

type IKeyDataItem = { frame: number; value: number; inTangent?: number; outTangent?: number };

export const CurveDriverNodeRegisterData: IFlowNodeTypeRegisterData<'CurveDriverNode'> = {
  define: {
    className: 'CurveDriverNode',
    cnName: '曲线驱动器',
    input: {
      frame: { title: '帧序号', dataType: 'Number', defaultValue: 0 },
      ch_keyData_default: {
        title: '通道_default',
        dataType: 'JSON',
        defaultValue: [
          { frame: 0, value: 0 },
          { frame: 60, value: 1 },
        ] as IKeyDataItem[],
      },
      ...BaseInput,
    },
    output: {
      ch_evaluated_default: { title: '通道_default', dataType: 'Number' },
    },
  },
  setup(ctx) {
    const flush = () => {
      const frame = ctx.input.frame;
      if (typeof frame !== 'number') return;

      const toEvaluateChNames = Object.keys(ctx._define.output)
        .filter(k => k.startsWith('ch_evaluated_'))
        .map(k => k.replace(/^ch_evaluated_/, ''));

      for (let i = 0; i < toEvaluateChNames.length; i++) {
        const _inDataKey = 'ch_keyData_' + toEvaluateChNames[i];

        const chKeyData: IKeyDataItem[] | undefined = (ctx.input as any)[_inDataKey];
        if (!chKeyData || chKeyData.length === 0) continue;

        let outputValue: number;

        if (frame <= chKeyData[0].frame) {
          outputValue = chKeyData[0].value;
        }
        //
        else if (chKeyData[chKeyData.length - 1].frame <= frame) {
          outputValue = chKeyData[chKeyData.length - 1].value;
        }
        //
        else {
          let kd1: IKeyDataItem | undefined;
          let kd2: IKeyDataItem | undefined;

          for (let j = 0; j < chKeyData.length - 1; j++) {
            kd1 = chKeyData[j];
            kd2 = chKeyData[j + 1];
            if (kd1.frame <= frame && frame < kd2.frame) break;

            kd1 = kd2 = undefined;
          }
          if (!kd1 || !kd2) continue; // 没有找到前后两个帧, 跳过

          const frameDelta = kd2.frame - kd1.frame;
          const gradient = (frame - kd1.frame) / frameDelta;

          outputValue =
            typeof kd1.outTangent === 'number' && typeof kd2.inTangent === 'number'
              ? Scalar.Hermite(kd1.value, kd1.outTangent * frameDelta, kd2.value, kd2.inTangent * frameDelta, gradient)
              : Scalar.Lerp(kd1.value, kd2.value, gradient);
        }

        const _outValueKey = 'ch_evaluated_' + toEvaluateChNames[i];
        (ctx.output as any)[_outValueKey] = outputValue;
      }
    };

    ctx.event.listen('input:change:frame', flush);
    flush();

    return () => {};
  },
};
