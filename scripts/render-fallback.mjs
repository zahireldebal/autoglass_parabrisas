/**
 * Genera las imágenes de la versión liviana del simulador (sin WebGL) a partir del modelo 3D:
 *   public/sim/{toma}-base.webp  → render con vidrio claro
 *   public/sim/{toma}-side.webp  → máscara (alfa) de laterales + luneta
 *   public/sim/{toma}-ws.webp    → máscara (alfa) del parabrisas
 * Tomas: a0…a5 (6 ángulos), interior, windshield.
 * También genera la imagen ilustrativa de la tarjeta "Polarizado" y src/data/sim-meta.json.
 *
 * Requiere `npm run build` antes (usa el modo captura del simulador: /?sim-render=…).
 * Uso: npm run render:fallback   (volver a correrlo si se cambia el modelo 3D)
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './serve-out.mjs';

const OUT = path.resolve('public/sim');
const IMG = path.resolve('public/img');
const W = 1200;
const H = 900;
const SHOTS = ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'interior', 'windshield'];

fs.mkdirSync(OUT, { recursive: true });
const server = await serve(4190);
// Usa la GPU si está disponible (con SwiftShader también funciona, más lento)
const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

async function capture(shot, layer) {
  await page.goto(`http://localhost:4190/?sim-render=${shot}&layer=${layer}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__simReady === true, null, { timeout: 120000 });
  await page.waitForTimeout(250);
  const buf = await page.locator('[data-capture] canvas').screenshot({ type: 'png' });
  const meta = await page.evaluate(() => window.__simMeta ?? null);
  return { buf, meta };
}

/** Convierte una captura blanco/negro en máscara: blanco con alfa = luminancia. */
async function toMask(png, file) {
  const alpha = await sharp(png).greyscale().blur(0.6).toColourspace('b-w').raw().toBuffer({ resolveWithObject: true });
  await sharp({ create: { width: alpha.info.width, height: alpha.info.height, channels: 3, background: '#ffffff' } })
    .joinChannel(alpha.data, { raw: { width: alpha.info.width, height: alpha.info.height, channels: 1 } })
    .webp({ quality: 60, alphaQuality: 70, effort: 6 })
    .toFile(file);
}

let wsMeta = null;
for (const shot of SHOTS) {
  const base = await capture(shot, 'base');
  if (shot === 'windshield') wsMeta = base.meta;
  await sharp(base.buf).webp({ quality: 74, effort: 6 }).toFile(path.join(OUT, `${shot}-base.webp`));
  const side = await capture(shot, 'mask-side');
  await toMask(side.buf, path.join(OUT, `${shot}-side.webp`));
  const ws = await capture(shot, 'mask-ws');
  await toMask(ws.buf, path.join(OUT, `${shot}-ws.webp`));
  console.log(`✓ ${shot}`);
}

// Imagen ilustrativa para la tarjeta de Polarizado (vista lateral, tono 5 %)
const preview = await capture('a1', 'preview');
const cropped = await sharp(preview.buf).extract({ left: 60, top: 150, width: 1080, height: 675 }).toBuffer();
const manifestPath = path.resolve('src/data/images.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const sizes = [480, 960, 1080];
for (const w of sizes) await sharp(cropped).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(IMG, `polarizado-render-${w}.webp`));
manifest['polarizado-render'] = { width: 1080, height: 675, sizes };
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✓ polarizado-render');

if (wsMeta) {
  fs.writeFileSync(path.resolve('src/data/sim-meta.json'), JSON.stringify({ windshield: wsMeta }, null, 2) + '\n');
  console.log('✓ sim-meta.json', wsMeta);
}

await browser.close();
server.close();
