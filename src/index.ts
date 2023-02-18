import { ReflectMetadataUnavailableError } from './errors';

if (!Reflect || !(Reflect as any).getMetadata) {
  throw new ReflectMetadataUnavailableError();
}

import { Container } from './container';
export * from './container';
export * from './modules';
export * from './react-provider';
export * from './types';

export function createContainer() {
  return new Container({
    isTest: false,
  });
}

export function createTestbed() {
  return new Container({
    isTest: true,
  });
}
