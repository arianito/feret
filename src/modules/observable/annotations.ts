import { ObservablePlugin } from './plugin';
import { ObservableOptions } from './types';

export function Observable(options: ObservableOptions = {}): PropertyDecorator {
  return (target, propertyName) => {
    ObservablePlugin.extend(target.constructor, {
      propertyName,
      proxied: options.proxied || false,
      mode: options.mode,
      delay: options.delay || 25,
    });
  };
}
