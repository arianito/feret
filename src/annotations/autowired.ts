import { ReflectionNotAvailableError } from '../errors';
import { InjectableRegistry } from '../registries/injectable-registry';
import { ServiceIdentifier } from '../types';

export function Autowired(): PropertyDecorator {
  return (target, propertyKey) => {
    const type: ServiceIdentifier = (Reflect as any).getMetadata(
      'design:type',
      target,
      propertyKey,
    );
    if (!type) throw new ReflectionNotAvailableError();
    InjectableRegistry.extend(target.constructor, {
      propertyName: propertyKey,
      type,
    });
  };
}
