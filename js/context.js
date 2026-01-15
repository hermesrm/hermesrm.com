/* =============================
   context.js
   Session context and helpers
   ============================= */

import { fileSystem } from "./filesystem.js";

/*
  ES: SessionContext almacena todo el estado vivo de la sesión; no guardar estado fuera de aquí.
  EN: SessionContext holds all live session state; do not persist state outside this object.
*/

const SessionContext = {
  cwd: [],                 // Directorio actual como array (ej. ['cv','skills'])
  lang: "es",              // Idioma activo ('es' | 'en')
  history: [],             // Historial de comandos
  historyIndex: null,      // Índice para navegación con ↑ ↓
  visitor: {
    name: null             // Nombre introducido por el visitante
  },
  fs: fileSystem           // Referencia al filesystem virtual
};

/* =============================
   Helpers de contexto
   ============================= */

/* ES: Resuelve el nodo actual desde cwd. EN: Resolve current node from cwd. */
function resolveCwd(context = SessionContext) {
  let node = context.fs;

  for (const dir of context.cwd) {
    if (!node.children || !node.children[dir]) {
      return null;
    }
    node = node.children[dir];
  }

  return node;
}

/* ES: Ruta actual como string (solo para mostrar). EN: Current path string for display. */
function getCwdPath(context = SessionContext) {
  if (!context.cwd.length) return "/";
  return "/" + context.cwd.join("/");
}

/* ES: Resuelve una ruta a un directorio (cd). EN: Resolve a path to a directory (cd). */
function resolvePath(context, path) {
  let parts;
  let node;
  let newCwd = [];

  if (!path || path === "/") {
    return { node: context.fs, cwd: [] };
  }

  // Ruta absoluta
  if (path.startsWith("/")) {
    parts = path.split("/").filter(Boolean);
    node = context.fs;
  }
  // Ruta relativa
  else {
    parts = path.split("/").filter(Boolean);
    node = resolveCwd(context);
    newCwd = [...context.cwd];
  }

  for (const part of parts) {
    if (part === "..") {
      newCwd.pop();
      node = context.fs;
      for (const dir of newCwd) {
        node = node.children[dir];
      }
      continue;
    }

    if (!node.children || !node.children[part]) {
      return null;
    }

    node = node.children[part];
    if (node.type !== "dir") {
      return null;
    }

    newCwd.push(part);
  }

  return { node, cwd: newCwd };
}

/* ES: Resuelve una ruta a un nodo (archivo o dir). EN: Resolve a path to a node (file or dir). */
function resolveNode(context, path) {
  let parts;
  let node;

  if (path.startsWith("/")) {
    parts = path.split("/").filter(Boolean);
    node = context.fs;
  } else {
    parts = path.split("/").filter(Boolean);
    node = resolveCwd(context);
  }

  for (const part of parts) {
    if (!node.children || !node.children[part]) {
      return null;
    }
    node = node.children[part];
  }

  return node;
}

export {
  SessionContext,
  resolveCwd,
  getCwdPath,
  resolvePath,
  resolveNode
};