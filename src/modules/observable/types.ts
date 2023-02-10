import { Identifier, ServiceIdentifier, ServiceMetadata } from '../../types';

export type ObservableDefinition = Identifier;

export type MessageType = {
  type: ServiceIdentifier;
  metadata: ServiceMetadata;
  propertyKey: Identifier;
  value: any;
};
