import { Identifier } from '../types';

export type PropertyVault = Map<Identifier, any>;

const PropertyVaultName = Symbol('__vault__');

export function getVault(instance: unknown): PropertyVault {
  let vault: PropertyVault = instance[PropertyVaultName];
  if (!vault) {
    vault = new Map();
    Object.defineProperty(instance, PropertyVaultName, {
      configurable: false,
      writable: false,
      enumerable: false,
      value: vault,
    });
  }
  return vault;
}
