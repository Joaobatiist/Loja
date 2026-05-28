import { supabase, supabaseAnonKey, supabaseUrl } from "../lib/supabase";
import { createClient } from '@supabase/supabase-js';
export const usuarioService = {
  async obterPerfilAtual(authUserId) {
    try {
      // Tenta buscar primeiro na sua tabela 'usuarios'
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, email, role')
        .eq('id', authUserId)
        .single();

      if (!error && data) {
        return data; 
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.email,
          nome: session.user.user_metadata?.nome ,
          role: session.user.user_metadata?.role
        };
      }

      return null;
    } catch (error) {
      console.error("Erro ao obter perfil:", error);
      return null;
    }
  },
  // Listar todos os usuários
  async listarUsuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, role, created_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

 
async criarUsuario(usuario) {
    try {
      const supabaseIsolado = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false } 
      });

     
      const { data: authData, error: authError } = await supabaseIsolado.auth.signUp({
        email: usuario.email,
        password: usuario.senha,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar credenciais de autenticação.");

      // 3. Salva na tabela pública usando o 'supabase' original (onde você está logado)
      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          {
            id: authData.user.id, 
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role || 'USER'
          }
        ])
        .select('id, nome, email, role, created_at')
        .single();
        
      if (error) throw error;

      return {
        success: true,
        usuario: data
      };
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  },

  // Login para usuários já existentes
  async login(email, senha) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) {
        return { success: false, message: 'E-mail ou senha inválidos.' };
      }

      return {
        success: true,
        data: {
          usuario: data.user,
          token: data.session.access_token,
          session: data.session
        }
      };

    } catch (error) {
      return { success: false, message: 'Erro interno ao tentar fazer login.' };
    }
  },

  // Buscar usuário por ID (Corrigido de this.supabase para supabase)
  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
    
    return data;
  },

  // Buscar usuário por E-mail (Adicionado porque o método 'atualizar' precisa dele)
  async buscarPorEmail(email) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Não quebra se não achar nenhum
    
    if (error) throw error;
    return data;
  },

  // Deletar usuário (Corrigido para usar supabase)
  async deletar(id) {
    const usuarioExistente = await this.buscarPorId(id);
    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    const { data, error } = await supabase
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
  },

  // Atualizar usuário (Corrigido para usar supabase)
  async atualizar(id, dadosAtualizacao) {
    const usuarioExistente = await this.buscarPorId(id);
    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    if (dadosAtualizacao.email && dadosAtualizacao.email !== usuarioExistente.email) {
      const emailJaExiste = await this.buscarPorEmail(dadosAtualizacao.email);
      if (emailJaExiste) {
        throw new Error('E-mail já cadastrado');
      }
    }

    const { data, error } = await supabase
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
};