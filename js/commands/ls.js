/* =============================
   ls.js
   List directory contents
   ============================= */

import { resolveCwd } from "../context.js";

const lsCommand = {
  id: "LS",
  aliases: {
    es: ["ls"],
    en: ["ls"]
  },
  description: {
    es: "Lista el contenido del directorio actual",
    en: "List directory contents"
  },

  execute(context) {
    const node = resolveCwd(context);

    if (!node || node.type !== "dir") {
      return {
        es: "No es un directorio",
        en: "Not a directory"
      }[context.lang];
    }

    return Object.keys(node.children).join("  ");
  }
};

export { lsCommand };