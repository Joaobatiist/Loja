const { supabase } = require('../config/supabase');

class ProdutoRepository {
  constructor() {
    this.supabase = supabase;
  }

  // Buscar todos os produtos
  async buscarTodos() {
    const { data, error } = await this.supabase
      .from('produtos')
      .select(`
        *,
        usuarios(
          id,
          nome,
          email
        )
      `)
      .order('nome', { ascending: true });
    
    if (error) {
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }
    
    return data || [];
  }

  // Buscar produto por ID
  async buscarPorId(id) {
    const { data, error } = await this.supabase
      .from('produtos')
      .select(`
        *,
        usuarios(
          id,
          nome,
          email
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
    
    return data;
  }

  // Buscar produtos por categoria
  async buscarPorCategoria(categoria) {
    const { data, error } = await this.supabase
      .from('produtos')
      .select('*')
      .ilike('categoria', categoria)
      .order('nome');
    
    if (error) {
      throw new Error(`Erro ao buscar produtos por categoria: ${error.message}`);
    }
    
    return data || [];
  }

  // Buscar produtos por marca
  async buscarPorMarca(marca) {
    const { data, error } = await this.supabase
      .from('produtos')
      .select('*')
      .ilike('marca', marca)
      .order('nome');
    
    if (error) {
      throw new Error(`Erro ao buscar produtos por marca: ${error.message}`);
    }
    
    return data || [];
  }

  // Buscar produtos (com filtros opcionais)
  async buscar({ nome, marca, categoria, disponivel } = {}) {
    let query = this.supabase
      .from('produtos')
      .select(`
        *,
        usuarios(
          id,
          nome,
          email
        )
      `);

    if (nome) {
      query = query.ilike('nome', `%${nome}%`);
    }

    if (marca) {
      query = query.ilike('marca', `%${marca}%`);
    }

    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    if (disponivel) {
      query = query.gt('quantidade', 0);
    }

    query = query.order('nome', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }

    return data || [];
  }

  // Criar novo produto
  async criar(dadosProduto) {
    const { data, error } = await this.supabase
      .from('produtos')
      .insert([{
        ...dadosProduto,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        usuarios(
          id,
          nome,
          email
        )
      `)
      .single();
    
    if (error) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
    
    return data;
  }

  // Atualizar produto
  async atualizar(id, dadosAtualizacao) {
    const { data, error } = await this.supabase
      .from('produtos')
      .update({
        ...dadosAtualizacao,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        usuarios(
          id,
          nome,
          email
        )
      `)
      .single();
    
    if (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
    
    return data;
  }

  // Deletar produto
  async deletar(id) {
    const { error } = await this.supabase
      .from('produtos')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
    
    return true;
  }

  // Atualizar estoque
  async atualizarEstoque(id, quantidade) {
    const { data, error } = await this.supabase
      .from('produtos')
      .update({ 
        quantidade: quantidade,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao atualizar estoque: ${error.message}`);
    }
    
    return data;
  }

  // Obter estatísticas
  async obterEstatisticas() {
    const { data, error } = await this.supabase
      .from('produtos')
      .select('quantidade, preco');
    
    if (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
    
    const produtos = data || [];
    
    return {
      total: produtos.length,
      disponivel: produtos.filter(p => p.quantidade > 0).length,
      semEstoque: produtos.filter(p => p.quantidade === 0).length,
      valorTotalEstoque: produtos.reduce((total, p) => total + (p.preco * p.quantidade), 0)
    };
  }
}

// Singleton - uma instância única
const produtoRepository = new ProdutoRepository();
module.exports = produtoRepository;