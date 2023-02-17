import { Identifier } from '../../types';

export type FunctionalTypes =
  | 'once'
  | 'after'
  | 'before'
  | 'debounce'
  | 'throttle'
  | 'defer';

export type OnceDefinition = {
  type: FunctionalTypes;
  propertyName: Identifier;
};

export type AfterDefinition = {
  type: FunctionalTypes;
  propertyName: Identifier;
  n: number;
};

export type BeforeDefinition = {
  type: FunctionalTypes;
  propertyName: Identifier;
  n: number;
};

export type DebounceDefinition = {
  type: FunctionalTypes;
  propertyName: Identifier;
  wait: number;
  leading: boolean;
  trailng: boolean;
};
export type ThrottleDefinition = {
  type: FunctionalTypes;
  propertyName: Identifier;
  wait: number;
  leading: boolean;
  trailng: boolean;
};

export type DeferDefinition = {
  type: FunctionalTypes;
  propertyName: Identifier;
};

export type FunctionalDefinition =
  | OnceDefinition
  | AfterDefinition
  | BeforeDefinition
  | DebounceDefinition
  | ThrottleDefinition
  | DeferDefinition;

export const typeGuards = {
  isOnce(obj: FunctionalDefinition): obj is OnceDefinition {
    return obj.type === 'once';
  },
  isAfter(obj: FunctionalDefinition): obj is AfterDefinition {
    return obj.type === 'after';
  },
  isBefore(obj: FunctionalDefinition): obj is BeforeDefinition {
    return obj.type === 'before';
  },
  isDebounce(obj: FunctionalDefinition): obj is DebounceDefinition {
    return obj.type === 'debounce';
  },
  isThrottle(obj: FunctionalDefinition): obj is ThrottleDefinition {
    return obj.type === 'throttle';
  },
  isDefer(obj: FunctionalDefinition): obj is DeferDefinition {
    return obj.type === 'defer';
  },
};

export type FunctionalOptions<T> = Partial<Omit<T, 'type' | 'propertyName'>>;
