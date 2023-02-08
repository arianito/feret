import { ReflectMetadataUnavailableError } from './errors';

if (!Reflect || !(Reflect as any).getMetadata) {
  throw new ReflectMetadataUnavailableError();
}


import './plugins'

export * from './annotations';
export * from './container';
export * from './context';
