import { PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { BasePlugin } from '../base-plugin';
import { PropertyDefinition } from './types';

export class InjectablePlugin extends BasePlugin {
  private static sInjectables = new WeakMap<
    ServiceIdentifier,
    Array<PropertyDefinition>
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
          value: this.mContainer.get(h.type),
        };
        return acc;
      }, {}),
    );
  };

  static extend(target: ServiceIdentifier, property: PropertyDefinition) {
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
