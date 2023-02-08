import { PropertyDefinition, ServiceIdentifier } from '../types';

export class ObservableRegistry {
  private static observables = new Map<
    ServiceIdentifier,
    PropertyDefinition[]
  >();
  static extend(target: ServiceIdentifier, property: PropertyDefinition) {
    let list = ObservableRegistry.observables.get(target);
    if (!list) {
      list = [];
      ObservableRegistry.observables.set(target, list);
    }
    list.push(property);
  }
  static get(target: ServiceIdentifier) {
    return ObservableRegistry.observables.get(target);
  }
}
