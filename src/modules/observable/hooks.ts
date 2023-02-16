import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ReactBootContext } from '../../react-context';
import { ArrayOneOrMore, ServiceIdentifier } from '../../types';
import { ObservablePlugin } from './plugin';
import { Scheduler } from './scheduler';

import {
  LocalStateMutateFunction,
  LocalStateType,
  NotifyEvent,
  ObserverOptions,
} from './types';

export function useObserver(
  services: ArrayOneOrMore<ServiceIdentifier>,
  options: ObserverOptions = {},
) {
  const { container } = useContext(ReactBootContext);
  const [_, setLocalState] = useState<LocalStateType>({});
  const attached = useRef(true);

  const scheduler = useRef(
    new Scheduler<LocalStateMutateFunction>((buff) => {
      if (!attached) return;
      if (buff.length > 0) {
        setLocalState((localState) => {
          let shouldUpdate = false;

          const updatedState = buff.reduce((acc, { object: value }) => {
            const isUpdated = value(acc);
            if (isUpdated) shouldUpdate = true;
            return acc;
          }, localState);

          if (!shouldUpdate) return localState;

          return Object.assign({}, updatedState);
        });
      }
    }),
  );

  const onMessage = useCallback(
    (e: CustomEvent<NotifyEvent>) => {
      const { type, metadata, bulk } = e.detail;
      if (!services.includes(type)) return;
      bulk.forEach(({ force, propertyName, object }) => {
        const uniquePropertyPath = metadata.getUniqueKey(propertyName);
        scheduler.current.push(
          {
            object: (localState: any) => {
              const isValueUndefined =
                typeof localState[uniquePropertyPath] === 'undefined';
              const isValueDiffers = localState[uniquePropertyPath] !== object;
              if (!isValueUndefined && !isValueDiffers && !force) return false;
              localState[uniquePropertyPath] = object;
              return true;
            },
            force,
          },
          {
            mode: options.mode,
            delay: options.delay || 25,
          },
        );
      });
    },
    [services, options],
  );

  useEffect(() => {
    const observablePlugin = container.getPlugin(ObservablePlugin);

    let release: any = undefined;

    if (services.length === 1)
      release = observablePlugin.subscribe(services[0], onMessage);
    else release = observablePlugin.subscribeAll(onMessage);

    return () => {
      attached.current = false;
      release();
    };
  }, [services]);
}
