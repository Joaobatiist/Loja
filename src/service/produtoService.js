import { supabase } from "../lib/supabase";


export const produtoService = {
  async listarProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        id,
        nome,
        marca,
        categoria,
        foto,
        quantidade,
        created_at
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async buscarProduto(id) {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        id,
        nome,
        marca,
        categoria,
        foto,
        quantidade,
        created_at
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async criarProduto(produto) {
    const { data, error } = await supabase
      .from('produtos')
      .insert([produto])
      .select(`
        id,
        nome,
        marca,
        categoria,
        foto,
        quantidade,
        created_at
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

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

  async deletar(id) {
    const { data, error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  },

  async buscarPorCategoria(categoria) {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        id,
        nome,
        marca,
        categoria,
        foto
      `)
      .eq('categoria', categoria)
      .order('nome');
    
    if (error) throw error;
    return data;
  },

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

  async buscarProdutosPorUsuario(usuarioId) {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        id,
        nome,
        marca,
        categoria,
        foto,
        quantidade,
        created_at,
        usuario_id,
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