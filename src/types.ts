export type Constructable<T> = new (...args: Array<any>) => T;
export type AbstractConstructable<T> = NewableFunction & { prototype: T };
export type ServiceIdentifier<T = unknown> =
  | Constructable<T>
  | AbstractConstructable<T>;

export type Identifier = string | symbol;

export type ServiceScope = 'container' | 'transient';

export type ServiceOptions = Partial<
  Omit<ServiceMetadata, 'type' | 'id' | 'getUniqueKey'>
>;

export type ServiceMetadata<T = unknown> = {
  id?: number;
  name?: string;
  version?: number;
  type: Constructable<T>;
  scope: ServiceScope;
  getUniqueKey: (suffix?: Identifier) => string;
};

export type ContainerConfig = {
  isTest?: boolean;
};

export type ArrayOneOrMore<T> = { 0: T } & Array<T>;
