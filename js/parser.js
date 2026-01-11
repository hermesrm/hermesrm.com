/* =============================
   parser.js
   Input resolution and command dispatch
   ============================= */

import { aliasRegistry } from "./aliases.js";

/*
  Resuelve alias simples antes de procesar el comando.
  Solo se aplica si el input completo coincide con un alias.
*/
function resolveAlias(input, lang = "es") {
  const trimmed = input.trim();
  return (aliasRegistry[lang] && aliasRegistry[lang][trimmed]) || trimmed;
}

/*
  Tokeniza la entrada:
  - Primer token: comando
  - Resto: argumentos
*/
function tokenize(input) {
  const tokens = input.trim().split(/\s+/);
  return {
    command: tokens[0] || "",
    args: tokens.slice(1)
  };
}

/*
  Ejecuta un comando a partir del registro.
  Devuelve string (salida) o string vacío.
*/
function executeInput(rawInput, context, commandRegistry) {
  if (!rawInput.trim()) return "";

  const resolvedInput = resolveAlias(rawInput, context.lang);
  const { command, args } = tokenize(resolvedInput);

  const cmd = commandRegistry.find(c =>
    c.aliases[context.lang]?.includes(command)
  );

  if (!cmd) {
    return {
      es: `Comando no reconocido: ${command}`,
      en: `Command not found: ${command}`
    }[context.lang];
  }

  try {
    return cmd.execute(context, args, commandRegistry) || "";
  } catch (error) {
    return {
      es: `Error ejecutando comando: ${error.message}`,
      en: `Error executing command: ${error.message}`
    }[context.lang];
  }
}

export {
  resolveAlias,
  tokenize,
  executeInput
};