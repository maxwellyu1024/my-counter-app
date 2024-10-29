// src/useCounter.ts
import { useState, useEffect, useMemo } from 'react';

const useCounter = () => {
  const [count, setCount] = useState<number>(() => {
    const savedCount = localStorage.getItem('count');
    return savedCount ? JSON.parse(savedCount) : 0;
  });

  useEffect(() => {
    localStorage.setItem('count', JSON.stringify(count));
    console.log(`当前计数: ${count}`);

    return () => {
      console.log(`清理计数: ${count}`);
    };
  }, [count]);

  const squaredCount = useMemo(() => {
    console.log('计算平方值');
    return count * count;
  }, [count]);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return { count, squaredCount, increment, decrement, reset };
};

export default useCounter;
