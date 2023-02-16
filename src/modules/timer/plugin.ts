import { PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { BasePlugin } from '../base-plugin';
import { TimerDefinition } from './types';

export class TimerPlugin extends BasePlugin {
  private static sTimers = new WeakMap<ServiceIdentifier, Array<TimerDefinition>>();

  onServiceInstantiated(
    target: ServiceIdentifier<unknown>,
    instance: unknown,
  ): void {
    const timers = TimerPlugin.get(target);
    if (!timers) return;
    timers.forEach(({ propertyName, interval }) => {
      function timerFunction(elapsed: number) {
        const desiredFunction = instance[propertyName];
        setTimeout(() => {
          if (desiredFunction.call(instance, elapsed) === false) return;
          timerFunction(elapsed + interval);
        }, interval);
      }
      timerFunction(0);
    });
  }

  static extend(target: ServiceIdentifier, property: TimerDefinition) {
    let service = TimerPlugin.sTimers.get(target);
    if (!service) {
      service = [];
      TimerPlugin.sTimers.set(target, service);
    }
    service.push(property);
  }

  static get(target: ServiceIdentifier) {
    return TimerPlugin.sTimers.get(target);
  }
}

PluginRegistry.extend([TimerPlugin]);
