import React, { useState } from 'react';
import '../style/cadastroProduto.css';

const CadastroProduto = () => {
  const [nomeProduto, setNomeProduto] = useState('');
  const [marca, setMarca] = useState('');
  const [foto, setFoto] = useState(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState('');
  const [produtoCadastrado, setProdutoCadastrado] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      const fileUrl = URL.createObjectURL(file);
      setFotoPreviewUrl(fileUrl);
    }
  };

  const handleCadastro = (e) => {
    e.preventDefault();
    if (!nomeProduto || !marca || !foto) {
      alert('Por favor, preencha todos os campos e adicione uma foto.');
      return;
    }
    console.log('Produto Cadastrado:', {
      nome: nomeProduto,
      marca: marca,
      foto: foto.name,
    });
    setProdutoCadastrado(true);
  };

  const handleSendToWhatsApp = () => {
    const message = `🌟 Novo Produto na Loja!%0A%0A🛍️ *Nome:* ${nomeProduto}%0A🔖 *Marca:* ${marca}%0A%0A_Aguarde os preços e mais informações!_`;
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNovoCadastro = () => {
    setNomeProduto('');
    setMarca('');
    setFoto(null);
    setFotoPreviewUrl('');
    setProdutoCadastrado(false);
  };

  return (
    <div className="cadastro-produto-container">
      <div className="cadastro-produto-card">
        {!produtoCadastrado ? (
          <>
            <h2 className="cadastro-produto-title">Cadastrar Novo Produto</h2>
            <form onSubmit={handleCadastro} className="cadastro-produto-form">
              <div className="form-group">
                <label htmlFor="nomeProduto">Nome do Produto</label>
                <input
                  type="text"
                  id="nomeProduto"
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="marca">Marca</label>
                <input
                  type="text"
                  id="marca"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  required
                />
              </div>
              <div className="form-group image-upload-container">
                <label htmlFor="fotoProduto" className="image-upload-label">
                  {fotoPreviewUrl ? (
                    <img src={fotoPreviewUrl} alt="Prévia do Produto" className="image-preview" />
                  ) : (
                    <>
                      <span className="upload-icon">📸</span>
                      <span className="upload-text">Adicionar Foto do Produto</span>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  id="fotoProduto"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                />
              </div>
              <button type="submit" className="cadastro-produto-button">Adicionar ao Catálogo</button>
            </form>
          </>
        ) : (
          <div className="produto-detalhe">
            <h2 className="cadastro-produto-title">Produto Cadastrado!</h2>
            <div className="produto-info-card">
              <img src={fotoPreviewUrl} alt={nomeProduto} className="produto-imagem" />
              <h3>{nomeProduto}</h3>
              <p><span>Marca:</span> {marca}</p>
            </div>
            <button onClick={handleSendToWhatsApp} className="whatsapp-button">
              Enviar para o WhatsApp
            </button>
            <button onClick={handleNovoCadastro} className="novo-cadastro-button">
              Cadastrar Novo Produto
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadastroProduto;