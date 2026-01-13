/* =============================
   help.js
   Dynamic help command
   ============================= */

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

    // help (general)
    const lines = [];

    lines.push({
      es: "Comandos disponibles:",
      en: "Available commands:"
    }[context.lang]);

    commandRegistry.forEach(cmd => {
      const name = cmd.aliases[context.lang][0];
      const desc = cmd.description[context.lang];
      lines.push(`${name.padEnd(14)} ${desc}`);
    });

    lines.push("");
    lines.push({
      es: "Nota: Esta es una simulación controlada. No se ejecutan comandos reales.",
      en: "Note: This is a controlled simulation. No real system commands are executed."
    }[context.lang]);

    return lines.join("\n");
  }
};

export { helpCommand };