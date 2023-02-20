import { MetadataRegistry } from '../../registries';
import { Constructable, ServiceOptions } from '../../types';
import { ModulePlugin } from './plugin';
import { ModuleDefinition, ModuleOptions } from './types';

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

export function Module(): ClassDecorator;
export function Module(
  bootOrder: ModuleDefinition['bootOrder'],
): ClassDecorator;
export function Module(options: ModuleOptions): ClassDecorator;
export function Module(
  opts: ModuleDefinition['bootOrder'] | ModuleOptions = {},
): ClassDecorator {
  let options: ModuleOptions;
  if (Array.isArray(opts)) options = { bootOrder: opts };
  else options = opts;
  return (target) => {
    ModulePlugin.extend(target, {
      discovery: options.discovery || [],
      bootOrder: options.bootOrder || [],
    });
    Service()(target);
  };
}
