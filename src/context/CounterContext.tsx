
import React from 'react';
import useCounter from '../hooks/useCounter';

import { createContext, useContext } from 'react';


interface CounterContextType {
    count: number;
    squaredCount: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    clearHistory: () => void;
    history: HistoryEntry[];
    setInitialValue: (value: number) => void;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export const CounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const counter = useCounter();
    return (
        <CounterContext.Provider value={counter}>
            {children}
        </CounterContext.Provider>
    );
};

export const useCounterContext = () => {
    const context = useContext(CounterContext);
    if (!context) {
        throw new Error("useCounterContext must be used within a CounterProvider");
    }
    return context;
};
