/* =============================
   pdf.js
   Show PDF résumé location
   ============================= */

const pdfCommand = {
  id: "PDF",
  aliases: {
    es: ["pdf"],
    en: ["pdf"]
  },
  description: {
    es: "Muestra la ubicación del currículum en PDF",
    en: "Show the location of the PDF résumé"
  },

  execute(context) {
    return {
      es: [
        "Currículum en PDF disponible en:",
        "/assets/HermesRM_CV.pdf",
        "",
        "Nota: El CV interactivo es la versión principal."
      ].join("\n"),
      en: [
        "PDF résumé available at:",
        "/assets/HermesRM_CV.pdf",
        "",
        "Note: The interactive CV is the primary version."
      ].join("\n")
    }[context.lang];
  }
};

export { pdfCommand };