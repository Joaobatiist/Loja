import React from 'react';
import '../../style/lojasParceiras.css'; 

function PartnerScroller() {
  // 1. Defina os logos dos parceiros aqui dentro do componente
  const partnerLogos = [
    { src: '/img/academia agoge.png', alt: 'Nome do Parceiro 1' },
    { src: '/img/academia evidence.png', alt: 'Nome do Parceiro 2' },
    { src: '/img/arabaiano.jpg', alt: 'Nome do Parceiro 3' },
    { src: '/img/bambina.jpg', alt: 'Nome do Parceiro 4' },
    { src: '/img/banco santander.png', alt: 'Nome do Parceiro 5' },
    { src: '/img/casa da manteiga.jpg', alt: 'Nome do Parceiro 6' },
    { src: '/img/casafazendeiro.jpg', alt: 'Nome do Parceiro 7' },
    { src: '/img/cemedi.jpg', alt: 'Nome do Parceiro 8' },
    { src: '/img/clinica integrare.png', alt: 'Nome do Parceiro 9' },
    { src: '/img/dinamo.png', alt: 'Nome do Parceiro 10' },
    { src: '/img/ideal fisio.jpg', alt: 'Nome do Parceiro 11' },
    { src: '/img/imperio das bolsas.jpg', alt: 'Nome do Parceiro 12' },
    { src: '/img/juliana persan.jpg', alt: 'Nome do Parceiro 13' },
    { src: '/img/paraisonativo.png', alt: 'Nome do Parceiro 14' },
    { src: '/img/mersan.jpg', alt: 'Nome do Parceiro 15' },
    { src: '/img/multimagem.png', alt: 'Nome do Parceiro 16' },
    { src: '/img/osab.webp', alt: 'Nome do Parceiro 17' },
    { src: '/img/procura.png', alt: 'Nome do Parceiro 19' },
    { src: '/img/rc florestal.jpg', alt: 'Nome do Parceiro 20' },
    { src: '/img/via di uso.png', alt: 'Nome do Parceiro 21' },
    
  

  ];

  // 2. Retorne o JSX da seção
  return (
    <section id="parceiros" className="section">
      <div className="container">
        <h2 className="section-title">Nossos Clientes</h2>
        <div className="logo-scroller">
          <div className="logo-track">
            {/* O truque da duplicação continua funcionando perfeitamente */}
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div className="logo-slide" key={index}>
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnerScroller;