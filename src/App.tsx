// src/App.tsx
import React, { useState } from 'react';
import { CounterProvider, useCounterContext } from './CounterContext';
import { Button, Typography, Box, List, ListItem, Card, CardContent, Snackbar, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import './App.css';

const CounterDisplay: React.FC = () => {
  const { count, squaredCount, increment, decrement, reset, history, clearHistory, setInitialValue } = useCounterContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialValue, setInitialValueInput] = useState<number>(0);

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

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSetInitialValue = () => {
    setInitialValue(initialValue);
    setSnackbarMessage('初始值设置为 ' + initialValue);
    setSnackbarOpen(true);
    handleDialogClose();
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <Typography variant="h4">计数器: {count}</Typography>
        <Typography variant="h6">平方: {squaredCount}</Typography>
      </Grid>
      <Grid item>
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
            <Grid item>
              <Button variant="outlined" onClick={handleDialogOpen}>设置初始值</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={clearHistory}>清除历史</Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item>
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
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>设置初始值</DialogTitle>
        <DialogContent>
          <DialogContentText>
            输入计数器的初始值:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="初始值"
            type="number"
            fullWidth
            variant="outlined"
            value={initialValue}
            onChange={(e) => setInitialValueInput(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            取消
          </Button>
          <Button onClick={handleSetInitialValue} color="primary">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

const App: React.FC = () => {
  return (
    <CounterProvider>
      <div className="app" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CounterDisplay />
      </div>
    </CounterProvider>
  );
};

export default App;
