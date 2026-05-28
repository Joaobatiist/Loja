import React from 'react';

const ProductCard = ({ product, onAddToCart, isInCart }) => {
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
};

export default ProductCard;