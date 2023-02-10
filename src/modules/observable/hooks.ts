import { useCallback, useContext, useEffect, useState } from 'react';
import { ReactBootContext } from '../../react-context';
import { ArrayOneOrMore, ServiceIdentifier } from '../../types';
import { ObservablePlugin } from './plugin';
import { MessageType } from './types';

export function useObserver(services: ArrayOneOrMore<ServiceIdentifier>) {
  const { container } = useContext(ReactBootContext);
  const [_, setLocalState] = useState<Record<string, any>>({});

  const onMessage = useCallback((e: CustomEvent<MessageType>) => {
    const { type, metadata, propertyKey, value } = e.detail;

    if (!services.includes(type)) return;

    const uniquePropertyPath = metadata.getUniqueKey(propertyKey);

    setLocalState((localState) => {
      const isValueUndefined =
        typeof localState[uniquePropertyPath] === 'undefined';
      const isValueDiffers = localState[uniquePropertyPath] !== value;

      if (!isValueUndefined && !isValueDiffers) return localState;

      return Object.assign({}, localState, {
        [uniquePropertyPath]: value,
      });
    });
  }, []);

  useEffect(() => {
    const observablePlugin = container.getPlugin(ObservablePlugin);

    if (services.length == 1)
      return observablePlugin.subscribe(services[0], onMessage);

    return observablePlugin.subscribeAll(onMessage);
  }, []);
}
