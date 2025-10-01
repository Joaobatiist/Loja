// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware para rota não encontrada
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.path} não encontrada`
  });
};



// Middleware para verificar se usuário é admin
const requireAdmin = (req, res, next) => {
  const userRole = req.headers['user-role']; // Role vem do header (em produção usar JWT)
  
  if (!userRole) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  if (userRole !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem realizar esta ação.'
    });
  }

  next();
};

// Middleware para verificar autenticação básica
const requireAuth = (req, res, next) => {
  const userId = req.headers['user-id']; // ID vem do header (em produção usar JWT)
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  req.userId = userId; // Adiciona userId ao request
  next();
};

// Middleware de log para requisições
const logger = (req, res, next) => {
  next();
};

// Exportar middlewares
module.exports = {
  errorHandler,
  notFound,
  requireAdmin,
  requireAuth,
  logger
};