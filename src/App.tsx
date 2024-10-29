// src/App.tsx
import React from 'react';
import { CounterProvider, useCounterContext } from './CounterContext';
import { Button, Typography, Box, List, ListItem, Card, CardContent } from '@mui/material';
import './App.css';

const CounterDisplay: React.FC = () => {
  const { count, squaredCount, increment, decrement, reset, history } = useCounterContext();

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h4">计数器: {count}</Typography>
      <Typography variant="h6">平方: {squaredCount}</Typography>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={increment}>增加</Button>
        <Button variant="contained" color="secondary" onClick={decrement}>减少</Button>
        <Button variant="outlined" onClick={reset}>重置</Button>
      </Box>
      <Box mt={4}>
        <Typography variant="h5">历史记录:</Typography>
        <List>
          {history.map((entry, index) => (
            <ListItem key={index}>
              <Card variant="outlined" style={{ width: '300px', margin: '5px auto' }}>
                <CardContent>
                  <Typography variant="body1">值: {entry.value}</Typography>
                  <Typography variant="body2" color="textSecondary">时间: {entry.timestamp}</Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <CounterProvider>
      <div className="app">
        <CounterDisplay />
      </div>
    </CounterProvider>
  );
};

export default App;
