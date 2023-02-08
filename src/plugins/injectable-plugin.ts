import { Container } from '../container';
import { Plugin } from '../plugin';
import { InjectableRegistry } from '../registries';
import { ServiceIdentifier } from './../types';

export class InjectablePlugin extends Plugin {
  constructor(protected container: Container) {
    super(container);
  }
  onContainerCreated(): void {}
  onServiceInstantiated = (
    target: ServiceIdentifier<unknown>,
    instance: unknown,
  ) => {
    const properties = InjectableRegistry.get(target);
    if (!properties) return;
    Object.defineProperties(
      instance,
      properties.reduce<PropertyDescriptorMap>((acc, h) => {
        acc[h.propertyName] = {
          configurable: false,
          enumerable: true,
          value: this.container.get(h.type),
        };
        return acc;
      }, {}),
    );
  };
}
