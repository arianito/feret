import { TimerPlugin } from './plugin';
import { TimerOptions } from './types';

export function Interval(options: TimerOptions = {}): PropertyDecorator {
  return (target, propertyName) => {
    TimerPlugin.extend(target.constructor, {
      propertyName,
      interval: options.interval || 1000,
    });
  };
}
