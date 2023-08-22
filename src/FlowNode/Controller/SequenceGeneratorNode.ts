import { IFlowNodeMeta, IFlowNodeTypeRegisterData, Util } from 'ah-flow-node';
import { BezierCurve, Scalar } from '../../Math';
import { getCurrentTimestamp } from '../../lib';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    SequenceGeneratorNode: IFlowNodeMeta<
      'SequenceGeneratorNode',
      {
        start: 'Number';
        end: 'Number';
        loop: 'Boolean';
        loopCircle: 'Boolean';
        duration: 'Number';
        bezier: 'String';
        useInteger: 'Boolean';
        active: 'Boolean';
      } & BaseInput,
      {
        data: 'Number';
      }
    >;
  }
}

export const SequenceGeneratorNodeRegisterData: IFlowNodeTypeRegisterData<'SequenceGeneratorNode'> = {
  define: {
    className: 'SequenceGeneratorNode',
    cnName: '序列发生器',
    input: {
      start: { title: '起点', dataType: 'Number', defaultValue: 0 },
      end: { title: '终点', dataType: 'Number', defaultValue: 1 },
      loop: { title: '循环', dataType: 'Boolean' },
      loopCircle: { title: '正反交替', dataType: 'Boolean' },
      duration: { title: '持续时长(s)', dataType: 'Number', defaultValue: 1 },
      bezier: { title: '贝塞尔参数', dataType: 'String' },
      useInteger: { title: '仅输出整数', dataType: 'Boolean' },
      active: { title: '运行', dataType: 'Boolean' },
      ...BaseInput,
    },
    output: {
      data: { title: '输出', dataType: 'Number' },
    },
  },
  setup(ctx) {
    let removeRenderListen: Function | undefined;
    let easeFn = (a: number) => a;

    let lerpStartTime: number | undefined;
    let lerpInverse = false;

    function handleRenderTick() {
      if (
        typeof ctx.input.start === 'undefined' ||
        typeof ctx.input.end === 'undefined' ||
        typeof ctx.input.duration === 'undefined' ||
        ctx.input.duration <= 0 ||
        !ctx.input.active
      ) {
        return;
      }

      if (!lerpStartTime) lerpStartTime = getCurrentTimestamp();

      let curTickTime = getCurrentTimestamp();

      // 通过时间增量求 lerpAmount
      let lerpAmount = Scalar.Clamp((curTickTime - lerpStartTime) / (ctx.input.duration * 1000), 0, 1);

      // 设置了 loop && 超时了 -> 重置 lerp, 翻转 inverse 标记
      if (ctx.input.loop && lerpStartTime + ctx.input.duration * 1000 < curTickTime) {
        lerpStartTime = getCurrentTimestamp();
        lerpAmount = 0;
        lerpInverse = !lerpInverse;
      }

      // optional: 翻转 amount
      if (ctx.input.loopCircle && lerpInverse) lerpAmount = 1 - lerpAmount;

      lerpAmount = easeFn(lerpAmount);

      let outValue = Scalar.Lerp(ctx.input.start, ctx.input.end, lerpAmount);

      if (ctx.input.useInteger) outValue = Math.round(outValue);

      ctx.output.data = outValue;
    }

    function launch() {
      stop();
      removeRenderListen = ctx.host.event.listen('beforeRender', handleRenderTick);
    }

    function stop() {
      if (removeRenderListen) {
        removeRenderListen();
        removeRenderListen = undefined;
        lerpStartTime = undefined;
      }
    }

    const flusher = Util.createNodeFlusher(ctx, {
      start: function () {},
      end: function () {},
      loop: function () {},
      loopCircle: function () {
        if (!ctx.input.loopCircle) lerpInverse = false;
      },
      duration: function () {},
      bezier: function () {
        if (!ctx.input.bezier) return;
        const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = ctx.input.bezier.split(',').map(s => parseFloat(s.trim()));
        easeFn = a => BezierCurve.Interpolate(a, x1, y1, x2, y2);
      },
      useInteger: function () {},
      active: function () {
        if (ctx.input.active) launch();
        else stop();
      },
      _meta: function () {},
    });

    flusher.bindInputEvent();
    flusher.keys.forEach(k => {
      flusher.handler[k]();
    });

    return () => {
      stop();
    };
  },
};
