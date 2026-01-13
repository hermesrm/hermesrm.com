/* =============================
   aliases.js
   Semantic aliases for CV navigation
   ============================= */

/*
  Los alias NO contienen lógica.
  Simplemente redirigen una entrada directa
  a un comando real existente.
  
  Cada alias está segmentado por idioma:
  - Los alias en "en" solo se sugieren cuando el idioma es inglés
  - Los alias en "es" solo se sugieren cuando el idioma es español
  - El autocompletado filtra por idioma activo
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

