/**
 * Fotos del sitio. Fuente: capturas de Instagram / Google Maps en /Fotos (no se suben al repo).
 *
 * - crop:  recorte en px de la captura (quita la interfaz de Instagram/Maps).
 * - scale: factor de super-resolución (ESRGAN) para llevarla a HD. La versión mejorada
 *          se guarda en Fotos/hd/<name>.png con `node scripts/upscale-images.mjs`.
 * - plates: matrículas a censurar, en FRACCIONES de la imagen recortada (0–1),
 *          así sirven para cualquier resolución: { x, y, w, h }.
 */
export const IMAGES = [
  { name: 'hero-colocacion', source: 'instagram4.png', crop: { left: 476, top: 24, width: 503, height: 860 }, scale: 4 },
  { name: 'stock-parabrisas', source: 'sitio2.png', crop: { left: 0, top: 116, width: 1264, height: 738 }, scale: 2 },
  { name: 'cambio-parabrisas', source: 'instagram3.png', crop: { left: 12, top: 324, width: 570, height: 314 }, scale: 4 },
  { name: 'luneta-nivus', source: 'sitio4.png', crop: { left: 12, top: 0, width: 940, height: 850 }, scale: 2 },
  { name: 'lamina-seguridad', source: 'instagram11.png', crop: { left: 698, top: 80, width: 510, height: 690 }, scale: 4 },
  { name: 'taller-importacion', source: 'sitio1.png', crop: { left: 72, top: 106, width: 1195, height: 740 }, scale: 2 },
  { name: 'fachada-frente', source: 'maps3.png', crop: { left: 70, top: 116, width: 1150, height: 734 }, scale: 2,
    plates: [{ x: 0.703, y: 0.59, w: 0.042, h: 0.028 }, { x: 0.76, y: 0.55, w: 0.034, h: 0.026 }, { x: 0.68, y: 0.527, w: 0.02, h: 0.014 }] },
  { name: 'filtracion-burlete', source: 'instagram6.png', crop: { left: 366, top: 318, width: 722, height: 356 }, scale: 3 },
  { name: 'camaro-taller', source: 'instagram5.png', crop: { left: 366, top: 332, width: 722, height: 448 }, scale: 3,
    plates: [{ x: 0.2, y: 0.76, w: 0.228, h: 0.125 }] },
  { name: 'saveiro-fachada', source: 'instagram8.png', crop: { left: 390, top: 17, width: 640, height: 870 }, scale: 3,
    plates: [{ x: 0.552, y: 0.866, w: 0.172, h: 0.072 }, { x: 0.722, y: 0.604, w: 0.062, h: 0.026 }, { x: 0.895, y: 0.612, w: 0.05, h: 0.022 }] },
  { name: 'fachada-acceso', source: 'maps2.png', crop: { left: 0, top: 0, width: 716, height: 850 }, scale: 3 },
  { name: 'carteles-taller', source: 'sitio3.png', crop: { left: 14, top: 0, width: 708, height: 850 }, scale: 3,
    plates: [{ x: 0.73, y: 0.655, w: 0.045, h: 0.02 }, { x: 0.558, y: 0.615, w: 0.026, h: 0.016 }, { x: 0.62, y: 0.645, w: 0.03, h: 0.02 }, { x: 0.02, y: 0.598, w: 0.022, h: 0.016 }] },
];
