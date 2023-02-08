import { ObservablePlugin } from './../plugins/observable-plugin';
import { useContext, useEffect, useState } from 'react';
import { ContainerUnavailableError } from '../errors';
import { ServiceIdentifier } from '../types';
import { ReactBootContext } from '../context/context';
import { MetadataRegistry } from '../registries';

export function useObserver(services: ServiceIdentifier[]) {
  const context = useContext(ReactBootContext);
  const updater = useState<Record<string, any>>({});

  useEffect(() => {
    let isReleased = false;
    const observablePlugin = context.container.getPlugin(ObservablePlugin);
    const release = observablePlugin.bus.listen(
      ({ type, propertyKey, value }) => {
        if (services.includes(type) && !isReleased) {
          const metadata = MetadataRegistry.get(type);
          const key = [metadata?.getUniqueKey(), propertyKey.toString()]
            .filter(Boolean)
            .join('|');

          console.log(key);
          updater[1]((state) => {
            if (typeof state[key] !== 'undefined' && state[key] === value)
              return state;
            return {
              ...state,
              [key]: value,
            };
          });
        }
      },
    );
    return () => {
      isReleased = true;
      release();
    };
  }, []);
}
