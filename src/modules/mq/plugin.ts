import { PluginRegistry } from '../../registries';
import { Identifier, ServiceIdentifier } from '../../types';
import { Scheduler } from '../../utils';
import { NativeEventBus } from '../../utils/event-bus';
import { BasePlugin } from '../base-plugin';
import { ListenerDefinition, NotifyEvent } from './types';

export class MQPlugin extends BasePlugin {
  private static sListeners = new WeakMap<
    ServiceIdentifier,
    Array<ListenerDefinition>
  >();

  private readonly mGlobalChannelName = '*';
  private readonly mEventBus = new NativeEventBus<unknown>();

  subscribe(
    target: Identifier,
    listener: (message: CustomEvent<NotifyEvent<unknown>>) => void,
  ) {
    return this.mEventBus.subscribe(String(target), listener);
  }

  subscribeAll(listener: (message: CustomEvent<NotifyEvent<unknown>>) => void) {
    return this.mEventBus.subscribe(this.mGlobalChannelName, listener);
  }

  dispatch(type: string, message: any) {
    this.mEventBus.dispatch(type, message);
  }

  onServiceInstantiated(
    target: ServiceIdentifier<unknown>,
    instance: unknown,
  ): void {
    const listeners = MQPlugin.get(target);
    if (!listeners) return;

    listeners.forEach(({ propertyName, schedule, cycleMs, eventName }) => {
      const fn = instance[propertyName];

      const scheduler = new Scheduler<unknown>((buff) => {
        if (buff.length > 0) fn.call(instance, buff);
      });

      const onMessage = (message: CustomEvent<NotifyEvent<unknown>>) => {
        scheduler.push(message.detail, {
          schedule,
          cycleMs,
        });
      };

      this.subscribe(eventName, onMessage);
    });
  }

  static extend(target: ServiceIdentifier, property: ListenerDefinition) {
    let service = MQPlugin.sListeners.get(target);
    if (!service) {
      service = [];
      MQPlugin.sListeners.set(target, service);
    }
    service.push(property);
  }

  static get(target: ServiceIdentifier) {
    return MQPlugin.sListeners.get(target);
  }
}

PluginRegistry.extend([MQPlugin]);
