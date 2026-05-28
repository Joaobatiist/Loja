import React from 'react';
import '../style/loja.css';
import LojasParceiras from '../componets/lojasParceiras/index.jsx';
import { useLojaController } from '../hooks/useLoja.js';
import { Header, Footer, Catalog, ProductList } from '../componets/loja';

// --- COMPONENTE PRINCIPAL ---
function Loja() {
  const {
    cartItems,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isCartOpen,
    setIsCartOpen,
    isMenuOpen,
    loading,
    currentPage,
    productsPerPage,
    categories,
    filteredProducts,
    currentProducts,
    totalPages,
    handleAddToCart,
    handleRemoveItem,
    handleUpdateQuantity,
    handleToggleMenu,
    handlePageChange
  } = useLojaController();

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
              <>
                <ProductList
                  products={currentProducts}
                  onAddToCart={handleAddToCart}
                  cartItems={cartItems}
                />
                
                {/* Controles de Paginação */}
                {filteredProducts.length > productsPerPage && (
                  <div className="pagination">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      ← Anterior
                    </button>
                    
                    <div className="pagination-info">
                      <span>Página {currentPage} de {totalPages}</span>
                      <span className="products-count">
                        ({filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Próximo →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Sidebar do catálogo */}
        <Catalog
          cartItems={cartItems}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
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