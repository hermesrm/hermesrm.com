/* =============================
   echo.js
   Display text
   ============================= */

const echoCommand = {
  id: "ECHO",
  aliases: {
    es: ["echo"],
    en: ["echo"]
  },
  description: {
    es: "Muestra un texto en la pantalla",
    en: "Display a line of text"
  },

  execute(context, args) {
    if (!args || !args.length) {
      return "";
    }

    // ES: Normaliza salida a string. EN: Normalize output to string.
    return args.map(arg => String(arg)).join(" ");
  }
};

export { echoCommand };
