// Enum para tipos de usuário do sistema
const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

// Descrições amigáveis para os roles
const UserRoleLabels = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.USER]: 'Usuário'
};

// Permissões por role
const UserPermissions = {
  [UserRole.ADMIN]: [
    'create_users',
    'edit_users', 
    'delete_users',
    'manage_products',
    'view_users',
    'system_settings'
  ],
  [UserRole.USER]: [
    'view_products'
  ]
};

// Função para verificar se usuário tem permissão
const hasPermission = (userRole, permission) => {
  return UserPermissions[userRole]?.includes(permission) || false;
};

// Função para verificar se usuário é admin
const isAdmin = (userRole) => {
  return userRole === UserRole.ADMIN;
};

// Função para verificar se usuário pode cadastrar outros usuários
const canCreateUsers = (userRole) => {
  return hasPermission(userRole, 'create_users');
};

// Validar se o role é válido
const isValidRole = (role) => {
  return Object.values(UserRole).includes(role);
};

// Exportar todas as funções e constantes
module.exports = {
  UserRole,
  UserRoleLabels,
  UserPermissions,
  hasPermission,
  isAdmin,
  canCreateUsers,
  isValidRole
};