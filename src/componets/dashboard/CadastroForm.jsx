import React, { useState, useCallback, memo, useEffect } from 'react';

const CadastroForm = ({ novoProduto, setNovoProduto, onSubmit }) => {
  const [fotoPreview, setFotoPreview] = useState(null);

  // Limpar preview quando o produto for resetado
  useEffect(() => {
    if (!novoProduto?.foto) {
      setFotoPreview(null);
    }
  }, [novoProduto?.foto]);

  // useCallback garante que a função não será recriada em toda renderização
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        e.target.value = '';
        return;
      }
      
      // Verificar tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Selecione uma imagem menor que 5MB.');
        e.target.value = '';
        return;
      }
      
      // Processar de forma síncrona e simples para evitar problemas
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoPreview(event.target.result);
        // Usar setTimeout para evitar conflitos de estado
        setTimeout(() => {
          setNovoProduto(prev => ({ ...prev, foto: file }));
        }, 0);
      };
      reader.onerror = () => {
        alert('Erro ao ler arquivo. Tente novamente.');
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    } else {
      setFotoPreview(null);
      setNovoProduto(prev => ({ ...prev, foto: null }));
    }
  }, [setNovoProduto]);

  // também usamos useCallback para as mudanças nos inputs
  const handleChange = useCallback((field, value) => {
    setNovoProduto(prev => ({ ...prev, [field]: value }));
  }, [setNovoProduto]);

  return (
    <div className="cadastrar-produto">
      <h2 className="component-title">Cadastrar Novo Produto</h2>

      <form onSubmit={onSubmit} className="produto-form">
        <div className="form-group">
          <label htmlFor="nome" className="form-label">Nome do Produto</label>
          <input
            type="text"
            id="nome"
            className="form-input"
            value={novoProduto?.nome || ''}
            onChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Digite o nome do produto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="marca" className="form-label">Marca</label>
          <input
            type="text"
            id="marca"
            className="form-input"
            value={novoProduto?.marca || ''}
            onChange={(e) => handleChange('marca', e.target.value)}
            placeholder="Digite a marca"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria" className="form-label">Categoria</label>
          <input
            type="text"
            id="categoria"
            className="form-input"
            value={novoProduto?.categoria || ''}
            onChange={(e) => handleChange('categoria', e.target.value)}
            placeholder="Digite a categoria"
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantidade" className="form-label">Quantidade</label>
          <input
            type="number"
            id="quantidade"
            className="form-input"
            value={novoProduto?.quantidade || 1}
            onChange={(e) => handleChange('quantidade', Number(e.target.value))}
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="foto" className="form-label">Foto do Produto</label>
          <input
            type="file"
            id="foto"
            className="form-input"
            onChange={handleFileChange}
            accept="image/*"
          />
          {fotoPreview && (
            <div className="foto-preview">
              <img
                src={fotoPreview}
                alt="Preview do produto"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  marginTop: '10px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Cadastrar Produto
        </button>
      </form>
    </div>
  );
};

// React.memo impede re-renderizações se props não mudarem
export default memo(CadastroForm);
