/**
 * Optimiza el modelo 3D original (modelocarro/scene.gltf, 43 MB) a public/models/auto.glb.
 *  - Quita partes que no se ven (motor, chasis inferior).
 *  - Renombra los vidrios con nombres semánticos (los usa el simulador).
 *  - Texturas a WebP de máx. 1024 px; geometría comprimida con Meshopt.
 *
 * Uso: npm run model
 * Para usar OTRO modelo: ver README ("Cambiar el modelo 3D").
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTTextureWebP } from '@gltf-transform/extensions';
import { dedup, prune, meshopt, weld, resample, flatten, join } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('modelocarro/scene.gltf');
const OUT = path.resolve('public/models/auto.glb');

/** Mesh original → nombre semántico (identificados por posición; el frente del auto es +Z). */
const GLASS_NAMES = {
  Object_101: 'glass_windshield', // parabrisas
  Object_42: 'glass_rear', // luneta
  Object_18: 'glass_front_left', // +X = lado del conductor
  Object_19: 'glass_front_right',
  Object_26: 'glass_back_left',
  Object_27: 'glass_back_right',
  Object_24: 'glass_quarter_left',
  Object_25: 'glass_quarter_right',
};
/** Materiales que no se ven desde el simulador. */
const DROP_MATERIALS = new Set(['engine', 'car-bottom']);

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(SRC);
const root = doc.getRoot();

// 1) Quitar partes invisibles
let dropped = 0;
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const prims = mesh.listPrimitives();
  if (prims.every((p) => DROP_MATERIALS.has(p.getMaterial()?.getName() ?? ''))) {
    node.setMesh(null);
    dropped++;
  }
}

// 2) Renombrar vidrios (mesh y nodo). Cada vidrio queda como nodo propio.
const found = new Set();
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const semantic = GLASS_NAMES[mesh.getName()];
  if (semantic) {
    mesh.setName(semantic);
    node.setName(semantic);
    found.add(semantic);
  }
}
const missing = Object.values(GLASS_NAMES).filter((n) => !found.has(n));
if (missing.length) throw new Error(`No se encontraron vidrios: ${missing.join(', ')}`);

// Renombrar materiales clave para encontrarlos fácil en el código
for (const m of root.listMaterials()) {
  if (m.getName() === 'Car_Paint_-_All_Colors') m.setName('paint');
  if (m.getName() === 'Glass_ext-tinted') m.setName('glass_tintable');
  if (m.getName() === 'Glass_ext') m.setName('glass_windshield');
  if (m.getName() === 'interior') m.setName('interior');
}

// 3) Texturas a WebP (máx. 1024 px). Se convierten a mano: algunas son PNG en escala de grises
//    que el textureCompress de gltf-transform no procesa.
doc.createExtension(EXTTextureWebP).setRequired(true);
for (const tex of root.listTextures()) {
  const img = tex.getImage();
  if (!img) continue;
  const isColor = /baseColor/i.test(tex.getName() + (tex.getURI() || ''));
  // Paso 1: decodificar a RGB(A) crudo de 8 bits (normaliza escalas de grises)
  const { data, info } = await sharp(Buffer.from(img))
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const hasAlpha = tex.getMimeType() === 'image/png' && /honeycomb/i.test(tex.getURI() || tex.getName());
  // Paso 2: codificar a WebP
  let pipe = sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } });
  if (!hasAlpha) pipe = pipe.removeAlpha();
  const out = await pipe.webp({ quality: isColor ? 82 : 78, effort: 5 }).toBuffer();
  tex.setImage(new Uint8Array(out)).setMimeType('image/webp');
  if (tex.getURI()) tex.setURI(tex.getURI().replace(/\.(png|jpe?g)$/i, '.webp'));
}

// 4) Optimizaciones de geometría
await doc.transform(
  prune(),
  dedup(),
  flatten(),
  // join fusiona mallas con el mismo material EXCEPTO las que tienen nombre de vidrio
  join({ keepNamed: true, keepMeshes: false, filter: (node) => !node.getName().startsWith('glass_') }),
  weld(),
  resample(),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  prune(),
);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
await io.write(OUT, doc);
const bytes = fs.statSync(OUT).size;
fs.writeFileSync(path.resolve('src/data/model.json'), JSON.stringify({ url: '/models/auto.glb', bytes }, null, 2) + '\n');
console.log(`✓ ${path.relative(process.cwd(), OUT)}  ${(bytes / 1024 / 1024).toFixed(2)} MB  (partes quitadas: ${dropped})`);
console.log('  Vidrios:', [...found].join(', '));
