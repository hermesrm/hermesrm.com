/* =============================
   pwd.js
   Print working directory
   ============================= */

import { getCwdPath } from "../context.js";

const pwdCommand = {
  id: "PWD",
  aliases: {
    es: ["pwd"],
    en: ["pwd"]
  },
  description: {
    es: "Muestra la ruta actual",
    en: "Print working directory"
  },

  execute(context) {
    return getCwdPath(context);
  }
};

export { pwdCommand };
