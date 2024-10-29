// src/useCounter.ts
import { useState, useEffect, useMemo } from 'react';

const useCounter = () => {
  const [count, setCount] = useState<number>(() => {
    const savedCount = localStorage.getItem('count');
    return savedCount ? JSON.parse(savedCount) : 0;
  });

  const [history, setHistory] = useState<number[]>(() => {
    const savedHistory = localStorage.getItem('history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('count', JSON.stringify(count));
    localStorage.setItem('history', JSON.stringify(history));
    console.log(`当前计数: ${count}`);

    return () => {
      console.log(`清理计数: ${count}`);
    };
  }, [count, history]);

  const squaredCount = useMemo(() => {
    console.log('计算平方值');
    return count * count;
  }, [count]);

  const increment = () => {
    setCount((prev) => {
      const newCount = prev + 1;
      setHistory((prevHistory) => [...prevHistory, newCount]);
      return newCount;
    });
  };

  const decrement = () => {
    setCount((prev) => {
      const newCount = prev - 1;
      setHistory((prevHistory) => [...prevHistory, newCount]);
      return newCount;
    });
  };

  const reset = () => {
    setCount(0);
    setHistory((prevHistory) => [...prevHistory, 0]);
  };

  return { count, squaredCount, increment, decrement, reset, history };
};

export default useCounter;
