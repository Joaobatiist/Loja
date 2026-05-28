import React, { useState, useMemo } from 'react';
import EditarProdutoModal from './EditarProdutoModal';

const GerenciarProdutos = ({ produtos, onDeleteProduto, onProdutoUpdated }) => {
  const [produtoEditando, setProdutoEditando] = useState(null);
  
  // Estados para pesquisa e paginação
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const handleEditarProduto = (produto) => {
    setProdutoEditando(produto);
  };

  const handleExcluirProduto = (produto) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o produto "${produto.nome}"?\n\nEsta ação não pode ser desfeita.`
    );
    
    if (confirmDelete) {
      onDeleteProduto(produto.id);
      if (produtosFiltrados.length === 1 && paginaAtual > 1) {
        setPaginaAtual(prev => prev - 1);
      }
    }
  };

  const handleCloseModal = () => {
    setProdutoEditando(null);
  };

  const handleProdutoUpdated = () => {
    onProdutoUpdated();
    setProdutoEditando(null);
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'Não definida';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return dataString;
    }
  };

  const produtosFiltrados = useMemo(() => {
    return produtos.filter(produto => {
      const busca = termoPesquisa.toLowerCase().trim();
      if (!busca) return true;

      return (
        produto.nome?.toLowerCase().includes(busca) ||
        produto.marca?.toLowerCase().includes(busca) ||
        produto.categoria?.toLowerCase().includes(busca)
      );
    });
  }, [produtos, termoPesquisa]);

  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina) || 1;

  const produtosPaginados = useMemo(() => {
    const indexInicial = (paginaAtual - 1) * itensPorPagina;
    const indexFinal = indexInicial + itensPorPagina;
    return produtosFiltrados.slice(indexInicial, indexFinal);
  }, [produtosFiltrados, paginaAtual]);

  const handlePesquisaChange = (e) => {
    setTermoPesquisa(e.target.value);
    setPaginaAtual(1);
  };

  // Estilos base para os botões seguindo a identidade da sua loja
  const estiloBotaoLoja = {
    padding: '12px 28px',
    borderRadius: '14px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'inherit'
  };

  return (
    <div className="gerenciar-produtos">
      <h2 className="component-title"><i className="fas fa-boxes"></i> Gerenciar Produtos</h2>
      
      {/* BARRA DE PESQUISA */}
      <div className="search-container" style={{ marginBottom: '20px', position: 'relative' }}>
        <div className="search-input-wrapper" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px 15px' }}>
          <i className="fas fa-search" style={{ color: '#888', marginRight: '10px' }}></i>
          <input
            type="text"
            placeholder="Buscar por nome, marca ou categoria..."
            value={termoPesquisa}
            onChange={handlePesquisaChange}
            style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem' }}
          />
          {termoPesquisa && (
            <button 
              onClick={() => { setTermoPesquisa(''); setPaginaAtual(1); }} 
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}
            >
              <i className="fas fa-times-circle"></i>
            </button>
          )}
        </div>
      </div>

      {produtosFiltrados.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-search-minus empty-state-icon" style={{ fontSize: '3rem', marginBottom: '15px', color: '#ccc' }}></i>
          <p>Nenhum resultado encontrado para a sua busca.</p>
          <p>Tente digitar outros termos ou limpe o campo de pesquisa.</p>
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
                {produtosPaginados.map((produto, index) => (
                  <tr key={produto.id || `produto-${index}`}>
                    <td>
                      {produto.foto ? (
                        <img 
                          src={produto.foto} 
                          alt={produto.nome}
                          className="produto-thumb"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="produto-no-image">
                          <i className="fas fa-box"></i>
                        </div>
                      )}
                    </td>
                    <td>{produto.nome}</td>
                    <td>{produto.marca}</td>
                    <td>{produto.categoria}</td>
                    <td>{produto.quantidade}</td>
                    <td>{formatarData(produto.dataCadastro || produto.created_at)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEditarProduto(produto)}
                          title="Editar produto"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleExcluirProduto(produto)}
                          title="Excluir produto"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards para visualização Mobile */}
          <div className="produtos-cards">
            {produtosPaginados.map((produto, index) => (
              <div key={produto.id || `produto-card-${index}`} className="produto-card">
                <div className="produto-card-header">
                  {produto.foto ? (
                    <div className="produto-card-image">
                      <img 
                        src={produto.foto} 
                        alt={produto.nome}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <div className="produto-card-no-image" style={{ padding: '10px', fontSize: '1.5rem', color: '#ccc' }}>
                      <i className="fas fa-box"></i>
                    </div>
                  )}
                  <div className="produto-card-info">
                    <h4>{produto.nome}</h4>
                    <p><strong>Marca:</strong> {produto.marca}</p>
                    <p><strong>Categoria:</strong> {produto.categoria}</p>
                    <p><strong>Quantidade:</strong> {produto.quantidade}</p>
                    <p><strong>Data:</strong> {formatarData(produto.dataCadastro || produto.created_at)}</p>
                  </div>
                </div>
                <div className="produto-card-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditarProduto(produto)}
                    title="Editar produto"
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleExcluirProduto(produto)}
                    title="Excluir produto"
                  >
                    <i className="fas fa-trash-alt"></i> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BLOCK DE PAGINAÇÃO IGUAL À SUA LOJA */}
          <div className="shop-pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginTop: '30px', padding: '10px 0', fontFamily: 'sans-serif' }}>
            
            {/* Botão Anterior */}
            <button
              onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              style={{ 
                ...estiloBotaoLoja, 
                backgroundColor: paginaAtual === 1 ? '#e9ecef' : '#fff', // Cor cinza suave da foto quando desativado
                color: paginaAtual === 1 ? '#adb5bd' : '#2b5c9c', // Ajuste para o tom azul ou cinza de texto correspondente
                boxShadow: paginaAtual === 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
                cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Anterior
            </button>

            {/* Texto Centralizado */}
            <div style={{ textAlign: 'center', userSelect: 'none' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#212529', marginBottom: '4px' }}>
                Página {paginaAtual} de {totalPaginas}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                ({produtosFiltrados.length} produtos)
              </div>
            </div>

            {/* Botão Próximo */}
            <button
              onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
              style={{ 
                ...estiloBotaoLoja, 
                backgroundColor: paginaAtual === totalPaginas ? '#e9ecef' : '#2264ab', // Azul escuro idêntico ao da imagem
                color: paginaAtual === totalPaginas ? '#adb5bd' : '#fff',
                boxShadow: paginaAtual === totalPaginas ? 'none' : '0 4px 6px rgba(34, 100, 171, 0.2)',
                cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer'
              }}
            >
              Próximo →
            </button>

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