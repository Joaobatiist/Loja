const produtoRepository = require('../repositories/produtoRepository');
const Produto = require('../models/produtos');

class ProdutoService {
  
  // Listar todos os produtos
  async listarProdutos(filtros = {}) {
    try {
      if (Object.keys(filtros).length > 0) {
        return await produtoRepository.buscar(filtros);
      }
      return await produtoRepository.buscarTodos();
    } catch (error) {
      throw new Error(`Erro ao listar produtos: ${error.message}`);
    }
  }

  // Buscar produto por ID
  async buscarProdutoPorId(id) {
    try {
      const produto = await produtoRepository.buscarPorId(id);
      if (!produto) {
        throw new Error('Produto não encontrado');
      }
      return produto;
    } catch (error) {
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
  }

  // Criar novo produto
  async criarProduto(dadosProduto) {
    try {
      // Validar dados
      const erros = Produto.validar(dadosProduto);
      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(', ')}`);
      }

      return await produtoRepository.criar(dadosProduto);
    } catch (error) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  // Atualizar produto
  async atualizarProduto(id, dadosAtualizacao) {
    try {
      return await produtoRepository.atualizar(id, dadosAtualizacao);
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  // Deletar produto
  async deletarProduto(id) {
    try {
      return await produtoRepository.deletar(id);
    } catch (error) {
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
  }

  // Buscar produtos por categoria
  async buscarPorCategoria(categoria) {
    try {
      return await produtoRepository.buscarPorCategoria(categoria);
    } catch (error) {
      throw new Error(`Erro ao buscar produtos por categoria: ${error.message}`);
    }
  }

  // Buscar produtos por marca
  async buscarPorMarca(marca) {
    try {
      return await produtoRepository.buscarPorMarca(marca);
    } catch (error) {
      throw new Error(`Erro ao buscar produtos por marca: ${error.message}`);
    }
  }

  // Atualizar estoque
  async atualizarEstoque(id, quantidade) {
    try {
      if (quantidade < 0) {
        throw new Error('Quantidade não pode ser negativa');
      }
      return await produtoRepository.atualizarEstoque(id, quantidade);
    } catch (error) {
      throw new Error(`Erro ao atualizar estoque: ${error.message}`);
    }
  }

  // Obter estatísticas dos produtos
  async obterEstatisticas() {
    try {
      return await produtoRepository.obterEstatisticas();
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }

  // Buscar produtos com estoque baixo
  async produtosComEstoqueBaixo(limite = 5) {
    try {
      const produtos = await produtoRepository.buscarTodos();
      return produtos.filter(produto => produto.quantidade <= limite);
    } catch (error) {
      throw new Error(`Erro ao buscar produtos com estoque baixo: ${error.message}`);
    }
  }
}

const produtoService = new ProdutoService();
module.exports = produtoService;