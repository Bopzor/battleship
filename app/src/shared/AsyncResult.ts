export class AsyncResult<Value = void, Error = unknown> {
  private _resolve?: (value: Value) => void;
  private _reject?: (error: Error) => void;

  register = () => {
    if (this._resolve || this._reject) {
      throw new Error('AsyncResult: already registered');
    }

    return new Promise<Value>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  };

  resolve = (value: Value) => {
    if (!this._resolve) {
      throw new Error('AsyncResult: not registered');
    }

    this._resolve(value);
    this._resolve = this._reject = undefined;

    return new Promise((r) => setTimeout(r, 0));
  };

  reject = (error: Error) => {
    if (!this._reject) {
      throw new Error('AsyncResult: not registered');
    }

    this._reject(error);
    this._resolve = this._reject = undefined;

    return new Promise((r) => setTimeout(r, 0));
  };
}
