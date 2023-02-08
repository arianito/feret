import { useContext } from 'react';
import { ContainerUnavailableError } from '../errors';
import { ServiceIdentifier } from '../types';
import { ReactBootContext } from './../context/context';

export function useService<T>(type: ServiceIdentifier<T>): T {
  const context = useContext(ReactBootContext);
  if (!context.container) throw new ContainerUnavailableError();
  return context.container.get(type);
}
