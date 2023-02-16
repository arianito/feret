import { Constructable, ServiceIdentifier, ServiceMetadata } from '../types';

export class MetadataRegistry {
  private static sCurrentId = 0;
  private static sServices = new WeakMap<ServiceIdentifier, ServiceMetadata>();

  static set(type: ServiceIdentifier, metadata: ServiceMetadata) {
    const { id, key } = MetadataRegistry.generateServiceKey(metadata);
    MetadataRegistry.sServices.set(type, {
      ...metadata,
      id,
      getUniqueKey(suffix) {
        if (suffix) return `${key}_${String(suffix)}`;
        return key;
      },
    });
  }

  static register(type: ServiceIdentifier) {
    MetadataRegistry.set(type, {
      type: type as unknown as Constructable<unknown>,
      scope: 'container',
      version: 1,
      getUniqueKey() {
        return type.name;
      },
    });
  }

  private static generateServiceKey(metadata: ServiceMetadata) {
    const id = ++MetadataRegistry.sCurrentId;
    return {
      id,
      key: `${metadata.name || String(id)}_${metadata.version}`,
    };
  }

  static get(type: ServiceIdentifier) {
    return MetadataRegistry.sServices.get(type);
  }
}
