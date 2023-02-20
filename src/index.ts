import { ReflectMetadataUnavailableError } from './errors';

if (!Reflect || !(Reflect as any).getMetadata) {
  throw new ReflectMetadataUnavailableError();
}

export * from './container';
export * from './modules';
export * from './react-provider';
export * from './types';

import { Container } from './container';
import { ModuleIdentifier } from './types';

export function createContainer(): Container;
export function createContainer(modules: Array<ModuleIdentifier>): Container;
export function createContainer(
  modules: Array<ModuleIdentifier> = [],
): Container {
  return new Container({
    isTest: false,
    modules: modules || [],
  });
}

export function createTestbed(): Container;
export function createTestbed(modules: Array<ModuleIdentifier>): Container;
export function createTestbed(
  modules: Array<ModuleIdentifier> = [],
): Container {
  return new Container({
    isTest: true,
    modules: modules || [],
  });
}
