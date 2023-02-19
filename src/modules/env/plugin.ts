import { PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { BasePlugin } from '../base-plugin';
import { VariableDefinition } from './types';

export class EnvPlugin extends BasePlugin {
  private static sVariables = new WeakMap<
    ServiceIdentifier,
    Array<VariableDefinition>
  >();

  private getEnv(key: string, def: unknown): unknown {
    return process.env[key] || def;
  }

  onServiceInstantiated = (
    target: ServiceIdentifier<unknown>,
    instance: unknown,
  ) => {
    const properties = EnvPlugin.get(target);
    if (!properties) return;

    Object.defineProperties(
      instance,
      properties.reduce<PropertyDescriptorMap>(
        (acc, { propertyName, defaultValue }) => {
          acc[propertyName] = {
            configurable: false,
            enumerable: true,
            value: this.getEnv(String(propertyName), defaultValue),
          };
          return acc;
        },
        {},
      ),
    );
  };

  static extend(target: ServiceIdentifier, property: VariableDefinition) {
    let service = EnvPlugin.sVariables.get(target);
    if (!service) {
      service = [];
      EnvPlugin.sVariables.set(target, service);
    }
    service.push(property);
  }

  static get(target: ServiceIdentifier) {
    return EnvPlugin.sVariables.get(target);
  }
}

PluginRegistry.extend([EnvPlugin]);
