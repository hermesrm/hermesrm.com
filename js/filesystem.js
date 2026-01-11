/* =============================
   filesystem.js
   Virtual filesystem for CV
   ============================= */

/*
  Estructura:
  - Directorios (type: 'dir') con children
  - Archivos lógicos multilenguaje (type: 'file')
  - El archivo interno 'content' NO es visible para el usuario
*/

const fileSystem = {
  type: "dir",
  name: "/",
  children: {
    cv: {
      type: "dir",
      name: "cv",
      children: {
        about: {
          type: "dir",
          name: "about",
          children: {
            content: {
              type: "file",
              name: "content",
              content: {
                es: `Administrador de Infraestructura Digital e Innovación Tecnológica.

Especialista en administración de sistemas, Microsoft 365, automatización y mejora continua.
Enfoque en seguridad, buenas prácticas y diseño de soluciones mantenibles.`,
                en: `Digital Infrastructure and Technology Innovation Administrator.

Specialized in systems administration, Microsoft 365, automation, and continuous improvement.
Focused on security, best practices, and maintainable solution design.`
              }
            }
          }
        },

        experience: {
          type: "dir",
          name: "experience",
          children: {
            content: {
              type: "file",
              name: "content",
              content: {
                es: `Experiencia profesional centrada en la administración de infraestructura TI,
soporte avanzado, automatización de procesos y gestión de entornos Microsoft 365.`,
                en: `Professional experience focused on IT infrastructure administration,
advanced support, process automation, and Microsoft 365 environment management.`
              }
            }
          }
        },

        skills: {
          type: "dir",
          name: "skills",
          children: {
            content: {
              type: "file",
              name: "content",
              content: {
                es: `SISTEMAS Y PLATAFORMAS
- Windows Server
- Linux (CLI)
- Microsoft 365
- Active Directory / Entra ID
- Intune

AUTOMATIZACIÓN Y SCRIPTING
- PowerShell
- Bash

SEGURIDAD Y BUENAS PRÁCTICAS
- Principio de mínimo privilegio
- Gestión de identidades`,
                en: `SYSTEMS AND PLATFORMS
- Windows Server
- Linux (CLI)
- Microsoft 365
- Active Directory / Entra ID
- Intune

AUTOMATION AND SCRIPTING
- PowerShell
- Bash

SECURITY AND BEST PRACTICES
- Principle of least privilege
- Identity management`
              }
            }
          }
        },

        competencies: {
          type: "dir",
          name: "competencies",
          children: {
            content: {
              type: "file",
              name: "content",
              content: {
                es: `- Pensamiento analítico y crítico
- Mejora continua
- Documentación técnica clara
- Comunicación técnica efectiva`,
                en: `- Analytical and critical thinking
- Continuous improvement
- Clear technical documentation
- Effective technical communication`
              }
            }
          }
        },

        education: {
          type: "dir",
          name: "education",
          children: {
            content: {
              type: "file",
              name: "content",
              content: {
                es: `Formación orientada a tecnología, sistemas y aprendizaje autodidacta continuo.`,
                en: `Education focused on technology, systems, and continuous self-learning.`
              }
            }
          }
        },

        projects: {
          type: "dir",
          name: "projects",
          children: {
            content: {
              type: "file",
              name: "content",
              content: {
                es: `Proyectos de automatización, mejora de procesos y gestión de infraestructura digital.`,
                en: `Projects related to automation, process improvement, and digital infrastructure management.`
              }
            }
          }
        },

        contact: {
          type: "dir",
          name: "contact",
          children: {
            content: {
              type: "file",
              name: "content",
              content: {
                es: `Contacto disponible bajo solicitud profesional.`,
                en: `Contact information available upon professional request.`
              }
            }
          }
        }
      }
    }
  }
};

export { fileSystem };