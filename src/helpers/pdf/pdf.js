const fs = require("fs");
const PDFKit = require("pdfkit");

// Refatorar
const createPdf = (content) => {
  const pdf = new PDFKit();
  const title = `Elementos capturados: ${content.length}`;

  pdf.fontSize(30).font("Helvetica").text(title, {
    align: "center",
  });

  content.map(({ bookTitle, bookLink }, index) => {
    const title = `Título: - ${bookTitle}`;
    const link = `Link: - ${bookLink}`;
    const id = `${index}: `;

    pdf.moveDown();
    pdf.fontSize("13").font("Helvetica").fillColor("#6155a4").text(id, {
      align: "left",
    });

    pdf.moveDown();
    pdf.fontSize("13").font("Helvetica").fillColor("#6155a4").text(title, {
      align: "left",
    });

    pdf.moveDown();
    pdf.fontSize("13").font("Helvetica").fillColor("#6155a4").text(link, {
      align: "left",
    });
  });

  pdf.pipe(fs.createWriteStream("data.pdf"));
  pdf.end();
};

module.exports = { createPdf };
