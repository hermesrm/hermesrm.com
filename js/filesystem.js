/* =============================
   filesystem.js
   Virtual filesystem for CV
   ============================= */

/*
  ES: Estructura virtual: dirs (type 'dir') con children; archivos multilenguaje (type 'file').
      El nodo interno 'content' no se expone al usuario, solo sirve para el render.
  EN: Virtual structure: dirs (type 'dir') with children; multilingual files (type 'file').
      Internal 'content' nodes are not exposed to the user, only used for rendering.
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
                es: `Administrador de sistemas con experiencia en la gestión de proyectos estratégicos en el sector privado y en administraciones públicas. He evolucionado desde la coordinación operativa y el análisis de procesos empresariales hacia la administración avanzada de entornos tecnológicos híbridos, con un enfoque integral en seguridad, eficiencia y continuidad operativa.

Actualmente lidero la modernización de infraestructura en el sector salud, administrando Microsoft 365 (Entra ID, Intune, SharePoint, Teams, Exchange Online), Active Directory local y redes corporativas seguras y escalables. He implementado políticas de seguridad, proyectos de migración, modernización de centros de datos, virtualización y soluciones de respaldo, garantizando la confidencialidad, integridad y disponibilidad de la información.

Mi propuesta de valor se basa en:
- Integrar negocio y tecnología, traduciendo necesidades estratégicas en soluciones técnicas efectivas.
- Optimizar procesos mediante automatización, estandarización y control auditable.
- Fortalecer la seguridad y la continuidad operativa en entornos corporativos complejos.
- Impulsar la innovación con visión institucional, asegurando eficiencia y sostenibilidad tecnológica a largo plazo.`,
                en: `Systems administrator with experience managing strategic projects in the private sector and public administrations. I have evolved from operational coordination and business process analysis to advanced administration of hybrid technological environments, with a comprehensive focus on security, efficiency, and operational continuity.

I am currently leading infrastructure modernization in the healthcare sector, administering Microsoft 365 (Entra ID, Intune, SharePoint, Teams, Exchange Online), on‑premises Active Directory, and secure, scalable corporate networks. I have implemented security policies, migration projects, data center modernization, virtualization, and backup solutions, ensuring the confidentiality, integrity, and availability of information.

My value proposition is based on:
- Integrating business and technology, translating strategic needs into effective technical solutions.
- Optimizing processes through automation, standardization, and auditable control.
- Strengthening security and operational continuity in complex corporate environments.
- Driving innovation with an institutional vision, ensuring long‑term technological efficiency and sustainability.`
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
        },

        pdf: {
          type: "dir",
          name: "pdf",
          children: {
            content: {
              type: "file",
              name: "content",
              content: {
                es: `Currículum en PDF disponible en: /assets/HermesRM_CV.pdf`,
                en: `PDF résumé available at: /assets/HermesRM_CV.pdf`
              }
            }
          }
        }
      }
    }
  }
};

export { fileSystem };