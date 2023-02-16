import { PluginRegistry } from '../../registries';
import { ServiceIdentifier } from '../../types';
import { BasePlugin } from '../base-plugin';
import { TagDefinition } from './types';

export class TagPlugin extends BasePlugin {
  private static sTags = new Map<ServiceIdentifier, Array<TagDefinition>>();

  static extend(target: ServiceIdentifier, property: TagDefinition) {
    let service = TagPlugin.sTags.get(target);
    if (!service) {
      service = [];
      TagPlugin.sTags.set(target, service);
    }
    service.push(property);
  }

  static get(target: ServiceIdentifier) {
    return TagPlugin.sTags.get(target);
  }

  static forEach(
    callback: (value: Array<TagDefinition>, key: ServiceIdentifier) => void,
  ) {
    TagPlugin.sTags.forEach(callback);
  }
}

PluginRegistry.extend([TagPlugin]);
