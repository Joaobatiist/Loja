import { useState, useEffect, useCallback } from 'react';
import { produtoService } from '../service/produtoService.js';
import { usuarioService } from '../service/usuarioService.js';
import { supabase } from '../lib/supabase.js';
import { processarFotoProduto } from '../utils/processarFotoProduto.js';

const NOVO_PRODUTO_INICIAL = {
  nome: '',
  marca: '',
  categoria: '',
  quantidade: 1,
  foto: null
};

export const useDashboardController = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showCadastroFuncionario, setShowCadastroFuncionario] = useState(false);
  const [novoProduto, setNovoProduto] = useState(NOVO_PRODUTO_INICIAL);

  const carregarUsuarios = useCallback(async () => {
    if (!user || user.role !== 'ADMIN') return;

    try {
      const data = await usuarioService.listarUsuarios();
      if (data) {
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  }, [user]);

  const carregarProdutos = useCallback(async () => {
    if (!user) return;

    try {
      const data = await produtoService.listarProdutos();
      if (data) {
        setProdutos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProdutos([]);
    }
  }, [user]);

  useEffect(() => {
    const sincronizarSessao = async (authUserId) => {
      const perfilCompleto = await usuarioService.obterPerfilAtual(authUserId);

      if (perfilCompleto) {
        setUser(perfilCompleto);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        sincronizarSessao(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        sincronizarSessao(session.user.id);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      carregarUsuarios();
    }
  }, [user, carregarUsuarios]);

  useEffect(() => {
    if (user) {
      carregarProdutos();
    }
  }, [user, carregarProdutos]);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogin = useCallback(async (email, senha) => {
    try {
      const response = await usuarioService.login(email, senha);

      if (response.success) {
        const authUser = response.data.usuario;

        const dadosUsuario = {
          id: authUser.id,
          email: authUser.email,
          role: authUser.user_metadata?.role || 'user',
          nome: authUser.user_metadata?.nome || ''
        };

        setUser(dadosUsuario);
        setIsLoggedIn(true);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet ou o status do Supabase.');
      }

      throw new Error(error.message || 'Erro inesperado no login.');
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    setIsSidebarOpen(false);
  }, []);

  const handleCadastrarProduto = useCallback(async (e) => {
    e.preventDefault();

    if (!novoProduto.nome || !novoProduto.marca || !novoProduto.categoria || !novoProduto.quantidade) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const dadosProduto = {
        nome: novoProduto.nome.trim(),
        marca: novoProduto.marca.trim(),
        categoria: novoProduto.categoria,
        quantidade: Number(novoProduto.quantidade),
        usuario_id: user.id
      };

      if (novoProduto.foto && typeof novoProduto.foto === 'object') {
        dadosProduto.foto = await processarFotoProduto(novoProduto.foto);
      }

      const response = await produtoService.criarProduto(dadosProduto);

      if (response) {
        setNovoProduto(NOVO_PRODUTO_INICIAL);

        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }

        await carregarProdutos();
        alert('Produto cadastrado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro ao cadastrar produto: ' + (error.message || 'Erro desconhecido'));
    }
  }, [novoProduto, carregarProdutos, user]);

  const handleDeleteUsuario = useCallback(async (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    const nomeUsuario = usuario ? usuario.nome : 'usuário';

    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o usuário "${nomeUsuario}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (confirmDelete) {
      try {
        await usuarioService.deletar(id);
        await carregarUsuarios();
        alert(`Usuário "${nomeUsuario}" excluído com sucesso!`);
      } catch (error) {
        alert(`Erro ao excluir usuário: ${error.message}`);
      }
    }
  }, [carregarUsuarios, usuarios]);

  const handleDeleteProduto = useCallback(async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await produtoService.deletar(id);
        await carregarProdutos();
        alert('Produto excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir produto. Tente novamente.');
      }
    }
  }, [carregarProdutos]);

  return {
    user,
    currentPage,
    setCurrentPage,
    isSidebarOpen,
    setIsSidebarOpen,
    isLoggedIn,
    isMobile,
    produtos,
    usuarios,
    showCadastroFuncionario,
    setShowCadastroFuncionario,
    novoProduto,
    setNovoProduto,
    handleLogin,
    handleLogout,
    handleCadastrarProduto,
    handleDeleteUsuario,
    handleDeleteProduto,
    carregarUsuarios,
    carregarProdutos
  };
};