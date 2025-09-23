import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Loja from './pages/loja';
import Dashboard from './pages/dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={< Loja />} />
        
         < Route path="/dashboard" element={<Dashboard />} />
        
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


reportWebVitals();
