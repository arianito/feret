import { ReflectionNotAvailableError } from '../../errors';
import { ServiceIdentifier } from '../../types';
import { InjectablePlugin } from './plugin';
import { InjectedOptions } from './types';

export function Injected(): PropertyDecorator;
export function Injected(name: string): PropertyDecorator;
export function Injected(options: InjectedOptions): PropertyDecorator;
export function Injected(
  opts: string | InjectedOptions = {},
): PropertyDecorator {
  let options: InjectedOptions;
  if (typeof opts === 'string') options = { name: opts };
  else options = opts;
  return (target, propertyName) => {
    const type: ServiceIdentifier = (Reflect as any).getMetadata(
      'design:type',
      target,
      propertyName,
    );
    if (!type) throw new ReflectionNotAvailableError();
    InjectablePlugin.extend(target.constructor, {
      type,
      propertyName,
      name: options.name,
    });
  };
}
