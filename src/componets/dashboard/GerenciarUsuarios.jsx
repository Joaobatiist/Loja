import React from 'react';

const GerenciarUsuarios = ({ usuarios, onDeleteUsuario }) => {
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
                    onClick={() => alert('Funcionalidade de edição será implementada')}
                    title="Editar usuário"
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDeleteUsuario(usuario.id)}
                    title="Excluir usuário"
                  >
                    🗑️
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
                onClick={() => alert('Funcionalidade de edição será implementada')}
                title="Editar usuário"
              >
                ✏️ Editar
              </button>
              <button
                className="delete-button"
                onClick={() => onDeleteUsuario(usuario.id)}
                title="Excluir usuário"
              >
                🗑️ Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GerenciarUsuarios;