import { createContext } from 'react';
import { Container } from './container';

type FeretContextType = {
  container?: Container;
};

export const FeretContext = createContext<FeretContextType>({});
