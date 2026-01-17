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
    // ES: Señal para que main.js limpie el output. EN: Signal for main.js to clear output.
    return "__CLEAR__";
  }
};

export { clearCommand };
