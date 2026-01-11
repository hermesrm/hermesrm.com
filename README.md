# hermesrm.com — Interactive CV (Terminal UI)

## Español

### Resumen
`hermesrm.com` es un currículum interactivo que simula una terminal en el navegador. El objetivo es presentar la información profesional (skills, experience, projects, contact, etc.) mediante comandos estilo UNIX dentro de una interfaz visual inspirada en Git Bash.

### Cómo usar
- Abrir `index.html` en un navegador moderno (soporta módulos ES6).
- Al cargar, se pide un nombre opcional; pulsa `Enter` para continuar.
- Escribe comandos en el prompt y pulsa `Enter`.
- Usa `help` para ver la lista de comandos disponibles.

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
- `clear` / `limpiar` — Limpia la salida de la terminal.
- `echo <texto>` — Muestra texto simple.
- `history` — Muestra historial de comandos.
- `pdf` — Muestra ubicación del CV en PDF.

### Autocompletado (Tab)
- Se añadió autocompletado para comandos, alias y rutas.
- Tab sugiere y autocompleta según el idioma activo.
- Para `cd` y `cat`, Tab intenta completar rutas dentro del filesystem virtual.

### Notas para desarrolladores
- Añadir un comando: crear un archivo en `js/commands/` que exporte un objeto con `{ id, aliases, description, execute(context,args,registry) }` y registrarlo en `main.js`.
- El estado de la sesión vive en `SessionContext` (`context.js`). Evitar persistir estado fuera de este objeto.
- Los alias están en `aliases.js` organizados por idioma (`es`, `en`). El parser usa `resolveAlias(input, lang)`.
- El filesystem virtual (`filesystem.js`) contiene nodos tipo `dir` y `file`. Las secciones del CV usan archivos internos `content` con claves `es` y `en`.

### Recomendaciones
- Mantener las traducciones en ambos idiomas coherentes.
- Para mejorar autocompletado de rutas y/o añadir fuzzy matching, editar `getPathCompletions` y `getCompletions` en `main.js`.

---

## English

### Summary
`hermesrm.com` is an interactive résumé that emulates a terminal in the browser. It presents professional information (skills, experience, projects, contact, etc.) via UNIX-style commands inside a Git Bash–inspired UI.

### How to use
- Open `index.html` in a modern browser (ES6 modules supported).
- On load, you are prompted for an optional name; press `Enter` to continue.
- Type commands at the prompt and press `Enter`.
- Use `help` to list available commands.

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
- `clear` / `limpiar` — Clear the terminal output.
- `echo <text>` — Print plain text.
- `history` — Show command history.
- `pdf` — Show PDF résumé location.

### Autocomplete (Tab)
- Tab autocompletion is implemented for commands, aliases and paths.
- Suggestions are filtered by the active language.
- For `cd` and `cat`, Tab completes paths inside the virtual filesystem.

### Developer notes
- To add a command: create a file in `js/commands/` exporting an object `{ id, aliases, description, execute(context,args,registry) }` and register it in `main.js`.
- Session state is kept in `SessionContext` (`context.js`). Do not persist state outside this object.
- Aliases live in `aliases.js` organized under language keys (`es`, `en`). Parser uses `resolveAlias(input, lang)`.
- The virtual filesystem (`filesystem.js`) uses nodes of type `dir` and `file`. CV sections use an internal `content` file per section with `es`/`en` keys.

### Recommendations
- Keep translations synchronized between both languages.
- To improve path autocompletion or add fuzzy search, modify `getPathCompletions` and `getCompletions` in `main.js`.

---

If you want, I can also:
- Add a short examples section with common command sequences.
- Generate a minimal `CONTRIBUTING.md` or `DEVELOPMENT.md` with local setup steps.
- Add inline JSDoc comments to main functions for code documentation.
