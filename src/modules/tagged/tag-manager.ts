import { Container } from '../../container';
import { MetadataRegistry } from '../../registries';
import { ArrayOneOrMore } from '../../types';
import { TagPlugin } from './plugin';
import { ContainerSnapshot, ServiceSnapshot } from './types';

export class TagManager {
  constructor(private readonly container: Container) {}

  getSnapshot(catchTheseTags: ArrayOneOrMore<string>) {
    const snapshot: ContainerSnapshot = {};
    TagPlugin.forEach((properties, constructableType) => {
      const serviceMetadata = MetadataRegistry.get(constructableType);
      if (serviceMetadata.scope !== 'container') return;
      const uniqueServiceIdentifier = serviceMetadata.getUniqueKey();
      const serviceInstance = this.container.get(constructableType);
      const persistedProperties = properties.reduce<ServiceSnapshot>(
        (acc, { propertyName, tags }) => {
          const setOfTags = new Set(catchTheseTags);
          const doesContainPredefinedTags = tags.some((tag) =>
            setOfTags.has(tag),
          );
          if (!doesContainPredefinedTags) return acc;
          acc[String(propertyName)] = serviceInstance[propertyName];
          return acc;
        },
        {},
      );
      snapshot[uniqueServiceIdentifier] = persistedProperties;
    });
    return snapshot;
  }

  restoreSnapshot(data: ContainerSnapshot) {
    TagPlugin.forEach((_, constructableType) => {
      const serviceMetadata = MetadataRegistry.get(constructableType);
      if (serviceMetadata.scope !== 'container') return;
      const uniqueServiceIdentifier = serviceMetadata.getUniqueKey();
      const serviceInstance = this.container.get(constructableType);
      const persistedProperties = data[uniqueServiceIdentifier];
      if (!persistedProperties) return;
      Object.entries(persistedProperties).forEach(([propertyName, value]) => {
        serviceInstance[propertyName] = value;
      });
    });
  }
}

MetadataRegistry.register(TagManager);
