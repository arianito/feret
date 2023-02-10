import { PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { BasePlugin } from '../base-plugin';
import { TagDefinition } from './types';

export class TagPlugin extends BasePlugin {
  private static persisted = new Map<ServiceIdentifier, TagDefinition[]>();

  private static getService(target: ServiceIdentifier) {
    let list = TagPlugin.persisted.get(target);
    if (!list) {
      list = [];
      TagPlugin.persisted.set(target, list);
    }
    return list;
  }

  static extend(target: ServiceIdentifier, property: TagDefinition) {
    const service = TagPlugin.getService(target);
    service.push(property);
  }

  static get(target: ServiceIdentifier) {
    return TagPlugin.persisted.get(target);
  }

  static forEach(
    callback: (value: TagDefinition[], key: ServiceIdentifier) => void,
  ) {
    TagPlugin.persisted.forEach(callback);
  }
}

PluginRegistry.extend([TagPlugin]);
