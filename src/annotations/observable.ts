import { ReflectionNotAvailableError } from '../errors';
import { ObservableRegistry } from '../registries';

export function Observable(): PropertyDecorator {
  return (target, propertyKey) => {
    const type = (Reflect as any).getMetadata(
      'design:type',
      target,
      propertyKey,
    );
    if (!type) throw new ReflectionNotAvailableError();
    ObservableRegistry.extend(target.constructor, {
      type,
      propertyName: propertyKey,
    });
  };
}
