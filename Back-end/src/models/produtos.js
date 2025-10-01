// Modelo de Produto com relação ao usuário criador
class Produto {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nome = data.nome || '';
    this.marca = data.marca || '';
    this.categoria = data.categoria || '';
    this.quantidade = data.quantidade || 0;
    this.preco = data.preco || 0;
    this.foto = data.foto || null; // URL da imagem ou base64
    this.usuario_id = data.usuario_id || null; // ID do usuário que criou o produto
    this.descricao = data.descricao || '';
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  // Validações
  validate() {
    const errors = [];
    
    if (!this.nome || this.nome.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!this.marca || this.marca.trim().length < 1) {
      errors.push('Marca é obrigatória');
    }
    
    if (!this.categoria || this.categoria.trim().length < 1) {
      errors.push('Categoria é obrigatória');
    }
    
    if (this.quantidade < 0) {
      errors.push('Quantidade deve ser maior ou igual a 0');
    }

    if (this.preco < 0) {
      errors.push('Preço deve ser maior ou igual a 0');
    }
    
    if (!this.usuario_id) {
      errors.push('ID do usuário é obrigatório');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Converter para JSON
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      marca: this.marca,
      categoria: this.categoria,
      quantidade: this.quantidade,
      preco: this.preco,
      foto: this.foto,
      usuario_id: this.usuario_id,
      descricao: this.descricao,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Converter para inserção no banco
  toDatabase() {
    return {
      nome: this.nome,
      marca: this.marca,
      categoria: this.categoria,
      quantidade: this.quantidade,
      preco: this.preco,
      foto: this.foto,
      usuario_id: this.usuario_id,
      descricao: this.descricao
    };
  }

  // Criar instância a partir dos dados do banco
  static fromDatabase(data) {
    return new Produto({
      id: data.id,
      nome: data.nome,
      marca: data.marca,
      categoria: data.categoria,
      quantidade: data.quantidade,
      preco: data.preco,
      foto: data.foto,
      usuario_id: data.usuario_id,
      descricao: data.descricao,
      created_at: data.created_at,
      updated_at: data.updated_at
    });
  }

  // Verificar se o usuário é o dono do produto
  pertenceAoUsuario(usuarioId) {
    return this.usuario_id === usuarioId;
  }

  // Atualizar informações do produto
  update(data) {
    if (data.nome !== undefined) this.nome = data.nome;
    if (data.marca !== undefined) this.marca = data.marca;
    if (data.categoria !== undefined) this.categoria = data.categoria;
    if (data.quantidade !== undefined) this.quantidade = data.quantidade;
    if (data.preco !== undefined) this.preco = data.preco;
    if (data.foto !== undefined) this.foto = data.foto;
    if (data.descricao !== undefined) this.descricao = data.descricao;
    this.updated_at = new Date().toISOString();
  }

  // Validação estática para dados de entrada
  static validar(data) {
    const errors = [];
    
    if (!data.nome || data.nome.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!data.marca || data.marca.trim().length < 1) {
      errors.push('Marca é obrigatória');
    }
    
    if (!data.categoria || data.categoria.trim().length < 1) {
      errors.push('Categoria é obrigatória');
    }
    
    if (data.quantidade === undefined || data.quantidade < 0) {
      errors.push('Quantidade deve ser maior ou igual a 0');
    }
    
    return errors;
  }
}

module.exports = Produto;