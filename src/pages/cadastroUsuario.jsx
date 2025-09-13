import React, { useState } from 'react';
import '../style/cadastro.css';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [role, setRole] = useState('USER');

  const handleTelefoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (input.length > 0) {
      formatted += `(${input.substring(0, 2)}`;
    }
    if (input.length > 2) {
      formatted += `) ${input.substring(2, 7)}`;
    }
    if (input.length > 7) {
      formatted += `-${input.substring(7, 11)}`;
    }
    setTelefone(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar os dados de cadastro
    console.log('Dados do formulário:', { nome, email, senha, telefone, role });
    alert('Cadastro realizado com sucesso!');
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h2 className="cadastro-title">Crie sua conta</h2>
        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              value={telefone}
              onChange={handleTelefoneChange}
              maxLength="15"
              placeholder="(00) 00000-0000"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Tipo de Usuário</label>
            <div className="role-options">
              <label>
                <input
                  type="radio"
                  value="USER"
                  checked={role === 'USER'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="radio-label">Usuário</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="ADMIN"
                  checked={role === 'ADMIN'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="radio-label">Admin</span>
              </label>
            </div>
          </div>
          <button type="submit" className="cadastro-button">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;