// Corta un rango de páginas de un PDF en un PDF nuevo. Nunca modifica el original.
// Uso:
//   node cortar-pdf.js info  "<pdf>"                         -> imprime el número de páginas
//   node cortar-pdf.js cortar "<pdf>" <desde> <hasta> "<salida.pdf>"   (páginas 1-based, inclusivas)
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function main() {
  const [modo, entrada, a, b, salida] = process.argv.slice(2);
  if (!modo || !entrada) {
    console.error('Uso: node cortar-pdf.js info|cortar "<pdf>" [desde hasta "<salida.pdf>"]');
    process.exit(1);
  }
  const origen = await PDFDocument.load(fs.readFileSync(entrada), { ignoreEncryption: true });
  const total = origen.getPageCount();
  if (modo === 'info') {
    console.log(`${path.basename(entrada)}\t${total} páginas`);
    return;
  }
  if (modo !== 'cortar') throw new Error(`Modo desconocido: ${modo}`);
  const desde = parseInt(a, 10), hasta = Math.min(parseInt(b, 10), total);
  if (!(desde >= 1 && hasta >= desde)) throw new Error(`Rango inválido: ${a}-${b} (total ${total})`);
  if (path.resolve(salida) === path.resolve(entrada)) throw new Error('La salida no puede ser el original');
  const nuevo = await PDFDocument.create();
  const idx = Array.from({ length: hasta - desde + 1 }, (_, i) => desde - 1 + i);
  (await nuevo.copyPages(origen, idx)).forEach(p => nuevo.addPage(p));
  fs.mkdirSync(path.dirname(salida), { recursive: true });
  fs.writeFileSync(salida, await nuevo.save());
  const mb = (fs.statSync(salida).size / 1048576).toFixed(1);
  console.log(`OK ${path.basename(salida)}: páginas ${desde}-${hasta} de ${total} (${mb} MB)`);
}
main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
