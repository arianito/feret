import {
  PluginNotRegisteredError,
  ReflectionNotAvailableError,
  ServiceNotAvailableError,
} from './errors';
import { BasePlugin, PluginConstructor } from './modules/base-plugin';
import { MetadataRegistry, PluginRegistry } from './registries';
import {
  Constructable,
  ContainerConfig,
  ServiceIdentifier,
  ServiceMetadata,
} from './types';

export const primitiveTypes = new Set([
  ['string', 'boolean', 'number', 'object'],
]);

export class Container {
  private instanceRegistry = new Map<ServiceIdentifier, unknown>();
  private aliases = new WeakMap<ServiceIdentifier, ServiceMetadata>();
  private plugins = new WeakMap<PluginConstructor, BasePlugin>();

  constructor(private config: ContainerConfig = {}) {
    PluginRegistry.forEach((constructor) => {
      const plugin = new constructor(this);
      this.plugins.set(constructor, plugin);
    });
  }

  alias(alias: ServiceIdentifier, insteadOf: ServiceIdentifier) {
    const metadata = MetadataRegistry.get(insteadOf);
    if (!metadata) throw new ServiceNotAvailableError(insteadOf);
    const serviceMetadata: ServiceMetadata = {
      ...metadata,
      type: alias as unknown as Constructable<unknown>,
    };
    this.aliases.set(insteadOf, serviceMetadata);
  }

  private findClass<T = unknown>(
    type: ServiceIdentifier<T>,
  ): ServiceMetadata<T> {
    let metadata = MetadataRegistry.get(type);
    if (this.config.isTest) {
      const aliasMetadata = this.aliases.get(type);
      if (aliasMetadata) metadata = aliasMetadata;
    }
    if (!metadata) throw new ServiceNotAvailableError(type);
    return metadata as unknown as ServiceMetadata<T>;
  }

  get<T = unknown>(type: ServiceIdentifier<T>): T {
    const metadata = this.findClass(type);

    if (metadata.scope === 'transient')
      return this.getService(metadata) as unknown as T;

    let singleton = this.instanceRegistry.get(metadata.type);
    if (!singleton) {
      singleton = this.getService(metadata);
      this.instanceRegistry.set(metadata.type, singleton);
    }
    return singleton as T;
  }

  private getService(metadata: ServiceMetadata) {
    const constructableTargetType: Constructable<unknown> = metadata.type;
    const paramTypes =
      (Reflect as any).getMetadata(
        'design:paramtypes',
        constructableTargetType,
      ) || [];

    if (!paramTypes) throw new ReflectionNotAvailableError();

    const params = paramTypes.map((type: ServiceIdentifier<unknown>) => {
      if (type && type.name && !primitiveTypes.has([type.name.toLowerCase()]))
        return this.get(type);
      return undefined;
    });

    const instance = new constructableTargetType(...params);
    Object.defineProperty(instance, 'container', {
      configurable: false,
      enumerable: false,
      get: () => this,
    });
    PluginRegistry.forEach((constructor) => {
      const plugin = this.plugins.get(constructor);
      if (!plugin) throw new PluginNotRegisteredError();
      plugin.onServiceInstantiated?.(constructableTargetType, instance);
    });

    return instance;
  }

  getPlugin<T extends BasePlugin>(type: PluginConstructor<T>): T {
    const plugin = this.plugins.get(type) as unknown as T;
    if (!plugin) throw new PluginNotRegisteredError();
    return plugin;
  }

  forEach(
    callback: (instance: unknown, constructableType: ServiceIdentifier) => void,
  ) {
    this.instanceRegistry.forEach(callback);
  }
}
