import { ServiceIdentifier } from '../../types';

export type ModuleDefinition = {
  bootOrder: Array<ServiceIdentifier>;
};

export type ModuleOptions = Partial<ModuleDefinition>;
