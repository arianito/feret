import { ArrayOneOrMore, Identifier } from '../../types';

export type TagDefinition = {
  propertyName: Identifier;
  tags: ArrayOneOrMore<string>;
};
export type TagArguments = TagDefinition['tags'];

export type ServiceSnapshot = Record<string, any>;
export type ContainerSnapshot = Record<string, ServiceSnapshot>;
