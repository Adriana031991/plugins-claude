// Valida archivos RAML 1.0 con AMF (amf-client-js 5).
// Uso: node validar.js <archivo-o-carpeta> [más rutas...]
// Sale con código 0 si todo es válido y 1 si hay errores.
const fs = require('fs');
const path = require('path');
const amf = require('amf-client-js');

function listarRaml(ruta, salida) {
  const stat = fs.statSync(ruta);
  if (stat.isDirectory()) {
    for (const nombre of fs.readdirSync(ruta)) {
      if (nombre === 'node_modules' || nombre.startsWith('.')) continue;
      listarRaml(path.join(ruta, nombre), salida);
    }
  } else if (ruta.toLowerCase().endsWith('.raml')) {
    salida.push(path.resolve(ruta));
  }
  return salida;
}

async function main() {
  const entradas = process.argv.slice(2);
  if (entradas.length === 0) {
    console.error('Uso: node validar.js <archivo-o-carpeta> [...]');
    process.exit(2);
  }
  const archivos = [];
  for (const e of entradas) {
    if (!fs.existsSync(e)) {
      console.error(`No existe: ${e}`);
      process.exit(2);
    }
    listarRaml(e, archivos);
  }
  if (archivos.length === 0) {
    console.error('No se encontró ningún .raml');
    process.exit(2);
  }

  const cliente = amf.RAMLConfiguration.RAML10().baseUnitClient();
  let conErrores = 0;

  for (const archivo of archivos) {
    // AMF en Windows necesita "file://C:/..." (dos barras); con tres falla. En Linux/Mac
    // la ruta ya empieza con "/", así que queda "file:///...".
    const url = 'file://' + encodeURI(archivo.split('\\').join('/'));
    const parseo = await cliente.parse(url);
    const reporte = await cliente.validate(parseo.baseUnit);
    const resultados = [...parseo.results, ...reporte.results];
    const errores = resultados.filter((r) => r.severityLevel === 'Violation');
    const otros = resultados.filter((r) => r.severityLevel !== 'Violation');
    const rel = path.relative(process.cwd(), archivo);

    if (errores.length === 0) {
      console.log(`OK     ${rel}${otros.length ? `  (${otros.length} aviso/s)` : ''}`);
    } else {
      conErrores++;
      console.log(`ERROR  ${rel}  (${errores.length})`);
      for (const r of errores) {
        const pos = r.position && r.position.start ? `:${r.position.start.line}` : '';
        console.log(`   - ${r.message}${pos ? `  [línea ${pos.slice(1)}]` : ''}`);
      }
    }
    for (const r of otros) console.log(`   · aviso: ${r.message}`);
  }

  console.log(`\n${archivos.length} archivo/s revisado/s, ${conErrores} con errores.`);
  process.exit(conErrores ? 1 : 0);
}

main().catch((e) => {
  console.error('Fallo al ejecutar el validador:', e.message);
  process.exit(2);
});
