import React, { useState } from 'react';
import './styles/App.css';
import CounterDisplay from './components/CounterDisplay';
import { CounterProvider } from './context/CounterContext';
import { Box, Button, Container } from '@mui/material';
import SetInitialValueDialog from './components/SetInitialValueDialog';


const App: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <CounterProvider>
      <Container className="app">
        <Box  display="block" flexDirection="column" alignItems="center">
          <Button variant="outlined" onClick={() => setOpenDialog(true)}>
            设置初始值
          </Button>
        </Box>
        <CounterDisplay />
        <SetInitialValueDialog open={openDialog} onClose={() => setOpenDialog(false)} />
      </Container>
    </CounterProvider>
  );
};

export default App;
