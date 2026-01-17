# HermesRM - CLI Profile

## Español

### Resumen
`hermesrm.com` es un currículum interactivo que simula una terminal en el navegador. El objetivo es presentar la información profesional (skills, experience, projects, contact, etc.) mediante comandos estilo UNIX dentro de una interfaz visual inspirada en Git Bash.

### Cómo usar
- Abrir `index.html` en un navegador moderno (soporta módulos ES6).
- Al cargar, se pide un nombre opcional; pulsa `Enter` para continuar.
- Escribe comandos en el prompt y pulsa `Enter`.
- Usa `help` para ver la lista de comandos disponibles.

### Accesibilidad y comportamiento
- El `output` expone `role="log"` y `aria-live="polite"` para lectores de pantalla.
- Se respeta `prefers-reduced-motion` desactivando animaciones y scroll suave.
- El input real es invisible y captura el teclado móvil sin romper la selección de texto.

### Estructura del proyecto
- `index.html` — punto de entrada de la app
- `css/terminal.css` — estilos de la terminal
- `js/` — código JS modular
  - `main.js` — entrada de la aplicación, UI y flujo principal
  - `context.js` — sesión, cwd y helpers de filesystem virtual
  - `filesystem.js` — estructura virtual del CV (multilenguaje)
  - `parser.js` — tokenización, alias y dispatch de comandos
  - `aliases.js` — alias semánticos organizados por idioma
  - `commands/` — comandos implementados (ls, cd, cat, help, idioma, history, whoami, pdf, pwd, clear, echo)

### Comandos principales
- `help` — Muestra ayuda general o `help <comando>` para detalle.
- `ls` — Lista el contenido del directorio actual (`ls -l` para modo largo).
- `cd <ruta>` — Cambia de directorio (soporta rutas relativas y absolutas).
- `cat <archivo|sección>` — Muestra contenido multilenguaje de secciones del CV.
- `idioma <es|en>` / `language <es|en>` — Muestra o cambia el idioma de la sesión.
- `pwd` — Muestra la ruta actual.
- `clear` — Limpia la salida de la terminal.
- `echo <texto>` — Muestra texto simple.
- `history` — Muestra historial de comandos.
- `pdf` — Muestra ubicación del CV en PDF.
- `reboot` — Reinicia la sesión simulada.

### Autocompletado (Tab)
- Se añadió autocompletado para comandos, alias y rutas.
- Tab sugiere y autocompleta según el idioma activo.
- Para `cd` y `cat`, Tab intenta completar rutas dentro del filesystem virtual.
- El autocompletado es tolerante a mayúsculas y acentos (ej. `educacion` → `educación`).

### Notas para desarrolladores
- Añadir un comando: crear un archivo en `js/commands/` que exporte un objeto con `{ id, aliases, description, execute(context,args,registry) }` y registrarlo en `main.js`.
- El estado de la sesión vive en `SessionContext` (`context.js`). Evitar persistir estado fuera de este objeto.
- Los alias están en `aliases.js` organizados por idioma (`es`, `en`). El parser usa `resolveAlias(input, lang)`.
- El filesystem virtual (`filesystem.js`) contiene nodos tipo `dir` y `file`. Las secciones del CV usan archivos internos `content` con claves `es` y `en`.
- La salida se imprime con `textContent` y se recorta a un máximo de nodos para evitar crecimiento infinito.
- El historial de comandos se limita para evitar consumo de memoria.

### Recomendaciones
- Mantener las traducciones en ambos idiomas coherentes.
- Para mejorar autocompletado de rutas y/o añadir fuzzy matching, editar `getPathCompletions` y `getCompletions` en `main.js`.
- La impresión de comandos se sanea; conservar `textContent` al extenderla para evitar XSS.
- En móviles se fuerza minúscula inicial solo fuera del flujo de nombre; si cambias el prompt, revisa el handler en `main.js`.
- No hay pruebas automatizadas; si las agregas, usa una carpeta dedicada y evita dejar dependencias si no se usarán.

---

## English

### Summary
`hermesrm.com` is an interactive résumé that emulates a terminal in the browser. It presents professional information (skills, experience, projects, contact, etc.) via UNIX-style commands inside a Git Bash–inspired UI.

### How to use
- Open `index.html` in a modern browser (ES6 modules supported).
- On load, you are prompted for an optional name; press `Enter` to continue.
- Type commands at the prompt and press `Enter`.
- Use `help` to list available commands.

### Accessibility and behavior
- The `output` uses `role="log"` and `aria-live="polite"` for screen readers.
- `prefers-reduced-motion` is respected (no animations or smooth scrolling).
- The real input is invisible and captures mobile keyboard input without breaking selection.

### Project structure
- `index.html` — application entry point
- `css/terminal.css` — terminal styles
- `js/` — modular JS code
  - `main.js` — application entry, UI and main flow
  - `context.js` — session, cwd and virtual filesystem helpers
  - `filesystem.js` — virtual CV structure (multilanguage)
  - `parser.js` — tokenization, alias resolution and command dispatch
  - `aliases.js` — semantic aliases organized by language
  - `commands/` — implemented commands (ls, cd, cat, help, idioma, history, whoami, pdf, pwd, clear, echo)

### Main commands
- `help` — Shows general help or `help <command>` for details.
- `ls` — List directory contents (`ls -l` for long format).
- `cd <path>` — Change directory (supports relative and absolute paths).
- `cat <file|section>` — Show multilingual CV section contents.
- `idioma <es|en>` / `language <es|en>` — Show or change session language.
- `pwd` — Print working directory.
- `clear` — Clear the terminal output.
- `echo <text>` — Print plain text.
- `history` — Show command history.
- `pdf` — Show PDF résumé location.
- `reboot` — Reset the simulated session.

### Autocomplete (Tab)
- Tab autocompletion is implemented for commands, aliases and paths.
- Suggestions are filtered by the active language.
- For `cd` and `cat`, Tab completes paths inside the virtual filesystem.
- Autocomplete is case- and accent-insensitive (e.g. `educacion` → `educación`).

### Developer notes
- To add a command: create a file in `js/commands/` exporting an object `{ id, aliases, description, execute(context,args,registry) }` and register it in `main.js`.
- Session state is kept in `SessionContext` (`context.js`). Do not persist state outside this object.
- Aliases live in `aliases.js` organized under language keys (`es`, `en`). Parser uses `resolveAlias(input, lang)`.
- The virtual filesystem (`filesystem.js`) uses nodes of type `dir` and `file`. CV sections use an internal `content` file per section with `es`/`en` keys.
- Output is rendered with `textContent` and trimmed to a maximum number of nodes to prevent unbounded growth.
- Command history is capped to prevent excessive memory usage.

### Recommendations
- Keep translations synchronized between both languages.
- To improve path autocompletion or add fuzzy search, modify `getPathCompletions` and `getCompletions` in `main.js`.
- Command echo is sanitized; keep using `textContent` when extending to avoid XSS.
- On mobile, lowercase forcing applies only after name entry; if you change the prompt flow, revisit the handler in `main.js`.
- No automated tests are included; if you add them, keep dependencies isolated and remove them if not needed.