import {
  PluginNotRegisteredError,
  ReflectionNotAvailableError,
  ServiceNotAvailableError,
} from './errors';
import { BasePlugin, PluginConstructor } from './modules/base-plugin';
import { ModulePlugin } from './modules/core/plugin';
import { MetadataRegistry, PluginRegistry } from './registries';
import {
  Constructable,
  ContainerConfig,
  DebugOptions,
  ServiceIdentifier,
  ServiceMetadata,
} from './types';

export const primitiveTypes = new Set([
  ['string', 'boolean', 'number', 'object'],
]);

const DEFAULT_DEBUG_IDENTIFIER = 'feret';

export class Container {
  private mInstanceRegistry = new Map<ServiceIdentifier, unknown>();
  private mAliases = new Map<string | ServiceIdentifier, ServiceMetadata>();
  private mPlugins = new WeakMap<PluginConstructor, BasePlugin>();

  constructor(private readonly config: ContainerConfig = { modules: [] }) {
    PluginRegistry.forEach((constructor) => {
      const plugin = new constructor(this);
      this.mPlugins.set(constructor, plugin);
    });
  }

  async bootSequence() {
    const plugin = this.getPlugin(ModulePlugin);
    await plugin.start(this.config.modules);
  }

  enableDebug();
  enableDebug(enabled: boolean);
  enableDebug(options: DebugOptions);
  enableDebug(opts: boolean | DebugOptions = { debug: true }) {
    if (typeof global === 'undefined') return;
    let options: DebugOptions;
    if (typeof opts === 'boolean') options = { debug: opts };
    else options = opts;

    const enabled = options.debug;
    const identifier = options.identifier || DEFAULT_DEBUG_IDENTIFIER;
    if (!enabled) {
      delete global[identifier];
      return;
    }
    Object.defineProperty(global, identifier, {
      configurable: false,
      enumerable: false,
      get: () => {
        const obj = {};
        this.mInstanceRegistry.forEach((instance, service) => {
          const key = MetadataRegistry.get(service).getUniqueKey();
          obj[key] = instance;
        });
        return obj;
      },
    });
  }

  test(alias: ServiceIdentifier, insteadOf: ServiceIdentifier) {
    const metadata = MetadataRegistry.get(insteadOf);
    if (!metadata) throw new ServiceNotAvailableError(insteadOf);
    const serviceMetadata: ServiceMetadata = {
      ...metadata,
      type: alias as unknown as Constructable<unknown>,
    };
    if (metadata.name) this.mAliases.set(metadata.name, serviceMetadata);
    this.mAliases.set(insteadOf, serviceMetadata);
  }

  private findClass<T = unknown>(
    type: string | ServiceIdentifier<T>,
  ): ServiceMetadata<T> {
    let metadata = MetadataRegistry.get(type);
    if (this.config.isTest) {
      const aliasMetadata = this.mAliases.get(type);
      if (aliasMetadata) metadata = aliasMetadata;
    }
    if (!metadata) throw new ServiceNotAvailableError(type);
    return metadata as unknown as ServiceMetadata<T>;
  }

  get<T = unknown>(name: string): T;
  get<T = unknown>(type: ServiceIdentifier<T>): T;
  get<T = unknown>(type: string | ServiceIdentifier<T>): T;
  get<T = unknown>(type: string | ServiceIdentifier<T>): T {
    const metadata = this.findClass(type);

    if (metadata.scope === 'transient')
      return this.getService(metadata) as unknown as T;

    let singleton = this.mInstanceRegistry.get(metadata.type);
    if (!singleton) {
      singleton = this.getService(metadata);
      this.mInstanceRegistry.set(metadata.type, singleton);
    }
    return singleton as T;
  }

  private getService(metadata: ServiceMetadata) {
    const constructableTargetType = metadata.type;
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
      const plugin = this.mPlugins.get(constructor);
      if (!plugin) throw new PluginNotRegisteredError();
      plugin.onServiceInstantiated?.(constructableTargetType, instance);
    });

    return instance;
  }

  getPlugin<T extends BasePlugin>(type: PluginConstructor<T>): T {
    const plugin = this.mPlugins.get(type) as unknown as T;
    if (!plugin) throw new PluginNotRegisteredError();
    return plugin;
  }

  forEach(
    callback: (instance: unknown, constructableType: ServiceIdentifier) => void,
  ) {
    this.mInstanceRegistry.forEach(callback);
  }
}

MetadataRegistry.register(Container);
