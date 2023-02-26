import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FeretContext } from '../../react-context';
import { ServiceIdentifier } from '../../types';
import { Scheduler } from '../../utils';
import { ObservablePlugin } from './plugin';

import {
  LocalStateMutateFunction,
  LocalStateType,
  Message,
  NotifyEvent,
  ObserverOptions,
  UseObserverOutput
} from './types';

export function useObserver<T extends Array<ServiceIdentifier>>(
  opts: ObserverOptions<T>['services'],
): UseObserverOutput<T>;
export function useObserver<T extends Array<ServiceIdentifier>>(
  opts: ObserverOptions<T>,
): UseObserverOutput<T>;
export function useObserver<T extends Array<ServiceIdentifier>>(
  opts: ObserverOptions<T> | ObserverOptions<T>['services'],
): UseObserverOutput<T> {
  let options: ObserverOptions<T>;
  if (Array.isArray(opts)) {
    options = {
      services: opts,
    };
  } else {
    options = opts;
  }
  const { container } = useContext(FeretContext);
  const [_, setLocalState] = useState<LocalStateType>({});
  const attached = useRef(true);

  const scheduler = useRef(
    new Scheduler<Message<LocalStateMutateFunction>>((buff) => {
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
      if (!options.services.includes(type)) return;
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
            schedule: options.schedule,
            cycleMs: options.cycleMs || 25,
          },
        );
      });
    },
    [options],
  );

  useEffect(() => {
    const observablePlugin = container.getPlugin(ObservablePlugin);

    let release: any = undefined;

    if (options.services.length === 1)
      release = observablePlugin.subscribe(options.services[0], onMessage);
    else release = observablePlugin.subscribeAll(onMessage);

    return () => {
      attached.current = false;
      release();
    };
  }, [options]);

  return options.services.map((service) =>
    container.get(service),
  ) as unknown as UseObserverOutput<T>;
}
