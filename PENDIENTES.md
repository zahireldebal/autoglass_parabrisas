# Pendientes: Autoglass Parabrisas

Cosas a confirmar con el cliente o a reemplazar antes de publicar en el dominio final.
Cada punto indica **qué** falta y **dónde** se cambia.

---

## 1. Datos a confirmar con el cliente

| # | Qué confirmar | Dónde se cambia | Estado actual en el sitio |
|---|---|---|---|
| 1.1 | **Tiempo de cambio de parabrisas.** En Instagram dicen "menos de 40 minutos" y en otra pieza "menos de 1 hora". Se usa "en menos de 1 hora". | `src/data/business.ts` → `replacementTime` | "en menos de 1 hora" (hero, cómo trabajamos, simulador, FAQ) |
| 1.2 | **Plazo de la garantía** de colocación. Publican que trabajan "con garantía", pero no dicen el plazo. | `src/data/services.ts` (Cambio de parabrisas) y `src/data/faq.ts` | "Con garantía de colocación" (sin plazo) |
| 1.3 | **¿Cuándo se puede manejar después del cambio?** (tiempo de curado del adhesivo). | `src/data/faq.ts` | "Al terminar la colocación te indicamos el tiempo de espera recomendado." (sin marcador) |
| 1.7 | **Zonas de domicilio sin costo:** Piriápolis, Maldonado, San Carlos y Rocha (sacado de una historia de Instagram). ¿Sigue vigente? ¿Punta del Este entra dentro de "Maldonado"? | `src/data/business.ts` → `homeServiceZones` | Esas 4 zonas |
| 1.8 | **Seguros:** listadas Mapfre, Porto Seguro, SURA, Sancor Seguros, Surco, Berkley, San Cristóbal y HDI (en texto, sin logos). Confirmar si se suman otras. | `src/data/business.ts` → `insurers` | Lista de 8 aseguradoras |
| 1.12 | **Security Film:** la ficha no detalla la composición de la lámina por capas (solo el espesor: 4 MIL / 100 micrones). Si la marca tiene ese dato, se puede sumar. | `src/data/securityFilm.ts` | Solo los datos de la ficha |
| 1.13 | **Fotos con carteles viejos:** en la portada y en otras fotos del taller se ven carteles con la palabra "polarizados" y las líneas Nano Cerámico / Nano Carbon HP. Se recortaron donde se pudo; si cambian esos carteles, conviene sacar fotos nuevas. | `scripts/images.config.mjs` | Recortadas |
| 1.9 | **Formas de pago:** "Hasta 6 pagos con todas las tarjetas". ¿Aceptan transferencia o efectivo? (en el JSON-LD figura "Tarjeta de crédito, tarjeta de débito, efectivo") | `src/data/business.ts` → `installments` y `src/lib/jsonld.ts` → `paymentAccepted` | Hasta 6 pagos |
| 1.10 | **Horarios:** lunes a viernes de 8:00 a 18:30, sábados de 8:00 a 13:00 (coinciden Instagram y Google Maps). ¿Feriados? | `src/data/business.ts` → `hours` | Esos horarios |
| 1.11 | **Promoción "colocación GRATIS con la compra del cristal":** ¿sigue vigente? Es uno de los diferenciales principales. | `src/components/sections/TrustBar.tsx`, `Hero.tsx`, `WhyImport.tsx`, `services.ts`, `faq.ts` | Visible en varias secciones |

## 2. Fotos

| # | Qué falta | Dónde | Nota |
|---|---|---|---|
| 2.1 | **Originales en alta resolución** de todas las fotos. Las actuales son capturas de Instagram y Google Maps (entre 500 y 1270 px), mejoradas a HD con super-resolución (ESRGAN). La mejora ayuda, pero no reemplaza el original: la del hero es un cuadro de video y sigue algo blanda. | Poner en `Fotos/`, ajustar `scripts/images.config.mjs` y correr `npm run images` | Mejoradas a HD, con las matrículas censuradas |
| 2.3 | **Más fotos de trabajos** para la galería (hoy 13; con 17 la grilla vuelve a quedar completa). Idealmente pares **antes/después** del mismo vehículo, para sumar un slider comparativo. | `src/data/gallery.ts` | No hay pares antes/después |
| 2.4 | **Foto de lunetas o laterales** colocados. Hoy se usa la VW Nivus de atrás. | `src/data/services.ts` | — |
| 2.5 | **Foto de interior** (opcional) para la versión liviana del simulador. Hoy se usa un render del modelo 3D. | `public/sim/interior-*.webp` | Funciona con el render |
| 2.6 | **Imagen para compartir** (Open Graph) con foto en alta. | `public/og-image.jpg` (lo genera `npm run images`) | Hecha con la portada nueva |

## 3. Reseñas

| # | Qué falta | Dónde |
|---|---|---|
| 3.1 | La tercera reseña de Instagram ("Excelente servicio, rapidez y muy buenos…") estaba incompleta y **se quitó**. Si consiguen el texto completo, se puede volver a sumar. | `src/components/sections/Reviews.tsx` |
| 3.2 | ¿Se pueden mostrar **reseñas de Google** con nombre? Solo con permiso o vía widget oficial. Hoy solo se muestra el puntaje (4,5 ★ · 176 reseñas) con el botón "Ver reseñas en Google". | `src/components/sections/Reviews.tsx` |
| 3.3 | Actualizar el **puntaje y la cantidad de reseñas** de Google periódicamente (se cargan a mano). | `src/data/business.ts` → `google` |

## 4. Dominio y publicación

| # | Qué hacer | Dónde |
|---|---|---|
| 4.1 | Hoy la URL es `https://autoglassparabriss.netlify.app`. Cuando llegue el dominio definitivo, pasar `SITE_URL` a ese dominio. Se puede hacer en el código o con la variable `NEXT_PUBLIC_SITE_URL` en Netlify (recomendado). Ver README → "Dominio final". | `src/data/business.ts` → `SITE_URL` |
| 4.2 | Conectar el dominio `autoglassparabrisas.com` en Netlify (DNS) y activar HTTPS. Hoy el dominio existe, pero el sitio actual no funciona. | Panel de Netlify |
| 4.4 | Dar de alta el sitio en **Google Search Console** y enviar `sitemap.xml`. Agregar la URL del sitio en la ficha de Google Maps. | — |
| 4.5 | Medir Lighthouse / PageSpeed Insights sobre la URL publicada (ver README → "Rendimiento"). | — |

## 5. Otros

- **Crédito del modelo 3D:** la licencia CC BY 4.0 obliga a mantener "Modelo 3D: Generic Sedan Car por Márcio Meireles · CC BY 4.0" visible (está en el simulador y en el footer). Si se reemplaza el modelo, actualizar `business.modelCredit`.
- **El modelo 3D es un sedán genérico** y no representa un vehículo específico del cliente. El simulador lo aclara con "Representación aproximada".
- **Teléfono fijo 4225 1708:** se usa con el prefijo `+598` en el link `tel:`. Confirmar que funcione desde celulares.
