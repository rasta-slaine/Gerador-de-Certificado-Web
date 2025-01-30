import "../style/CertificadoPages.css";
import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const  CertificadoAll = () => {

  type PdfInfo = {
    nome: string;
    url: string;
  };


  const [generatedPdfs, setGeneratedPdfs] = useState<PdfInfo[]>([]);
  const [totalNomes, setTotalNomes] = useState(0);
  const [loading, setLoading] = useState(false);


  const processFile = async (file: File) => {

    setLoading(true);

    try {
      let names: string[]  = [];

      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<{Nome:string}>(sheet);
        
        names = rows.map((row) => row.Nome);

      } else if (file.name.endsWith(".txt")) {
        const text = await file.text();
        names = text.split("\n").map((line: string) => line.trim());
      }

      setTotalNomes(names.length);
      names.forEach((name)=>generateCertificates(name));

    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (nome: string) => {
    try {
      const existingPdfBytes = await fetch("/template/certificado-2.pdf").then((res) =>
        res.arrayBuffer()
      );

      const alexBrushFontBytes = await fetch("/fonts/AlexBrush-Regular.ttf").then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontkit);

      const alexBrushFont = await pdfDoc.embedFont(alexBrushFontBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      firstPage.drawText(nome, {
        x: 130,
        y: 300,
        size: 70,
        font: alexBrushFont,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setGeneratedPdfs((prev) => [...prev, { nome, url }]);
    } catch (error) {
      console.error("Erro ao gerar o certificado:", error);
    }
  }; 

  const generateCertificates = async (names: string) => {
    for (const name of names) {
      await handleGenerateCertificate(name);
    }
    alert("Certificados gerados com sucesso!");
  };

  const downloadAllPdfs = async () => {
    const zip = new JSZip();

    for (const { nome, url } of generatedPdfs) {
      const response = await fetch(url);
      const blob = await response.blob();
      zip.file(`${nome}.pdf`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "certificados.zip");
  };

  return (
    <div className="certificado-container">
      <h1>Gerar Certificados</h1>
      {loading && <p>Carregando, por favor aguarde...</p>}

      <div
        className="drag-drop-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) processFile(file);
        }}
      >
        Arraste e solte um arquivo ou clique em "Procurar Arquivo".
      </div>

      <input
        type="file"
        accept=".xlsx, .xls, .txt"
        style={{ display: "none" }}
        id="file-upload"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0){
            processFile(e.target.files[0])
          }
        }}
      />

      <button className="btn-2" onClick={() =>{
        const fileInput =  document.getElementById("file-upload") as HTMLInputElement
        if(fileInput){
          fileInput.click()
        }}
        }>
        Procurar Arquivo
      </button>

      {generatedPdfs.length > 0 && (
        <div  className="list-container">

          <div className="list-container-title">
            <h3>Certificados Gerados :</h3> 
            <p>{totalNomes > 0 && `${totalNomes}`}</p> 
          </div>

        
          <ul>
            {generatedPdfs.map((pdf, index) => (
              <li key={index}>
                 <span>{pdf.nome}</span>
                 
                 <div>
                      <a href={pdf.url} target="blank">
                        Visualizar
                      </a>
                      <a href={pdf.url} download={`${pdf.nome}.pdf`}>
                        Baixar
                      </a>
                 </div>
              </li>
            ))}
          </ul>


          <button  className="btn-2" onClick={downloadAllPdfs}>Baixar Todos</button>
        </div>

        
      )}
    </div>
  );
};

export default CertificadoAll;
