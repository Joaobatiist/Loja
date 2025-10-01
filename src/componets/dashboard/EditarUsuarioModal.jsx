import React, { useState, useEffect } from 'react';

const EditarUsuarioModal = ({ usuario, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    role: 'USER'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Preencher formulário com dados do usuário
  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome || '',
        email: usuario.email || '',
        role: usuario.role || 'USER'
      });
    }
  }, [usuario]);

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!['USER', 'ADMIN'].includes(formData.role)) {
      newErrors.role = 'Role inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Importar apiService dinamicamente para evitar problemas de circular import
      const { default: apiService } = await import('../../utils/apiService');
      
      await apiService.atualizarUsuario(usuario.id, formData);
      
      // Chamar callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar usuário';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Mudança nos inputs
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content editar-usuario-modal">
        <div className="modal-header">
          <h3>✏️ Editar Usuário</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="editar-usuario-form">
          {/* Nome */}
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Digite o nome completo"
              disabled={isLoading}
              className={errors.nome ? 'input-error' : ''}
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Digite o e-mail"
              disabled={isLoading}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">Nível de Acesso</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              disabled={isLoading}
              className={errors.role ? 'input-error' : ''}
            >
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          {/* Erro geral */}
          {errors.submit && (
            <div className="error-message error-submit">
              {errors.submit}
            </div>
          )}

          {/* Botões */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Salvando...' : '💾 Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuarioModal;