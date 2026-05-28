import React from 'react';
import '../style/dashboard.css';
import { useDashboardController } from '../hooks/useDashboard';

// Importação dos componentes organizados
import {
  LoginForm,
  Sidebar,
  Header,
  DashboardContent,
  GerenciarProdutos,
  GerenciarUsuarios
} from '../componets/dashboard';
import CadastroForm from '../componets/dashboard/CadastroForm'; 
import CadastroFuncionario from '../componets/dashboard/CadastroFuncionario';

const Dashboard = () => {
  const {
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
  } = useDashboardController();

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
              onCadastrarFuncionario={() => setShowCadastroFuncionario(true)}
            />
          )}
          {currentPage === 'cadastrar-produto' && (
            <div style={{ isolation: 'isolate' }}>
              <CadastroForm
                novoProduto={novoProduto}
                setNovoProduto={setNovoProduto}
                onSubmit={handleCadastrarProduto}
              />
            </div>
          )}
          {currentPage === 'gerenciar-produtos' && (
            <GerenciarProdutos
              produtos={produtos}
              onDeleteProduto={handleDeleteProduto}
              onProdutoUpdated={carregarProdutos}
            />
          )}
          {currentPage === 'gerenciar-usuarios' && user?.role === 'ADMIN' && (
            <GerenciarUsuarios
              usuarios={usuarios}
              onDeleteUsuario={handleDeleteUsuario}
              onUpdateUsuario={carregarUsuarios}
            />
          )}
          {currentPage === 'gerenciar-usuarios' && user?.role !== 'ADMIN' && (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              background: 'white',
              borderRadius: '12px',
              maxWidth: '400px', // Corrigido de 100px para 400px para não espremer o texto
              margin: '0 auto'
            }}>
              <h3>Acesso Negado</h3>
              <p>Apenas administradores podem gerenciar usuários.</p>
              <p><strong>Seu nível:</strong> {user?.role || 'Não definido'}</p>
            </div>
          )}
        </main>
      </div>
      
     {showCadastroFuncionario && user && (
  <CadastroFuncionario 
    user={user} 
    onClose={() => setShowCadastroFuncionario(false)}
    onSuccess={() => {
      carregarUsuarios();
      setShowCadastroFuncionario(false);
    }}
  />
)}
      
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