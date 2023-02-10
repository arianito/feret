import { ServiceIdentifier } from '../types';

export class ContainerUnavailableError extends Error {
  get message() {
    return 'No active container not available.';
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
