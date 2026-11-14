/**
 * Recorta las capturas originales de /Fotos (Instagram / Google Maps) para quitar
 * la interfaz y genera WebP optimizados en /public/img en varios anchos.
 * Los originales NO se modifican. Genera src/data/images.json (manifiesto).
 *
 * Uso: npm run images
 * Para reemplazar una foto por su original en alta: poné el archivo en /Fotos,
 * actualizá `source` y `crop` (o quitá `crop`) en la lista de abajo y volvé a correr.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'Fotos');
const OUT = path.join(ROOT, 'public', 'img');
const WIDTHS = [480, 720, 960, 1440];

/** name: nombre de salida · crop: {left, top, width, height} en px de la captura. */
const IMAGES = [
  { name: 'hero-colocacion', source: 'instagram4.png', crop: { left: 476, top: 24, width: 503, height: 860 } },
  { name: 'stock-parabrisas', source: 'sitio2.png', crop: { left: 0, top: 116, width: 1264, height: 738 } },
  { name: 'cambio-parabrisas', source: 'instagram3.png', crop: { left: 12, top: 324, width: 570, height: 314 } },
  { name: 'luneta-nivus', source: 'sitio4.png', crop: { left: 12, top: 0, width: 940, height: 850 } },
  { name: 'lamina-seguridad', source: 'instagram11.png', crop: { left: 698, top: 80, width: 510, height: 690 } },
  { name: 'taller-importacion', source: 'sitio1.png', crop: { left: 72, top: 106, width: 1195, height: 740 } },
  { name: 'fachada-frente', source: 'maps3.png', crop: { left: 70, top: 116, width: 1150, height: 734 } },
  { name: 'filtracion-burlete', source: 'instagram6.png', crop: { left: 366, top: 318, width: 722, height: 356 } },
  { name: 'camaro-taller', source: 'instagram5.png', crop: { left: 366, top: 332, width: 722, height: 448 } },
  { name: 'saveiro-fachada', source: 'instagram8.png', crop: { left: 390, top: 17, width: 640, height: 870 } },
  { name: 'fachada-acceso', source: 'maps2.png', crop: { left: 0, top: 0, width: 716, height: 850 } },
  { name: 'carteles-taller', source: 'sitio3.png', crop: { left: 14, top: 0, width: 708, height: 850 } },
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  // Se conserva lo que agregan otros scripts (p. ej. polarizado-render de render-fallback.mjs)
  const manifestPath = path.join(ROOT, 'src', 'data', 'images.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8').catch(() => '{}'));
  for (const img of IMAGES) {
    const input = path.join(SRC, img.source);
    const base = sharp(input).extract(img.crop);
    const buf = await base
      .modulate({ saturation: 1.05 })
      .linear(1.06, -6) // un poco más de contraste
      .sharpen({ sigma: 0.6 })
      .toBuffer();
    const { width, height } = await sharp(buf).metadata();
    const widths = WIDTHS.filter((w) => w < width);
    widths.push(Math.min(width, 1440));
    const uniq = [...new Set(widths)].sort((a, b) => a - b);
    for (const w of uniq) {
      await sharp(buf)
        .resize({ width: w })
        .webp({ quality: 78, effort: 6 })
        .toFile(path.join(OUT, `${img.name}-${w}.webp`));
    }
    manifest[img.name] = { width, height, sizes: uniq };
    console.log(`✓ ${img.name}  ${width}x${height}  → ${uniq.join(', ')}`);
  }

  // Logo: recorte circular (el PNG original tiene esquinas negras)
  const meta = await sharp(path.join(ROOT, 'logo.png')).metadata();
  const d = Math.min(meta.width, meta.height) - 8;
  const circle = Buffer.from(`<svg width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}"/></svg>`);
  const logo = await sharp(path.join(ROOT, 'logo.png'))
    .extract({ left: Math.round((meta.width - d) / 2), top: Math.round((meta.height - d) / 2), width: d, height: d })
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();
  await sharp(logo).resize(160).webp({ quality: 90 }).toFile(path.join(OUT, 'logo-160.webp'));
  await sharp(logo).resize(320).png().toFile(path.join(OUT, 'logo-320.png'));
  await fs.mkdir(path.join(ROOT, 'src', 'app'), { recursive: true });
  await sharp(logo).resize(180, 180, { fit: 'contain', background: '#0C1014' }).png().toFile(path.join(ROOT, 'src', 'app', 'apple-icon.png'));
  await sharp(logo).resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(ROOT, 'src', 'app', 'icon.png'));
  console.log('✓ logo e íconos');

  // Imagen Open Graph 1200x630 (logo + fachada)
  const bg = await sharp(path.join(SRC, 'maps3.png'))
    .extract({ left: 70, top: 116, width: 1150, height: 604 })
    .resize(1200, 630, { fit: 'cover' })
    .modulate({ brightness: 0.42 })
    .toBuffer();
  const logoBuf = await sharp(logo).resize(300).png().toBuffer();
  const svg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="600" width="1200" height="30" fill="#F0B331"/>
    <text x="400" y="250" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="64" fill="#ffffff">PARABRISAS, CRISTALES</text>
    <text x="400" y="325" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="64" fill="#F0B331">Y POLARIZADO</text>
    <text x="400" y="390" font-family="Arial, sans-serif" font-size="30" fill="#ffffff">Importación directa · Colocación profesional</text>
    <text x="400" y="435" font-family="Arial, sans-serif" font-size="30" fill="#ffffff">Maldonado · 096 126 160</text>
  </svg>`);
  await sharp(bg)
    .composite([{ input: logoBuf, left: 60, top: 165 }, { input: svg, left: 0, top: 0 }])
    .jpeg({ quality: 82 })
    .toFile(path.join(ROOT, 'public', 'og-image.jpg'));
  console.log('✓ og-image.jpg');

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✓ src/data/images.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
