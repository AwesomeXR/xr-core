import { IFlowHost } from 'ah-flow-node';
import { Vector3 } from '../Math';
import { calcLodValue } from './calcLodValue';
import { getCurrentTimestamp } from './getCurrentTimestamp';

export type ILODItem<T> = { value: T; distance: number };

export class LODManager<T> {
  private _removeTickListen: Function;
  private _lastLodValue?: T;
  private _lastProcessTime?: number;

  // 下面的属性是需要外部赋值的
  lodList: ILODItem<T>[] = [];
  pause = false;
  throttle = 300;
  targetCenter?: Vector3;
  targetSize?: Vector3;

  constructor(
    private host: IFlowHost,
    private onGetCameraPos: () => Vector3,
    private onLodChange: (value: T, distance: number, index: number) => any
  ) {
    this._removeTickListen = this.host.event.listen('beforeRender', this._handleTick);
  }

  private _handleTick = () => {
    if (this.pause) return;

    if (!this._lastProcessTime) this._lastProcessTime = getCurrentTimestamp();
    const curTime = getCurrentTimestamp();

    // 节流处理
    if (curTime - this._lastProcessTime < this.throttle) return;

    let targetCenter: Vector3;
    let targetSize: Vector3;

    if (this.targetCenter) targetCenter = this.targetCenter;
    else targetCenter = Vector3.Zero();

    if (this.targetSize) targetSize = this.targetSize;
    else targetSize = new Vector3(0.001, 0.001, 0.001);

    const camPos = this.onGetCameraPos();
    const lodRet = calcLodValue<T>(camPos, targetCenter, targetSize, this.lodList);
    if (lodRet && lodRet.value !== this._lastLodValue) {
      this._lastLodValue = lodRet.value;
      this.onLodChange(lodRet.value, lodRet.distance, lodRet.index);
    }

    this._lastProcessTime = curTime;
  };

  dispose() {
    this._removeTickListen();
  }
}
