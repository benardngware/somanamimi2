import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // This is the essential line that imports all your styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
