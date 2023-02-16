import { PluginConstructor } from '../modules/base-plugin';

export class PluginRegistry {
  private static sPlugins: Array<PluginConstructor> = [];
  static extend(plugin: Array<PluginConstructor>) {
    PluginRegistry.sPlugins.push(...plugin);
  }

  static forEach(callback: (plugin: PluginConstructor, i: number) => void) {
    PluginRegistry.sPlugins.forEach(callback);
  }
}
