import { Identifier } from '../../types';

export type VariableDefinition = {
  propertyName: Identifier;
  defaultValue: unknown;
};
