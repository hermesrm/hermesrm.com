/* =============================
   main.js
   Application entry point
   ============================= */

import { SessionContext, getCwdPath } from "./context.js";
import { executeInput } from "./parser.js";

// Commands
import { lsCommand } from "./commands/ls.js";
import { cdCommand } from "./commands/cd.js";
import { catCommand } from "./commands/cat.js";
import { helpCommand } from "./commands/help.js";
import { languageCommand } from "./commands/idioma.js";
import { historyCommand } from "./commands/history.js";
import { whoamiCommand } from "./commands/whoami.js";
import { pdfCommand } from "./commands/pdf.js";

/* =============================
   DOM references
   ============================= */

const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const promptEl = document.querySelector(".prompt");
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
  pdfCommand
];

/* =============================
   Username constraints
   ============================= */

const USERNAME_MAX_LENGTH = 16;
const USERNAME_REGEX = /^[a-z0-9]+$/;

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
  scrollToBottom();
}

function buildPrompt() {
  const user = SessionContext.visitor.name || "guest";
  const host = "hermesrm.com";
  const path = getCwdPath(SessionContext);
  return `${user}@${host}:${path}$`;
}

function renderPrompt() {
  promptEl.textContent = buildPrompt();
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
    promptEl.textContent = "Nombre (opcional):";
  } else {
    printLine("Welcome to hermesrm.com");
    printLine();
    printLine("Interactive résumé in console mode.\n");
    printLine("You can explore the profile using commands.");
    printLine("\n");
    printLine("Type 'help' to see available options.\n");
    promptEl.textContent = "Name (optional):";
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
    renderPrompt();

    if (SessionContext.lang === "es") {
      printLine("# Consejo: escriba 'skills', 'experience' o 'help' para comenzar", "comment");
    } else {
      printLine("# Tip: write 'skills', 'experience' or 'help' to begin", "comment");
    }

    return;
  }

  // Normal command execution
  if (rawInput.trim()) {
    SessionContext.history.push(rawInput.trim());
  }
  SessionContext.historyIndex = null;

  printLine(`${promptEl.textContent} ${rawInput}`);

  const result = executeInput(rawInput, SessionContext, commandRegistry);

  if (result) {
    printLine(result);
  }

  renderPrompt();
}

/* =============================
   History navigation (↑ ↓)
   ============================= */

inputEl.addEventListener("keydown", (e) => {
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