import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Router } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Cadastro from './pages/cadastroUsuario';
import CadastroProduto from './pages/cadastroProduto';
import Loja from './pages/loja';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={< Loja />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/cadastroProduto" element={<CadastroProduto />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


reportWebVitals();
