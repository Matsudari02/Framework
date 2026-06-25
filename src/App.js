import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './styles/global.css';
import { ToastWrapper } from './components/ToastWrapper';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastWrapper />
    </>
  );
}

export default App;