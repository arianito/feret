import { PluginRegistry } from '../../registries';
import { ModuleIdentifier } from '../../types';
import { BasePlugin } from '../base-plugin';
import { Bootable } from './interfaces';
import { ModuleDefinition } from './types';

export class ModulePlugin extends BasePlugin {
  private static sModules = new WeakMap<ModuleIdentifier, ModuleDefinition>();

  async start(modules: Array<ModuleIdentifier>) {
    for (const module of modules) {
      const { bootOrder } = ModulePlugin.get(module);
      for (const service of bootOrder) {
        const instance = this.mContainer.get<Bootable>(service);
        if (instance.onBoot) await instance.onBoot.call(instance);
      }
    }
  }

  static extend(target: ModuleIdentifier, definition: ModuleDefinition) {
    ModulePlugin.sModules.set(target, definition);
  }

  static get(target: ModuleIdentifier) {
    return ModulePlugin.sModules.get(target);
  }
}

PluginRegistry.extend([ModulePlugin]);
