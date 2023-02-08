import { Container } from './container';
import { ServiceIdentifier } from './types';

export class Plugin {
  constructor(protected container: Container) {}
  onServiceInstantiated(target: ServiceIdentifier, instance: unknown) {}
}

export type PluginConstructor<T = Plugin> = new (container: Container) => T;
