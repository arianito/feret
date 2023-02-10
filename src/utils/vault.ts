import { Identifier } from '../types';

export type PropertyVault = Map<Identifier, any>;

export class Vault {
  private static propertyVaultName = Symbol('__vault__');
  static getVault(instance: unknown): PropertyVault {
    let vault: PropertyVault = instance[Vault.propertyVaultName];
    if (!vault) {
      vault = new Map();
      Object.defineProperty(instance, Vault.propertyVaultName, {
        configurable: false,
        writable: false,
        enumerable: false,
        value: vault,
      });
    }
    return vault;
  }
}
