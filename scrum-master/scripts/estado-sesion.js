// Al iniciar sesión: si el proyecto tiene .scrum/, imprime un resumen corto del sprint activo.
// La salida se agrega como contexto para Claude. Si no hay .scrum/ o algo falla, no imprime nada.
// Uso manual: node estado-sesion.js [ruta-del-proyecto]
const fs = require("fs");
const path = require("path");

function leerEntrada() {
  if (process.argv[2]) return process.argv[2];
  try {
    if (process.stdin.isTTY) return process.cwd();
    const datos = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
    return datos.cwd || process.cwd();
  } catch {
    return process.cwd();
  }
}

function buscarScrum(desde) {
  let dir = path.resolve(desde);
  while (true) {
    const candidato = path.join(dir, ".scrum");
    if (fs.existsSync(candidato) && fs.statSync(candidato).isDirectory()) return candidato;
    const padre = path.dirname(dir);
    if (padre === dir) return null;
    dir = padre;
  }
}

const campo = (texto, nombre) => {
  const m = texto.match(new RegExp("^- " + nombre + ":[ \\t]*(.+)$", "mi"));
  return m ? m[1].trim() : null;
};

const fecha = (s) => {
  const m = s && s.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};

function diasHabiles(desde, hasta) {
  // Cuenta días hábiles entre desde y hasta, ambos incluidos.
  let n = 0;
  const d = new Date(desde);
  while (d <= hasta) {
    const dia = d.getDay();
    if (dia !== 0 && dia !== 6) n++;
    d.setDate(d.getDate() + 1);
  }
  return n;
}

function siguienteHabil(d) {
  const s = new Date(d);
  do { s.setDate(s.getDate() + 1); } while (s.getDay() === 0 || s.getDay() === 6);
  return s;
}

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const textoFecha = (d) =>
  `${DIAS[d.getDay()]} ${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function principal() {
  const scrum = buscarScrum(leerEntrada());
  if (!scrum) return;

  const leer = (f) => {
    try { return fs.readFileSync(path.join(scrum, f), "utf8").replace(/^﻿/, ""); } catch { return ""; }
  };
  const proyecto = leer("proyecto.md");
  const nombre = (proyecto.match(/^# (.+)$/m) || [, "proyecto"])[1].trim();
  const lineas = [`Proyecto con seguimiento Scrum: "${nombre}" (.scrum/). Usa la skill scrum-master del plugin scrum-master.`];

  const dirSprints = path.join(scrum, "sprints");
  const archivos = fs.existsSync(dirSprints)
    ? fs.readdirSync(dirSprints).filter((f) => /^sprint-\d+\.md$/.test(f)).sort()
    : [];
  const activo = archivos
    .map((f) => ({ f, t: fs.readFileSync(path.join(dirSprints, f), "utf8").replace(/^﻿/, "") }))
    .find((s) => /^activo$/i.test(campo(s.t, "Estado") || ""));

  if (!activo) {
    lineas.push(
      "No hay sprint activo: HOY ES DÍA DE PLANIFICACIÓN. Avísalo y sugiere /planificar " +
        "(primero revisar historias pendientes, completar las incompletas y crear las que faltan)."
    );
    console.log(lineas.join("\n"));
    return;
  }

  const num = (activo.f.match(/\d+/) || ["?"])[0].replace(/^0+(?=\d)/, "");
  // SCRUM_HOY=AAAA-MM-DD permite probar con otra fecha.
  const hoy = (process.env.SCRUM_HOY && fecha(process.env.SCRUM_HOY)) || new Date();
  hoy.setHours(0, 0, 0, 0);
  const inicio = fecha(campo(activo.t, "Inicio"));
  const fin = fecha(campo(activo.t, "Fin"));
  const objetivo = campo(activo.t, "Objetivo") || "(sin objetivo)";

  // Historias del sprint, desde backlog.md (única fuente de su estado).
  const backlog = leer("backlog.md");
  const historias = backlog.split(/^### /m).slice(1).filter((b) => {
    const s = campo(b, "Sprint");
    return s && s.replace(/^0+(?=\d)/, "") === num;
  });
  let total = 0, hechos = 0;
  const cuenta = {};
  for (const h of historias) {
    const estado = (campo(h, "Estado") || "?").toLowerCase();
    const pts = parseInt(campo(h, "Puntos"), 10) || 0;
    if (estado === "descartada") continue;
    total += pts;
    if (estado === "hecha") hechos += pts;
    cuenta[estado] = (cuenta[estado] || 0) + 1;
  }

  let dia = "";
  if (inicio && fin) {
    const totalDias = diasHabiles(inicio, fin);
    const transcurridos = hoy < inicio ? 0 : diasHabiles(inicio, hoy > fin ? fin : hoy);
    dia = `, día ${transcurridos} de ${totalDias} (fin ${campo(activo.t, "Fin")})`;
    if (hoy > fin) {
      lineas.push(
        `ATENCIÓN: el sprint ${num} terminó el ${campo(activo.t, "Fin")}: HOY ES DÍA DE PLANIFICACIÓN. ` +
          "Avísalo: primero /cerrar-sprint (revisión y retro) y luego /planificar (revisar historias pendientes y crear las que faltan)."
      );
    } else if (hoy.getTime() === fin.getTime()) {
      lineas.push(
        `ATENCIÓN: HOY ES EL ÚLTIMO DÍA del sprint ${num}. Avísalo: hoy toca /cerrar-sprint y ` +
          `el ${textoFecha(siguienteHabil(fin))} es la planificación del siguiente sprint.`
      );
    }
  }
  lineas.push(`Sprint ${num} activo${dia}. Objetivo: ${objetivo}`);
  lineas.push(
    `Avance: ${hechos} de ${total} puntos hechos. Historias: ` +
      (Object.entries(cuenta).map(([e, n]) => `${n} ${e}`).join(", ") || "ninguna asignada")
  );

  const impAbiertos = (activo.t.match(/^\|.*\|\s*abierto\s*\|\s*$/gim) || []).length;
  if (impAbiertos) lineas.push(`Impedimentos abiertos: ${impAbiertos}.`);

  const dailies = activo.t.split(/^## Dailies/m)[1] || "";
  const fechasDaily = (dailies.split(/^## /m)[0].match(/^### (\d{4}-\d{2}-\d{2})/gm) || []).map((s) => s.slice(4));
  const ultima = fechasDaily.sort().pop();
  const hoyTxt = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
  if (!ultima) lineas.push("Aún no hay dailies en este sprint.");
  else if (ultima !== hoyTxt && !(fin && hoy > fin) && hoy.getDay() !== 0 && hoy.getDay() !== 6) lineas.push(`Última daily: ${ultima}. Hoy no hay daily; puedes ofrecer /daily en una línea.`);

  console.log(lineas.join("\n"));
}

try { principal(); } catch { /* nunca bloquear el inicio de sesión */ }
