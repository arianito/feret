import React, { FC, PropsWithChildren } from 'react';
import { Container } from '../container';
import { ReactBootContext } from './context';

export const ReactBootProvider: FC<
  PropsWithChildren<{ container: Container }>
> = ({ container, children }) => {
  return (
    <ReactBootContext.Provider value={{ container }}>
      {children}
    </ReactBootContext.Provider>
  );
};
