const { UserRole } = require('../utils/userRoles');

class Usuario {
    constructor(data = {}) {
        this.id = data.id || null;
        this.nome = data.nome || '';
        this.email = data.email || '';
        this.senha = data.senha || '';
        this.role = data.role || UserRole.USER;
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
    }

    // Validar dados do usuário
    validate() {
        const errors = [];

        // Validar nome
        if (!this.nome || this.nome.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            errors.push('Email inválido');
        }

        // Validar senha
        if (!this.senha || this.senha.length < 6) {
            errors.push('Senha deve ter pelo menos 6 caracteres');
        }

        // Validar role
        if (!Object.values(UserRole).includes(this.role)) {
            errors.push('Role inválida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Converter para objeto simples (sem senha para respostas)
    toJSON(includePassword = false) {
        const obj = {
            id: this.id,
            nome: this.nome,
            email: this.email,
            role: this.role,
            created_at: this.created_at,
            updated_at: this.updated_at
        };

        if (includePassword) {
            obj.senha = this.senha;
        }

        return obj;
    }

    // Converter para inserção no banco
    toDatabase() {
        return {
            nome: this.nome,
            email: this.email,
            senha: this.senha,
            role: this.role
        };
    }

    // Criar instância a partir dos dados do banco
    static fromDatabase(data) {
        return new Usuario({
            id: data.id,
            nome: data.nome,
            email: data.email,
            senha: data.senha,
            role: data.role,
            created_at: data.created_at,
            updated_at: data.updated_at
        });
    }

    // Verificar se é admin
    isAdmin() {
        return this.role === UserRole.ADMIN;
    }

    // Verificar se pode criar outros usuários
    canCreateUsers() {
        return this.role === UserRole.ADMIN;
    }

    // Verificar se pode gerenciar produtos
    canManageProducts() {
        return this.role === UserRole.ADMIN || this.role === UserRole.USER;
    }

    // Atualizar dados
    update(data) {
        if (data.nome !== undefined) this.nome = data.nome;
        if (data.email !== undefined) this.email = data.email;
        if (data.senha !== undefined) this.senha = data.senha;
        if (data.role !== undefined) this.role = data.role;
        this.updated_at = new Date().toISOString();
    }

    // Método estático para validar dados sem criar instância
    static validar(dadosUsuario) {
        const errors = [];

        // Validar nome
        if (!dadosUsuario.nome || dadosUsuario.nome.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!dadosUsuario.email || !emailRegex.test(dadosUsuario.email)) {
            errors.push('Email inválido');
        }

        // Validar senha
        if (!dadosUsuario.senha || dadosUsuario.senha.length < 6) {
            errors.push('Senha deve ter pelo menos 6 caracteres');
        }

        // Validar role (opcional, padrão USER)
        if (dadosUsuario.role && !Object.values(UserRole).includes(dadosUsuario.role)) {
            errors.push('Role inválida');
        }

        return errors; // Retorna array de erros (vazio se válido)
    }
}

module.exports = Usuario;
