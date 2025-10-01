const Usuario = require('../models/usuarios');
const { supabase } = require('../config/supabase');

class UsuarioRepository {
  constructor() {
    this.supabase = supabase;
  }
  
  // Buscar todos os usuários
  async buscarTodos() {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*');
    
    if (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
    
    return data || [];
  }

  // Buscar usuário por ID
  async buscarPorId(id) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
    
    return data;
  }

  // Buscar usuário por email
  async buscarPorEmail(email) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
    
    return data;
  }

  // Criar novo usuário no Auth + tabela usuarios
  async criar(dadosUsuario) {
    try {
      // 1. Verificar se email já existe na nossa tabela
      const usuarioExistente = await this.buscarPorEmail(dadosUsuario.email);
      if (usuarioExistente) {
        throw new Error('E-mail já cadastrado');
      }

      // 2. Criar usuário no Supabase Auth (senha fica segura lá)
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: dadosUsuario.email,
        password: dadosUsuario.senha, // Senha vai pro Auth, não pra tabela
        options: {
          data: {
            nome: dadosUsuario.nome,
            role: dadosUsuario.role || 'USER'
          }
        }
      });

      if (authError) {
        throw new Error('Erro ao criar conta: ' + authError.message);
      }

      // 3. Criar registro na nossa tabela usuarios (SEM senha)
      const { data, error } = await this.supabase
        .from('usuarios')
        .insert([{
          id: authData.user.id, // Mesmo ID do Auth
          nome: dadosUsuario.nome,
          email: dadosUsuario.email,
          // senha: NÃO SALVAR - fica só no Auth
          role: dadosUsuario.role || 'USER',
          created_at: new Date(),
          updated_at: new Date()
        }])
        .select()
        .single();

      if (error) {
        throw new Error('Erro ao salvar dados do usuário');
      }

      return data;

    } catch (error) {
      throw error;
    }
  }

  // Atualizar usuário
  async atualizar(id, dadosAtualizacao) {
    // Verificar se usuário existe
    const usuarioExistente = await this.buscarPorId(id);
    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se o novo email já existe (se estiver sendo alterado)
    if (dadosAtualizacao.email && dadosAtualizacao.email !== usuarioExistente.email) {
      const emailJaExiste = await this.buscarPorEmail(dadosAtualizacao.email);
      if (emailJaExiste) {
        throw new Error('E-mail já cadastrado');
      }
    }

    // Atualizar dados no Supabase
    const { data, error } = await this.supabase
      .from('usuarios')
      .update({
        ...dadosAtualizacao,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error('Erro interno do servidor');
    }

    return data;
  }

  // Deletar usuário
  async deletar(id) {
    // Verificar se usuário existe
    const usuarioExistente = await this.buscarPorId(id);
    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    // Deletar do Supabase
    const { data, error } = await this.supabase
      .from('usuarios')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new Error('Erro interno do servidor');
    }

    return data;
  }

  // Autenticar usuário usando Supabase Auth
  async autenticar(email, senha) {
    try {
      // Fazer login com Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: email,
        password: senha
      });

      if (authError) {
        return null;
      }

      // Buscar dados completos do usuário na nossa tabela
      const usuario = await this.buscarPorEmail(email);
      if (!usuario) {
        return null;
      }

      // Retornar dados do usuário + token de acesso
      const resultado = {
        usuario: usuario,
        token: authData.session.access_token,
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at,
          user: usuario
        }
      };

      return resultado;
      
    } catch (error) {
      return null;
    }
  }

  // Registrar usuário tanto no Auth quanto na nossa tabela
  async registrarUsuario(dadosUsuario) {
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: dadosUsuario.email,
        password: dadosUsuario.senha,
        options: {
          data: {
            nome: dadosUsuario.nome,
            role: dadosUsuario.role
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário no Auth:', authError);
        throw new Error('Erro ao criar conta de usuário');
      }

      // 2. Criar registro na nossa tabela usuarios (sem senha)
      const novoUsuario = {
        id: authData.user.id, // Usar o mesmo ID do auth
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        // senha: não salvar senha na tabela, fica só no Auth
        role: dadosUsuario.role,
        created_at: new Date(),
        updated_at: new Date()
      };

      const { data, error } = await this.supabase
        .from('usuarios')
        .insert(novoUsuario)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar usuário na tabela:', error);
        throw new Error('Erro ao salvar dados do usuário');
      }

      return data;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }
}

// Singleton - uma instância única
const usuarioRepository = new UsuarioRepository();
module.exports = usuarioRepository;