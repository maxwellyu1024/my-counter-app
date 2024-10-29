import { useState, useEffect, useMemo } from 'react';
import {
    getFromLocalStorage,
    saveToLocalStorage,
    removeFromLocalStorage,
} from '../utils/localStorageUtils';


const useCounter = () => {
    const [count, setCount] = useState<number>(0);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        const savedCount = getFromLocalStorage('count');
        const savedHistory = getFromLocalStorage('history');

        if (savedCount) {
            setCount(savedCount);
        }
        if (savedHistory) {
            setHistory(savedHistory);
        }
    }, []);

    useEffect(() => {
        saveToLocalStorage('count', count);
        saveToLocalStorage('history', history);
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
        removeFromLocalStorage('history'); // 清除本地存储中的历史记录
    };


    return { count, squaredCount, increment, decrement, reset, history, clearHistory };
};

export default useCounter;
