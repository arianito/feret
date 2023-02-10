import { PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { BasePlugin } from '../base-plugin';
import { TimerDefinition } from './types';

export class TimerPlugin extends BasePlugin {
  private static timers = new WeakMap<ServiceIdentifier, TimerDefinition[]>();

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

  private static getService(target: ServiceIdentifier) {
    let list = TimerPlugin.timers.get(target);
    if (!list) {
      list = [];
      TimerPlugin.timers.set(target, list);
    }
    return list;
  }

  static extend(target: ServiceIdentifier, property: TimerDefinition) {
    const service = TimerPlugin.getService(target);
    service.push(property);
  }

  static get(target: ServiceIdentifier) {
    return TimerPlugin.timers.get(target);
  }
}

PluginRegistry.extend([TimerPlugin]);
