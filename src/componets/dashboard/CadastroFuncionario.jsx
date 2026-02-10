import React, { useState } from 'react';
import apiService from '../../utils/apiService';

const CadastroFuncionario = ({ onClose, onSuccess }) => {
  // Simular dados do usuário logado (em produção viria do AuthContext)
  const user = JSON.parse(localStorage.getItem('limpatech_user') || '{}');
  
  const [funcionario, setFuncionario] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: 'USER' // Padrão como USER
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verificar se o usuário é admin
  const isAdmin = user?.role === 'ADMIN';

  // Se não for admin, mostrar mensagem de acesso negado
  if (!isAdmin) {
    return (
      <div className="funcionario-modal">
        <div className="funcionario-content">
          <div className="access-denied">
            <h3>🚫 Acesso Negado</h3>
            <p>Apenas administradores podem cadastrar funcionários.</p>
            <p>Seu nível atual: <strong>{user?.role || 'Não definido'}</strong></p>
            <button onClick={onClose} className="close-btn-access">
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Validação
  const validateForm = () => {
    const newErrors = {};

    if (!funcionario.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!funcionario.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(funcionario.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!funcionario.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (funcionario.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (funcionario.senha !== funcionario.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Pegar token do localStorage
      const token = localStorage.getItem('limpatech_token');
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
      }
      
      // Usar apiService que já tem o token e URL corretos
      await apiService.cadastrarFuncionario({
        nome: funcionario.nome,
        email: funcionario.email,
        senha: funcionario.senha,
        role: funcionario.role
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(); // Chama callback para recarregar usuários e fechar modal
        } else {
          onClose(); // Fallback caso onSuccess não seja fornecido
        }
      }, 2000);
      
    } catch (error) {
      const errorMessage = error.message || 'Erro ao cadastrar funcionário';
      setErrors({ submit: errorMessage });
      
      // Se for erro de autorização, mostrar mensagem específica
      if (error.response?.status === 403) {
        setErrors({ submit: 'Acesso negado: Apenas administradores podem cadastrar funcionários' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mudança nos inputs
  const handleChange = (field, value) => {
    setFuncionario(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Se o cadastro foi bem-sucedido
  if (success) {
    return (
      <div className="funcionario-modal">
        <div className="funcionario-content">
          <div className="success-message">
            <h3>✅ Funcionário cadastrado com sucesso!</h3>
            <p>O novo funcionário foi adicionado ao sistema.</p>
            <p>Redirecionando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="funcionario-modal">
      <div className="funcionario-content">
        <div className="funcionario-header">
          <h2>📝 Cadastrar Funcionário</h2>
          <span className="admin-badge">👨‍💼 Admin: {user?.nome}</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {errors.submit && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="funcionario-form">
          <div className="input-group">
            <label htmlFor="nome">
              <span className="label-icon">👤</span>
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={funcionario.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
              placeholder="Digite o nome completo do funcionário"
              className={errors.nome ? 'error' : ''}
            />
            {errors.nome && <span className="error-text">{errors.nome}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="email">
              <span className="label-icon">📧</span>
              Email Corporativo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={funcionario.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              placeholder="funcionario@empresa.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="senha">
              <span className="label-icon">🔒</span>
              Senha Inicial
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={funcionario.senha}
              onChange={(e) => handleChange('senha', e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
              className={errors.senha ? 'error' : ''}
            />
            <small className="helper-text">
              O funcionário poderá alterar esta senha no primeiro login
            </small>
            {errors.senha && <span className="error-text">{errors.senha}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="confirmarSenha">
              <span className="label-icon">🔐</span>
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={funcionario.confirmarSenha}
              onChange={(e) => handleChange('confirmarSenha', e.target.value)}
              required
              placeholder="Confirme a senha"
              className={errors.confirmarSenha ? 'error' : ''}
            />
            {errors.confirmarSenha && <span className="error-text">{errors.confirmarSenha}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="role">
              <span className="label-icon">👨‍💼</span>
              Cargo/Função
            </label>
            <select
              id="role"
              name="role"
              value={funcionario.role}
              onChange={(e) => handleChange('role', e.target.value)}
              required
              className="role-select"
            >
              <option value="USER">👤 Funcionário (USER)</option>
              <option value="ADMIN">👑 Administrador (ADMIN)</option>
            </select>
            <small className="helper-text">
              • <strong>Funcionário:</strong> Pode visualizar produtos e dados básicos<br/>
              • <strong>Administrador:</strong> Pode cadastrar funcionários e gerenciar tudo
            </small>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="cancel-btn" disabled={isLoading}>
              <span className="btn-icon">❌</span>
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="submit-btn">
              <span className="btn-icon">
                {isLoading ? '⏳' : '✅'}
              </span>
              {isLoading ? 'Cadastrando...' : 'Cadastrar Funcionário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroFuncionario;