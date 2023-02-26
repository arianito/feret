import { MQPlugin } from './plugin';
import { ListenerOptions } from './types';

export function Listen(name: ListenerOptions['eventName']): PropertyDecorator;
export function Listen(opts: ListenerOptions): PropertyDecorator;
export function Listen(
  opts: ListenerOptions['eventName'] | ListenerOptions,
): PropertyDecorator {
  return (target, propertyName) => {
    let options: ListenerOptions;
    if (typeof opts === 'string' || typeof opts === 'symbol')
      options = { eventName: opts };
    else options = opts;
    MQPlugin.extend(target.constructor, {
      propertyName,
      eventName: options.eventName,
      schedule: options.schedule,
      cycleMs: options.cycleMs || 25,
    });
  };
}
