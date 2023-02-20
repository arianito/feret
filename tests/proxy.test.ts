import { test } from '@jest/globals';
test('test proxy triggers on chaning object properties', () => {
  const obj = {
    a: 1,
    b: {
      c: 2,
      d: {
        e: 5,
      },
    },
  };

  function updateValue(a: any) {
    console.log(a);
  }
  function handler(instance): ProxyHandler<any> {
    return {
      get: (target, prop) => {
        if (prop === '_isProxy') return true;
        if (typeof target[prop] === 'object' && !obj[prop]._isProxy) {
          obj[prop] = new Proxy(obj[prop], handler(instance));
        }
        return obj[prop];
      },

      set: function (obj, prop, value) {
        if (obj[prop] === value) return true;
        obj[prop] = value;
        updateValue(instance);
        return true;
      },
      deleteProperty: function (obj, prop) {
        delete obj[prop];
        updateValue(instance);
        return true;
      },
    };
  }
  const proxy = new Proxy(obj, handler(obj));
  proxy.a = 2;
});
