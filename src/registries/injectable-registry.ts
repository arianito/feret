import { PropertyDefinition, ServiceIdentifier } from '../types';

export class InjectableRegistry {
  private static injectables = new Map<
    ServiceIdentifier,
    PropertyDefinition[]
  >();
  static extend(target: ServiceIdentifier, property: PropertyDefinition) {
    let list = InjectableRegistry.injectables.get(target);
    if (!list) {
      list = [];
      InjectableRegistry.injectables.set(target, list);
    }
    list.push(property);
  }
  static get(target: ServiceIdentifier) {
    return InjectableRegistry.injectables.get(target);
  }
}
