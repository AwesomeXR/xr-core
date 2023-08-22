import { IFlowHost } from 'ah-flow-node';
import { MemoryFS } from 'ah-memory-fs';

// 以下需要外部声明合并
export interface IEngine {
  activeSceneID?: string;

  pause?: boolean;

  resize(): void;
  dispose(): void;
}

export const ExternalImpl = {
  createEngine: (_mfs: MemoryFS, _opt?: any): IEngine => {
    throw new Error('ExternalImpl.createEngine not implement');
  },
  createScene: (_engine: IEngine, _opt?: any): IFlowHost => {
    throw new Error('ExternalImpl.createScene not implement');
  },
};

export const createEngine: (typeof ExternalImpl)['createEngine'] = (...args) => ExternalImpl.createEngine(...args);
export const createScene: (typeof ExternalImpl)['createScene'] = (...args) => ExternalImpl.createScene(...args);
