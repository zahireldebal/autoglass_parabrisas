// Super-resolución de las fotos con ESRGAN (UpscalerJS + TF.js WebGL en la GPU vía Playwright).
// Requiere: cd scripts/upscale && npm install  (dependencias aparte, no van al build de Netlify)
// Uso (desde la raíz del proyecto): node --max-old-space-size=6144 scripts/upscale/run.mjs [nombre...]
import { chromium } from 'playwright';
import sharp from 'sharp';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { IMAGES } from '../../scripts/images.config.mjs';

const DIR = path.resolve('scripts/upscale');
const IN = path.join(DIR, 'in');
const OUT = path.resolve('Fotos/hd');
fs.mkdirSync(IN, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
// Solo las fotos con `scale` (las originales grandes no lo necesitan)
const list = IMAGES.filter((i) => i.scale && (!only.length || only.includes(i.name)));

for (const img of list) {
  const src = sharp(path.resolve(img.dir ?? 'Fotos', img.source));
  await (img.crop ? src.extract(img.crop) : src).png().toFile(path.join(IN, `${img.name}.png`));
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.bin': 'application/octet-stream', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = path.join(DIR, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(4400, r));

const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('ERR', e.message));
await page.goto('http://localhost:4400/index.html');
await page.waitForFunction(() => window.ready);
console.log('backend:', await page.evaluate(() => tf.getBackend()));

for (const img of list) {
  const t = Date.now();
  const b64 = await page.evaluate(([src, s]) => window.upscaleImage(src, s), [`/in/${img.name}.png`, img.scale]);
  const buf = Buffer.from(b64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  await sharp(buf).png().toFile(path.join(OUT, `${img.name}.png`));
  const m = await sharp(buf).metadata();
  console.log(`✓ ${img.name} x${img.scale} → ${m.width}x${m.height} (${((Date.now() - t) / 1000).toFixed(1)} s)`);
}
await browser.close();
server.close();
