import React from 'react';

const Header = ({ onToggleCart, cartCount, isMenuOpen, onToggleMenu }) => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">Limpa Tech</h1>
        <div className="header-right">
          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <a href="#produtos" onClick={() => onToggleMenu(false)}>Produtos</a>
            <a href="#sobre" onClick={() => onToggleMenu(false)}>Sobre Nós</a>
            <a href="#contato" onClick={() => onToggleMenu(false)}>Contato</a>
          </nav>
          <a href="/dashboard" className="login-icon">
            <i className="fa-solid fa-user"></i>
          </a>
          <button className="cart-icon" onClick={onToggleCart}>
            <i className="fa-solid fa-cart-shopping"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
        <button className="menu-toggle" onClick={() => onToggleMenu(!isMenuOpen)}>
          {isMenuOpen ? '×' : '☰'}
        </button>
      </div>
    </header>
  );
};

export default Header;