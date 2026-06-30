import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from '@context/AuthContext';
import { FridgeProvider } from '@context/FridgeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FridgeProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#FFFDF9',
                color: '#33322D',
                border: '1px solid #E3E1DB',
                borderRadius: '14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
            }}
          />
        </FridgeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
