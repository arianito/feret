import { MetadataRegistry } from '../../registries';
import { Constructable, ServiceOptions } from '../../types';

export function Service<T>(options: ServiceOptions = {}): ClassDecorator {
  return (target) => {
    MetadataRegistry.set(target, {
      name: options.name,
      type: target as unknown as Constructable<T>,
      scope: options.scope || 'container',
      version: options.version || 1,
      getUniqueKey() {
        return target.name;
      },
    });
  };
}
