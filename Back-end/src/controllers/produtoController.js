const produtoService = require('../services/produtoService');

class ProdutoController {

  // GET /api/produtos - Listar todos os produtos (com filtros opcionais)
  async listarProdutos(req, res) {
    try {
      const filtros = req.query; // { nome, marca, categoria, disponivel }
      const produtos = await produtoService.listarProdutos(filtros);
      
      res.json({
        success: true,
        data: produtos,
        total: produtos.length,
        filtros: filtros
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/produtos/:id - Buscar produto por ID
  async buscarProduto(req, res) {
    try {
      const { id } = req.params;
      const produto = await produtoService.buscarProdutoPorId(Number(id));
      
      res.json({
        success: true,
        data: produto
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/produtos - Criar novo produto
  async criarProduto(req, res) {
    try {
      const dadosProduto = req.body;
      const novoProduto = await produtoService.criarProduto(dadosProduto);
      
      res.status(201).json({
        success: true,
        data: novoProduto,
        message: 'Produto criado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/produtos/:id - Atualizar produto
  async atualizarProduto(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;
      
      const produtoAtualizado = await produtoService.atualizarProduto(id, dadosAtualizacao);
      
      res.json({
        success: true,
        data: produtoAtualizado,
        message: 'Produto atualizado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/produtos/:id - Deletar produto
  async deletarProduto(req, res) {
    try {
      const { id } = req.params;
      await produtoService.deletarProduto(id);
      
      res.json({
        success: true,
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/produtos/categoria/:categoria - Buscar por categoria
  async buscarPorCategoria(req, res) {
    try {
      const { categoria } = req.params;
      const produtos = await produtoService.buscarPorCategoria(categoria);
      
      res.json({
        success: true,
        data: produtos,
        total: produtos.length,
        categoria: categoria
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/produtos/marca/:marca - Buscar por marca
  async buscarPorMarca(req, res) {
    try {
      const { marca } = req.params;
      const produtos = await produtoService.buscarPorMarca(marca);
      
      res.json({
        success: true,
        data: produtos,
        total: produtos.length,
        marca: marca
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PATCH /api/produtos/:id/estoque - Atualizar estoque
  async atualizarEstoque(req, res) {
    try {
      const { id } = req.params;
      const { quantidade } = req.body;
      
      const produto = await produtoService.atualizarEstoque(Number(id), quantidade);
      
      res.json({
        success: true,
        data: produto,
        message: 'Estoque atualizado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/produtos/estatisticas - Obter estatísticas
  async obterEstatisticas(req, res) {
    try {
      const estatisticas = await produtoService.obterEstatisticas();
      
      res.json({
        success: true,
        data: estatisticas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/produtos/estoque-baixo - Produtos com estoque baixo
  async produtosEstoqueBaixo(req, res) {
    try {
      const { limite = 5 } = req.query;
      const produtos = await produtoService.produtosComEstoqueBaixo(Number(limite));
      
      res.json({
        success: true,
        data: produtos,
        total: produtos.length,
        limite: Number(limite)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

const produtoController = new ProdutoController();
module.exports = produtoController;