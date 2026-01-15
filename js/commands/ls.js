/* =============================
   ls.js
   List directory contents
   ============================= */

import { resolveCwd } from "../context.js";

// Mapeo de nombres de directorios por idioma
const directoryNames = {
  about: { es: "acerca", en: "about" },
  skills: { es: "habilidades", en: "skills" },
  competencies: { es: "competencias", en: "competencies" },
  experience: { es: "experiencia", en: "experience" },
  education: { es: "educación", en: "education" },
  projects: { es: "proyectos", en: "projects" },
  contact: { es: "contacto", en: "contact" },
  pdf: { es: "pdf", en: "pdf" }
};

function getDisplayName(name, lang) {
  return directoryNames[name]?.[lang] || name;
}

// Función inversa: convierte nombre traducido al nombre raw del filesystem
function getInternalName(displayName, lang) {
  // Buscar en el mapeo inverso
  for (const [raw, translations] of Object.entries(directoryNames)) {
    if (translations[lang] === displayName) {
      return raw;
    }
  }
  // Si no encuentra, asumir que es el nombre raw
  return displayName;
}

const lsCommand = {
  id: "LS",
  aliases: {
    es: ["ls"],
    en: ["ls"]
  },
  description: {
    es: "Lista el contenido del directorio actual",
    en: "List directory contents"
  },

  execute(context, args) {
    const node = resolveCwd(context);

    if (!node || node.type !== "dir") {
      return {
        es: "No es un directorio",
        en: "Not a directory"
      }[context.lang];
    }

    const hasLongFlag = args && args.includes("-l");
    const items = Object.entries(node.children);

    if (!hasLongFlag) {
      // Formato simple - mostrar nombres traducidos
      return items.map(([name]) => getDisplayName(name, context.lang)).join("  ");
    }

    // Formato largo (-l)
    const lines = items.map(([name, child]) => {
      const displayName = getDisplayName(name, context.lang);
      const type = child.type === "dir" ? "d" : "-";
      const typeStr = child.type === "dir" ? "/" : "";
      return `${type}  ${displayName}${typeStr}`;
    });

    return lines.join("\n");
  }
};

export { lsCommand, getDisplayName, getInternalName };