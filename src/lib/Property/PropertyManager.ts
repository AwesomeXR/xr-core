import { FlowDTRegistry, IDefaultFlowNode, Util } from 'ah-flow-node';
import { IPropertyItem } from './IPropertyItem';
import { EventBus } from 'ah-event-bus';

export class PropertyManager {
  static joinPath(...segs: string[]) {
    return JSON.stringify(segs);
  }
  static splitPath(path: string) {
    return JSON.parse(path) as string[];
  }

  readonly event = new EventBus<{}>();

  private _cache = new Map<string, IPropertyItem>();
  private _removeBindingListen: Function;

  constructor(
    private _node: IDefaultFlowNode,
    private _onGet: (path: string) => any,
    private _onSet: (path: string, value: any) => any
  ) {
    this._removeBindingListen = this._node.event.listen('input:change', ev => {
      for (const [path, item] of this._cache) {
        if (item.type === 'binding' && item.ioKey === ev.key) {
          this._onSet(path, ev.value);
          break;
        }
      }
    });
  }

  get(path: string): { item?: IPropertyItem; value?: any } {
    return { item: this._cache.get(path), value: this._onGet(path) };
  }

  update(path: string, item: IPropertyItem) {
    const lastItem = this._cache.get(path);

    if (item.type === 'value') {
      // 删除上次的 binding
      if (lastItem && lastItem.type === 'binding') {
        const newInputDef = { ...this._node._define.input };
        delete newInputDef[lastItem.ioKey];
        this._node.updateDefine({ input: newInputDef });
      }

      const dt = FlowDTRegistry.Default.get(item.dataType);
      const nValue = dt && dt.serializer && dt.serializer !== 'JSON' ? dt.serializer.restore(item.value) : item.value;

      this._onSet(path, nValue);
    }
    //
    else if (item.type === 'binding') {
      // 删除上次的 binding
      if (lastItem && lastItem.type === 'binding' && lastItem.ioKey !== item.ioKey) {
        const newInputDef = { ...this._node._define.input };
        delete newInputDef[lastItem.ioKey];
        this._node.updateDefine({ input: newInputDef });
      }

      const newInputDef = Util.cloneNodeInputDefine({ ...this._node._define.input, [item.ioKey]: item.ioDef });
      this._node.updateDefine({ input: newInputDef });
    }

    this._cache.set(path, item);
  }

  batchUpdate(data: Record<string, IPropertyItem>) {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const item = data[key];
      this.update(key, item);
    }
  }

  dispose() {
    this.event.remove();
    this._removeBindingListen();
  }
}
