/* =============================
   main.js
   Application entry point
   ============================= */

import { SessionContext, getCwdPath, resolvePath, resolveCwd } from "./context.js";
import { executeInput, resolveAlias, tokenize } from "./parser.js";
import { aliasRegistry } from "./aliases.js";

// Commands
import { lsCommand, getDisplayName } from "./commands/ls.js";
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
import { rebootCommand } from "./commands/reboot.js";

/* =============================
   DOM references
   ============================= */

const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const promptTextEl = document.getElementById("prompt-text");
const promptSymbolEl = document.getElementById("prompt-symbol");
const inputEl = document.getElementById("command");
const suggestionsEl = document.getElementById("suggestions");

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
  echoCommand,
  rebootCommand
];

/* =============================
   Username constraints
   ============================= */

const USERNAME_MAX_LENGTH = 16;
const PROMPT_USERNAME_REGEX = /^[a-z0-9]+$/; // Solo minúsculas y dígitos, sin espacios
const STORAGE_KEY_PROMPT = "hermesrm_username"; // nombre seguro para el prompt (sin espacios, minúsculas)
const STORAGE_KEY_DISPLAY = "hermesrm_username_display"; // nombre formateado para mensajes

// Formatea el nombre para mostrarlo en texto: primera letra en mayúscula de hasta dos palabras
function formatDisplayName(name) {
  const safe = (name || "guest").toLowerCase();
  const words = safe.split(/\s+/).filter(Boolean).slice(0, 2); // máximo dos palabras

  const formatted = words.map((w, idx) => {
    if (idx < 2 && w.length) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }
    return w;
  });

  return formatted.join(" ");
}

/* =============================
   localStorage helpers
   ============================= */

function saveUsername(promptName, displayName) {
  localStorage.setItem(STORAGE_KEY_PROMPT, promptName);
  localStorage.setItem(STORAGE_KEY_DISPLAY, displayName);
}

function getSavedUsername() {
  const promptName = localStorage.getItem(STORAGE_KEY_PROMPT);
  const displayName = localStorage.getItem(STORAGE_KEY_DISPLAY);
  return {
    prompt: promptName || null,
    display: displayName || null
  };
}

function clearSavedUsername() {
  localStorage.removeItem(STORAGE_KEY_PROMPT);
  localStorage.removeItem(STORAGE_KEY_DISPLAY);
}

/* =============================
   Autocompletion helpers
   ============================= */

function filterAliasesByLanguage(word, lang) {
  const current = aliasRegistry[lang] || {};
  const other = aliasRegistry[lang === "es" ? "en" : "es"] || {};

  // Solo sugerir alias propios del idioma actual (evita los que existen en ambos)
  return Object.keys(current)
    .filter(alias => alias.startsWith(word))
    .filter(alias => !(alias in other));
}

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
    
    // Alias solo del idioma activo (excluye los que también existen en el otro idioma)
    const aliasMatches = filterAliasesByLanguage(word, context.lang);
    
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
    // Traducir nombres y filtrar por lo que el usuario escribió
    const displayItems = items.map(name => ({
      raw: name,
      display: getDisplayName(name, context.lang)
    }));
    
    const matches = displayItems.filter(item => item.display.startsWith(pathPrefix));
    
    // Devolver nombres traducidos para mostrar
    return matches.map(item => baseDir + item.display);
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

function showSuggestions(completions) {
  if (!completions.length) {
    suggestionsEl.style.display = "none";
    suggestionsEl.textContent = "";
    return;
  }

  const label = SessionContext.lang === "es" ? "# Sugerencias: " : "# Suggestions: ";
  suggestionsEl.textContent = label + completions.join(", ");
  suggestionsEl.style.display = "block";
  
  // Hacer scroll para que las sugerencias sean visibles
  suggestionsEl.scrollIntoView({ behavior: "smooth", block: "end" });
}

function clearSuggestions() {
  suggestionsEl.style.display = "none";
  suggestionsEl.textContent = "";
}

/* =============================
   Helpers UI
   ============================= */

function scrollToBottom() {
  terminal.scrollTop = terminal.scrollHeight;
}

function printLine(text, cssClass = "") {
  const div = document.createElement("div");
  // Asegurar que las líneas en blanco se rendericen visualmente
  div.textContent = (text === "" ? "\u00A0" : text);
  if (cssClass) div.classList.add(cssClass);
  output.appendChild(div);
}

// Renderizado específico para la ayuda en columnas flexibles - animado
async function renderHelp(helpData) {
  const addSection = async (title, items) => {
    printLine(title);
    for (const { cmd, desc } of items) {
      const line = document.createElement("div");
      line.classList.add("help-line");

      const cmdSpan = document.createElement("span");
      cmdSpan.classList.add("help-cmd");
      cmdSpan.textContent = cmd;

      const descSpan = document.createElement("span");
      descSpan.classList.add("help-desc");
      descSpan.textContent = desc;

      line.appendChild(cmdSpan);
      line.appendChild(descSpan);
      output.appendChild(line);
      scrollToBottom();
      await new Promise(resolve => setTimeout(resolve, 40)); // pequeño delay entre items
    }
    printLine("");
  };

  await addSection(helpData.primaryTitle, helpData.primary);
  await addSection(helpData.systemTitle, helpData.system);
  printLine(helpData.note, "comment");
}

// Imprime contenido animado carácter por carácter (máquina de escribir)
async function printAnimated(text, delay = 3) {
  const div = document.createElement("div");
  div.style.whiteSpace = "pre-wrap";
  div.style.wordBreak = "break-word";
  output.appendChild(div);
  
  for (let i = 0; i < text.length; i++) {
    div.textContent += text[i];
    scrollToBottom();
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

function removeLastLine() {
  if (output.lastChild) {
    output.removeChild(output.lastChild);
  }
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
  promptSymbolEl.textContent = "$";
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
  const saved = getSavedUsername();
  
  if (saved.prompt) {
    // Hay nombre guardado - preguntar si continuar con él
    SessionContext.visitor.name = saved.prompt; // Prompt seguro: minúsculas, sin espacios
    savedUsernameMode = true;

    const displayName = saved.display || formatDisplayName(saved.prompt);
    
    printLine(`¡Bienvenido/a de vuelta, ${displayName}!`);
    printLine("");
    printLine(SessionContext.lang === "es" ? "¿Deseas continuar con este nombre de usuario? (s/n)" : "Do you want to continue with this username? (y/n)");
    
    if (SessionContext.lang === "es") {
      promptTextEl.innerHTML = "";
      promptSymbolEl.className = "prompt";
      promptSymbolEl.textContent = "Respuesta: ";
    } else {
      promptTextEl.innerHTML = "";
      promptSymbolEl.className = "prompt";
      promptSymbolEl.textContent = "Answer: ";
    }
  } else {
    // Primer acceso - pedir nombre
    if (SessionContext.lang === "es") {
      printLine("¡Bienvenido/a a hermesrm.com!");
      printLine("");
      printLine("Currículum interactivo en modo consola.");
      printLine("Puede explorar el perfil usando comandos.");
      printLine("");
      printLine("Escriba 'help' para ver las opciones disponibles.");
      promptTextEl.innerHTML = "";
      promptSymbolEl.className = "prompt";
      promptSymbolEl.innerHTML = "Nombre <span style=\"color: #0078D4;\">(opcional)</span>: ";
    } else {
      printLine("Welcome to hermesrm.com!");
      printLine("");
      printLine("Interactive résumé in console mode.");
      printLine("You can explore the profile using commands.");
      printLine("");
      printLine("Type 'help' to see available options.");
      promptTextEl.innerHTML = "";
      promptSymbolEl.className = "prompt";
      promptSymbolEl.innerHTML = "Name <span style=\"color: #0078D4;\">(optional)</span>: ";
    }
  }
}

/* =============================
   Input handling
   ============================= */

let awaitingName = true;
let savedUsernameMode = false; // Para detectar si estamos en modo "aceptar nombre previo"
let changingName = false; // Para detectar si estamos cambiando de un nombre previo

async function handleEnter() {
  const rawInput = inputEl.value;
  inputEl.value = "";
  clearSuggestions();

  if (awaitingName) {
    // Modo: Preguntar si continuar con nombre guardado
    if (savedUsernameMode) {
      const response = rawInput.trim().toLowerCase();
      
      if (response === "s" || response === "y" || response === "si" || response === "yes") {
        // Acepta el nombre guardado
        awaitingName = false;
        savedUsernameMode = false;
        
        // Remover la pregunta del usuario
        removeLastLine();
        
        if (SessionContext.lang === "es") {
          printLine("# Consejo: Escriba 'acerca', 'experiencia' o 'help' para comenzar", "comment");
        } else {
          printLine("# Tip: type 'about', 'experience' or 'help' to begin", "comment");
        }
        
        scrollToBottom();
        renderPrompt();
        return;
      } else if (response === "n" || response === "no") {
        // Rechaza y pide nuevo nombre
        savedUsernameMode = false;
        changingName = true; // Marcar que estamos cambiando de nombre
        clearSavedUsername();
        
        if (SessionContext.lang === "es") {
          printLine("Ingrese un nuevo nombre:");
          promptTextEl.innerHTML = "";
          promptSymbolEl.className = "prompt";
          promptSymbolEl.innerHTML = "Nombre <span style=\"color: #0078D4;\">(nuevo)</span>: ";
        } else {
          printLine("Enter a new name:");
          promptTextEl.innerHTML = "";
          promptSymbolEl.className = "prompt";
          promptSymbolEl.innerHTML = "Name <span style=\"color: #0078D4;\">(new)</span>: ";
        }
        

        scrollToBottom();
        inputEl.focus();
        return;
      } else {
        // Respuesta inválida
        if (SessionContext.lang === "es") {
          printLine("Por favor, responde con 's' (sí) o 'n' (no)", "comment");
        } else {
          printLine("Please answer with 'y' (yes) or 'n' (no)", "comment");
        }
        inputEl.focus();
        return;
      }
    }
    
    // Modo: Ingresar nombre por primera vez o nuevo
    const rawName = rawInput.trim();

    // Para mostrar: permitir letras (incluyendo acentos), números y espacios; colapsar múltiples
    const displaySource = rawName
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

    // Para el prompt: minúsculas, sin espacios ni acentos
    let promptName = displaySource
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quitar diacríticos
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    if (!promptName) {
      promptName = "guest";
    } else {
      promptName = promptName.slice(0, USERNAME_MAX_LENGTH);
      if (!PROMPT_USERNAME_REGEX.test(promptName)) {
        promptName = "guest";
      }
    }

    const displayName = formatDisplayName(displaySource || promptName);

    SessionContext.visitor.name = promptName;
    saveUsername(promptName, displayName); // Guardar en localStorage
    awaitingName = false;

    // Si estamos cambiando de un nombre anterior, borrar las líneas previas
    if (changingName) {
      removeLastLine(); // Remove: "Ingrese un nuevo nombre:" / "Enter a new name:"
      removeLastLine(); // Remove: "¿Deseas continuar..." / "Do you want to continue..."
      removeLastLine(); // Remove: línea vacía
      removeLastLine(); // Remove: "Bienvenido de vuelta, nombre!" / "Welcome back, name!"
      changingName = false;
    }

    // Mostrar mensaje de bienvenida con el nombre
    if (SessionContext.lang === "es") {
      printLine(`¡Bienvenido/a, ${displayName}!`);
      printLine("# Consejo: Escriba 'acerca', 'experiencia' o 'help' para comenzar", "comment");
    } else {
      printLine(`Welcome, ${displayName}!`);
      printLine("# Tip: type 'about', 'experience' or 'help' to begin", "comment");
    }

    scrollToBottom();
    renderPrompt();
    return;
  }

  // Normal command execution
  if (rawInput.trim()) {
    SessionContext.history.push(rawInput.trim());
  }
  SessionContext.historyIndex = null;

  const resolvedInput = resolveAlias(rawInput, SessionContext.lang);
  const { command } = tokenize(resolvedInput);
  const isHelpCommand = command === "help";
  const isAliasCommand = Boolean(aliasRegistry[SessionContext.lang]?.[rawInput.trim()]);

  const prompt = buildPrompt();
  printCommandHistory(prompt.userHost, prompt.path, rawInput);

  const result = executeInput(rawInput, SessionContext, commandRegistry);

  // Señal de reinicio de consola
  if (result === "__REBOOT__") {
    // Reset de estado de sesión (manteniendo idioma y FS)
    SessionContext.cwd = [];
    SessionContext.history = [];
    SessionContext.historyIndex = null;
    SessionContext.visitor.name = null;

    // Olvidar nombres guardados para simular primera visita
    clearSavedUsername();

    // Reset de flags locales
    awaitingName = true;
    savedUsernameMode = false;
    changingName = false;

    // Limpiar pantalla y reiniciar flujo
    output.innerHTML = "";
    showWelcome();
    inputEl.focus();
    return;
  }

  if (result) {
    if (result.type === "animated") {
      // Contenido animado (filesystem: acerca, experiencia, etc.)
      printLine("");
      await printAnimated(result.text);
      printLine("");
    } else if (result.type === "help") {
      // Separación visual para ayuda - animado
      printLine("");
      await renderHelp(result);
      printLine("");
    } else if (isAliasCommand || isHelpCommand) {
      // Espacios para comandos alias o help en texto plano - animado
      printLine("");
      await printAnimated(result);
      printLine("");
    } else {
      // Sin espacios extra para comandos nativos - animado
      await printAnimated(result);
    }
  }
  
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
          clearSuggestions();
        } else if (completions.length > 1) {
          // Si hay múltiples, mostrar sugerencias bajo el prompt
          showSuggestions(completions);
        } else {
          clearSuggestions();
        }
      } catch (err) {
        console.error("Error en autocompletación:", err);
      }
    }
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    clearSuggestions();
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
    clearSuggestions();
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
    clearSuggestions();
  }

  // En cualquier otra tecla, ocultar sugerencias para no dejar basura visual
  if (e.key !== "Tab") {
    clearSuggestions();
  }
});

/* =============================
   Focus & init
   ============================= */

document.addEventListener("click", (e) => {
  // Si hay texto seleccionado, no interferar
  const selection = window.getSelection();
  if (selection.toString().length > 0) {
    return;
  }
  
  // Solo enfocar el input si el click NO fue en el output (para permitir seleccionar)
  if (!output.contains(e.target)) {
    inputEl.focus();
  }
});

showWelcome();
inputEl.focus();