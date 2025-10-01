const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

// Rotas de autenticação
router.post('/login', usuarioController.login.bind(usuarioController));
router.post('/logout', usuarioController.logout.bind(usuarioController));

module.exports = router;