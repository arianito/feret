import { ObservablePlugin } from './plugin';
import { ObservableOptions } from './types';

export function Observable(options: ObservableOptions = {}): PropertyDecorator {
  return (target, propertyName) => {
    ObservablePlugin.extend(target.constructor, {
      propertyName,
      proxied: options.proxied || false,
      schedule: options.schedule,
      cycleMs: options.cycleMs || 25,
    });
  };
}
