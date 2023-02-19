import { EnvPlugin } from './plugin';

export function Env(): PropertyDecorator;
export function Env(defaultValue: string): PropertyDecorator;
export function Env(
  defaultValue: string | undefined = undefined,
): PropertyDecorator {
  return (target, propertyName) => {
    EnvPlugin.extend(target.constructor, {
      propertyName,
      defaultValue,
    });
  };
}
