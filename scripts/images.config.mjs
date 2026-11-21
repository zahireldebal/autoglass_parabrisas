/**
 * Fotos del sitio. Fuente: capturas de Instagram / Google Maps en /Fotos (no se suben al repo).
 *
 * - dir:   carpeta de la foto original (por defecto 'Fotos'; las de la segunda tanda están en 'nuevasfotos').
 * - crop:  recorte en px (quita la interfaz de Instagram/Maps o textos sobreimpresos). Opcional.
 * - scale: factor de super-resolución (ESRGAN) para llevarla a HD. La versión mejorada
 *          se guarda en Fotos/hd/<name>.png con `node scripts/upscale/run.mjs`.
 * - plates: matrículas a censurar, en FRACCIONES de la imagen recortada (0–1),
 *          así sirven para cualquier resolución: { x, y, w, h }.
 * - widths / quality / max: anchos, calidad WebP y lado máximo propios (si no, los generales del script).
 *          Nunca se agranda por encima del original.
 */
export const IMAGES = [
  { name: 'luneta-nivus', source: 'sitio4.png', crop: { left: 12, top: 0, width: 940, height: 850 }, scale: 2 },
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
  { name: 'lamina-suv', dir: 'nuevasfotos', source: 'laminasdeseguridad.png', scale: 2 },
  { name: 'colocacion-parabrisas', dir: 'nuevasfotos', source: 'parabrisas.png', scale: 2 },
  { name: 'luneta-rota', dir: 'nuevasfotos', source: 'cristales laterales lunetas.png', scale: 2 },
  // Recortes que quitan los textos sobreimpresos de las historias de Instagram
  { name: 'sellado-parabrisas', dir: 'nuevasfotos', source: 'cristalrotooagretiado.png', crop: { left: 0, top: 420, width: 1152, height: 1628 } },
  { name: 'parabrisas-colocado', dir: 'nuevasfotos', source: 'fotos.png', crop: { left: 0, top: 470, width: 1152, height: 1578 } },
  { name: 'seguro-parabrisas', dir: 'nuevasfotos', source: 'si tu vehiculo tiene seguro tu parabrisas es gratis.png', crop: { left: 0, top: 500, width: 1152, height: 1270 } },
  // Se recorta el borde derecho (cartel viejo)
  { name: 'cambio-parabrisas-taller', dir: 'nuevasfotos', source: 'cambiandoparabrisas.png', crop: { left: 0, top: 0, width: 670, height: 1448 } },
  { name: 'taller-recepcion', dir: 'nuevasfotos', source: 'fotosprofesionales.png' },
  { name: 'taller-stock', dir: 'nuevasfotos', source: 'fotosprofesionales2.png' },

  // ——— Ronda 2 (nuevasfotosv2/): reemplazos pedidos por la clienta ———
  // Portada (hero). Original 1536x2048: se recorta el borde izquierdo (cartel viejo de "polarizados").
  // Más calidad que el resto, para que se vea nítida en pantallas grandes y retina.
  { name: 'hero-taller', dir: 'nuevasfotosv2', source: 'nuevohero.png', crop: { left: 170, top: 0, width: 1366, height: 2048 }, widths: [640, 960, 1280], quality: 88, max: 2048 },
  // Tarjeta "Cristales automotrices" (16:11): se recorta a la derecha del cartel viejo de "polarizados" y por encima de la matrícula.
  { name: 'cristales-saveiro', dir: 'nuevasfotosv2', source: 'cambiarfotocristalesautomotrices DESPUES.png', crop: { left: 590, top: 800, width: 946, height: 650 } },
  // Tarjeta "Venta mayorista" (16:11): franja central de la estantería.
  { name: 'stock-cristales', dir: 'nuevasfotosv2', source: 'ventamayorista DESPUES.png', crop: { left: 0, top: 350, width: 1086, height: 747 } },
  // Galería, "Colocación de lámina de seguridad".
  { name: 'lamina-lateral', dir: 'nuevasfotosv2', source: 'colocacion de laminas de seguridad DESPUES.png' },

  // ——— Ronda 3 (nuevasfotosv3/) ———
  // Galería, "Atención en el taller": frente nuevo de la oficina (reemplaza a taller-oficina, que tenía una goma a medio colocar).
  { name: 'oficina-frente', dir: 'nuevasfotosv3', source: 'foto de atencion en el taller cambiar(despues).png' },
];
