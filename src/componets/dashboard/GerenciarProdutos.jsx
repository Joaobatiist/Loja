import React, { useState } from 'react';
import EditarProdutoModal from './EditarProdutoModal';

const GerenciarProdutos = ({ produtos, onDeleteProduto, onProdutoUpdated }) => {
  const [produtoEditando, setProdutoEditando] = useState(null);

  const handleEditarProduto = (produto) => {
    setProdutoEditando(produto);
  };

  const handleExcluirProduto = (produto) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o produto "${produto.nome}"?\n\nEsta ação não pode ser desfeita.`
    );
    
    if (confirmDelete) {
      onDeleteProduto(produto.id);
    }
  };

  const handleCloseModal = () => {
    setProdutoEditando(null);
  };

  const handleProdutoUpdated = () => {
    onProdutoUpdated();
    setProdutoEditando(null);
  };
  return (
    <div className="gerenciar-produtos">
      <h2 className="component-title">Gerenciar Produtos</h2>
      {produtos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum produto cadastrado ainda.</p>
          <p>Use o menu "Cadastrar Produto" para adicionar novos produtos.</p>
        </div>
      ) : (
        <>
          {/* Tabela para desktop e tablet */}
          <div className="produtos-table">
            <table>
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Quantidade</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto, index) => (
                  <tr key={produto.id || `produto-${index}`}>
                    <td>
                      {produto.foto ? (
                        <img 
                          src={produto.foto} 
                          alt={produto.nome}
                          className="produto-thumb"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="produto-no-image">📦</div>
                      )}
                    </td>
                    <td>{produto.nome}</td>
                    <td>{produto.marca}</td>
                    <td>{produto.categoria}</td>
                    <td>{produto.quantidade}</td>
                    <td>{produto.dataCadastro || produto.created_at}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEditarProduto(produto)}
                          title="Editar produto"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleExcluirProduto(produto)}
                          title="Excluir produto"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards para mobile */}
          <div className="produtos-cards">
            {produtos.map((produto, index) => (
              <div key={produto.id || `produto-card-${index}`} className="produto-card">
                <div className="produto-card-header">
                  {produto.foto && (
                    <div className="produto-card-image">
                      <img 
                        src={produto.foto} 
                        alt={produto.nome}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="produto-card-info">
                    <h4>{produto.nome}</h4>
                    <p><strong>Marca:</strong> {produto.marca}</p>
                    <p><strong>Categoria:</strong> {produto.categoria}</p>
                    <p><strong>Quantidade:</strong> {produto.quantidade}</p>
                    <p><strong>Data:</strong> {produto.dataCadastro || produto.created_at}</p>
                  </div>
                </div>
                <div className="produto-card-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditarProduto(produto)}
                    title="Editar produto"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleExcluirProduto(produto)}
                    title="Excluir produto"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Modal de edição */}
      {produtoEditando && (
        <EditarProdutoModal
          produto={produtoEditando}
          onClose={handleCloseModal}
          onProdutoUpdated={handleProdutoUpdated}
        />
      )}
    </div>
  );
};

export default GerenciarProdutos;