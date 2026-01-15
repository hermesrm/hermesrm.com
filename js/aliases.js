/* =============================
   aliases.js
   Semantic aliases for CV navigation
   ============================= */

/*
  ES: Los alias no contienen lógica; redirigen input directo a comandos reales.
      Segmentados por idioma (en/es) y filtrados por autocompletado según idioma activo.
  EN: Aliases carry no logic; they redirect raw input to real commands.
      Segmented by language (en/es) and filtered by autocomplete for active language.
*/

const aliasRegistry = {
  en: {
    about: "cat /cv/about",
    skills: "cat /cv/skills",
    competencies: "cat /cv/competencies",
    experience: "cat /cv/experience",
    education: "cat /cv/education",
    projects: "cat /cv/projects",
    contact: "cat /cv/contact",
    pdf: "cat /cv/pdf"
  },
  es: {
    acerca: "cat /cv/about",
    habilidades: "cat /cv/skills",
    competencias: "cat /cv/competencies",
    experiencia: "cat /cv/experience",
    educacion: "cat /cv/education",
    proyectos: "cat /cv/projects",
    contacto: "cat /cv/contact",
    pdf: "cat /cv/pdf"
  }
};

export { aliasRegistry };

