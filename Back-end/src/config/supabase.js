// Configuração do Supabase
const { createClient } = require('@supabase/supabase-js');

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = process.env.SUPABASE_URL; // Ex: https://xyzcompany.supabase.co
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Sua chave pública

const supabase = createClient(supabaseUrl, supabaseKey);

// Funções auxiliares para produtos
const produtoService = {
  // Listar todos os produtos com informação do criador
  async listarProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        usuarios(
          id,
          nome,
          email
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar produto por ID
  async buscarProduto(id) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Criar novo produto (com usuario_id)
  async criarProduto(produto, usuarioId) {
    const produtoComUsuario = {
      ...produto,
      usuario_id: usuarioId
    };
    
    const { data, error } = await supabase
      .from('produtos')
      .insert([produtoComUsuario])
      .select('*, usuarios(nome, email)') // Incluir dados do usuário
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar produto
  async atualizarProduto(id, dadosAtualizacao) {
    const { data, error } = await supabase
      .from('produtos')
      .update(dadosAtualizacao)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar produto
  async deletarProduto(id) {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Buscar por categoria
  async buscarPorCategoria(categoria) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('categoria', categoria)
      .order('nome');
    
    if (error) throw error;
    return data;
  },

  // Atualizar estoque
  async atualizarEstoque(id, quantidade) {
    const { data, error } = await supabase
      .from('produtos')
      .update({ quantidade })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Buscar produtos de um usuário específico
  async buscarProdutosPorUsuario(usuarioId) {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        usuarios(
          id,
          nome,
          email
        )
      `)
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Verificar se usuário pode editar produto
  async verificarPropriedade(produtoId, usuarioId) {
    const { data, error } = await supabase
      .from('produtos')
      .select('usuario_id, usuarios(role)')
      .eq('id', produtoId)
      .single();
    
    if (error) throw error;
    
    // Usuário é dono do produto OU é admin
    const podeEditar = data.usuario_id === usuarioId || 
                       data.usuarios?.role === 'ADMIN';
    
    return podeEditar;
  }
};

// Funções auxiliares para usuários
const usuarioService = {
  // Listar todos os usuários
  async listarUsuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, role, criado_em') // Não retorna senha
      .order('criado_em', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Criar usuário
  async criarUsuario(usuario) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuario])
      .select('id, nome, email, role, criado_em')
      .single();
    
    if (error) throw error;
    return data;
  },

  // Login (verificar credenciais)
  async login(email, senha) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .single();
    
    if (error || !data) {
      throw new Error('Credenciais inválidas');
    }
    
    // Retorna dados sem senha
    const { senha: _, ...usuarioSemSenha } = data;
    return usuarioSemSenha;
  }
};

// Exportar configurações e serviços
module.exports = {
  supabase,
  produtoService,
  usuarioService
};