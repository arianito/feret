import { useContext } from 'react';
import { Container } from '../../container';
import { ContainerUnavailableError } from '../../errors/container-errors';
import { FeretContext } from '../../react-context';
import { ServiceIdentifier } from '../../types';

export function useService<T>(type: ServiceIdentifier<T>): T {
  const context = useContext(FeretContext);
  if (!context.container) throw new ContainerUnavailableError();
  return context.container.get(type);
}

export function useContainer(): Container {
  const context = useContext(FeretContext);
  if (!context.container) throw new ContainerUnavailableError();
  return context.container;
}
