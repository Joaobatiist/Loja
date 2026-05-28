import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onAddToCart, cartItems }) => {
  if (products.length === 0) {
    return <p className="no-products-found">Nenhum produto encontrado com os filtros selecionados.</p>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          isInCart={cartItems.some((item) => item.id === product.id)}
        />
      ))}
    </div>
  );
};

export default ProductList;