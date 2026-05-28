import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react'; // Importando os ícones
import EditarUsuarioModal from './EditarUsuarioModal';

const GerenciarUsuarios = ({ usuarios, onDeleteUsuario, onUpdateUsuario }) => {
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
  };

  const handleCloseModal = () => {
    setUsuarioEditando(null);
  };

  const handleSuccessEdit = () => {
    setUsuarioEditando(null);
    if (onUpdateUsuario) {
      onUpdateUsuario(); // Callback para recarregar a lista
    }
  };

  return (
    <div className="gerenciar-usuarios">
      <h2 className="component-title">Gerenciar Usuários</h2>
      
      {/* Tabela para desktop e tablet */}
      <div className="usuarios-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Nível</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`role-badge ${usuario.role.toLowerCase()}`}>
                    {usuario.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                  </span>
                </td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEditarUsuario(usuario)}
                    title="Editar usuário"
                  >
                    <Pencil size={16} className="btn-icon" />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDeleteUsuario(usuario.id)}
                    title="Excluir usuário"
                  >
                    <Trash2 size={16} className="btn-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards para mobile */}
      <div className="usuarios-cards">
        {usuarios.map(usuario => (
          <div key={usuario.id} className="usuario-card">
            <div className="usuario-card-header">
              <div className="usuario-card-info">
                <h4>{usuario.nome}</h4>
                <p>{usuario.email}</p>
                <span className={`role-badge ${usuario.role.toLowerCase()}`}>
                  {usuario.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>
            <div className="usuario-card-actions">
              <button
                className="edit-button"
                onClick={() => handleEditarUsuario(usuario)}
                title="Editar usuário"
              >
                <Pencil size={16} className="btn-icon" /> Editar
              </button>
              <button
                className="delete-button"
                onClick={() => onDeleteUsuario(usuario.id)}
                title="Excluir usuário"
              >
                <Trash2 size={16} className="btn-icon" /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      {usuarioEditando && (
        <EditarUsuarioModal
          usuario={usuarioEditando}
          onClose={handleCloseModal}
          onSuccess={handleSuccessEdit}
        />
      )}
    </div>
  );
};

export default GerenciarUsuarios;