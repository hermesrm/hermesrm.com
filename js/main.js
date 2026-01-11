/* =============================
   main.js
   Application entry point
   ============================= */

import { SessionContext, getCwdPath, resolvePath, resolveCwd } from "./context.js";
import { executeInput } from "./parser.js";
import { aliasRegistry } from "./aliases.js";

// Commands
import { lsCommand } from "./commands/ls.js";
import { cdCommand } from "./commands/cd.js";
import { catCommand } from "./commands/cat.js";
import { helpCommand } from "./commands/help.js";
import { languageCommand } from "./commands/idioma.js";
import { historyCommand } from "./commands/history.js";
import { whoamiCommand } from "./commands/whoami.js";
import { pdfCommand } from "./commands/pdf.js";
import { pwdCommand } from "./commands/pwd.js";
import { clearCommand } from "./commands/clear.js";
import { echoCommand } from "./commands/echo.js";

/* =============================
   DOM references
   ============================= */

const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const promptTextEl = document.getElementById("prompt-text");
const promptSymbolEl = document.getElementById("prompt-symbol");
const inputEl = document.getElementById("command");

/* =============================
   Command registry
   ============================= */

const commandRegistry = [
  lsCommand,
  cdCommand,
  catCommand,
  helpCommand,
  languageCommand,
  historyCommand,
  whoamiCommand,
  pdfCommand,
  pwdCommand,
  clearCommand,
  echoCommand
];

/* =============================
   Username constraints
   ============================= */

const USERNAME_MAX_LENGTH = 16;
const USERNAME_REGEX = /^[a-z0-9]+$/;

/* =============================
   Autocompletion helpers
   ============================= */

function getCompletions(input, context, commandRegistry) {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  
  // Si solo hay una palabra, podría ser comando o alias
  if (parts.length === 1) {
    const word = parts[0].toLowerCase();
    
    if (!word) return [];
    
    // Buscar comandos que coincidan con el idioma actual
    const commandMatches = commandRegistry
      .flatMap(cmd => cmd.aliases[context.lang] || [])
      .filter(alias => alias.startsWith(word));
    
    // Buscar alias que coincidan solo en el idioma actual
    const aliasMatches = Object.keys(aliasRegistry[context.lang] || {})
      .filter(alias => alias.startsWith(word));
    
    return [...commandMatches, ...aliasMatches];
  }
  
  // Si tiene espacios, es "comando argumento"
  if (parts.length > 1) {
    const command = parts[0].toLowerCase();
    const lastPart = parts[parts.length - 1];
    
    // Para cd y cat, autocomplatar rutas
    if ((command === "cd" || command === "cat") && lastPart) {
      return getPathCompletions(lastPart, context);
    }
  }
  
  return [];
}

function getPathCompletions(pathPrefix, context) {
  try {
    // Si es una ruta vacía o relativa corta, buscar en directorio actual
    let currentNode = null;
    let baseDir = "";
    
    if (!pathPrefix || pathPrefix === "") {
      // Directorio actual
      currentNode = resolvePath(context, "").node || resolveCwd(context);
      baseDir = "";
    } else if (pathPrefix.includes("/")) {
      // Ruta con /
      const lastSlash = pathPrefix.lastIndexOf("/");
      baseDir = pathPrefix.slice(0, lastSlash + 1);
      const searchTerm = pathPrefix.slice(lastSlash + 1);
      
      const dirResult = resolvePath(context, baseDir);
      if (!dirResult) return [];
      
      currentNode = dirResult.node;
      pathPrefix = searchTerm;
    } else {
      // Ruta relativa corta como "c"
      currentNode = resolveCwd(context);
      baseDir = "";
    }
    
    if (!currentNode || currentNode.type !== "dir") {
      return [];
    }
    
    const items = Object.keys(currentNode.children || {});
    const matches = items.filter(name => name.startsWith(pathPrefix));
    
    return matches.map(name => baseDir + name);
  } catch (err) {
    console.error("Error en getPathCompletions:", err);
    return [];
  }
}

function applyCompletion(input, completion) {
  const parts = input.trim().split(/\s+/);
  if (parts.length === 1) {
    return completion;
  }
  parts[parts.length - 1] = completion;
  return parts.join(" ");
}

/* =============================
   Helpers UI
   ============================= */

function scrollToBottom() {
  terminal.scrollTop = terminal.scrollHeight;
}

function printLine(text, cssClass = "") {
  const div = document.createElement("div");
  div.textContent = text;
  if (cssClass) div.classList.add(cssClass);
  output.appendChild(div);
}

function printCommandHistory(userHost, path, command) {
  // Primera línea: prompt con colores
  const promptDiv = document.createElement("div");
  promptDiv.innerHTML = `<span class="prompt">${userHost}</span> <span class="prompt-path">${path}</span>`;
  output.appendChild(promptDiv);
  
  // Segunda línea: comando con $
  const commandDiv = document.createElement("div");
  commandDiv.innerHTML = `<span class="prompt-symbol">$</span> ${command}`;
  output.appendChild(commandDiv);
}

function buildPrompt() {
  const user = SessionContext.visitor.name || "guest";
  const host = "hermesrm.com";
  const path = getCwdPath(SessionContext);
  
  // Reemplazar la ruta de inicio con ~ y mantenerlo en rutas anidadas
  const displayPath = path === "/" ? "~" : "~" + path;
  
  return {
    userHost: `${user}@${host}`,
    path: displayPath
  };
}

function renderPrompt() {
  const prompt = buildPrompt();
  promptTextEl.innerHTML = `${prompt.userHost} <span class="prompt-path">${prompt.path}</span>`;
  promptSymbolEl.className = "prompt-symbol prompt-path";
}

/* =============================
   Language detection
   ============================= */

function detectBrowserLang() {
  const lang = navigator.language?.toLowerCase() || "en";
  return lang.startsWith("es") ? "es" : "en";
}

SessionContext.lang = detectBrowserLang();

/* =============================
   Welcome message
   ============================= */

function showWelcome() {
  if (SessionContext.lang === "es") {
    printLine("Bienvenido a hermesrm.com");
    printLine("\n");
    printLine("Currículum interactivo en modo consola.\n");
    printLine("Puede explorar el perfil usando comandos.");
    printLine("\n");
    printLine("Escriba 'help' para ver las opciones disponibles.\n");
    promptTextEl.innerHTML = "Nombre (opcional): <span class=\"prompt-path\">";
  } else {
    printLine("Welcome to hermesrm.com");
    printLine();
    printLine("Interactive résumé in console mode.\n");
    printLine("You can explore the profile using commands.");
    printLine("\n");
    printLine("Type 'help' to see available options.\n");
    promptTextEl.innerHTML = "Nombre (optional): <span class=\"prompt-path\">";
  }
}

/* =============================
   Input handling
   ============================= */

let awaitingName = true;

function handleEnter() {
  const rawInput = inputEl.value;
  inputEl.value = "";

  // Capture visitor name (with normalization)
  if (awaitingName) {
    let name = rawInput.trim().toLowerCase();

    // Remove all spaces
    name = name.replace(/\s+/g, "");

    // Validate and normalize
    if (!name) {
      name = "guest";
    } else {
      name = name.slice(0, USERNAME_MAX_LENGTH);
      if (!USERNAME_REGEX.test(name)) {
        name = "guest";
      }
    }

    SessionContext.visitor.name = name;
    awaitingName = false;
    
    if (SessionContext.lang === "es") {
      printLine("# Consejo: escriba 'skills', 'experience' o 'help' para comenzar", "comment");
    } else {
      printLine("# Tip: write 'skills', 'experience' or 'help' to begin", "comment");
    }
    
    printLine("");
    scrollToBottom();
    renderPrompt();

    return;
  }

  // Normal command execution
  if (rawInput.trim()) {
    SessionContext.history.push(rawInput.trim());
  }
  SessionContext.historyIndex = null;

  const prompt = buildPrompt();
  printCommandHistory(prompt.userHost, prompt.path, rawInput);

  const result = executeInput(rawInput, SessionContext, commandRegistry);

  if (result) {
    printLine(result);
  }

  // Agregar línea en blanco para separación
  printLine("");
  
  scrollToBottom();
  renderPrompt();
}

/* =============================
   History navigation (↑ ↓)
   ============================= */

inputEl.addEventListener("keydown", (e) => {
  // Tab para autocompletar
  if (e.key === "Tab") {
    e.preventDefault();
    
    // Solo funciona si no estamos esperando el nombre
    if (!awaitingName) {
      const input = inputEl.value;
      
      try {
        const completions = getCompletions(input, SessionContext, commandRegistry);
        
        if (completions.length === 1) {
          // Si hay una única opción, aplicar
          inputEl.value = applyCompletion(input, completions[0]);
        } else if (completions.length > 1) {
          // Si hay múltiples, mostrar sugerencias
          printLine("# Sugerencias: " + completions.join(", "), "comment");
        }
      } catch (err) {
        console.error("Error en autocompletación:", err);
      }
    }
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    handleEnter();
    return;
  }

  const history = SessionContext.history;

  if (e.key === "ArrowUp") {
    if (!history.length) return;
    e.preventDefault();

    if (SessionContext.historyIndex === null) {
      SessionContext.historyIndex = history.length - 1;
    } else if (SessionContext.historyIndex > 0) {
      SessionContext.historyIndex--;
    }

    inputEl.value = history[SessionContext.historyIndex];
  }

  if (e.key === "ArrowDown") {
    if (!history.length) return;
    e.preventDefault();

    if (SessionContext.historyIndex === null) return;

    if (SessionContext.historyIndex < history.length - 1) {
      SessionContext.historyIndex++;
      inputEl.value = history[SessionContext.historyIndex];
    } else {
      SessionContext.historyIndex = null;
      inputEl.value = "";
    }
  }
});

/* =============================
   Focus & init
   ============================= */

document.addEventListener("click", () => inputEl.focus());

showWelcome();
inputEl.focus();