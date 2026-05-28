import { useCallback, useEffect, useMemo, useState } from 'react';
import { produtoService } from '../service/produtoService.js';

const PRODUCTS_PER_PAGE = 15;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300.png?text=Sem+Foto';

const formatarProdutos = (produtos) => {
  return produtos.map((produto) => ({
    id: produto.id,
    brand: produto.marca,
    name: produto.nome,
    category: produto.categoria,
    image: produto.foto || PLACEHOLDER_IMAGE
  }));
};

export const useLojaController = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const data = await produtoService.listarProdutos();

        if (data && Array.isArray(data)) {
          setProdutos(formatarProdutos(data));
        } else {
          setProdutos([]);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos do Supabase:', error);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  const handleAddToCart = useCallback((productToAdd) => {
    const existingItem = cartItems.find((item) => item.id === productToAdd.id);

    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      return;
    }

    setCartItems((prevItems) => [...prevItems, { ...productToAdd, quantity: 1 }]);
  }, [cartItems]);

  const handleRemoveItem = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const handleUpdateQuantity = useCallback((id, newQuantity) => {
    const safeQuantity = newQuantity > 0 ? newQuantity : 1;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: safeQuantity } : item
      )
    );
  }, []);

  const handleToggleMenu = useCallback((state) => {
    if (state !== undefined) {
      setIsMenuOpen(state);
      return;
    }

    setIsMenuOpen((current) => !current);
  }, []);

  const categories = useMemo(
    () => ['Todas', ...new Set(produtos.map((produto) => produto.category))],
    [produtos]
  );

  const filteredProducts = useMemo(() => {
    return produtos.filter((product) => {
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, produtos]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);

    if (typeof window !== 'undefined') {
      const element = document.getElementById('produtos');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return {
    cartItems,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isCartOpen,
    setIsCartOpen,
    isMenuOpen,
    setIsMenuOpen,
    produtos,
    loading,
    currentPage,
    setCurrentPage,
    productsPerPage: PRODUCTS_PER_PAGE,
    categories,
    filteredProducts,
    currentProducts,
    totalPages,
    handleAddToCart,
    handleRemoveItem,
    handleUpdateQuantity,
    handleToggleMenu,
    handlePageChange
  };
};