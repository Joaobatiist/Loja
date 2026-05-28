import React from 'react';

const DashboardContent = ({ produtos, usuarios, user, onCadastrarFuncionario }) => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h2>Bem-vindo ao LimpaTech Dashboard</h2>
        <p>Sistema de gestão de produtos e usuários</p>
        
        {/* Botão para cadastrar funcionário - apenas para admins */}
        {user?.role === 'ADMIN' && (
          <div className="admin-actions">
            <button 
              className="btn-cadastrar-funcionario"
              onClick={onCadastrarFuncionario}
            >
              <span className="btn-icon">
                <i className="fas fa-user-plus"></i>
              </span>
              Cadastrar Funcionário
            </button>
          </div>
        )}
      </div>
      
      <div className="dashboard-stats">
        {/* Card de Produtos */}
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="stat-info">
            <h3>{produtos.length}</h3>
            <p>Produtos Cadastrados</p>
          </div>
        </div>
        
        {/* Card de Usuários - apenas para admins */}
        {user?.role === 'ADMIN' && (
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>{usuarios.length}</h3>
              <p>Usuários no Sistema</p>
            </div>
          </div>
        )}
        
        {/* Card de Nível de Acesso */}
        <div className="stat-card">
          <div className="stat-icon">
            {user?.role === 'ADMIN' ? (
              <i className="fas fa-user-shield"></i>
            ) : (
              <i className="fas fa-user-lock"></i>
            )}
          </div>
          <div className="stat-info">
            <h3>{user?.role === 'ADMIN' ? 'Admin' : 'User'}</h3>
            <p>Nível de Acesso</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;