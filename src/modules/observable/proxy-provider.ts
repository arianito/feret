import { isObject } from '../../utils';

export class ProxyProvider {
  private mInstance: ProxyConstructor;
  private mValue: any;

  constructor(private readonly updateValue: (value: any) => void) {}

  getProxy(value: any) {
    const isValueDiffers = value !== this.mValue;
    if (!this.mInstance || isValueDiffers) {
      this.mValue = value;
      this.mInstance = new Proxy(value, this.dataHandler(value));
    }
    return this.mInstance;
  }

  private dataHandler(value: any): ProxyHandler<any> {
    return {
      get: (obj, prop) => {
        if (prop === '_isProxy') return true;
        if (isObject(obj[prop]) && !obj[prop]._isProxy) {
          obj[prop] = new Proxy(obj[prop], this.dataHandler(value));
        }
        return obj[prop];
      },
      set: (obj, prop, value) => {
        if (obj[prop] === value) return true;
        obj[prop] = value;
        this.updateValue(this.mValue);
        return true;
      },
      has: (obj, prop) => {
        if (obj[prop]) return true;
        return false;
      },
      deleteProperty: (obj, prop) => {
        delete obj[prop];
        this.updateValue(this.mValue);
        return true;
      },
    };
  }
}
