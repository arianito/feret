import afterFn from 'lodash/after';
import beforeFn from 'lodash/before';
import debounceFn from 'lodash/debounce';
import deferFn from 'lodash/defer';
import onceFn from 'lodash/once';
import throttleFn from 'lodash/throttle';
import { FunctionalDefinition, typeGuards } from './types';

export function getFunction(
  functional: FunctionalDefinition,
  proxyFunction: any,
) {
  if (typeGuards.isOnce(functional)) {
    return onceFn(proxyFunction);
  }
  if (typeGuards.isAfter(functional)) {
    const { n } = functional;
    return afterFn(n, proxyFunction);
  }
  if (typeGuards.isBefore(functional)) {
    const { n } = functional;
    return beforeFn(n, proxyFunction);
  }
  if (typeGuards.isDebounce(functional)) {
    const { wait, leading, trailng } = functional;
    return debounceFn(proxyFunction, wait, {
      leading,
      trailng,
    });
  }
  if (typeGuards.isThrottle(functional)) {
    const { wait, leading, trailng } = functional;
    return throttleFn(proxyFunction, wait, {
      leading,
      trailng,
    });
  }
  if (typeGuards.isDefer(functional)) {
    return deferFn(proxyFunction);
  }
  return proxyFunction;
}
