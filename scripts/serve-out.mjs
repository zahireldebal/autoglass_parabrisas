/** Servidor estático mínimo para /out (pruebas locales y scripts). Uso: node scripts/serve-out.mjs [puerto] */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve(process.cwd(), 'out');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.glb': 'model/gltf-binary',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
  '.hdr': 'application/octet-stream',
};

export function serve(port = 4173) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404, { 'content-type': 'text/html' });
      return fs.createReadStream(path.join(ROOT, '404.html')).pipe(res);
    }
    const ext = path.extname(file);
    const type = TYPES[ext] || 'application/octet-stream';
    const headers = { 'content-type': type, 'cache-control': 'public, max-age=3600' };
    const compressible = /text|javascript|json|xml|svg/.test(type);
    if (compressible && /gzip/.test(req.headers['accept-encoding'] || '')) {
      res.writeHead(200, { ...headers, 'content-encoding': 'gzip' });
      fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, { ...headers, 'content-length': fs.statSync(file).size });
      fs.createReadStream(file).pipe(res);
    }
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1].endsWith('serve-out.mjs')) {
  const port = Number(process.argv[2] || 4173);
  serve(port).then(() => console.log(`Sirviendo /out en http://localhost:${port}`));
}
