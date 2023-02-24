import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react"
import { BrowserRouter } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Auth0Provider domain="dev-tdj2wkqpcpaktq0g.us.auth0.com" clientId='9BKspW4pIZ5t4MRwF1ZTXZeKjRXRjoCH' redirectUri={window.location.origin}>
      <App />
    </Auth0Provider>
  </BrowserRouter>
);
