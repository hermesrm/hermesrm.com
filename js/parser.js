/* =============================
   parser.js
   Input resolution and command dispatch
   ============================= */

import { aliasRegistry } from "./aliases.js";

/*
  ES: Resuelve alias simples antes de procesar; aplica solo si el input completo coincide.
  EN: Resolves simple aliases before processing; only when full input matches.
*/
function resolveAlias(input, lang = "es") {
  const trimmed = input.trim();
  return (aliasRegistry[lang] && aliasRegistry[lang][trimmed]) || trimmed;
}

/*
  ES: Tokeniza entrada: primer token comando, resto argumentos.
  EN: Tokenize input: first token command, rest arguments.
*/
function tokenize(input) {
  const tokens = input.trim().split(/\s+/);
  return {
    command: tokens[0] || "",
    args: tokens.slice(1)
  };
}

/*
  ES: Ejecuta un comando desde el registro; devuelve string de salida (o vacío).
  EN: Executes a registry command; returns output string (or empty).
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