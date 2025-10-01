import React, { createContext, useContext, useState, useEffect } from 'react';

// Criar o contexto
const AuthContext = createContext();

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se há usuário salvo no localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('limpatech_user');
    const savedToken = localStorage.getItem('limpatech_token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setToken(savedToken);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('limpatech_user');
        localStorage.removeItem('limpatech_token');
      }
    }
  }, []);

  // Função para fazer login
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
    localStorage.setItem('limpatech_user', JSON.stringify(userData));
    localStorage.setItem('limpatech_token', userToken);
  };

  // Função para fazer logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('limpatech_user');
    localStorage.removeItem('limpatech_token');
  };

  // Função para atualizar dados do usuário
  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('limpatech_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Exportar contexto para uso direto
export { AuthContext };
