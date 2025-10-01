import React, { useState, useMemo, useEffect } from 'react';
import '../style/loja.css';
import apiService from '../utils/apiService';
import LojasParceiras from '../componets/lojasParceiras/index.jsx';

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
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy;  Limpa Tech. CNPJ:02.926.607.0001-22 Todos os direitos reservados. 2025</p>
      </div>
    </footer>
  );
}

function Catalog({ cartItems, onRemoveItem, onUpdateQuantity, isOpen, onClose }) {
  const numeroWhatsApp = "7599801234"; // seu número
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
        {isInCart ? 'Adicionado ✓' : 'Adicionar ao Carrinho'}
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
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos da API
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await apiService.listarProdutosPublicos();
        
        if (response.success) {
          // Converter formato do backend para formato esperado pelo frontend
          const produtosFormatados = response.data.map(produto => ({
            id: produto.id,
            brand: produto.marca,
            name: produto.nome,
            category: produto.categoria,
            image: produto.foto || 'https://via.placeholder.com/300x300.png?text=Sem+Foto',
            quantity: 1 // quantidade inicial para o carrinho
          }));
          
          setProdutos(produtosFormatados);
        } else {
          setProdutos([]);
        }
      } catch (error) {
        setProdutos([]); // Array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

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
    ['Todas', ...new Set(produtos.map(p => p.category))],
    [produtos]
  );

  const filteredProducts = useMemo(() => {
    return produtos.filter(product => {
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, produtos]);

  return (
    <div className="app loja-container">
      <Header 
        onToggleCart={() => setIsCartOpen(true)} 
        cartCount={cartItems.length} 
        isMenuOpen={isMenuOpen}
        onToggleMenu={handleToggleMenu}
      />
      <main>
        <section id="produtos" className="section">
          <div className="container">
            <img src="/img/logo.png" alt='logo' className='logo-foto'></img>
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

            {loading ? (
              <div className="loading-state">
                <p>Carregando produtos...</p>
              </div>
            ) : (
              <ProductList
                products={filteredProducts}
                onAddToCart={handleAddToCart}
                cartItems={cartItems}
              />
            )}
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
    <div className="content-card">
      <h2 className="section-title">Sobre nós</h2>
      <div className="sobre-container">
        
        {/* Coluna da Imagem */}
        <div className="sobre-imagem">
          {/* Você pode usar uma foto ou até mesmo sua logo aqui */}
          <img src="/img/logo.png" alt="Logo Limpa Tech" /> 
        </div>

        {/* Coluna do Texto */}
        <div className="sobre-texto">
          <div className="section-content">
            <p>
              A Limpa Tech nasceu para facilitar o seu dia a dia com soluções completas em limpeza e bem-estar. Trabalhamos com produtos de limpeza geral, hospitalar e para piscinas, sempre prezando pela qualidade e confiança que seu ambiente merece.
            </p>
            <p>
              Temos também uma parceria exclusiva com a <strong>Capim Cheiroso</strong>, trazendo aromatizadores de ambiente que transformam qualquer espaço em um lugar mais agradável. E se você busca uma experiência ainda mais marcante, oferecemos <strong>marketing olfativo</strong>: alugamos a máquina e fornecemos as essências para que seu empreendimento tenha sempre o aroma perfeito, liberado em intervalos de tempo pré-definidos.
            </p>
            <p>
              Na Limpa Tech, você encontra muito mais que produtos: encontra praticidade, cuidado e o toque especial que deixa cada ambiente único.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<LojasParceiras />
            
        <section id="contato" className="section">
  <div className="container">
    <div className="content-card"> {/* Opcional: use o card de vidro que criamos antes para um visual consistente */}
      <h2 className="section-title">Entre em Contato</h2>
      <p className="section-content" style={{ marginBottom: '40px' }}>
        Tem alguma dúvida ou quer fazer um pedido especial? Fale conosco! Estamos sempre prontos para ajudar. Escolha um dos canais abaixo:
      </p>

      {/* Container para os contatos principais */}
      <div className="contact-info">
        {/* Lembre-se de trocar SEUNUMERO pelo seu número de telefone/WhatsApp */}
        <a href="https://wa.me/557599801234" target="_blank" rel="noopener noreferrer" className="contact-item">
          <i className="fa-brands fa-whatsapp"></i>
          <span>(75) 99801234</span>
        </a>
        <a href="tel:+5571999222524" className="contact-item">
          <i className="fa-solid fa-phone"></i>
          <span>Ligue para nós</span>
        </a>
        {/* Lembre-se de trocar para o seu email */}
        <a href="mailto:limpatechmaterialdelimpeza@gmail.com" className="contact-item">
          <i className="fa-solid fa-envelope"></i>
          <span>Email</span>
        </a>
      </div>

      {/* Container para as redes sociais */}
      <div className="social-media">
        <h3>Siga-nos nas Redes Sociais</h3>
        <div className="social-icons">
          {/* Lembre-se de trocar o '#' pelo link do seu perfil */}
          <a href="https://www.instagram.com/limpatechlimpeza/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          
        </div>
      </div>

    </div>
  </div>
</section>
      </main>
      <Footer />
    </div>
  );
}

export default Loja;