import React, { useState } from 'react';
import { Box, Button, Typography, List, Snackbar } from '@mui/material';
import HistoryList from './HistoryList';
import { useCounterContext } from '../context/CounterContext';

const CounterDisplay: React.FC = () => {
    const { count, squaredCount, increment, decrement, reset, history, clearHistory} = useCounterContext();
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
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4">计数器: {count}</Typography>
            <Typography variant="h6">平方: {squaredCount}</Typography>
            <Box>
                <Button variant="contained" color="primary" onClick={handleIncrement}>增加</Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDecrement}
                    disabled={count === 0}
                    style={{ marginLeft: '10px' }}
                >
                    减少
                </Button>
                <Button variant="outlined" onClick={handleReset} style={{ marginLeft: '10px' }}>重置</Button>
                <Button variant="outlined" onClick={clearHistory} style={{ marginLeft: '10px' }}>清除历史</Button>
            </Box>
            <List>
                <Typography variant="h5">历史记录</Typography>
                <HistoryList history={history} />
                
            </List>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />

          
        </Box>
    );
};

export default CounterDisplay;
