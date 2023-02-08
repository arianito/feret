import { type } from 'os';
import { Container } from './container';

export type Constructable<T> = new (...args: any[]) => T;
export type AbstractConstructable<T> = NewableFunction & { prototype: T };
export type ServiceIdentifier<T = unknown> =
  | Constructable<T>
  | AbstractConstructable<T>;

export type Identifier = string | symbol;

export type ServiceScope = 'container' | 'transient';

export type ServiceMetadata<T = unknown> = {
  id?: number;
  name?: string;
  version?: number;
  getUniqueKey: () => string;
  type: Constructable<T>;
  scope: ServiceScope;
};

export type ServiceOptions = Partial<Omit<ServiceMetadata, 'type' | 'id' | 'getUniqueKey'>>;

export type PropertyDefinition = {
  propertyName: Identifier;
  type: ServiceIdentifier;
};

export type ContainerConfig = {
  enableAliasing?: boolean;
};

export type MessageType = {
  type: ServiceIdentifier;
  propertyKey: Identifier;
  value: any;
};
