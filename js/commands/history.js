/* =============================
   history.js
   Command history display
   ============================= */

const historyCommand = {
  id: "HISTORY",
  aliases: {
    es: ["history", "historial"],
    en: ["history"]
  },
  description: {
    es: "Muestra el historial de comandos",
    en: "Show command history"
  },

  execute(context) {
    if (!context.history.length) {
      return {
        es: "No hay comandos en el historial",
        en: "No commands in history"
      }[context.lang];
    }

    return context.history
      .map((cmd, index) => `${index + 1}  ${cmd}`)
      .join("\n");
  }
};

export { historyCommand };