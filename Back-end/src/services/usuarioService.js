const usuarioRepository = require('../repositories/usuarioRepository');
const Usuario = require('../models/usuarios');
const { UserRole, isValidRole, canCreateUsers } = require('../utils/userRoles');

class UsuarioService {
  
  // Listar todos os usuários
  async listarUsuarios() {
    try {
      return await usuarioRepository.buscarTodos();
    } catch (error) {
      throw new Error(`Erro ao listar usuários: ${error.message}`);
    }
  }

  // Buscar usuário por ID
  async buscarUsuarioPorId(id) {
    try {
      const usuario = await usuarioRepository.buscarPorId(id);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      return usuario;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  // Criar novo usuário (apenas admins podem criar)
  async criarUsuario(dadosUsuario, usuarioCriador) {
    try {
      // Validar se quem está criando é admin
      if (!canCreateUsers(usuarioCriador?.role)) {
        throw new Error('Apenas administradores podem cadastrar novos usuários');
      }

      // Validar dados
      const erros = Usuario.validar(dadosUsuario);
      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(', ')}`);
      }

      // Validar role
      if (!isValidRole(dadosUsuario.role)) {
        throw new Error(`Role inválido: ${dadosUsuario.role}`);
      }

      return await usuarioRepository.criar(dadosUsuario);
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  // Atualizar usuário
  async atualizarUsuario(id, dadosAtualizacao) {
    try {
      // Validação específica para atualização (sem obrigar todos os campos)
      const erros = [];

      // Validar nome se fornecido
      if (dadosAtualizacao.nome !== undefined && (!dadosAtualizacao.nome || dadosAtualizacao.nome.trim().length < 2)) {
        erros.push('Nome deve ter pelo menos 2 caracteres');
      }

      // Validar email se fornecido
      if (dadosAtualizacao.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!dadosAtualizacao.email || !emailRegex.test(dadosAtualizacao.email)) {
          erros.push('Email inválido');
        }
      }

      // Validar role se fornecido
      if (dadosAtualizacao.role !== undefined && !isValidRole(dadosAtualizacao.role)) {
        erros.push('Role inválido');
      }

      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(', ')}`);
      }

      return await usuarioRepository.atualizar(id, dadosAtualizacao);
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  // Deletar usuário
  async deletarUsuario(id) {
    try {
      return await usuarioRepository.deletar(id);
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

  // Autenticar usuário (login)
  async autenticarUsuario(email, senha) {
    try {
      if (!email || !senha) {
        throw new Error('Email e senha são obrigatórios');
      }

      const resultado = await usuarioRepository.autenticar(email, senha);
      if (!resultado) {
        throw new Error('Credenciais inválidas');
      }

      return {
        usuario: resultado.usuario,
        token: resultado.token,
        session: resultado.session,
        message: 'Login realizado com sucesso'
      };
    } catch (error) {
      throw new Error(`Erro na autenticação: ${error.message}`);
    }
  }



  // Verificar se usuário é admin
  async verificarPermissaoAdmin(usuarioId) {
    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    return usuario && usuario.role === 'ADMIN';
  }
}

const usuarioService = new UsuarioService();
module.exports = usuarioService;