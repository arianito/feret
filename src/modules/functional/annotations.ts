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

export function After(
  options: FunctionalOptions<AfterDefinition> = {},
): PropertyDecorator {
  return (target, propertyName) => {
    FunctionalPlugin.extend(target.constructor, {
      type: 'after',
      propertyName,
      n: options.n || 5,
    });
  };
}

export function Before(
  options: FunctionalOptions<BeforeDefinition> = {},
): PropertyDecorator {
  return (target, propertyName) => {
    FunctionalPlugin.extend(target.constructor, {
      type: 'before',
      propertyName,
      n: options.n || 5,
    });
  };
}

export function Debounce(
  options: FunctionalOptions<DebounceDefinition> = {},
): PropertyDecorator {
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

export function Throttle(
  options: FunctionalOptions<ThrottleDefinition> = {},
): PropertyDecorator {
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
