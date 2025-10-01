// Carregar variáveis de ambiente primeiro
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { errorHandler, notFound, logger } = require('./src/middlewares/index');

// Importar rotas
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(cors({
  origin: true, // Permitir qualquer origem
  credentials: true // Permitir cookies
})); // Permitir requisições do React
app.use(express.json({ limit: '10mb' })); // Parser JSON com limite maior
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parser URL-encoded
app.use(logger); // Log das requisições





// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/produtos', produtoRoutes);


// Middlewares de erro (devem vir no final)
app.use(notFound); // 404
app.use(errorHandler); // Tratamento de erros

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor LimpaTech rodando na porta ${PORT}`);
    console.log(`📍 Acesse: http://localhost:${PORT}`);
    console.log(`📱 Acesse do celular: http://192.168.1.4:${PORT}`);
});