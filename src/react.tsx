import React, { createContext, FC } from 'react';
import { Container } from './di';

type IReactBootContext = {
  container?: Container;
};

export const Context = createContext<IReactBootContext>({});

export const ReactBootProvider: FC<{ container: Container }> = ({
  container,
}) => {
  return <Context.Provider value={{ container }}></Context.Provider>;
};
