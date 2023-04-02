const fs = require("fs");
const PDFKit = require("pdfkit");

// Refatorar
const createPdf = (content) => {
  const pdf = new PDFKit();
  const title = `Elementos capturados: ${content.length}`;

  pdf.fontSize(30).font("Helvetica").text(title, {
    align: "center",
  });

  content.map((text, index) => {
    const _text = `${index + 1} - ${text}`;

    pdf.moveDown();
    pdf.fontSize("13").font("Helvetica").fillColor("#6155a4").text(_text, {
      align: "left",
    });
  });

  pdf.pipe(fs.createWriteStream("data.pdf"));
  pdf.end();
};

module.exports = { createPdf };
