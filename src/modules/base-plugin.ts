import { Container } from '../container';
import { ServiceIdentifier } from '../types';

export class BasePlugin {
  constructor(protected container: Container) {}
  onServiceInstantiated(target: ServiceIdentifier, instance: unknown) {}
}

export type PluginConstructor<T = BasePlugin> = new (container: Container) => T;
