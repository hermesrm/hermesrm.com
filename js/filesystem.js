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
                es: `Estado: módulo en construcción.`,
                en: `Status: module under construction.`
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
                es: `- Microsoft 365 / Entra (identidades, licencias, accesos, MFA, roles, auditoría)
- Exchange Online (mail flow, reglas de transporte, moderación, NDR, alertas)
- SharePoint / OneDrive / Teams (permisos, sincronización, herencia, accesos externos)
- Intune / MDM (inscripción y administración de equipos, perfiles, apps, cumplimiento)
- Migraciones (Google Workspace → Microsoft 365: datos, correo, dominio, adopción)
- Windows / Linux (instalación, configuración, perfiles, troubleshooting)
- NAS Synology (usuarios, permisos, carpetas compartidas, sincronización bidireccional)
- Seguridad (alertas, políticas, control de adjuntos, protección de datos)
- Monitorización (pfSense, Unifi, M365, Entra, NAS)
- Automatización (PowerShell asistido, flujos puntuales)
- Virtualización / Contenedores (VirtualBox labs, Proxmox básico, Docker básico)
- ISO 9001 (procesos, procedimientos, control documental)
- Redes (nivel operativo) (TCP/IP, configuración de IPs estáticas, diagnóstico de conectividad, filtrado MAC, gestión básica de switches)
- Ofimática (Excel, Word, PowerPoint)
`,
                en: `- Microsoft 365 / Entra (identities, licensing, access, MFA, roles, auditing)
- Exchange Online (mail flow, transport rules, moderation, NDR, alerts)
- SharePoint / OneDrive / Teams (permissions, sync, inheritance, external access)
- Intune / MDM (device enrollment and management, profiles, apps, compliance)
- Migrations (Google Workspace → Microsoft 365: data, email, domain, adoption)
- Windows / Linux (installation, configuration, profiles, troubleshooting)
- Synology NAS (users, permissions, shared folders, bidirectional sync)
- Security (alerts, policies, attachment control, data protection)
- Monitoring (pfSense, Unifi, M365, Entra, NAS)
- Automation (assisted PowerShell, targeted workflows)
- Virtualization / Containers (VirtualBox labs, basic Proxmox, basic Docker)
- ISO 9001 (processes, procedures, document control)
- Networking (operational level) (TCP/IP, static IP configuration, connectivity diagnostics, MAC filtering, basic switch management)
- Office productivity (Excel, Word, PowerPoint)`
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
                es: `Estado: módulo en construcción.`,
                en: `Status: module under construction.`
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
                es: `Estado: módulo en construcción.`,
                en: `Status: module under construction.`
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
                es: `Estado: módulo en construcción.`,
                en: `Status: module under construction.`
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
                es: `Estado: módulo en construcción.`,
                en: `Status: module under construction.`
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
                /*
                es: `Currículum en PDF disponible en: /assets/HermesRM_CV.pdf`,
                en: `PDF résumé available at: /assets/HermesRM_CV.pdf`
                */
                es: `Estado: módulo en construcción.`,
                en: `Status: module under construction.`
              }
            }
          }
        }
      }
    }
  }
};

export { fileSystem };