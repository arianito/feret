import { ServiceIdentifier } from './types';

export class ReflectionNotAvailableError extends Error {
  get message() {
    return 'Reflection is not available';
  }
}

export class ServiceNotAvailableError extends Error {
  constructor(private type: ServiceIdentifier<unknown>) {
    super();
  }
  get message() {
    return `Service of type "${this.type.name}" is not available.`;
  }
}

export class ReflectMetadataUnavailableError extends Error {
  get message() {
    return 'Please install reflect-metadata and import it at root of the project.';
  }
}

export class ContainerUnavailableError extends Error {
  get message() {
    return 'No active container not available.';
  }
}

export class PluginNotRegisteredError extends Error {
  get message() {
    return 'Plugin not registered.';
  }
}


