/* =============================
   cat.js
   Display file or section content
   ============================= */

import { resolveNode } from "../context.js";
import { getInternalName } from "./ls.js";

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

    // ES: Traduce nombre mostrado al nombre interno del filesystem. EN: Translate display name to raw FS name.
    let target = args[0];
    target = getInternalName(target, context.lang);
    
    const node = resolveNode(context, target);

    if (!node) {
      return {
        es: "Archivo o sección no encontrada",
        en: "File or section not found"
      }[context.lang];
    }

    // Directorio de sección del CV (content interno) - devolver como animado
    if (node.type === "dir" && node.children?.content) {
      const text = node.children.content.content[context.lang] || "";
      return {
        type: "animated",
        text: text
      };
    }

    // Archivo multilenguaje explícito - devolver como animado
    if (node.type === "file" && node.content) {
      const text = node.content[context.lang] || {
        es: "Idioma no disponible",
        en: "Language not available"
      }[context.lang];
      return {
        type: "animated",
        text: text
      };
    }

    return {
      es: "No se puede mostrar este elemento",
      en: "Cannot display this element"
    }[context.lang];
  }
};

export { catCommand };