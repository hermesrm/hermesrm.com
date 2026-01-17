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
const hiddenInputEl = document.getElementById("hidden-input");

const MAX_HISTORY = 200;
const MAX_OUTPUT_NODES = 600;

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

const UI_TEXT = {
  es: {
    welcomeBack: name => `¡Bienvenido/a de vuelta, ${name}!`,
    continueQuestion: "¿Deseas continuar con este nombre de usuario? (s/n)",
    answerLabel: "Respuesta",
    welcomeLines: [
      "¡Bienvenido/a a hermesrm.com!",
      "",
      "Perfil interactivo en modo CLI (Command‑Line Interface)",
      "",
      "Puede explorar el perfil mediante la simulación de comandos.",
      ""
    ],
    nameHint: "Introduzca su nombre si desea personalizar la sesión.",
    nameLabel: "Nombre",
    nameOptional: "(opcional)",
    nameNewHint: "(nuevo)",
    newNamePrompt: "Ingrese un nuevo nombre:",
    startHint: "# Introduzca 'acerca' o 'habilidades' para comenzar; 'help' muestra todos los comandos.",
    invalidYesNo: "Por favor, responde con 's' (sí) o 'n' (no)",
    welcome: name => `¡Bienvenido/a, ${name}!`
  },
  en: {
    welcomeBack: name => `Welcome back, ${name}!`,
    continueQuestion: "Do you want to continue with this username? (y/n)",
    answerLabel: "Answer",
    welcomeLines: [
      "Welcome to hermesrm.com!",
      "",
      "Interactive CLI‑Mode Profile (Command‑Line Interface)",
      "",
      "Explore the profile through simulated commands.",
      ""
    ],
    nameHint: "Enter your name if you want to personalize the session.",
    nameLabel: "Name",
    nameOptional: "(optional)",
    nameNewHint: "(new)",
    newNamePrompt: "Enter a new name:",
    startHint: "# Type 'about' or 'skills' to begin; 'help' shows all commands.",
    invalidYesNo: "Please answer with 'y' (yes) or 'n' (no)",
    welcome: name => `Welcome, ${name}!`
  }
};

function t(key, ...args) {
  const entry = UI_TEXT[SessionContext.lang]?.[key];
  return typeof entry === "function" ? entry(...args) : entry;
}

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
  const normalizedWord = normalizeForMatch(word);

  // Solo sugerir alias propios del idioma actual (evita los que existen en ambos)
  return Object.keys(current)
    .filter(alias => normalizeForMatch(alias).startsWith(normalizedWord))
    .filter(alias => !(alias in other));
}

function normalizeForMatch(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getCompletions(input, context, commandRegistry) {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  
  // Si solo hay una palabra, podría ser comando o alias
  if (parts.length === 1) {
    const word = parts[0].toLowerCase();
    const normalizedWord = normalizeForMatch(word);
    
    if (!word) return [];
    
    // Buscar comandos que coincidan con el idioma actual
    const commandMatches = commandRegistry
      .flatMap(cmd => cmd.aliases[context.lang] || [])
      .filter(alias => normalizeForMatch(alias).startsWith(normalizedWord));
    
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
    
    const normalizedPrefix = normalizeForMatch(pathPrefix);
    const items = Object.keys(currentNode.children || {});
    // Traducir nombres y filtrar por lo que el usuario escribió
    const displayItems = items.map(name => ({
      raw: name,
      display: getDisplayName(name, context.lang)
    }));

    const matches = displayItems.filter(item =>
      normalizeForMatch(item.display).startsWith(normalizedPrefix)
    );
    
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

  // Hacer scroll solo si las sugerencias quedan fuera del viewport visible
  requestAnimationFrame(() => {
    const terminalRect = terminal.getBoundingClientRect();
    const suggestionsRect = suggestionsEl.getBoundingClientRect();
    if (suggestionsRect.bottom > terminalRect.bottom) {
      suggestionsEl.scrollIntoView({ behavior: "auto", block: "end" });
    }
  });
}

function clearSuggestions() {
  suggestionsEl.style.display = "none";
  suggestionsEl.textContent = "";
}

/* =============================
   Helpers UI
   ============================= */

// Helpers para input
function getInputValue() {
  if (!hiddenInputEl) {
    return inputEl.textContent || "";
  }
  return hiddenInputEl.value || "";
}

function setInputValue(value) {
  if (!hiddenInputEl) {
    inputEl.textContent = value;
    return;
  }
  hiddenInputEl.value = value;
  inputEl.textContent = value;
}

function scrollToBottom() {
  terminal.scrollTop = terminal.scrollHeight;
}

function isNearBottom(element, threshold = 80) {
  const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
  return distance <= threshold;
}

function printLine(text, cssClass = "") {
  const div = document.createElement("div");
  // ES: Espacio duro mantiene visibles las líneas en blanco. EN: Non-breaking space keeps blank lines visible.
  div.textContent = (text === "" ? "\u00A0" : text);
  if (cssClass) div.classList.add(cssClass);
  output.appendChild(div);
  trimOutputNodes();
  return div;
}

function trimOutputNodes() {
  while (output.childNodes.length > MAX_OUTPUT_NODES) {
    output.removeChild(output.firstChild);
  }
}

// Renderizado específico para la ayuda en columnas flexibles - animado
async function renderHelp(helpData) {
  // Desactivar scroll suave temporalmente para mejor rendimiento
  const originalScrollBehavior = terminal.style.scrollBehavior;
  terminal.style.scrollBehavior = "auto";
  
  const addSection = async (title, items) => {
    printLine(title);
    printLine("");
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
      trimOutputNodes();
      
      if (isNearBottom(terminal)) {
        terminal.scrollTop = terminal.scrollHeight;
      }
    }
    printLine("");
  };

  await addSection(helpData.primaryTitle, helpData.primary);
  await addSection(helpData.systemTitle, helpData.system);
  printLine(helpData.note, "comment");
  
  // Scroll final
  if (isNearBottom(terminal)) {
    terminal.scrollTop = terminal.scrollHeight;
  }
  
  // Restaurar comportamiento original de scroll
  terminal.style.scrollBehavior = originalScrollBehavior;
}

// Imprime contenido animado carácter por carácter (máquina de escribir)
async function printAnimated(text, delay = 5) {
  const div = document.createElement("div");
  div.style.whiteSpace = "pre-wrap";
  div.style.wordBreak = "break-word";
  output.appendChild(div);
  trimOutputNodes();

  const autoScrollEnabled = isNearBottom(terminal);

  div.textContent = text;
  if (autoScrollEnabled) {
    terminal.scrollTop = terminal.scrollHeight;
  }
}

function removeLastLine() {
  if (output.lastChild) {
    output.removeChild(output.lastChild);
  }
}

function printCommandHistory(userHost, path, command) {
  // ES: Renderiza el prompt evitando HTML del usuario. EN: Renders prompt without injecting user HTML.
  const promptDiv = document.createElement("div");
  const userSpan = document.createElement("span");
  userSpan.className = "prompt";
  userSpan.textContent = userHost;
  const pathSpan = document.createElement("span");
  pathSpan.className = "prompt-path";
  pathSpan.textContent = ` ${path}`;
  promptDiv.appendChild(userSpan);
  promptDiv.appendChild(pathSpan);
  output.appendChild(promptDiv);

  // ES: Comando con símbolo, saneado. EN: Command line with symbol, sanitized.
  const commandDiv = document.createElement("div");
  const symbolSpan = document.createElement("span");
  symbolSpan.className = "prompt-symbol";
  symbolSpan.textContent = "$";
  const textSpan = document.createElement("span");
  textSpan.textContent = ` ${command}`;
  commandDiv.appendChild(symbolSpan);
  commandDiv.appendChild(textSpan);
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
  promptTextEl.textContent = "";
  promptTextEl.append(document.createTextNode(`${prompt.userHost} `));
  const pathSpan = document.createElement("span");
  pathSpan.className = "prompt-path";
  pathSpan.textContent = prompt.path;
  promptTextEl.appendChild(pathSpan);
  promptSymbolEl.className = "prompt-symbol prompt-path";
  promptSymbolEl.textContent = "$\u00A0";
}

function setPromptSymbol(label, hintText = "") {
  promptTextEl.textContent = "";
  promptSymbolEl.className = "prompt";
  promptSymbolEl.textContent = "";
  promptSymbolEl.append(document.createTextNode(label));

  if (hintText) {
    promptSymbolEl.append(document.createTextNode(" "));
    const hintSpan = document.createElement("span");
    hintSpan.className = "prompt-hint";
    hintSpan.textContent = hintText;
    promptSymbolEl.appendChild(hintSpan);
  }

  promptSymbolEl.append(document.createTextNode(":\u00A0"));
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

// ES: Nodo que muestra la instrucción de introducir nombre; se elimina al capturar el nombre.
// EN: Node holding the name instruction line; removed after the name is captured.
let nameHintNode = null;

function showWelcome() {
  const saved = getSavedUsername();
  
  if (saved.prompt) {
    // Hay nombre guardado - preguntar si continuar con él
    SessionContext.visitor.name = saved.prompt; // Prompt seguro: minúsculas, sin espacios
    savedUsernameMode = true;

    const displayName = saved.display || formatDisplayName(saved.prompt);
    
    printLine(t("welcomeBack", displayName));
    printLine("");
    printLine(t("continueQuestion"));

    setPromptSymbol(t("answerLabel"));
  } else {
    // Primer acceso - pedir nombre
    t("welcomeLines").forEach(line => printLine(line));
    nameHintNode = printLine(t("nameHint")); // ES: Se remueve tras capturar. EN: Removed after capture.
    setPromptSymbol(t("nameLabel"), t("nameOptional"));
  }
}

/* =============================
   Input handling
   ============================= */

let awaitingName = true;
let savedUsernameMode = false; // Para detectar si estamos en modo "aceptar nombre previo"
let changingName = false; // Para detectar si estamos cambiando de un nombre previo

async function handleEnter() {
  const rawInput = getInputValue();
  setInputValue("");
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
        
        printLine(t("startHint"), "comment");
        
        scrollToBottom();
        renderPrompt();
        return;
      } else if (response === "n" || response === "no") {
        // Rechaza y pide nuevo nombre
        savedUsernameMode = false;
        changingName = true; // Marcar que estamos cambiando de nombre
        clearSavedUsername();
        
        printLine(t("newNamePrompt"));
        setPromptSymbol(t("nameLabel"), t("nameNewHint"));
        

        scrollToBottom();
        if (hiddenInputEl) hiddenInputEl.focus({ preventScroll: true });
        return;
      } else {
        // Respuesta inválida
        printLine(t("invalidYesNo"), "comment");
        if (hiddenInputEl) hiddenInputEl.focus({ preventScroll: true });
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

    // ES: Elimina la línea de instrucción del nombre si sigue presente. EN: Remove the name hint line if still present.
    if (nameHintNode?.isConnected) {
      nameHintNode.remove();
      nameHintNode = null;
    } else {
      removeLastLine();
    }

    // Si estamos cambiando de un nombre anterior, borrar las líneas previas
    if (changingName) {
      removeLastLine(); // Remove: "Ingrese un nuevo nombre:" / "Enter a new name:"
      removeLastLine(); // Remove: "¿Deseas continuar..." / "Do you want to continue..."
      removeLastLine(); // Remove: línea vacía
      removeLastLine(); // Remove: "Bienvenido de vuelta, nombre!" / "Welcome back, name!"
      changingName = false;
    }

    // Mostrar mensaje de bienvenida con el nombre
    printLine(t("welcome", displayName));
    printLine(t("startHint"), "comment");

    scrollToBottom();
    renderPrompt();
    return;
  }

  // Normal command execution
  if (rawInput.trim()) {
    SessionContext.history.push(rawInput.trim());
    if (SessionContext.history.length > MAX_HISTORY) {
      SessionContext.history = SessionContext.history.slice(-MAX_HISTORY);
    }
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
    if (hiddenInputEl) hiddenInputEl.focus({ preventScroll: true });
    return;
  }

  // ES: Señal para limpiar consola. EN: Clear console signal.
  if (result === "__CLEAR__") {
    output.innerHTML = "";
    renderPrompt();
    scrollToBottom();
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
   Keyboard event handling
   ============================= */

function focusHiddenInput() {
  if (!hiddenInputEl) return;
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) return;
  hiddenInputEl.focus({ preventScroll: true });
}

if (!hiddenInputEl) {
  console.error("hidden-input not found: input handling is disabled.");
} else {
  let isComposing = false;

  const syncInputFromHidden = () => {
    inputEl.textContent = hiddenInputEl.value;
  };

  const setCaretToEnd = () => {
    const end = hiddenInputEl.value.length;
    try {
      hiddenInputEl.setSelectionRange(end, end);
    } catch (err) {
      // Ignorar si el navegador no soporta setSelectionRange
    }
  };

  // Focus en input invisible al tocar la terminal
  terminal.addEventListener("click", focusHiddenInput);

  terminal.addEventListener("touchstart", focusHiddenInput);

  // Manejo de composición (IME)
  hiddenInputEl.addEventListener("compositionstart", () => {
    isComposing = true;
  });

  hiddenInputEl.addEventListener("compositionend", () => {
    isComposing = false;
    syncInputFromHidden();
  });

  // Sincronizar input invisible con span visible
  hiddenInputEl.addEventListener("input", () => {
    syncInputFromHidden();
  });

  // Manejar entrada de teclado
  hiddenInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      clearSuggestions();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (!awaitingName) {
        const input = hiddenInputEl.value;
        try {
          const completions = getCompletions(input, SessionContext, commandRegistry);
          if (completions.length === 1) {
            hiddenInputEl.value = applyCompletion(input, completions[0]);
            inputEl.textContent = hiddenInputEl.value;
            clearSuggestions();
          } else if (completions.length > 1) {
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
      hiddenInputEl.value = history[SessionContext.historyIndex];
      inputEl.textContent = hiddenInputEl.value;
      clearSuggestions();
      return;
    }

    if (e.key === "ArrowDown") {
      if (!history.length) return;
      e.preventDefault();
      if (SessionContext.historyIndex === null) return;
      if (SessionContext.historyIndex < history.length - 1) {
        SessionContext.historyIndex++;
        hiddenInputEl.value = history[SessionContext.historyIndex];
        inputEl.textContent = hiddenInputEl.value;
      } else {
        SessionContext.historyIndex = null;
        hiddenInputEl.value = "";
        inputEl.textContent = "";
      }
      clearSuggestions();
      return;
    }
  });
}

/* =============================
   Init
   ============================= */

showWelcome();

// Auto-focus en el input invisible
setTimeout(() => {
  focusHiddenInput();
}, 100);