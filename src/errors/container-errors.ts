import { ServiceIdentifier } from '../types';

export class ContainerUnavailableError extends Error {
  get message() {
    return 'No active container not available.';
  }
}

export class ServiceNotAvailableError extends Error {
  constructor(private mType: ServiceIdentifier<unknown>) {
    super();
  }
  get message() {
    return `Service of type "${this.mType.name}" is not available.`;
  }
}
