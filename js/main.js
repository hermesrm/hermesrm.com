var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer"); 
var textarea = document.getElementById("texter"); 
var terminal = document.getElementById("terminal");

var git = 0;
var pw = false;
let pwd = false;
var commands = [];

setTimeout(function() {
  loopLines(inicio, "", 80);
  textarea.focus();
}, 100);

window.addEventListener("keyup", enterKey);

console.log("Web basada en un desarrollo de https://github.com/forrestknight/.")
console.log(
  "%c¡Has hackeado my contraseña!😠",
  "color: #04ff00; font-weight: bold; font-size: 24px;"
);
console.log("%cContraseña: '" + contraseña + "' - Me pregunto ¿Que hará eso? 🤔", "color: grey");

//init
textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  if (e.keyCode == 181) {
    document.location.reload(true);
  }
  if (pw) {
    let et = "*";
    let w = textarea.value.length;
    command.innerHTML = et.repeat(w);
    if (textarea.value === contraseña) {
      pwd = true;
    }
    if (pwd && e.keyCode == 13) {
      loopLines(enigma, "color2 margin", 120);
      command.innerHTML = "";
      textarea.value = "";
      pwd = false;
      pw = false;
      liner.classList.remove("contraseña");
    } else if (e.keyCode == 13) {
      addLine("Contraseña erronea", "error", 0);
      command.innerHTML = "";
      textarea.value = "";
      pw = false;
      liner.classList.remove("contraseña");
    }
  } else {
    if (e.keyCode == 13) {
      commands.push(command.innerHTML);
      git = commands.length;
      addLine("usuario@hermesrm.com:~$ " + command.innerHTML, "no-animation", 0);
      commander(command.innerHTML.toLowerCase());
      command.innerHTML = "";
      textarea.value = "";
    }
    if (e.keyCode == 38 && git != 0) {
      git -= 1;
      textarea.value = commands[git];
      command.innerHTML = textarea.value;
    }
    if (e.keyCode == 40 && git != commands.length) {
      git += 1;
      if (commands[git] === undefined) {
        textarea.value = "";
      } else {
        textarea.value = commands[git];
      }
      command.innerHTML = textarea.value;
    }
  }
}

function commander(cmd) {
  switch (cmd.toLowerCase()) {
    case "ayuda":
      loopLines(ayuda, "color2 margin", 80);
      break;
    case "acerca":
      loopLines(acerca, "color2 margin", 80);
      break;
    case "experiencia":
      loopLines(experiencia, "color2 margin", 80);
      break;
    case "formacion":
      loopLines(formacion, "color2 margin", 80);
      break;
    case "sudo":
      addLine("¡Oh no! Lo has logrado...", "color2", 80);
      setTimeout(function() {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      }, 1000); 
      break;
    case "social":
      loopLines(social, "color2 margin", 80);
      break;
    case "enigma":
      liner.classList.add("contraseña");
      pw = true;
      break;
    case "proyectos":
      loopLines(proyectos, "color2 margin", 80);
      break;
    case "contraseña":
      addLine("<span class=\"inherit\"> ¿Enserio?¿Estás bromeando, verdad?¡Tendrás que intentarlo con más ganas!😂</span>", "error", 100);
      break;
    case "historial":
      addLine("<br>", "", 0);
      loopLines(commands, "color2", 80);
      addLine("<br>", "command", 80 * commands.length + 50);
      break;
    case "email":
      addLine('Opening mailto:<a href="mailto:hermesrm@pronto.me">hermesrm@proton.me</a>...', "color2", 80);
      newTab(email);
      break;
    case "limpia":
      setTimeout(function() {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
      }, 1);
      break;
    case "inicio":
      loopLines(inicio, "", 80);
      break;
    // socials
    case "linkedin":
      addLine("Opening LinkedIn...", "color2", 0);
      newTab(linkedin);
      break;
    case "github":
      addLine("Opening GitHub...", "color2", 0);
      newTab(github);
      break;
    default:
      addLine("<span class=\"inherit\">Ese comando no está disponible. Si quieres ver la lista de comandos, escribe <span class=\"command\">'ayuda'</span>.</span>", "error", 100);
      break;
  }
}

function newTab(link) {
  setTimeout(function() {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time) {
  var t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }
  setTimeout(function() {
    var next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;

    before.parentNode.insertBefore(next, before);

    window.scrollTo(0, document.body.offsetHeight);
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function(item, index) {
    addLine(item, style, index * time);
  });
}
