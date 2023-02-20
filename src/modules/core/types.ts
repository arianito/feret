import { ServiceIdentifier } from '../../types';

export type ModuleDefinition = {
  discovery: Array<ServiceIdentifier>;
  bootOrder: Array<ServiceIdentifier>;
};

export type ModuleOptions = Partial<ModuleDefinition>;
