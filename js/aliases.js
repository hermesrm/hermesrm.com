/* =============================
   aliases.js
   Semantic aliases for CV navigation
   ============================= */

/*
  Los alias NO contienen lógica.
  Simplemente redirigen una entrada directa
  a un comando real existente.
  
  Los alias en inglés funcionan siempre;
  los alias en español también funcionan siempre.
  Esto permite acceder a cualquier comando sin cambiar de idioma.
*/

const aliasRegistry = {
  en: {
    skills: "cat cv/skills",
    competencies: "cat cv/competencies",
    experience: "cat cv/experience",
    education: "cat cv/education",
    projects: "cat cv/projects",
    contact: "cat cv/contact"
  },
  es: {
    habilidades: "cat cv/skills",
    competencias: "cat cv/competencies",
    experiencia: "cat cv/experience",
    educacion: "cat cv/education",
    proyectos: "cat cv/projects",
    contacto: "cat cv/contact",
    // También permitir alias en inglés cuando estamos en español
    skills: "cat cv/skills",
    competencies: "cat cv/competencies",
    experience: "cat cv/experience",
    education: "cat cv/education",
    projects: "cat cv/projects",
    contact: "cat cv/contact"
  }
};

export { aliasRegistry };

