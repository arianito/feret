import { NativeEventBus } from '../../utils/event-bus';
import { MetadataRegistry, PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { Vault } from '../../utils/vault';
import { BasePlugin } from '../base-plugin';
import { MessageType, ObservableDefinition } from './types';

export class ObservablePlugin extends BasePlugin {
  private static observables = new WeakMap<
    ServiceIdentifier,
    ObservableDefinition[]
  >();

  private readonly globalChannelName = '*';
  private readonly eventBus = new NativeEventBus<MessageType>();

  subscribe(
    target: ServiceIdentifier<unknown>,
    listener: (message: CustomEvent<MessageType>) => void,
  ) {
    const metadata = MetadataRegistry.get(target);
    return this.eventBus.subscribe(metadata.getUniqueKey(), listener);
  }
  subscribeAll(listener: (message: CustomEvent<MessageType>) => void) {
    return this.eventBus.subscribe(this.globalChannelName, listener);
  }

  onServiceInstantiated(
    target: ServiceIdentifier<unknown>,
    instance: unknown,
  ): void {
    const observables = ObservablePlugin.get(target);
    if (!observables) return;

    const metadata = MetadataRegistry.get(target);
    const vault = Vault.getVault(instance);

    observables.forEach((propertyName) => {
      vault.set(propertyName, instance[propertyName]);
      Object.defineProperty(instance, propertyName, {
        configurable: false,
        enumerable: true,
        get: () => vault.get(propertyName),
        set: (value) => {
          const isValueDiffers = value !== vault.get(propertyName);
          if (!isValueDiffers) return;

          vault.set(propertyName, value);
          const message: MessageType = {
            type: target,
            propertyKey: propertyName,
            metadata,
            value,
          };

          this.eventBus.dispatch(this.globalChannelName, message);
          this.eventBus.dispatch(metadata.getUniqueKey(), message);
        },
      });
    });
  }

  private static getService(target: ServiceIdentifier) {
    let list = ObservablePlugin.observables.get(target);
    if (!list) {
      list = [];
      ObservablePlugin.observables.set(target, list);
    }
    return list;
  }

  static extend(target: ServiceIdentifier, property: ObservableDefinition) {
    const service = ObservablePlugin.getService(target);
    service.push(property);
  }

  static get(target: ServiceIdentifier) {
    return ObservablePlugin.observables.get(target);
  }
}

PluginRegistry.extend([ObservablePlugin]);
