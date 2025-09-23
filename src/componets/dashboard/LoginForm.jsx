import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src="/img/logo.png" alt="LimpaTech Logo" className="login-logo" />
            <h2 className="login-title">LimpaTech Dashboard</h2>
            <p className="login-subtitle">Acesse o sistema de gestão</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Senha</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>
            
            <button type="submit" className="login-button">
              Entrar no Sistema
            </button>
          </form>
          
          <div className="login-footer">
            <p className="demo-info">
              <strong>Demo:</strong> admin@limpatech.com (Admin) | user@limpatech.com (Usuário)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;