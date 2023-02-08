import { Container } from '../container';
import { ObservableRegistry } from '../registries/observable-registry';
import { MessageType, ServiceIdentifier } from '../types';
import { Plugin } from '../plugin';
import { EventBus } from '../event-bus';

export class ObservablePlugin extends Plugin {
  bus = new EventBus<MessageType>();
  constructor(container: Container) {
    super(container);
  }
  onServiceInstantiated(
    target: ServiceIdentifier<unknown>,
    instance: unknown,
  ): void {
    const observables = ObservableRegistry.get(target);
    if (!observables) return;

    observables.forEach(({ propertyName }) => {
      const alias = `$$${propertyName.toString()}`;
      Object.defineProperty(instance, alias, {
        configurable: true,
        writable: false,
        enumerable: false,
        value: instance[propertyName],
      });

      Object.defineProperty(instance, propertyName, {
        configurable: true,
        enumerable: true,
        get: () => {
          return instance[alias];
        },
        set: (value) => {
          if (instance[alias] !== value) {
            Object.defineProperty(instance, alias, {
              configurable: true,
              writable: false,
              enumerable: false,
              value: value,
            });
            this.bus.dispatch({
              type: target,
              propertyKey: propertyName,
              value: value,
            });
          }
        },
      });
    });
  }
}
