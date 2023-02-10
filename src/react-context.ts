import { createContext } from 'react';
import { Container } from './container';

type ReactBootContextType = {
  container?: Container;
};

export const ReactBootContext = createContext<ReactBootContextType>({});
