import React from 'react';

const Catalog = ({ cartItems, onRemoveItem, onUpdateQuantity, isOpen, onClose }) => {
  const numeroWhatsApp = '7599801234';

  const handleConsultPrice = () => {
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio. Adicione produtos para consultar o preço.');
      return;
    }

    const productList = cartItems
      .map((item) => `- ${item.name} (${item.brand}) - Quantidade: ${item.quantity}`)
      .join('\n');
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
              {cartItems.map((item) => (
                <li key={item.id} className="catalog-item">
                  <div className="product-details">
                    <span>{item.brand} - {item.name}</span>
                    <div className="quantity-controls">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="quantity-button minus-button"
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                        className="quantity-input"
                      />
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="quantity-button plus-button"
                      >
                        +
                      </button>
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
};

export default Catalog;