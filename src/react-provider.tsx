import React, { FC, PropsWithChildren } from 'react';
import { Container } from './container';
import { FeretContext } from './react-context';

export const FeretProvider: FC<PropsWithChildren<{ container: Container }>> = ({
  container,
  children,
}) => {
  return (
    <FeretContext.Provider value={{ container }}>
      {children}
    </FeretContext.Provider>
  );
};
