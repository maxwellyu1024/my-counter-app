import { useState, useEffect, useMemo } from 'react';

interface HistoryEntry {
    value: number;
    timestamp: string;
}

const useCounter = () => {
    /*
        const [count, setCount] = useState<number>(0);
        const [history, setHistory] = useState<HistoryEntry[]>([]);
    
        useEffect(() => {
            const savedCount = localStorage.getItem('count');
            const savedHistory = localStorage.getItem('history');
    
            if (savedCount) {
                setCount(JSON.parse(savedCount));
            }
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        }, []);
    */
    const [count, setCount] = useState<number>(() => {
        const savedCount = localStorage.getItem('count');
        return savedCount ? JSON.parse(savedCount) : 0;
    });

    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        const savedHistory = localStorage.getItem('history');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });

    useEffect(() => {
        localStorage.setItem('count', JSON.stringify(count));
        localStorage.setItem('history', JSON.stringify(history));
        console.log(`当前计数: ${count}`);


    }, [count, history]);

    const squaredCount = useMemo(() => {
        console.log('计算平方值');
        return count * count;
    }, [count]);

    const addHistoryEntry = (newCount: number) => {
        const timestamp = new Date().toLocaleString();
        setHistory((prevHistory) => [{ value: newCount, timestamp }, ...prevHistory]);
    };

    const increment = () => {
        setCount((prev) => {
            const newCount = prev + 1;
            addHistoryEntry(newCount);
            return newCount;
        });
    };

    const decrement = () => {
        setCount((prev) => {
            const newCount = prev - 1;
            addHistoryEntry(newCount);
            return newCount;
        });
    };

    const reset = () => {
        setCount(0);
        setHistory([]);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('history');
    };

    const setInitialValue = (value: number) => {
        setCount(value);
        addHistoryEntry(value);
    };

    return { count, squaredCount, increment, decrement, reset, history, clearHistory, setInitialValue };
};

export default useCounter;
