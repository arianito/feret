import { ServiceIdentifier, ServiceMetadata } from '../types';

export class MetadataRegistry {
  private static currentId = 0;
  private static services = new WeakMap<ServiceIdentifier, ServiceMetadata>();

  static set(type: ServiceIdentifier, metadata: ServiceMetadata) {
    const { id, key } = MetadataRegistry.generateServiceKey(metadata);
    MetadataRegistry.services.set(type, {
      ...metadata,
      id,
      getUniqueKey(suffix) {
        if (suffix) return `${key}_${String(suffix)}`;
        return key;
      },
    });
  }

  private static generateServiceKey(metadata: ServiceMetadata) {
    const id = ++MetadataRegistry.currentId;
    return {
      id,
      key: `${metadata.name || String(id)}_${metadata.version}`,
    };
  }

  static get(type: ServiceIdentifier) {
    return MetadataRegistry.services.get(type);
  }
}
