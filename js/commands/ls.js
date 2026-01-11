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

  execute(context, args) {
    const node = resolveCwd(context);

    if (!node || node.type !== "dir") {
      return {
        es: "No es un directorio",
        en: "Not a directory"
      }[context.lang];
    }

    const hasLongFlag = args && args.includes("-l");
    const items = Object.entries(node.children);

    if (!hasLongFlag) {
      // Formato simple
      return items.map(([name]) => name).join("  ");
    }

    // Formato largo (-l)
    const lines = items.map(([name, child]) => {
      const type = child.type === "dir" ? "d" : "-";
      const typeStr = child.type === "dir" ? "/" : "";
      return `${type}  ${name}${typeStr}`;
    });

    return lines.join("\n");
  }
};

export { lsCommand };