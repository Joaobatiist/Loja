const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware para verificar autenticação JWT do Supabase
const verificarAutenticacao = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token de acesso requerido' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Verificar token com Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ 
        error: 'Token inválido ou expirado' 
      });
    }

    // Adicionar usuário ao request para uso nos controllers
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

// Middleware para verificar se é admin
const verificarAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado' 
      });
    }

    // Buscar dados do usuário na nossa tabela para verificar role
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('role')
      .eq('email', req.user.email)
      .single();

    if (error || !usuario) {
      return res.status(403).json({ 
        error: 'Usuário não encontrado' 
      });
    }

    if (usuario.role !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Acesso negado. Apenas administradores podem realizar esta ação.' 
      });
    }

    req.userRole = usuario.role;
    next();
  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

module.exports = {
  verificarAutenticacao,
  verificarAdmin
};