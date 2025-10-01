import React, { useState, useEffect, useCallback } from 'react';
import '../style/dashboard.css';
import apiService from '../utils/apiService';

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
import CadastroFuncionario from '../componets/dashboard/CadastroFuncionario';

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
  const [showCadastroFuncionario, setShowCadastroFuncionario] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    marca: '',
    categoria: '',
    quantidade: 1,
    foto: null
  });



  // Função para carregar usuários da API
  const carregarUsuarios = useCallback(async () => {
    if (!user || user.role !== 'ADMIN') return;
    
    try {
      const response = await apiService.listarUsuarios();
      if (response.success) {
        setUsuarios(response.data);
      }
    } catch (error) {
      // Em caso de erro, usar dados mock como fallback
      setUsuarios(mockUsuarios);
    }
  }, [user]);

  // Função para carregar produtos da API
  const carregarProdutos = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await apiService.listarProdutos();
      if (response.success) {
        setProdutos(response.data);
      }
    } catch (error) {
      // Em caso de erro, manter array vazio ou usar mock se necessário
      setProdutos([]);
    }
  }, [user]);

  useEffect(() => {
    const userData = localStorage.getItem('limpatech_user');
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  // Carregar usuários quando o user for definido
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      carregarUsuarios();
    }
  }, [user, carregarUsuarios]);

  // Carregar produtos quando o user for definido
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

  const handleLogin = useCallback(async (email, password) => {
    try {
      // Usar o apiService para fazer login (já configurado para rede)
      const data = await apiService.login(email, password);

      if (data.success) {
        // Login bem-sucedido
        const userData = data.data.usuario;
        const userToken = data.data.token;
        const sessionData = data.data.session;
        
        localStorage.setItem('limpatech_user', JSON.stringify(userData));
        localStorage.setItem('limpatech_token', userToken);
        localStorage.setItem('limpatech_session', JSON.stringify(sessionData));
        
        setUser(userData);
        setIsLoggedIn(true);
        setUsuarios(mockUsuarios);
      } else {
        // Erro no login
        const errorMessage = data.message || 'Email ou senha incorretos!';
        throw new Error(errorMessage);
      }
    } catch (error) {
      
      // Verificar se é erro de conexão
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique se o servidor está rodando na porta 3001.');
      } else {
        throw new Error(error.message || 'Erro inesperado no login.');
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('limpatech_user');
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
      // Processar dados de forma isolada
      const dadosProduto = {
        nome: novoProduto.nome.trim(),
        marca: novoProduto.marca.trim(),
        categoria: novoProduto.categoria,
        quantidade: Number(novoProduto.quantidade),
        usuario_id: user.id
      };

      // Processar foto se existir
      if (novoProduto.foto && typeof novoProduto.foto === 'object') {
        // Processar de forma mais simples usando canvas diretamente
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Criar image element
        const img = new Image();
        
        const fotoProcessada = await new Promise((resolve) => {
          img.onload = () => {
            // Redimensionar mantendo proporção
            const maxWidth = 500;
            const maxHeight = 500;
            let { width, height } = img;
            
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width *= ratio;
              height *= ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Converter para base64 com compressão
            resolve(canvas.toDataURL('image/jpeg', 0.6));
          };
          
          // Usar URL.createObjectURL em vez de FileReader
          img.src = URL.createObjectURL(novoProduto.foto);
        });
        
        dadosProduto.foto = fotoProcessada;
        
        // Limpar URL object
        URL.revokeObjectURL(img.src);
      }

      // Enviar para API
      const response = await apiService.criarProduto(dadosProduto);
      
      if (response.success) {
        // Limpar formulário de forma mais direta
        setNovoProduto({ 
          nome: '', 
          marca: '', 
          categoria: '', 
          quantidade: 1, 
          foto: null 
        });
        
        // Limpar input de arquivo
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
        
        // Recarregar produtos
        await carregarProdutos();
        
        alert('Produto cadastrado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro ao cadastrar produto: ' + (error.message || 'Erro desconhecido'));
    }
  }, [novoProduto, carregarProdutos, user]);

  const handleDeleteUsuario = useCallback(async (id) => {
    const usuario = usuarios.find(u => u.id === id);
    const nomeUsuario = usuario ? usuario.nome : 'usuário';
    
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o usuário "${nomeUsuario}"?\n\nEsta ação não pode ser desfeita.`
    );
    
    if (confirmDelete) {
      try {
        await apiService.deletarUsuario(id);
        // Recarregar lista de usuários após deletar
        await carregarUsuarios();
        alert(`Usuário "${nomeUsuario}" excluído com sucesso!`);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erro ao excluir usuário';
        alert(`Erro: ${errorMessage}`);
      }
    }
  }, [carregarUsuarios, usuarios]);

  const handleDeleteProduto = useCallback(async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await apiService.deletarProduto(id);
        await carregarProdutos(); // Recarregar lista
        alert('Produto excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir produto. Tente novamente.');
      }
    }
  }, [carregarProdutos]);

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
      
      {/* Modal de Cadastro de Funcionário */}
      {showCadastroFuncionario && (
        <CadastroFuncionario 
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
