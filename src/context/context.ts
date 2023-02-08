import { createContext } from 'react';
import { Container } from '../container';

type IReactBootContext = {
  container?: Container;
};

export const ReactBootContext = createContext<IReactBootContext>({});
