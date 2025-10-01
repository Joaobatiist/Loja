// Utilitário para fazer requisições autenticadas
class ApiService {
  constructor() {
    // Usar variável de ambiente ou fallback baseado no hostname
    this.baseUrl = process.env.REACT_APP_API_URL || (() => {
      const isLocalNetwork = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const apiHost = isLocalNetwork ? window.location.hostname : 'localhost';
      return `http://${apiHost}:3001/api`;
    })();
   
  }

  // Pegar o token do localStorage
  getToken() {
    return localStorage.getItem('limpatech_token');
  }

  // Headers padrão com autenticação
  getHeaders() {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Método GET autenticado
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar os usuários`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Método POST autenticado
  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao cadastrar funcionário`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Método PUT autenticado
  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar usuário`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Método DELETE autenticado
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar usuário`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Login (sem autenticação)
  async login(email, senha) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error(`Erro credenciais inválidas!`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Verificar se token está válido
  async verificarToken() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Métodos específicos para usuários
  async listarUsuarios() {
    return await this.get('/usuarios');
  }

  async cadastrarFuncionario(dadosFuncionario) {
    return await this.post('/usuarios/funcionario', dadosFuncionario);
  }

  async deletarUsuario(id) {
    return await this.delete(`/usuarios/${id}`);
  }

  async atualizarUsuario(id, dadosUsuario) {
    return await this.put(`/usuarios/${id}`, dadosUsuario);
  }

  // Métodos específicos para produtos
  async listarProdutos(filtros = {}) {
    const queryParams = new URLSearchParams(filtros).toString();
    const endpoint = queryParams ? `/produtos?${queryParams}` : '/produtos';
    return await this.get(endpoint);
  }

  // Método para listar produtos públicos (sem autenticação)
  async listarProdutosPublicos(filtros = {}) {
    try {
      const queryParams = new URLSearchParams(filtros).toString();
      const endpoint = queryParams ? `/produtos/publicos?${queryParams}` : '/produtos/publicos';
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async criarProduto(dadosProduto) {
    return await this.post('/produtos', dadosProduto);
  }

  async atualizarProduto(id, dadosProduto) {
    return await this.put(`/produtos/${id}`, dadosProduto);
  }

  async deletarProduto(id) {
    return await this.delete(`/produtos/${id}`);
  }
}

// Exportar instância única
const apiService = new ApiService();
export default apiService;