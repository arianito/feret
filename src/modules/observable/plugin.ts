import { MetadataRegistry, PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { isObject } from '../../utils';
import { NativeEventBus } from '../../utils/event-bus';
import { getVault } from '../../utils/vault';
import { BasePlugin } from '../base-plugin';
import { ProxyProvider } from './proxy-provider';
import { Scheduler } from './scheduler';
import { NotifyEvent, ObservableDefinition } from './types';

export class ObservablePlugin extends BasePlugin {
  private static sObservables = new WeakMap<
    ServiceIdentifier,
    Array<ObservableDefinition>
  >();

  private readonly mGlobalChannelName = '*';
  private readonly mEventBus = new NativeEventBus<NotifyEvent>();

  subscribe(
    target: ServiceIdentifier<unknown>,
    listener: (message: CustomEvent<NotifyEvent>) => void,
  ) {
    const metadata = MetadataRegistry.get(target);
    return this.mEventBus.subscribe(metadata.getUniqueKey(), listener);
  }
  subscribeAll(listener: (message: CustomEvent<NotifyEvent>) => void) {
    return this.mEventBus.subscribe(this.mGlobalChannelName, listener);
  }

  onServiceInstantiated(
    target: ServiceIdentifier<unknown>,
    instance: unknown,
  ): void {
    const observables = ObservablePlugin.get(target);
    if (!observables) return;

    const metadata = MetadataRegistry.get(target);
    const vault = getVault(instance);
    const scheduler = new Scheduler<unknown>((bulk) => {
      bulk.forEach(({ force, propertyName, object }) => {
        const isValueDiffers = object !== vault.get(propertyName);
        if (!isValueDiffers && !force) return;
        vault.set(propertyName, object);
      });

      const event: NotifyEvent = {
        type: target,
        metadata,
        bulk,
      };

      this.mEventBus.dispatch(this.mGlobalChannelName, event);
      this.mEventBus.dispatch(metadata.getUniqueKey(), event);
    });

    observables.forEach(({ propertyName, proxied, delay, mode }) => {
      vault.set(propertyName, instance[propertyName]);

      const proxyFactory = new ProxyProvider((value) => {
        scheduler.push(
          {
            object: value,
            propertyName,
            force: true,
          },
          {
            mode,
            delay,
          },
        );
      });

      Object.defineProperty(instance, propertyName, {
        configurable: false,
        enumerable: true,
        get: () => {
          const value = vault.get(propertyName);
          if (isObject(value) && proxied) return proxyFactory.getProxy(value);
          return value;
        },
        set: (value) =>
          scheduler.push(
            {
              object: value,
              propertyName,
              force: false,
            },
            {
              mode,
              delay,
            },
          ),
      });
    });
  }

  static extend(target: ServiceIdentifier, property: ObservableDefinition) {
    let service = ObservablePlugin.sObservables.get(target);
    if (!service) {
      service = [];
      ObservablePlugin.sObservables.set(target, service);
    }
    service.push(property);
  }
  static get(target: ServiceIdentifier) {
    return ObservablePlugin.sObservables.get(target);
  }
}

PluginRegistry.extend([ObservablePlugin]);
