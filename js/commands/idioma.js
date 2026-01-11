/* =============================
   idioma.js
   Language selection command
   ============================= */

const SUPPORTED_LANGS = ["es", "en"];

const languageCommand = {
  id: "SET_LANG",
  aliases: {
    es: ["idioma", "language"],
    en: ["language", "idioma"]
  },
  description: {
    es: "Muestra o cambia el idioma de la sesión",
    en: "Show or change the session language"
  },

  execute(context, args) {
    // Mostrar idioma actual
    if (!args || !args.length) {
      return {
        es: `Idioma actual: ${context.lang}`,
        en: `Current language: ${context.lang}`
      }[context.lang];
    }

    const requested = args[0].toLowerCase();

    if (!SUPPORTED_LANGS.includes(requested)) {
      return {
        es: `Idioma no soportado: ${requested}`,
        en: `Unsupported language: ${requested}`
      }[context.lang];
    }

    context.lang = requested;

    return {
      es: `Idioma cambiado a: ${requested}`,
      en: `Language changed to: ${requested}`
    }[context.lang];
  }
};

export { languageCommand };