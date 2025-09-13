import React, { useState, useMemo } from 'react';
import '../style/loja.css';
import Logo from '../img/logo.png';

// --- MOCK DE PRODUTOS ---
const mockProducts = [
  { id: 1, brand: 'Nike', name: 'Tênis Air Max 90', category: 'Vestuário', image: 'https://via.placeholder.com/300x300.png?text=Air+Max+90', quantity: 1 },
  { id: 2, brand: 'Adidas', name: 'Camiseta Essentials Logo', category: 'Vestuário', image: 'https://via.placeholder.com/300x300.png?text=Camiseta+Adidas', quantity: 1},
  { id: 3, brand: 'Apple', name: 'iPhone 15 Pro', category: 'Eletrônicos', image: 'https://via.placeholder.com/300x300.png?text=iPhone+15', quantity: 1 },
  { id: 4, brand: 'Samsung', name: 'Galaxy Watch 6', category: 'Eletrônicos', image: 'https://via.placeholder.com/300x300.png?text=Galaxy+Watch', quantity: 1},
  { id: 5, brand: 'Sony', name: 'Headphone WH-1000XM5', category: 'Eletrônicos', image: 'https://via.placeholder.com/300x300.png?text=Headphone+Sony',quantity: 1 },
  { id: 6, brand: 'Dell', name: 'Notebook XPS 15', category: 'Eletrônicos', image: 'https://via.placeholder.com/300x300.png?text=Notebook+Dell',quantity: 1 },
  { id: 7, brand: 'Puma', name: 'Moletom com Capuz Essentials', category: 'Vestuário', image: 'https://via.placeholder.com/300x300.png?text=Moletom+Puma',quantity: 1 },
  { id: 8, brand: 'Calvin Klein', name: 'Jaqueta Jeans Clássica', category: 'Vestuário', image: 'https://via.placeholder.com/300x300.png?text=Jaqueta+Jeans',quantity: 1 },
];

function Header({ onToggleCart, cartCount, isMenuOpen, onToggleMenu }) {
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
          <a href="/login" className="login-icon">
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
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2025 SuaLoja. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

function Catalog({ cartItems, onRemoveItem, onUpdateQuantity, isOpen, onClose }) {
  const numeroWhatsApp = "71999222524"; // seu número
  const handleConsultPrice = () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio. Adicione produtos para consultar o preço.");
      return;
    }
    const productList = cartItems.map(item => `- ${item.name} (${item.brand}) - Quantidade: ${item.quantity}`).join('\n');
    const message = encodeURIComponent(
      `Olá! Gostaria do orçamento dos seguintes itens do catálogo:\n\n${productList}`
    );
    const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={`catalog-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <aside className={`catalog-sidebar ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="catalog-header">
          <h2>Carrinho</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        {cartItems.length === 0 ? (
          <p className="catalog-empty">Nenhum item adicionado ainda.</p>
        ) : (
          <>
            <ul className="catalog-list">
              {cartItems.map(item => (
              <li key={item.id} className="catalog-item">
    {/* Novo contêiner para agrupar o nome e os controles */}
    <div className="product-details">
        <span>{item.brand} - {item.name}</span>
        <div className="quantity-controls"> 
            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="quantity-button minus-button" disabled={item.quantity === 1}>-</button>
            <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                className="quantity-input"
            />
            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="quantity-button plus-button">+</button>
        </div>
    </div>
    <button onClick={() => onRemoveItem(item.id)} className="remove-button">×</button>
</li>
              ))}
            </ul>
            <button onClick={handleConsultPrice} className="whatsapp-button">
              Consultar Preços via WhatsApp
            </button>
          </>
        )}
      </aside>
    </div>
  );
}

function ProductCard({ product, onAddToCart, isInCart }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <p className="product-category">{product.category}</p>
      <p className="product-brand">{product.brand}</p>
      <h3 className="product-name">{product.name}</h3>
      <button
        onClick={() => onAddToCart(product)}
        className={`add-to-cart-button ${isInCart ? 'added' : ''}`}
        disabled={isInCart}
      >
        {isInCart ? 'Adicionado ✓' : 'Adicionar ao Catálogo'}
      </button>
    </div>
  );
}

function ProductList({ products, onAddToCart, cartItems }) {
  if (products.length === 0) {
    return <p className="no-products-found">Nenhum produto encontrado com os filtros selecionados.</p>
  }
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          isInCart={cartItems.some(item => item.id === product.id)}
        />
      ))}
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
function Loja() {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para adicionar um item ao carrinho
  const handleAddToCart = (productToAdd) => {
    // Verifica se o item já está no carrinho
    const existingItem = cartItems.find(item => item.id === productToAdd.id);
    if (existingItem) {
      // Se já existe, apenas incrementa a quantidade
      setCartItems(prevItems => 
        prevItems.map(item =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // Se é um novo item, adiciona-o com quantidade 1
      setCartItems(prevItems => [...prevItems, { ...productToAdd, quantity: 1 }]);
    }
  };

  // Função para remover um item do carrinho
  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  // Função para atualizar a quantidade de um item
  const handleUpdateQuantity = (id, newQuantity) => {
    // Garante que a quantidade seja um número válido e no mínimo 1
    const safeQuantity = newQuantity > 0 ? newQuantity : 1; 
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: safeQuantity } : item
      )
    );
  };

  const handleToggleMenu = (state) => {
    if (state !== undefined) {
      setIsMenuOpen(state);
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const categories = useMemo(() => 
    ['Todas', ...new Set(mockProducts.map(p => p.category))],
    []
  );

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="app">
      <Header 
        onToggleCart={() => setIsCartOpen(true)} 
        cartCount={cartItems.length} 
        isMenuOpen={isMenuOpen}
        onToggleMenu={handleToggleMenu}
      />
      <main>
        <section id="produtos" className="section">
          <div className="container">
            <img src={Logo} alt='logo' className='logo-foto'></img>
            <h2 className="section-title">Nossos Produtos</h2>
            
            <div className="filters-bar">
              <input
                type="text"
                placeholder="Pesquisar por nome ou marca..."
                className="search-input"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <ProductList
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
            />
          </div>
        </section>

        {/* Sidebar do catálogo */}
        <Catalog
          cartItems={cartItems}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity} // ✅ AQUI ESTÁ A CORREÇÃO!
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />

        <section id="sobre" className="section section-light">
          <div className="container">
            <h2 className="section-title">Sobre Nossa Loja</h2>
            <p className="section-content">
              Bem-vindo à SuaLoja, o seu destino para produtos incríveis e de alta qualidade. Nossa missão é oferecer uma curadoria especial de itens que combinam estilo, inovação e funcionalidade. Navegue pelo nosso catálogo e entre em contato para um atendimento personalizado.
            </p>
          </div>
        </section>
        
        <section id="contato" className="section">
          <div className="container">
            <h2 className="section-title">Entre em Contato</h2>
            <p className="section-content">
              Tem alguma dúvida ou quer fazer um pedido especial? Fale conosco! A melhor forma de nos contatar é através do WhatsApp, clicando em "Consultar Preços" no seu catálogo. Ou, se preferir, envie um email para: <strong>contato@sualoja.com</strong>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Loja;