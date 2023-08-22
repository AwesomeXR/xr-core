import { Deferred } from './lib';
import { MemoryFS } from 'ah-memory-fs';

export type IXRStage = 'beforeSave' | 'beforePublish';
export type IXRStageItem = { stage: IXRStage; platform: string; cb: IXRStageCB };

export type IXRStageCB = (mfs: MemoryFS) => Deferred<any>;

export class XRStageRegistry {
  static readonly Default = new XRStageRegistry();

  private _store: IXRStageItem[] = [];

  get(stage: IXRStage, platform: string) {
    return this._store.find(d => d.stage === stage && d.platform === platform)?.cb;
  }

  getAll() {
    return this._store;
  }

  register(stage: IXRStage, platform: string, cb: IXRStageCB) {
    this._store.push({ stage, platform, cb });
  }
}
