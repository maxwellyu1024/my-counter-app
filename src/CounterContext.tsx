// src/CounterContext.tsx
import React, { createContext, useContext } from 'react';
import useCounter from './useCounter';

const CounterContext = createContext<any>(null);

export const CounterProvider: React.FC = ({ children }) => {
  const counter = useCounter();
  return (
    <CounterContext.Provider value={counter}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounterContext = () => {
  return useContext(CounterContext);
};
