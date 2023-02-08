import { PluginRegistry } from './../registries/plugin-registry';
import { InjectablePlugin } from './injectable-plugin';
import { ObservablePlugin } from './observable-plugin';

PluginRegistry.extend(InjectablePlugin, ObservablePlugin);
