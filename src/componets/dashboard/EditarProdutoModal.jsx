import React, { useState, useEffect } from 'react';
import apiService from '../../utils/apiService';

const EditarProdutoModal = ({ produto, onClose, onProdutoUpdated }) => {
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    categoria: '',
    quantidade: 1,
    foto: null
  });
  const [fotoPreview, setFotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome || '',
        marca: produto.marca || '',
        categoria: produto.categoria || '',
        quantidade: produto.quantidade || 1,
        foto: null // Reset foto para nova seleção
      });
      setFotoPreview(produto.foto || '');
    }
  }, [produto]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamanho do arquivo (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Arquivo muito grande. Máximo 5MB.');
        return;
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      setFormData(prev => ({ ...prev, foto: file }));
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (file, maxSizeMB = 1) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular dimensões mantendo aspecto
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Comprimir iterativamente
        let quality = 0.9;
        const compress = () => {
          canvas.toBlob((blob) => {
            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.1) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            } else {
              quality -= 0.1;
              compress();
            }
          }, 'image/jpeg', quality);
        };
        
        compress();
      };
      
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validações
      if (!formData.nome.trim()) {
        throw new Error('Nome é obrigatório');
      }
      if (!formData.marca.trim()) {
        throw new Error('Marca é obrigatória');
      }
      if (!formData.categoria.trim()) {
        throw new Error('Categoria é obrigatória');
      }

      const dadosAtualizacao = {
        nome: formData.nome.trim(),
        marca: formData.marca.trim(),
        categoria: formData.categoria.trim(),
        quantidade: Number(formData.quantidade)
      };

      // Se uma nova foto foi selecionada
      if (formData.foto && typeof formData.foto === 'object') {
        dadosAtualizacao.foto = await compressImage(formData.foto);
      }

      const response = await apiService.atualizarProduto(produto.id, dadosAtualizacao);

      if (response.success) {
        onProdutoUpdated();
        onClose();
        alert('Produto atualizado com sucesso!');
      } else {
        throw new Error(response.message || 'Erro ao atualizar produto');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Editar Produto</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome" className="form-label">Nome *</label>
              <input
                type="text"
                id="nome"
                className="form-input"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="marca" className="form-label">Marca *</label>
              <input
                type="text"
                id="marca"
                className="form-input"
                value={formData.marca}
                onChange={(e) => handleChange('marca', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria" className="form-label">Categoria *</label>
              <input
                id="categoria"
                className="form-input"
                value={formData.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                required
             />
               
            </div>

            <div className="form-group">
              <label htmlFor="quantidade" className="form-label">Quantidade *</label>
              <input
                type="number"
                id="quantidade"
                className="form-input"
                value={formData.quantidade}
                onChange={(e) => handleChange('quantidade', e.target.value)}
                min="0"
                required
              />
            </div>
          </div>



          <div className="form-group">
            <label htmlFor="foto" className="form-label">Nova Foto (opcional)</label>
            <input
              type="file"
              id="foto"
              className="form-input"
              onChange={handleFileChange}
              accept="image/*"
            />
            {fotoPreview && (
              <div className="foto-preview" style={{ marginTop: '10px' }}>
                <img
                  src={fotoPreview}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarProdutoModal;