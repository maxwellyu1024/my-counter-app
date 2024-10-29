// src/App.tsx
import React, { useState } from 'react';
import { CounterProvider, useCounterContext } from './CounterContext';
import { Button, Typography, Box, List, ListItem, Card, CardContent, Snackbar, Grid } from '@mui/material';
import './App.css';

const CounterDisplay: React.FC = () => {
  const { count, squaredCount, increment, decrement, reset, history } = useCounterContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleIncrement = () => {
    increment();
    setSnackbarMessage('计数增加');
    setSnackbarOpen(true);
  };

  const handleDecrement = () => {
    decrement();
    setSnackbarMessage('计数减少');
    setSnackbarOpen(true);
  };

  const handleReset = () => {
    reset();
    setSnackbarMessage('计数重置');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h4">计数器: {count}</Typography>
      <Typography variant="h6">平方: {squaredCount}</Typography>
      <Box mt={2}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleIncrement}>增加</Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDecrement}
              disabled={count === 0}
            >
              减少
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={handleReset}>重置</Button>
          </Grid>
        </Grid>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
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
