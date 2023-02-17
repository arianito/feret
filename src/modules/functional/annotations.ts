import { FunctionalPlugin } from './plugin';
import {
  AfterDefinition,
  BeforeDefinition,
  DebounceDefinition,
  FunctionalOptions,
  ThrottleDefinition,
} from './types';

export function Once(): PropertyDecorator {
  return (target, propertyName) => {
    FunctionalPlugin.extend(target.constructor, {
      type: 'once',
      propertyName,
    });
  };
}

export function After(): PropertyDecorator;
export function After(n: number): PropertyDecorator;
export function After(
  options: FunctionalOptions<AfterDefinition>,
): PropertyDecorator;
export function After(
  opts: number | FunctionalOptions<AfterDefinition> = {},
): PropertyDecorator {
  let options: FunctionalOptions<AfterDefinition>;
  if (typeof opts === 'number') options = { n: opts };
  else options = opts;
  return (target, propertyName) => {
    FunctionalPlugin.extend(target.constructor, {
      type: 'after',
      propertyName,
      n: options.n || 5,
    });
  };
}
export function Before(): PropertyDecorator;
export function Before(n: number): PropertyDecorator;
export function Before(
  options: FunctionalOptions<BeforeDefinition>,
): PropertyDecorator;
export function Before(
  opts: number | FunctionalOptions<BeforeDefinition> = {},
): PropertyDecorator {
  let options: FunctionalOptions<BeforeDefinition>;
  if (typeof opts === 'number') options = { n: opts };
  else options = opts;
  return (target, propertyName) => {
    FunctionalPlugin.extend(target.constructor, {
      type: 'before',
      propertyName,
      n: options.n || 5,
    });
  };
}
export function Debounce(): PropertyDecorator;
export function Debounce(wait: number): PropertyDecorator;
export function Debounce(
  options: FunctionalOptions<DebounceDefinition>,
): PropertyDecorator;
export function Debounce(
  opts: number | FunctionalOptions<DebounceDefinition> = {},
): PropertyDecorator {
  let options: FunctionalOptions<DebounceDefinition>;
  if (typeof opts === 'number') options = { wait: opts };
  else options = opts;

  return (target, propertyName) => {
    FunctionalPlugin.extend(target.constructor, {
      type: 'debounce',
      propertyName,
      leading: options.leading || false,
      trailng: options.trailng || true,
      wait: options.wait || 25,
    });
  };
}

export function Throttle(): PropertyDecorator;
export function Throttle(wait: number): PropertyDecorator;
export function Throttle(
  options: FunctionalOptions<ThrottleDefinition>,
): PropertyDecorator;
export function Throttle(
  opts: number | FunctionalOptions<ThrottleDefinition> = {},
): PropertyDecorator {
  let options: FunctionalOptions<DebounceDefinition>;
  if (typeof opts === 'number') options = { wait: opts };
  else options = opts;
  return (target, propertyName) => {
    FunctionalPlugin.extend(target.constructor, {
      type: 'throttle',
      propertyName,
      leading: options.leading || true,
      trailng: options.trailng || true,
      wait: options.wait || 25,
    });
  };
}

export function Defer(): PropertyDecorator {
  return (target, propertyName) => {
    FunctionalPlugin.extend(target.constructor, {
      type: 'defer',
      propertyName,
    });
  };
}
