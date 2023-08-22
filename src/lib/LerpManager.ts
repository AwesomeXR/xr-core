import { IFlowHost } from 'ah-flow-node';
import { getCurrentTimestamp } from './getCurrentTimestamp';

export class LerpManager<T> {
  private _outputValue: T | undefined;
  private _removeTickListen: Function;

  private _lerpStartTime?: number;
  private _lerpStartValue?: T | undefined;
  private _lerpEndValue?: T | undefined;
  private _lerpDuration?: number;

  private _isInterpolating = false;

  constructor(
    private host: IFlowHost,
    private lerpFn: (start: T, end: T, amount: number) => T,
    private onOutput: (data: T) => void,
    private onLerpStart?: (start: T, end: T, duration: number) => any
  ) {
    this._removeTickListen = this.host.event.listen('beforeRender', this._handleTick);
  }

  private _handleTick = () => {
    if (
      typeof this._lerpStartTime === 'undefined' ||
      typeof this._lerpDuration === 'undefined' ||
      typeof this._lerpStartValue === 'undefined' ||
      typeof this._lerpEndValue === 'undefined'
    ) {
      return;
    }

    this._isInterpolating = true;

    const now = getCurrentTimestamp();
    const amount = (now - this._lerpStartTime) / this._lerpDuration;
    const result = this.lerpFn(this._lerpStartValue, this._lerpEndValue, amount);

    if (amount <= 1) {
      this._outputValue = result;
      this.onOutput(this._outputValue);
    } else {
      this._isInterpolating = false;
      this._clearLerp();
    }
  };

  private _startLerp(startValue: T, endValue: T, duration: number) {
    this._lerpStartTime = getCurrentTimestamp();
    this._lerpStartValue = startValue;
    this._lerpEndValue = endValue;
    this._lerpDuration = duration;

    if (this.onLerpStart) this.onLerpStart(startValue, endValue, duration);

    this._handleTick(); // 马上调一遍
  }

  private _clearLerp() {
    this._lerpStartTime = undefined;
    this._lerpStartValue = undefined;
    this._lerpEndValue = undefined;
    this._lerpDuration = undefined;
  }

  get isInterpolating() {
    return this._isInterpolating;
  }

  update(targetValue: T, durationMs: number) {
    if (typeof this._outputValue === 'undefined' || durationMs <= 0) {
      this._clearLerp();
      this._outputValue = targetValue;
      this.onOutput(targetValue);
      return;
    }

    const startValue = this._outputValue; // 取当前输出值为 lerp 起点
    this._startLerp(startValue, targetValue, durationMs);
  }

  destroy() {
    this._clearLerp();
    this._removeTickListen();
  }
}
