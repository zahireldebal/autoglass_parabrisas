/**
 * Capturas de página completa en 375 px y 1440 px (requiere `npm run build` antes).
 * Uso: node scripts/screenshot.mjs <carpeta-salida> [selector-o-ancla]
 */
import { chromium } from 'playwright';
import { serve } from './serve-out.mjs';
import path from 'node:path';
import fs from 'node:fs';

const outDir = process.argv[2] || 'screenshots';
const anchor = process.argv[3];
fs.mkdirSync(outDir, { recursive: true });
const server = await serve(4174);
const browser = await chromium.launch();
for (const [name, width, height] of [
  ['mobile', 375, 812],
  ['desktop', 1440, 900],
]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('http://localhost:4174/' + (anchor ? `#${anchor}` : ''), { waitUntil: 'networkidle' });
  // fuerza la carga de imágenes lazy
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  console.log(`${name}: overflow-x=${overflow}px errores=${JSON.stringify(errors)}`);
  await page.close();
}
await browser.close();
server.close();
