/**
 * Fotos del sitio. Fuente: capturas de Instagram / Google Maps en /Fotos (no se suben al repo).
 *
 * - dir:   carpeta de la foto original (por defecto 'Fotos'; las de la segunda tanda están en 'nuevasfotos').
 * - crop:  recorte en px (quita la interfaz de Instagram/Maps o textos sobreimpresos). Opcional.
 * - scale: factor de super-resolución (ESRGAN) para llevarla a HD. La versión mejorada
 *          se guarda en Fotos/hd/<name>.png con `node scripts/upscale/run.mjs`.
 * - plates: matrículas a censurar, en FRACCIONES de la imagen recortada (0–1),
 *          así sirven para cualquier resolución: { x, y, w, h }.
 */
export const IMAGES = [
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

  // ——— Segunda tanda (nuevasfotos/): fotos originales de la clienta ———
  // Portada: se recorta el borde izquierdo (cartel viejo con líneas de lámina que ya no se ofrecen).
  { name: 'portada', dir: 'nuevasfotos', source: 'portada.png', crop: { left: 165, top: 0, width: 603, height: 1024 }, scale: 2 },
  { name: 'lamina-suv', dir: 'nuevasfotos', source: 'laminasdeseguridad.png', scale: 2 },
  { name: 'colocacion-parabrisas', dir: 'nuevasfotos', source: 'parabrisas.png', scale: 2 },
  { name: 'luneta-rota', dir: 'nuevasfotos', source: 'cristales laterales lunetas.png', scale: 2 },
  // Recortes que quitan los textos sobreimpresos de las historias de Instagram
  { name: 'sellado-parabrisas', dir: 'nuevasfotos', source: 'cristalrotooagretiado.png', crop: { left: 0, top: 420, width: 1152, height: 1628 } },
  { name: 'parabrisas-colocado', dir: 'nuevasfotos', source: 'fotos.png', crop: { left: 0, top: 470, width: 1152, height: 1578 } },
  // Se recorta el borde derecho (cartel viejo)
  { name: 'cambio-parabrisas-taller', dir: 'nuevasfotos', source: 'cambiandoparabrisas.png', crop: { left: 0, top: 0, width: 670, height: 1448 } },
  { name: 'taller-recepcion', dir: 'nuevasfotos', source: 'fotosprofesionales.png' },
  { name: 'taller-stock', dir: 'nuevasfotos', source: 'fotosprofesionales2.png' },
  { name: 'taller-oficina', dir: 'nuevasfotos', source: 'fotosprofesionales3.png' },
];
