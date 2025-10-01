const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const { verificarAutenticacao, verificarAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas de usuários
router.get('/', verificarAutenticacao, usuarioController.listarUsuarios.bind(usuarioController));
router.get('/:id', verificarAutenticacao, usuarioController.buscarUsuario.bind(usuarioController));
router.post('/', verificarAutenticacao, verificarAdmin, usuarioController.criarUsuario.bind(usuarioController)); // Apenas admins
router.post('/funcionario', verificarAutenticacao, verificarAdmin, usuarioController.cadastrarFuncionario.bind(usuarioController)); // Cadastrar funcionário
router.put('/:id', verificarAutenticacao, verificarAdmin, usuarioController.atualizarUsuario.bind(usuarioController)); // Apenas admins
router.delete('/:id', verificarAutenticacao, verificarAdmin, usuarioController.deletarUsuario.bind(usuarioController)); // Apenas admins

module.exports = router;