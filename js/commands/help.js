/* =============================
  help.js
  Dynamic help command
  ============================= */

import { aliasRegistry } from "../aliases.js";

const helpCommand = {
  id: "HELP",
  aliases: {
    es: ["help"],
    en: ["help"]
  },
  description: {
    es: "Muestra la ayuda del sistema",
    en: "Show system help"
  },

  execute(context, args, commandRegistry) {
    // help <comando>
    if (args && args.length) {
      const target = args[0];
      const cmd = commandRegistry.find(c =>
        c.aliases[context.lang]?.includes(target)
      );

      if (!cmd) {
        return {
          es: `No hay ayuda disponible para '${target}'`,
          en: `No help available for '${target}'`
        }[context.lang];
      }

      return `${target}\n${cmd.description[context.lang]}`;
    }

    // help (general) -> devolver estructura para renderizar con columnas
    const lang = context.lang;
    const aliases = Object.keys(aliasRegistry[lang] || {}).sort();

    const aliasDescriptions = lang === "es"
      ? {
          acerca: "Ver resumen del CV",
          habilidades: "Ver habilidades",
          competencias: "Ver competencias",
          experiencia: "Ver experiencia",
          educacion: "Ver educación",
          proyectos: "Ver proyectos",
          contacto: "Ver contacto",
          pdf: "Mostrar ubicación del CV en PDF"
        }
      : {
          about: "View CV overview",
          skills: "View skills",
          competencies: "View competencies",
          experience: "View experience",
          education: "View education",
          projects: "View projects",
          contact: "View contact info",
          pdf: "Show PDF résumé location"
        };

    const LINUX_IDS = new Set(["LS", "CD", "CAT", "PWD", "CLEAR", "ECHO", "HISTORY", "WHOAMI", "HELP", "REBOOT"]);
    const native = commandRegistry.filter(c => LINUX_IDS.has(c.id));

    return {
      type: "help",
      lang,
      primaryTitle: lang === "es" ? "Comandos principales:" : "Primary commands:",
      systemTitle: lang === "es" ? "Comandos del sistema (Linux):" : "System commands (Linux):",
      primary: aliases.map(name => ({
        cmd: name,
        desc: aliasDescriptions[name] || (lang === "es" ? "Comando principal" : "Primary command")
      })),
      system: native.map(cmd => ({
        cmd: cmd.aliases[lang][0],
        desc: cmd.description[lang]
      })),
      note: {
        es: "Nota: Esta es una simulación controlada. No se ejecutan comandos reales.",
        en: "Note: This is a controlled simulation. No real system commands are executed."
      }[lang]
    };
  }
};

export { helpCommand };