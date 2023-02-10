import 'reflect-metadata';
// sep
import { beforeEach, describe, expect, test } from '@jest/globals';
import { Autowired, Container, createTestbed, Service } from '../src';
import { ServiceNotAvailableError } from './../src/errors';

describe('dependency injection', () => {
  let c: Container;
  beforeEach(() => {
    c = createTestbed();
  });
  test('instancing a service', () => {
    @Service()
    class Temp {
      created = true;
    }
    //
    const a = c.get(Temp);
    expect(a).toBeTruthy();
    expect(a.created).toBe(true);
  });
  test('instancing a singleton service', () => {
    @Service()
    class Temp {
      counter = 0;
    }
    //
    const a = c.get(Temp);
    const b = c.get(Temp);
    a.counter = 2;
    expect(a.counter).toBe(2);
    a.counter = 3;
    expect(b.counter).toBe(3);
    expect(a).toBe(b);
  });
  test('instancing a transient service', () => {
    @Service({ scope: 'transient' })
    class Transient {
      value = 2;
    }

    @Service()
    class Temp {
      @Autowired() trans: Transient;
    }

    //
    const t = c.get(Transient);
    const a = c.get(Temp);
    const b = c.get(Temp);

    t.value = 4;
    a.trans.value = 5;

    expect(a.trans.value).toBe(5);
    expect(b.trans.value).toBe(5);
    expect(t.value).toBe(4);
  });

  test('injection using constructor', () => {
    @Service()
    class AnotherService {
      value = 2;
    }

    @Service()
    class Temp {
      constructor(public readonly anotherService: AnotherService) {}
    }
    const t = c.get(AnotherService);
    const a = c.get(Temp);
    a.anotherService.value = 5;
    expect(a.anotherService.value).toBe(5);
    expect(t.value).toBe(5);
  });

  test('throw an error if accessing an unregistered service', () => {
    class Temp {}
    const fn = () => c.get(Temp);
    expect(fn).toThrow(ServiceNotAvailableError);
  });
});
