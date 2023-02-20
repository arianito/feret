import { PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { BasePlugin } from '../base-plugin';
import { InjectedDefinition } from './types';

export class InjectablePlugin extends BasePlugin {
  private static sInjectables = new WeakMap<
    ServiceIdentifier,
    Array<InjectedDefinition>
  >();

  onServiceInstantiated = (
    target: ServiceIdentifier<unknown>,
    instance: unknown,
  ) => {
    const properties = InjectablePlugin.get(target);
    if (!properties) return;

    Object.defineProperties(
      instance,
      properties.reduce<PropertyDescriptorMap>(
        (acc, { name, type, propertyName }) => {
          acc[propertyName] = {
            configurable: false,
            enumerable: true,
            get: () => this.mContainer.get(name || type),
          };
          return acc;
        },
        {},
      ),
    );
  };

  static extend(target: ServiceIdentifier, property: InjectedDefinition) {
    let service = InjectablePlugin.sInjectables.get(target);
    if (!service) {
      service = [];
      InjectablePlugin.sInjectables.set(target, service);
    }
    service.push(property);
  }

  static get(target: ServiceIdentifier) {
    return InjectablePlugin.sInjectables.get(target);
  }
}

PluginRegistry.extend([InjectablePlugin]);
