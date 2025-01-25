import { useState } from "react";
import CertificadoAll from "./CertificadoAll";
import CertificadoOne from "./CertificadoOne";
import "../style/CertificadoPage.css";

const CertificadoPage = () => {
  const [ButtonType, setButtonType] = useState(0);

  const handleSingleCertificate = () => {
    setButtonType(1);
  };

  const handleMultipleCertificates = () => {
    setButtonType(2);
  };

  return (
    <div className="certificado-container-CertificadoPage">
      <div>
        <h3>Quantos certificados você deseja gerar?</h3>
        <section>
          <button className="btn-2" onClick={handleSingleCertificate}>
            Gerar um único certificado
          </button>
          <button className="btn-2" onClick={handleMultipleCertificates}>
            Gerar múltiplos certificados
          </button>
        </section>
      </div>
      {ButtonType === 1 && <CertificadoOne />}
      {ButtonType === 2 && <CertificadoAll />}
    </div>
  );
};

export default CertificadoPage;