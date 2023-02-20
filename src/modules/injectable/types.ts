import { Identifier, ServiceIdentifier } from '../../types';

export type InjectedDefinition = {
  propertyName: Identifier;
  type: ServiceIdentifier;
  name: string;
};

export type InjectedOptions = Partial<
  Omit<InjectedDefinition, 'propertyName' | 'type'>
>;
