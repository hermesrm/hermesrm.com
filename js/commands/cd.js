/* =============================
   cd.js
   Change directory
   ============================= */

import { resolvePath } from "../context.js";

const cdCommand = {
  id: "CD",
  aliases: {
    es: ["cd"],
    en: ["cd"]
  },
  description: {
    es: "Cambia el directorio actual",
    en: "Change the current directory"
  },

  execute(context, args) {
    const target = args[0] || "/";
    const result = resolvePath(context, target);

    if (!result) {
      return {
        es: "Directorio no encontrado",
        en: "Directory not found"
      }[context.lang];
    }

    context.cwd = result.cwd;
    return "";
  }
};

export { cdCommand };