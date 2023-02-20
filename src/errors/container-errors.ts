import { ServiceIdentifier } from '../types';

export class ContainerUnavailableError extends Error {
  get message() {
    return 'No active container not available.';
  }
}

export class ServiceNotAvailableError extends Error {
  constructor(private mType: string | ServiceIdentifier<unknown>) {
    super();
  }
  get message() {
    return `Service of type "${
      typeof this.mType === 'string' ? this.mType : this.mType.name
    }" is not available.`;
  }
}
