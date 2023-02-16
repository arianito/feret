import {
  ArrayOneOrMore,
  Identifier,
  ServiceIdentifier,
  ServiceMetadata
} from '../../types';
import { ScheduleOptions } from '../../utils';

export type ObservableDefinition = {
  propertyName: Identifier;
  proxied: boolean;
} & ScheduleOptions;

export type ObservableOptions = Partial<
  Omit<ObservableDefinition, 'propertyName'>
>;

export type Message<T = unknown> = {
  object: T;
  propertyName?: string | symbol;
  force: boolean;
};

export type NotifyEvent = {
  type: ServiceIdentifier;
  metadata: ServiceMetadata;
  bulk: Array<Message>;
};

export type ObserverOptions = {
  services: ArrayOneOrMore<ServiceIdentifier>;
} & ScheduleOptions;

export type LocalStateType = Record<string, any>;

export type LocalStateMutateFunction = (state: LocalStateType) => boolean;
