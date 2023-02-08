import { ServiceIdentifier, ServiceMetadata } from '../types';

export class MetadataRegistry {
  private static index = 0;
  private static services = new Map<ServiceIdentifier, ServiceMetadata>();

  static set(type: ServiceIdentifier, metadata: ServiceMetadata) {
    const newId = MetadataRegistry.index++;
    const key = [metadata.name || String(newId), metadata.version].join('.');
    MetadataRegistry.services.set(type, {
      ...metadata,
      id: newId,
      getUniqueKey() {
        return key;
      },
    });
  }
  static get(type: ServiceIdentifier) {
    return MetadataRegistry.services.get(type);
  }
}
