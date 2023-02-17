import { MQPlugin } from './plugin';
import { ListenerOptions } from './types';

export function Listen(name: string): PropertyDecorator;
export function Listen(opts: ListenerOptions): PropertyDecorator;
export function Listen(opts: string | ListenerOptions): PropertyDecorator {
  return (target, propertyName) => {
    let options: ListenerOptions;
    if (typeof opts === 'string') options = { event: opts };
    else options = opts;
    MQPlugin.extend(target.constructor, {
      propertyName,
      event: options.event,
      schedule: options.schedule,
      cycleMs: options.cycleMs || 25,
    });
  };
}
