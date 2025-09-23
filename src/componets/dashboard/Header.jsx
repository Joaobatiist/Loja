import React from 'react';

const Header = ({ currentPage, isSidebarOpen, setIsSidebarOpen, user }) => {
  const getPageTitle = () => {
    switch(currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'cadastrar-produto': return 'Cadastrar Produto';
      case 'gerenciar-produtos': return 'Gerenciar Produtos';
      case 'gerenciar-usuarios': return 'Gerenciar Usuários';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="dashboard-header">
      <button 
        className="menu-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>
      <h1 className="page-title">
        {getPageTitle()}
      </h1>
      <div className="header-actions">
        <span className="welcome-text">Olá, {user?.nome}!</span>
      </div>
    </header>
  );
};

export default Header;