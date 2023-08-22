import { IFlowHost } from 'ah-flow-node';
import { Deferred } from './lib';

export type IXRLintMsgItem = {
  level: 'error' | 'warning';
  comment: string;
  hostID: string;
  relNode?: { ID: string; propPath?: string };
};

export type IXRLinterCB = (host: IFlowHost, opt?: { fix?: boolean }) => Deferred<IXRLintMsgItem[]>;

export class XRLinterRegistry {
  static readonly Default = new XRLinterRegistry();

  private _store = new Map<string, IXRLinterCB>();

  get(type: string) {
    return this._store.get(type);
  }

  getAllTypes(): string[] {
    return [...this._store.keys()];
  }

  register(type: string, linter: IXRLinterCB) {
    this._store.set(type, linter);
  }
}
