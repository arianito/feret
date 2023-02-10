import { Identifier } from '../../types';

export type TimerDefinition = {
  propertyName: Identifier;
  interval: number;
};
export type TimerOptions = Partial<Omit<TimerDefinition, 'propertyName'>>;
