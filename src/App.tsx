import React from 'react';
import './styles/App.css';
import CounterDisplay from './components/CounterDisplay';
import { CounterProvider } from './context/CounterContext';


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
