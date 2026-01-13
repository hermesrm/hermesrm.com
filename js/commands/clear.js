/* =============================
   clear.js
   Clear terminal output
   ============================= */

const clearCommand = {
  id: "CLEAR",
  aliases: {
    es: ["clear"],
    en: ["clear"]
  },
  description: {
    es: "Limpia la pantalla de la terminal",
    en: "Clear the terminal screen"
  },

  execute(context) {
    // Acceder al DOM para limpiar el output
    const output = document.getElementById("output");
    if (output) {
      output.innerHTML = "";
    }
    return "";
  }
};

export { clearCommand };
