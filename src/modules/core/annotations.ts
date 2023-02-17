import { MetadataRegistry } from '../../registries';
import { Constructable, ServiceOptions } from '../../types';

export function Service(): ClassDecorator;
export function Service(name: string): ClassDecorator;
export function Service(options: ServiceOptions): ClassDecorator;
export function Service(opts: string | ServiceOptions = {}): ClassDecorator {
  return (target) => {
    let options: ServiceOptions;
    if (typeof opts === 'string') options = { name: opts };
    else options = opts;
    MetadataRegistry.set(target, {
      name: options.name,
      type: target as unknown as Constructable<unknown>,
      scope: options.scope || 'container',
      version: options.version || 1,
      getUniqueKey() {
        return target.name;
      },
    });
  };
}
