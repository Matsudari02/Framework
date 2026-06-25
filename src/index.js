import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CruntRollProvider } from './contexts/CruntRollContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CruntRollProvider>
      <App />
    </CruntRollProvider>
  </React.StrictMode>
);