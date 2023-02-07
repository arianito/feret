if (!Reflect || !(Reflect as any).getMetadata) {
  throw new Error(
    'Please install reflect-metadata and import it at root of the project.',
  );
}

export class ReflectionNotAvailable extends Error {
  get message() {
    return 'Reflection is not available';
  }
}

export class ServiceNotAvailable extends Error {
  constructor(private type: ServiceIdentifier<unknown>) {
    super();
  }
  get message() {
    return `Service of type "${this.type.name}" is not available.`;
  }
}

type Constructable<T> = new (...args: any[]) => T;
type AbstractConstructable<T> = NewableFunction & { prototype: T };
type ServiceIdentifier<T = unknown> =
  | Constructable<T>
  | AbstractConstructable<T>;

type Identifier = string | symbol;

export type ServiceScope = 'container' | 'transient';

type ServiceMetadata<T = unknown> = {
  name?: string;
  type: Constructable<T>;
  scope: ServiceScope;
};

export type ServiceOptions = Partial<Omit<ServiceMetadata, 'type'>>;

type Handler = {
  propertyName: Identifier;
  type: ServiceIdentifier;
};

const globalRegistry = new Map<ServiceIdentifier, ServiceMetadata>();
const globalHandlers = new Map<ServiceIdentifier, Handler[]>();

export function Service<T>(options: ServiceOptions = {}): ClassDecorator {
  return (target) => {
    globalRegistry.set(target, {
      name: options.name,
      type: target as unknown as Constructable<T>,
      scope: options.scope || 'container',
    });
  };
}

export function Autowired(): PropertyDecorator {
  return (target, propertyKey) => {
    const type: ServiceIdentifier = (Reflect as any).getMetadata(
      'design:type',
      target,
      propertyKey,
    );
    if (!type) throw new ReflectionNotAvailable();
    let list = globalHandlers.get(target.constructor);
    if (!list) {
      list = [];
      globalHandlers.set(target.constructor, list);
    }
    list.push({
      propertyName: propertyKey,
      type: type,
    });
  };
}

export type ContainerConfig = {
  enableAliasing?: boolean;
};

const primitiveTypes = new Set([['string', 'boolean', 'number', 'object']]);

export class Container {
  private instanceRegistry = new Map<ServiceIdentifier, any>();
  private aliases = new Map<ServiceIdentifier, ServiceMetadata>();

  constructor(private config: ContainerConfig = {}) {}

  alias(alias: ServiceIdentifier, insteadOf: ServiceIdentifier) {
    const metadata = globalRegistry.get(insteadOf);
    if (!metadata) throw new Error('Service not found.');
    const serviceMetadata: ServiceMetadata = {
      ...metadata,
      type: alias as unknown as Constructable<unknown>,
    };
    this.aliases.set(insteadOf, serviceMetadata);
  }

  get length() {
    return this.instanceRegistry.size;
  }

  private findClass<T = unknown>(
    type: ServiceIdentifier<T>,
  ): ServiceMetadata<T> {
    let metadata = globalRegistry.get(type);
    if (this.config.enableAliasing) {
      const aliasMetadata = this.aliases.get(type);
      if (aliasMetadata) metadata = aliasMetadata;
    }
    if (!metadata) throw new ServiceNotAvailable(type);
    return metadata as unknown as ServiceMetadata<T>;
  }

  get<T = unknown>(type: ServiceIdentifier<T>): T {
    const metadata = this.findClass(type);

    if (metadata.scope == 'container') {
      let singleton = this.instanceRegistry.get(metadata.type);
      if (!singleton) {
        singleton = this.getService(metadata);
        this.instanceRegistry.set(metadata.type, singleton);
      }
      return singleton;
    }
    return this.getService(metadata) as unknown as T;
  }

  private getService(metadata: ServiceMetadata) {
    const constructableTargetType: Constructable<Object> = metadata.type;
    const paramTypes =
      (Reflect as any).getMetadata(
        'design:paramtypes',
        constructableTargetType,
      ) || [];
    if (!paramTypes) throw new ReflectionNotAvailable();
    const params = paramTypes.map((type) => {
      if (type && type.name && !primitiveTypes.has(type.name.toLowerCase()))
        return this.get(type);
      return undefined;
    });
    const instance = new constructableTargetType(...params);
    const props = globalHandlers.get(constructableTargetType);
    if (props) {
      Object.defineProperties(
        instance,
        props.reduce((acc, h) => {
          acc[h.propertyName] = {
            configurable: false,
            enumerable: false,
            value: this.get(h.type),
          };
          return acc;
        }, {}),
      );
    }
    return instance;
  }
}

export function createContainer() {
  return new Container({});
}

export function createTestbed() {
  return new Container({
    enableAliasing: true,
  });
}
