/* =============================
   aliases.js
   Semantic aliases for CV navigation
   ============================= */

/*
  Los alias NO contienen lógica.
  Simplemente redirigen una entrada directa
  a un comando real existente.
*/

const aliasRegistry = {
  // English
  skills: "cat cv/skills",
  competencies: "cat cv/competencies",
  experience: "cat cv/experience",
  education: "cat cv/education",
  projects: "cat cv/projects",
  contact: "cat cv/contact",

  // Spanish
  habilidades: "cat cv/skills",
  competencias: "cat cv/competencies",
  experiencia: "cat cv/experience",
  educacion: "cat cv/education",
  proyectos: "cat cv/projects",
  contacto: "cat cv/contact"
};

export { aliasRegistry };