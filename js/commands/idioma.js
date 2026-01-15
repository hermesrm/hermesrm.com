/* =============================
   idioma.js
   Language selection command
   ============================= */

// ES: Idiomas soportados. EN: Supported languages.
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
    // Mostrar idioma actual e instrucciones
    if (!args || !args.length) {
      const currentLang = context.lang === "es" ? "Español (es)" : "English (en)";
      
      if (context.lang === "es") {
        return [
          `Idioma actual: ${currentLang}`,
          "",
          "Para cambiar el idioma, usa:",
          "  idioma en    → Cambiar a inglés",
          "  idioma es    → Cambiar a español"
        ].join("\n");
      } else {
        return [
          `Current language: ${currentLang}`,
          "",
          "To change the language, use:",
          "  language es  → Change to Spanish",
          "  language en  → Change to English"
        ].join("\n");
      }
    }

    const requested = args[0].toLowerCase();

    if (!SUPPORTED_LANGS.includes(requested)) {
      return {
        es: `Idioma no soportado: ${requested}. Usa 'idioma es' o 'idioma en'`,
        en: `Unsupported language: ${requested}. Use 'language es' or 'language en'`
      }[context.lang];
    }

    context.lang = requested;

    const newLang = requested === "es" ? "Español (es)" : "English (en)";
    
    return {
      es: `✓ Idioma cambiado a: ${newLang}`,
      en: `✓ Language changed to: ${newLang}`
    }[context.lang];
  }
};

export { languageCommand };