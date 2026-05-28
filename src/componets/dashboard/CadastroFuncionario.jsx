import React, { useState } from 'react';
import { usuarioService } from '../../service/usuarioService';

const CadastroFuncionario = ({ onClose, onSuccess, user }) => {
  
  const [funcionario, setFuncionario] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: 'USER'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  // Se não for admin, mostrar mensagem de acesso negado
  if (!isAdmin) {
    return (
      <div className="funcionario-modal">
        <div className="funcionario-content">
          <div className="access-denied">
            <h3><i className="fas fa-ban token-icon-danger"></i> Acesso Negado</h3>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const resultado = await usuarioService.criarUsuario({
        nome: funcionario.nome,
        email: funcionario.email,
        senha: funcionario.senha,
        role: funcionario.role
      });

      if (resultado.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            onClose();
          }
        }, 2000);
      }
      
    } catch (error) {
      const errorMessage = error.message || 'Erro ao cadastrar funcionário';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFuncionario(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (success) {
    return (
      <div className="funcionario-modal">
        <div className="funcionario-content">
          <div className="success-message">
            <h3><i className="fas fa-check-circle token-icon-success"></i> Funcionário cadastrado com sucesso!</h3>
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
          <h2><i className="fas fa-user-plus"></i> Cadastrar Funcionário</h2>
          <span className="admin-badge"><i className="fas fa-user-shield"></i> Admin: {user?.nome}</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {errors.submit && (
          <div className="error-message">
            <span className="error-icon"><i className="fas fa-exclamation-triangle"></i></span>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="funcionario-form">
          <div className="input-group">
            <label htmlFor="nome">
              <span className="label-icon"><i className="fas fa-user"></i></span>
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
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
              <span className="label-icon"><i className="fas fa-envelope"></i></span>
              Email Corporativo
            </label>
            <input
              type="email"
              id="email"
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
              <span className="label-icon"><i className="fas fa-lock"></i></span>
              Senha Inicial
            </label>
            <input
              type="password"
              id="senha"
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
              <span className="label-icon"><i className="fas fa-key"></i></span>
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
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
              <span className="label-icon"><i className="fas fa-briefcase"></i></span>
              Cargo/Função
            </label>
            <select
              id="role"
              value={funcionario.role}
              onChange={(e) => handleChange('role', e.target.value)}
              required
              className="role-select"
            >
              <option value="USER">Funcionário (USER)</option>
              <option value="ADMIN">Administrador (ADMIN)</option>
            </select>
            <small className="helper-text">
              • <strong>Funcionário:</strong> Pode visualizar produtos e dados básicos<br/>
              • <strong>Administrador:</strong> Pode cadastrar funcionários e gerenciar tudo
            </small>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="cancel-btn" disabled={isLoading}>
              <span className="btn-icon"><i className="fas fa-times"></i></span>
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="submit-btn">
              <span className="btn-icon">
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-save"></i>
                )}
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