import React from 'react';

const Sidebar = ({ user, currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen, handleLogout }) => {
  // Substituídos os emojis por classes de ícones do Font Awesome nas listas de navegação
  const menuItems = user?.role === 'ADMIN' ? [
    { id: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { id: 'cadastrar-produto', icon: 'fas fa-box-open', label: 'Cadastrar Produto' },
    { id: 'gerenciar-produtos', icon: 'fas fa-list-alt', label: 'Gerenciar Produtos' },
    { id: 'gerenciar-usuarios', icon: 'fas fa-users', label: 'Gerenciar Usuários' },
    { id: 'voltar-para-loja', icon: 'fas fa-shopping-cart', label: 'Voltar para Loja', action: () => { window.location.href = '/' } },
    { id: 'sair', icon: 'fas fa-sign-out-alt', label: 'Sair', action: handleLogout }
  ] : [
    { id: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { id: 'cadastrar-produto', icon: 'fas fa-box-open', label: 'Cadastrar Produto' },
    { id: 'gerenciar-produtos', icon: 'fas fa-list-alt', label: 'Gerenciar Produtos' },
    { id: 'voltar-para-loja', icon: 'fas fa-shopping-cart', label: 'Voltar para Loja', action: () => { window.location.href = '/' } },
    { id: 'sair', icon: 'fas fa-sign-out-alt', label: 'Sair', action: handleLogout }
  ];

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      setCurrentPage(item.id);
      // Fechar sidebar em mobile após clique
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    }
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <img src="/img/logo.png" alt="LimpaTech" className="sidebar-logo" />
        <div>
          <h3 className="sidebar-title">LimpaTech</h3>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <span className="sidebar-icon">
              <i className={item.icon}></i>
            </span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        {user ? (
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="user-details">
              <p className="user-name">{user.nome || 'Usuário'}</p>
              <p className="user-role">{user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</p>
            </div>
          </div>
        ) : (
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <div className="user-details">
              <p className="user-name">Carregando...</p>
              <p className="user-role">-</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;