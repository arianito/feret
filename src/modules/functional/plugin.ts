import { PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { getVault } from '../../utils';
import { BasePlugin } from '../base-plugin';
import { getFunction } from './function';
import { FunctionalDefinition } from './types';

export class FunctionalPlugin extends BasePlugin {
  private static sFunctional = new WeakMap<
    ServiceIdentifier,
    Array<FunctionalDefinition>
  >();

  onServiceInstantiated(
    target: ServiceIdentifier<unknown>,
    instance: unknown,
  ): void {
    const functionals = FunctionalPlugin.get(target);
    if (!functionals) return;

    const vault = getVault(instance);

    functionals.forEach((functional) => {
      const { propertyName } = functional;
      vault.set(propertyName, instance[propertyName]);

      let replacementFunction = getFunction(functional, (...args: any[]) => {
        const fn = vault.get(propertyName);
        if (typeof fn === 'function') fn.apply(instance, args);
      });

      Object.defineProperty(instance, propertyName, {
        configurable: false,
        enumerable: true,
        get: () => replacementFunction,
        set: (value) => {
          vault.set(propertyName, value);
        },
      });
    });
  }

  static extend(target: ServiceIdentifier, property: FunctionalDefinition) {
    let service = FunctionalPlugin.sFunctional.get(target);
    if (!service) {
      service = [];
      FunctionalPlugin.sFunctional.set(target, service);
    }
    service.push(property);
  }

  static get(target: ServiceIdentifier) {
    return FunctionalPlugin.sFunctional.get(target);
  }
}

PluginRegistry.extend([FunctionalPlugin]);
