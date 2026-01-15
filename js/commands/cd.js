/* =============================
   cd.js
   Change directory
   ============================= */

import { resolvePath } from "../context.js";
import { getInternalName } from "./ls.js";

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
    let target = args[0] || "/";
    
    // Traducir el argumento del nombre mostrado al nombre raw del filesystem
    target = getInternalName(target, context.lang);
    
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