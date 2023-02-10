import { PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { BasePlugin } from '../base-plugin';
import { PropertyDefinition } from './types';

export class InjectablePlugin extends BasePlugin {
  private static injectables = new WeakMap<
    ServiceIdentifier,
    PropertyDefinition[]
  >();

  onServiceInstantiated = (
    target: ServiceIdentifier<unknown>,
    instance: unknown,
  ) => {
    const properties = InjectablePlugin.get(target);
    if (!properties) return;

    Object.defineProperties(
      instance,
      properties.reduce<PropertyDescriptorMap>((acc, h) => {
        acc[h.propertyName] = {
          configurable: false,
          enumerable: true,
          value: this.container.get(h.type),
        };
        return acc;
      }, {}),
    );
  };

  private static getService(target: ServiceIdentifier) {
    let list = InjectablePlugin.injectables.get(target);
    if (!list) {
      list = [];
      InjectablePlugin.injectables.set(target, list);
    }
    return list;
  }

  static extend(target: ServiceIdentifier, property: PropertyDefinition) {
    const service = InjectablePlugin.getService(target);
    service.push(property);
  }

  static get(target: ServiceIdentifier) {
    return InjectablePlugin.injectables.get(target);
  }
}

PluginRegistry.extend([InjectablePlugin]);
