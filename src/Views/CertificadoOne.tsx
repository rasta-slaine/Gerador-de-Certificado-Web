
import  "../style/CertificadoPages.css"

import  { useState } from "react";
import { PDFDocument,rgb, StandardFonts } from "pdf-lib"; // Biblioteca para manipular PDFs
import * as fontkit from "fontkit" // Biblioteca para manipular fontes
import * as XLSX from "xlsx"; // Para processar arquivos Excel
    

const CertificadoOne = () => {
  
    const [nome, setNome] = useState("");
    const [data, setData] = useState("");
    const [generatedPdfUrl, setGeneratedPdfUrl] = useState("");
    const [loading, setLoading] = useState(false);
  

    const handleGenerateCertificate = async (nome:string) => {
        try {
          // Carrega o template do certificado
          const existingPdfBytes = await fetch("/template/certificado-2.pdf").then(
            (res) => res.arrayBuffer()
          );

         // Carregar as fontes
        const alexBrushFontBytes = await fetch("/fonts/AlexBrush-Regular.ttf").then((res) =>
             res.arrayBuffer()
        );
                
          // Carrega o PDF na biblioteca
          const pdfDoc = await PDFDocument.load(existingPdfBytes);

          pdfDoc.registerFontkit(fontkit)
          // Carregar fontes
          const alexBrushFont = await pdfDoc.embedFont(alexBrushFontBytes);
          const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
          // Seleciona a primeira página do template
          const pages = pdfDoc.getPages();
          const firstPage = pages[0];
    
          // Define posições para inserir texto
          firstPage.drawText(nome, {
            x: 130, // Posição X
            y: 300, // Posição Y
            size: 70, // Tamanho da fonte
            font: alexBrushFont,
            color: rgb(0, 0, 0), // Cor preta
          });
    
          
          firstPage.drawText(data, {
            x: 100,
            y: 260,
            size: 18,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });  


          // Salva o PDF editado
          const pdfBytes = await pdfDoc.save();
    
          // Gera uma URL para visualização e download
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
    
          setGeneratedPdfUrl(url); // Define o link gerado no estado
        } catch (error) {
          console.error("Erro ao gerar o certificado:", error);
        }
      };




      const processFile = async (file) => {
        setLoading(true);
        try {
          if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);
            const names = rows.map((row) => row.Nome); // Supondo que a coluna chama-se "Nome"
            generateCertificates(names);

          } else if (file.name.endsWith(".txt")) {
            const text = await file.text();
            const names = text.split("\n").map((line) => line.trim());
            generateCertificates(names);

          } else {
            alert("Formato de arquivo não suportado.");
          }

        } catch (error) {
          console.error("Erro ao processar o arquivo:", error);
        } finally {
          setLoading(false);
        }
      };
    
      const generateCertificates = async (names:string) => {
        for (const name of names) {
          await handleGenerateCertificate(name);
        }
        alert("Certificados gerados com sucesso!");
      };



  return (
      <div className="certificado-container">
      <h1>Gerar Certificado</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="NotApper"
          type="date"
          placeholder="Data"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>
      <button className="btn-2" onClick={() => handleGenerateCertificate(nome)}>
        Gerar Certificado
      </button>

      {loading && <p>Processando arquivos...</p>}

      {generatedPdfUrl && (
        <div className="iframe-container">
          <h3>Pré-visualização do Certificado</h3>
          <iframe
            src={generatedPdfUrl}
            title="Visualização do Certificado"
            width="100%"
            height="500px"
          ></iframe>
          <div style={{ marginTop: "10px" }}>
            <a
              href={generatedPdfUrl}
              className="download-link btn-2"
              download={`certificado ${nome}.pdf`}
            >
              Baixar Certificado
            </a>
          </div>
        </div>
      )}
    </div>

  )
}

export default CertificadoOne