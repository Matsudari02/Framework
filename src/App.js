import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './styles/global.css';
import { ToastWrapper } from './components/ToastWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastWrapper />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;