import { Identifier, ServiceIdentifier, ServiceMetadata } from '../../types';

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

export type ScheduleOptions = {
  mode?: 'debounced' | 'throttled';
  delay?: number;
};

export type ObserverOptions = {} & ScheduleOptions;

export type LocalStateType = Record<string, any>;

export type LocalStateMutateFunction = (state: LocalStateType) => boolean;
