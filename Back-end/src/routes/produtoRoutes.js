const express = require('express');
const produtoController = require('../controllers/produtoController');
const { verificarAutenticacao } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota pública para listar produtos (para a página loja)
router.get('/publicos', produtoController.listarProdutos.bind(produtoController));

// Rotas de produtos (protegidas por autenticação)
router.get('/', verificarAutenticacao, produtoController.listarProdutos.bind(produtoController));
router.get('/estatisticas', verificarAutenticacao, produtoController.obterEstatisticas.bind(produtoController));
router.get('/estoque-baixo', verificarAutenticacao, produtoController.produtosEstoqueBaixo.bind(produtoController));
router.get('/categoria/:categoria', verificarAutenticacao, produtoController.buscarPorCategoria.bind(produtoController));
router.get('/marca/:marca', verificarAutenticacao, produtoController.buscarPorMarca.bind(produtoController));
router.get('/:id', verificarAutenticacao, produtoController.buscarProduto.bind(produtoController));
router.post('/', verificarAutenticacao, produtoController.criarProduto.bind(produtoController));
router.put('/:id', verificarAutenticacao, produtoController.atualizarProduto.bind(produtoController));
router.patch('/:id/estoque', verificarAutenticacao, produtoController.atualizarEstoque.bind(produtoController));
router.delete('/:id', verificarAutenticacao, produtoController.deletarProduto.bind(produtoController));

module.exports = router;