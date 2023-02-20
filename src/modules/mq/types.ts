import { Identifier } from '../../types';
import { ScheduleOptions } from '../../utils';

export type ListenerDefinition = {
  propertyName: Identifier;
  eventName: string;
} & ScheduleOptions;

export type ListenerOptions = Omit<ListenerDefinition, 'propertyName'>;

export type NotifyEvent<T> = {
  type: string;
  message: T;
};
