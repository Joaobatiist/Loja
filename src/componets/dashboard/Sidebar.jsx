import React from 'react';

const Sidebar = ({ user, currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen, handleLogout }) => {
  // Debug para verificar se o usuário está sendo passado
  console.log('Sidebar user:', user);
  
  const menuItems = user?.role === 'ADMIN' ? [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'cadastrar-produto', icon: '📦', label: 'Cadastrar Produto' },
    { id: 'gerenciar-produtos', icon: '📋', label: 'Gerenciar Produtos' },
    { id: 'gerenciar-usuarios', icon: '👥', label: 'Gerenciar Usuários' },
    { id: 'sair', icon: '🚪', label: 'Sair', action: handleLogout }
  ] : [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'cadastrar-produto', icon: '📦', label: 'Cadastrar Produto' },
    { id: 'sair', icon: '🚪', label: 'Sair', action: handleLogout }
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
        <h3 className="sidebar-title">LimpaTech</h3>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        {user ? (
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <p className="user-name">{user.nome || 'Usuário'}</p>
              <p className="user-role">{user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</p>
            </div>
          </div>
        ) : (
          <div className="user-info">
            <div className="user-avatar">👤</div>
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