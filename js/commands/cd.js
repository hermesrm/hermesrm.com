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
        es: `cd: directorio no encontrado: ${target}`,
        en: `cd: no such file or directory: ${target}`
      }[context.lang];
    }

    if (result.node.type !== "dir") {
      return {
        es: `cd: no es un directorio: ${target}`,
        en: `cd: not a directory: ${target}`
      }[context.lang];
    }

    context.cwd = result.cwd;
    return "";
  }
};

export { cdCommand };