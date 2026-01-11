/* =============================
   cat.js
   Display file or section content
   ============================= */

import { resolveNode } from "../context.js";

const catCommand = {
  id: "CAT",
  aliases: {
    es: ["cat"],
    en: ["cat"]
  },
  description: {
    es: "Muestra el contenido de un archivo o sección",
    en: "Display file or section content"
  },

  execute(context, args) {
    if (!args.length) {
      return {
        es: "Uso: cat <archivo | sección>",
        en: "Usage: cat <file | section>"
      }[context.lang];
    }

    const target = args[0];
    const node = resolveNode(context, target);

    if (!node) {
      return {
        es: "Archivo o sección no encontrada",
        en: "File or section not found"
      }[context.lang];
    }

    // Directorio de sección del CV (content interno)
    if (node.type === "dir" && node.children?.content) {
      return node.children.content.content[context.lang] || "";
    }

    // Archivo multilenguaje explícito
    if (node.type === "file" && node.content) {
      return node.content[context.lang] || {
        es: "Idioma no disponible",
        en: "Language not available"
      }[context.lang];
    }

    return {
      es: "No se puede mostrar este elemento",
      en: "Cannot display this element"
    }[context.lang];
  }
};

export { catCommand };