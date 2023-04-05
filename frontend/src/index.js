import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './router';
import { CookiesProvider } from 'react-cookie';
import { SessionProvider } from './Common/Contexts/SessionContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <SessionProvider>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </SessionProvider>
    
  </React.StrictMode>
);

