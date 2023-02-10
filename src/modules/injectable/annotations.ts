import { ReflectionNotAvailableError } from '../../errors';
import { ServiceIdentifier } from '../../types';
import { InjectablePlugin } from './plugin';

export function Autowired(): PropertyDecorator {
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
    });
  };
}
