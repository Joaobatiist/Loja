import React from 'react';

const GerenciarProdutos = ({ produtos, onDeleteProduto }) => {
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
                  <th>Nome</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Quantidade</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.id}>
                    <td>{produto.nome}</td>
                    <td>{produto.marca}</td>
                    <td>{produto.categoria}</td>
                    <td>{produto.quantidade}</td>
                    <td>{produto.dataCadastro}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => onDeleteProduto(produto.id)}
                        title="Excluir produto"
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
          <div className="produtos-cards">
            {produtos.map(produto => (
              <div key={produto.id} className="produto-card">
                <div className="produto-card-header">
                  <div className="produto-card-info">
                    <h4>{produto.nome}</h4>
                    <p><strong>Marca:</strong> {produto.marca}</p>
                    <p><strong>Categoria:</strong> {produto.categoria}</p>
                    <p><strong>Quantidade:</strong> {produto.quantidade}</p>
                    <p><strong>Data:</strong> {produto.dataCadastro}</p>
                  </div>
                </div>
                <div className="produto-card-actions">
                  <button
                    className="delete-button"
                    onClick={() => onDeleteProduto(produto.id)}
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
    </div>
  );
};

export default GerenciarProdutos;