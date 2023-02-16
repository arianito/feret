import { Container } from '../container';
import { ServiceIdentifier } from '../types';

export class BasePlugin {
  constructor(protected mContainer: Container) {}
  onServiceInstantiated(target: ServiceIdentifier, instance: unknown) {}
}

export type PluginConstructor<T = BasePlugin> = new (mContainer: Container) => T;
