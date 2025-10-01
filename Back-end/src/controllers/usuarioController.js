const usuarioService = require('../services/usuarioService');
const usuarioRepository = require('../repositories/usuarioRepository');

class UsuarioController {

  // GET /api/usuarios - Listar todos os usuários
  async listarUsuarios(req, res) {
    try {
      const usuarios = await usuarioService.listarUsuarios();
      res.json({
        success: true,
        data: usuarios,
        total: usuarios.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/usuarios/:id - Buscar usuário por ID
  async buscarUsuario(req, res) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.buscarUsuarioPorId(id);
      
      res.json({
        success: true,
        data: usuario
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/usuarios - Criar novo usuário (apenas admins)
  async criarUsuario(req, res) {
    try {
      const dadosUsuario = req.body;
      const userId = req.headers['x-user-id'];
      
      // Buscar dados do usuário que está criando
      const usuarioCriador = await usuarioRepository.buscarPorId(userId);
      
      if (!usuarioCriador || usuarioCriador.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem cadastrar novos usuários'
        });
      }

      const novoUsuario = await usuarioService.criarUsuario(dadosUsuario, usuarioCriador);
      
      res.status(201).json({
        success: true,
        data: novoUsuario,
        message: `Usuário ${novoUsuario.nome} criado com sucesso`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/usuarios/:id - Atualizar usuário
  async atualizarUsuario(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;
      
     
      
      // Verificar se o usuário está tentando alterar seu próprio role
      if (req.user.sub === id && dadosAtualizacao.role) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível alterar seu próprio nível de acesso'
        });
      }
      
      const usuarioAtualizado = await usuarioService.atualizarUsuario(id, dadosAtualizacao);
      
      res.json({
        success: true,
        data: usuarioAtualizado,
        message: 'Usuário atualizado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/usuarios/:id - Deletar usuário
  async deletarUsuario(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se o usuário está tentando deletar a si mesmo
      if (req.user.sub === id) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível deletar sua própria conta'
        });
      }
      
      await usuarioService.deletarUsuario(id);
      
      res.json({
        success: true,
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/auth/login - Autenticar usuário
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      
      const resultado = await usuarioService.autenticarUsuario(email, senha);
      
      res.json({
        success: true,
        data: resultado,
        message: resultado.message
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/auth/logout - Logout (para futuro uso com JWT)
  async logout(req, res) {
    try {
      // Em produção, invalidar o token JWT aqui
      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/usuarios/funcionario - Cadastrar funcionário (endpoint específico)
  async cadastrarFuncionario(req, res) {
    try {
      
      const { nome, email, senha, role = 'USER' } = req.body;
      
    
      
      // Buscar dados completos do usuário na nossa tabela
      const usuarioCriador = await usuarioRepository.buscarPorEmail(req.user.email);
      
      if (!usuarioCriador || usuarioCriador.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem cadastrar funcionários'
        });
      }

      const dadosFuncionario = { nome, email, senha, role };
      const novoFuncionario = await usuarioService.criarUsuario(dadosFuncionario, usuarioCriador);
      
      res.status(201).json({
        success: true,
        data: novoFuncionario,
        message: `Funcionário ${novoFuncionario.nome} cadastrado com sucesso`,
        cadastradoPor: usuarioCriador.nome
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

const usuarioController = new UsuarioController();
module.exports = usuarioController;