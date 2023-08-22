import { IFlowNodeMeta, IFlowNodeTypeRegisterData, Util } from 'ah-flow-node';
import { getCurrentTimestamp } from '../../lib/getCurrentTimestamp';
import { BaseInput } from '../base';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    FrameTimerNode: IFlowNodeMeta<
      'FrameTimerNode',
      {
        run: 'Boolean';
        runs: 'Array<Boolean>';
        range: 'Vector2';
        loop: 'Boolean';
        speedRatio: 'Number';
        frame: 'Number';
        shouldContinue: 'Boolean';
      } & BaseInput,
      {
        frame: 'Number';
        isRunning: 'Boolean';
      }
    >;
  }
}

export const FrameTimerNodeRegisterData: IFlowNodeTypeRegisterData<'FrameTimerNode'> = {
  define: {
    className: 'FrameTimerNode',
    cnName: '回放',
    input: {
      run: { title: '运行', dataType: 'Boolean' },
      runs: { title: '运行(且)', dataType: 'Array<Boolean>' },
      loop: { title: '帧循环', dataType: 'Boolean' },
      range: { title: '帧范围', dataType: 'Vector2' },
      speedRatio: { title: '速率', dataType: 'Number', defaultValue: 1 },
      frame: { title: '手动帧', dataType: 'Number', defaultValue: 0 },
      shouldContinue: { title: '从当前帧继续', dataType: 'Boolean' },
      ...BaseInput,
    },
    output: {
      frame: { title: '帧序号', dataType: 'Number' },
      isRunning: { title: '正在运行', dataType: 'Boolean' },
    },
  },
  setup(ctx) {
    let removeRenderListen: Function | undefined;
    let continueFrame: number | undefined;

    function testShouldRun() {
      return ctx.input.runs ? ctx.input.runs.every(Boolean) && ctx.input.run : ctx.input.run;
    }

    function restartLerpLoop() {
      if (removeRenderListen) {
        removeRenderListen();
        removeRenderListen = undefined;
        ctx.output.isRunning = false;
      }
      const shouldRun = testShouldRun();
      if (!shouldRun) return;

      let runStartTime = getCurrentTimestamp();

      let rangeX = continueFrame ?? (ctx.input.range?.x || 0);
      const rangeY = ctx.input.range?.y || Number.MAX_SAFE_INTEGER;
      if (rangeX === rangeY) return;

      ctx.output.isRunning = true;

      removeRenderListen = ctx.host.event.listen('beforeRender', () => {
        continueFrame = undefined;
        const curTime = getCurrentTimestamp();

        let frameTimeDelta = 1000 / 60;

        const speedRatio = ctx.input.speedRatio;
        if (speedRatio) frameTimeDelta *= 1 / speedRatio; // 时间缩放

        let frame = rangeX + (curTime - runStartTime) / frameTimeDelta;

        // 钳制最大值
        if (rangeY < frame) {
          frame = rangeY;

          // 如果是循环模式，就重设起点时刻
          if (ctx.input.loop) {
            runStartTime = getCurrentTimestamp();
            rangeX = continueFrame ?? (ctx.input.range?.x || 0);
            frame = rangeX;
          }
        }

        ctx.output.frame = frame;
        ctx.setInput('frame', frame, { silence: true });
      });
    }

    function setContinueFrameIfNeeded() {
      const shouldRun = testShouldRun();
      if (
        !shouldRun &&
        ctx.input.shouldContinue &&
        typeof ctx.output.frame !== 'undefined' &&
        typeof ctx.input.range?.y !== 'undefined' &&
        ctx.output.frame < ctx.input.range?.y
      ) {
        continueFrame = ctx.output.frame;
      }
    }

    const flusher = Util.createNodeFlusher(ctx, {
      run: function () {
        setContinueFrameIfNeeded();
        restartLerpLoop();
      },
      runs: function () {
        setContinueFrameIfNeeded();
        restartLerpLoop();
      },
      range: function () {},
      loop: function () {},
      speedRatio: function () {},
      frame: function () {
        if (typeof ctx.input.frame === 'undefined') return;
        ctx.output.frame = ctx.input.frame;
        setContinueFrameIfNeeded();
      },
      _meta: function () {},
      shouldContinue: function () {},
    });

    flusher.bindInputEvent();

    if (typeof ctx.input.frame !== 'undefined') {
      ctx.output.frame = ctx.input.frame;
      if (ctx.input.shouldContinue) continueFrame = ctx.input.frame;
    }

    restartLerpLoop();

    return () => {
      if (removeRenderListen) {
        removeRenderListen();
      }
    };
  },
};
