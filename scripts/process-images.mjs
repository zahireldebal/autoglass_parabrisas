/**
 * Genera las fotos del sitio en /public/img (WebP en varios anchos) + src/data/images.json.
 *
 * Fuente de cada foto (ver scripts/images.config.mjs):
 *   1. Fotos/hd/<name>.png  → versión en HD (super-resolución ESRGAN, ver README) si existe.
 *   2. Si no, el original (recortado si tiene `crop`) en Fotos/ o en la carpeta indicada en `dir`.
 * Después: acabado suave (contraste/nitidez), censura de matrículas y exportación.
 * Los originales NO se modifican.
 *
 * Uso: npm run images
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { IMAGES } from './images.config.mjs';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'Fotos');
const HD = path.join(SRC, 'hd');
const OUT = path.join(ROOT, 'public', 'img');
const WIDTHS = [480, 720, 960, 1440, 1920];
const MAX = 1920;

/** Difumina las matrículas (cajas en fracciones 0–1 de la imagen). */
async function censorPlates(buf, plates = []) {
  if (!plates.length) return buf;
  const { width, height } = await sharp(buf).metadata();
  const layers = [];
  for (const p of plates) {
    const left = Math.max(0, Math.round(p.x * width));
    const top = Math.max(0, Math.round(p.y * height));
    const w = Math.min(width - left, Math.round(p.w * width));
    const h = Math.min(height - top, Math.round(p.h * height));
    if (w < 2 || h < 2) continue;
    // pixelado + desenfoque: ilegible pero discreto
    const small = await sharp(buf)
      .extract({ left, top, width: w, height: h })
      .resize(Math.max(2, Math.round(w / 14)), Math.max(1, Math.round(h / 14)))
      .toBuffer();
    const patch = await sharp(small).resize(w, h, { kernel: 'cubic' }).blur(Math.max(1.5, Math.min(w, h) / 6)).toBuffer();
    layers.push({ input: patch, left, top });
  }
  return sharp(buf).composite(layers).toBuffer();
}

async function load(img) {
  const hdPath = path.join(HD, `${img.name}.png`);
  if (existsSync(hdPath)) return { pipe: sharp(hdPath), hd: true };
  const pipe = sharp(path.join(ROOT, img.dir ?? 'Fotos', img.source));
  return { pipe: img.crop ? pipe.extract(img.crop) : pipe, hd: false };
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const manifestPath = path.join(ROOT, 'src', 'data', 'images.json');
  const manifest = {};
  const processed = {};

  // Borra los WebP de fotos que ya no están en la configuración
  const names = new Set(IMAGES.map((i) => i.name));
  for (const f of await fs.readdir(OUT)) {
    const m = /^(.+)-\d+\.webp$/.exec(f);
    if (m && !names.has(m[1]) && m[1] !== 'logo') {
      await fs.unlink(path.join(OUT, f));
      console.log(`✗ ${f} (ya no se usa)`);
    }
  }

  for (const img of IMAGES) {
    const { pipe, hd } = await load(img);
    let buf = await pipe
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' })
      .modulate({ saturation: 1.05 })
      .linear(1.05, -5) // un poco más de contraste
      .sharpen(hd ? { sigma: 1.1, m1: 0.6, m2: 2.2 } : { sigma: 0.6 })
      .toBuffer();
    buf = await censorPlates(buf, img.plates);
    processed[img.name] = buf;

    const { width, height } = await sharp(buf).metadata();
    // limpiar versiones anteriores de esta foto
    for (const f of await fs.readdir(OUT)) if (f.startsWith(`${img.name}-`) && f.endsWith('.webp')) await fs.unlink(path.join(OUT, f));
    const sizes = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, MAX)])].sort((a, b) => a - b);
    for (const w of sizes) {
      await sharp(buf)
        .resize({ width: w, kernel: 'lanczos3' })
        .webp({ quality: w >= 1440 ? 74 : 78, effort: 6, smartSubsample: true })
        .toFile(path.join(OUT, `${img.name}-${w}.webp`));
    }
    manifest[img.name] = { width, height, sizes };
    console.log(
      `✓ ${img.name}  ${hd ? 'HD' : 'captura'}  ${width}x${height}  → ${sizes.join(', ')}${img.plates?.length ? `  (${img.plates.length} matrícula/s censurada/s)` : ''}`,
    );
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

  // Imagen Open Graph 1200x630: foto de portada a la derecha, texto y logo a la izquierda
  const portada = await sharp(processed['portada'])
    .resize(560, 630, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 1.15 })
    .toBuffer();
  const fade = Buffer.from(`<svg width="560" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#0C1014" stop-opacity="1"/><stop offset="0.45" stop-color="#0C1014" stop-opacity="0.35"/><stop offset="1" stop-color="#0C1014" stop-opacity="0"/>
    </linearGradient></defs><rect width="560" height="630" fill="url(#g)"/></svg>`);
  const logoBuf = await sharp(logo).resize(120).png().toBuffer();
  const svg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="600" width="1200" height="30" fill="#F0B331"/>
    <text x="200" y="112" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="40" fill="#ffffff">AUTOGLASS <tspan fill="#F0B331">PARABRISAS</tspan></text>
    <text x="64" y="262" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="64" fill="#ffffff">CRISTALES AUTOMOTRICES</text>
    <text x="64" y="334" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="64" fill="#F0B331">Y LÁMINAS DE SEGURIDAD</text>
    <text x="64" y="400" font-family="Arial, sans-serif" font-size="29" fill="#ffffff">Colocación sin costo con la compra del cristal</text>
    <text x="64" y="442" font-family="Arial, sans-serif" font-size="29" fill="#ffffff">Security Film · Venta mayorista para talleres</text>
    <text x="64" y="530" font-family="Arial, sans-serif" font-weight="700" font-size="29" fill="#F0B331">Maldonado · 096 126 160</text>
  </svg>`);
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#0C1014' } })
    .composite([
      { input: portada, left: 640, top: 0 },
      { input: fade, left: 640, top: 0 },
      { input: logoBuf, left: 64, top: 40 },
      { input: svg, left: 0, top: 0 },
    ])
    .jpeg({ quality: 84 })
    .toFile(path.join(ROOT, 'public', 'og-image.jpg'));
  console.log('✓ og-image.jpg');

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✓ src/data/images.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
