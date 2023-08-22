import { getInternalRandomString } from './getInternalRandomString';
import { EventBus } from 'ah-event-bus';

export class Deferred<T> {
  static wrapAsyncFn = wrapAsyncFn;

  readonly ret: Promise<T>;
  readonly event = new EventBus<{ progressChange: number; resolve: T | PromiseLike<T>; reject: any }>();

  private _resolve!: (value: T | PromiseLike<T>) => void;
  private _reject!: (reason?: any) => void;
  private _progress: number = 0;

  get resolve() {
    return this._resolve;
  }

  get reject() {
    return this._reject;
  }

  set progress(pg: number) {
    this._progress = pg;
    this.event.emit('progressChange', pg);
  }

  setProgress = (pg: number) => {
    this.progress = pg;
  };

  get progress() {
    return this._progress;
  }

  transferTo(next: Deferred<T>): Deferred<T>;
  transferTo<K>(next: Deferred<K>, convert: (v: T) => K): Deferred<K>;
  transferTo(next: Deferred<any>, convert?: any) {
    this.event.listen('progressChange', next.setProgress);
    this.ret.then(v => next.resolve(convert ? convert(v) : v)).catch(next.reject);
    return this;
  }

  constructor(
    readonly name: string = getInternalRandomString(true),
    public title?: string
  ) {
    this.ret = new Promise<T>((resolve, reject) => {
      this.progress = 0;

      this._resolve = rsp => {
        this.progress = 1;
        this.event.emit('resolve', rsp);
        this.event.clear();
        resolve(rsp);
      };

      this._reject = err => {
        this.event.emit('reject', err);
        this.event.clear();
        reject(err);
      };
    });
  }
}

function wrapAsyncFn<P extends any[], R>(
  fn: (ctx: Deferred<R>, ...args: P) => Promise<R>,
  getDefer = () => new Deferred<R>()
): (...args: P) => Deferred<R> {
  const wrappedFn = (...args: P) => {
    const defer = getDefer();

    fn(defer, ...args)
      .then(defer.resolve)
      .catch(defer.reject);

    return defer;
  };

  return wrappedFn;
}
