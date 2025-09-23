import React, { useState, useEffect, useCallback } from 'react';
import '../style/dashboard.css';

// Importação dos componentes organizados
import {
  LoginForm,
  Sidebar,
  Header,
  DashboardContent,
  GerenciarProdutos,
  GerenciarUsuarios
} from '../componets/dashboard';
import CadastroForm from '../componets/dashboard/CadastroForm'; // importa o form otimizado

// Simulação de dados de usuários
const mockUsuarios = [
  { id: 1, nome: 'Admin Principal', email: 'admin@limpatech.com', role: 'ADMIN' },
  { id: 2, nome: 'João Silva', email: 'joao@limpatech.com', role: 'USER' },
  { id: 3, nome: 'Maria Santos', email: 'maria@limpatech.com', role: 'USER' }
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Estados para formulários e dados
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    marca: '',
    categoria: '',
    quantidade: 1,
    foto: null
  });

  useEffect(() => {
    const userData = localStorage.getItem('limpatech_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setUsuarios(mockUsuarios);
    }

    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogin = useCallback((email, password) => {
    let userData = null;
    if (email === 'admin@limpatech.com' && password === 'admin123') {
      userData = { id: 1, nome: 'Admin Principal', email, role: 'ADMIN' };
    } else if (email === 'user@limpatech.com' && password === 'user123') {
      userData = { id: 2, nome: 'Usuário Teste', email, role: 'USER' };
    } else {
      alert('Email ou senha incorretos!');
      return;
    }
    localStorage.setItem('limpatech_user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    setUsuarios(mockUsuarios);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('limpatech_user');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    setIsSidebarOpen(false);
  }, []);

  const handleCadastrarProduto = useCallback((e) => {
    e.preventDefault();
    if (!novoProduto.nome || !novoProduto.marca || !novoProduto.categoria || !novoProduto.quantidade) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const produto = {
      id: Date.now(),
      ...novoProduto,
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };

    setProdutos(prev => [...prev, produto]);
    setNovoProduto({ nome: '', marca: '', categoria: '', quantidade: 1, foto: null });
    alert('Produto cadastrado com sucesso!');
  }, [novoProduto]);

  const handleDeleteUsuario = useCallback((id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  }, [usuarios]);

  const handleDeleteProduto = useCallback((id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(p => p.id !== id));
    }
  }, [produtos]);

  if (!isLoggedIn) return <LoginForm onLogin={handleLogin} />;

  return (
    <div className="dashboard dashboard-app">
      <Sidebar
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />
      <div className={`dashboard-main ${!isSidebarOpen ? 'expanded' : ''}`}>
        <Header
          currentPage={currentPage}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          user={user}
        />
        <main className="main-content">
          {currentPage === 'dashboard' && (
            <DashboardContent
              produtos={produtos}
              usuarios={usuarios}
              user={user}
            />
          )}
          {currentPage === 'cadastrar-produto' && (
            <CadastroForm
              novoProduto={novoProduto}
              setNovoProduto={setNovoProduto}
              onSubmit={handleCadastrarProduto}
            />
          )}
          {currentPage === 'gerenciar-produtos' && (
            <GerenciarProdutos
              produtos={produtos}
              onDeleteProduto={handleDeleteProduto}
            />
          )}
          {currentPage === 'gerenciar-usuarios' && user?.role === 'ADMIN' && (
            <GerenciarUsuarios
              usuarios={usuarios}
              onDeleteUsuario={handleDeleteUsuario}
            />
          )}
          {currentPage === 'gerenciar-usuarios' && user?.role !== 'ADMIN' && (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              background: 'white',
              borderRadius: '12px',
              maxWidth: '100px',
              margin: '0 auto'
            }}>
              <h3>Acesso Negado</h3>
              <p>Apenas administradores podem gerenciar usuários.</p>
              <p><strong>Seu nível:</strong> {user?.role || 'Não definido'}</p>
            </div>
          )}
        </main>
      </div>
      {isSidebarOpen && isMobile && (
        <div
          className="sidebar-overlay show"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
