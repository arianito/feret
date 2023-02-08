import { PluginConstructor } from '../plugin';

export class PluginRegistry {
  static plugins: PluginConstructor[] = [];
  static extend(...plugin: PluginConstructor[]) {
    PluginRegistry.plugins.push(...plugin);
  }

  static forEach(callback: (plugin: PluginConstructor, i: number) => void) {
    PluginRegistry.plugins.forEach(callback);
  }
}
