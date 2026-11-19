# Autoglass Parabrisas: sitio web

Sitio one-page de **Autoglass Parabrisas** (Maldonado, Uruguay): importación, venta y colocación de cristales automotrices para todo tipo de vehículo, láminas de seguridad Security Film y venta mayorista para talleres. Toda consulta termina en **WhatsApp** (con un formulario que arma el mensaje, o con un mensaje directo en Security Film y venta mayorista). Incluye un **simulador 3D de la lámina de seguridad**.

- **Stack:** Next.js 15 (App Router, exportación estática), TypeScript, Tailwind CSS 4, React Three Fiber + drei (3D), React Hook Form + Zod, Framer Motion (solo en partes que se cargan bajo demanda).
- **Sin backend:** se despliega como sitio estático en Netlify.

---

## Correrlo en local

Requiere **Node 20 o superior**.

```bash
npm install
npm run dev        # http://localhost:3000
```

Build de producción (genera la carpeta `out/`):

```bash
npm run build
node scripts/serve-out.mjs 4173   # sirve out/ en http://localhost:4173
```

Pruebas:

```bash
npm test                          # tests de la lógica del mensaje de WhatsApp (Vitest)
npm run build && node scripts/e2e-form.mjs --simulador   # prueba de punta a punta del formulario (Playwright)
```

> La primera vez que uses Playwright: `npx playwright install chromium`.

---

## Editar datos del negocio

**Todo está en `src/data/business.ts`:** WhatsApp, teléfono fijo, Instagram, dirección, coordenadas, horarios, zonas de domicilio, si trabajan con seguros o a domicilio, puntaje de Google, URL del sitio y crédito del modelo 3D. El resto del sitio (textos, footer, JSON-LD, formulario y mensaje de WhatsApp) toma los datos de ahí.

| Qué | Archivo |
|---|---|
| Datos del negocio | `src/data/business.ts` |
| Servicios (tarjetas) | `src/data/services.ts` |
| Opciones del formulario y del simulador (servicios, tono de la lámina, vidrios, zonas) | `src/data/options.ts` |
| Datos de Security Film (ficha de la marca) | `src/data/securityFilm.ts` |
| Aseguradoras | `src/data/business.ts` → `insurers` |
| Preguntas frecuentes | `src/data/faq.ts` |
| Galería de trabajos | `src/data/gallery.ts` |
| Reseñas | `src/components/sections/Reviews.tsx` |
| Texto del mensaje de WhatsApp | `src/lib/whatsapp.ts` (con tests en `whatsapp.test.ts`) |
| Validaciones del formulario | `src/lib/quoteSchema.ts` |

Si `worksWithInsurance` o `homeService` se ponen en `false`, se ocultan solos el bloque de seguros y los campos correspondientes del formulario.

---

## Fotos

Las fotos originales van en `Fotos/` y, las de la segunda tanda, en `nuevasfotos/` (**ninguna de las dos carpetas se sube al repositorio**). La lista de fotos, con su recorte, el factor de mejora y las matrículas a censurar, está en `scripts/images.config.mjs`.

1. **Mejora a HD (opcional):** las fotos actuales son capturas de Instagram y Maps. Se les aplica super-resolución con ESRGAN (UpscalerJS, en la GPU vía Playwright) y quedan en `Fotos/hd/<name>.png`. Las dependencias están aparte para no cargar el build de Netlify:
   ```bash
   cd scripts/upscale && npm install && cd ../..
   node --max-old-space-size=6144 scripts/upscale/run.mjs            # todas
   node --max-old-space-size=6144 scripts/upscale/run.mjs portada   # una sola (solo las que tienen `scale`)
   ```
2. **Procesar:**
   ```bash
   npm run images
   ```
   Usa la versión HD si existe y, si no, el recorte de la captura. Les da un acabado suave (contraste y nitidez), **difumina las matrículas** y genera WebP de 480 a 1920 px en `public/img/`. También genera `src/data/images.json`, el favicon y `public/og-image.jpg`.

**Para agregar o reemplazar una foto:**

1. Copiá el archivo a `Fotos/` (o a otra carpeta e indicala con `dir`).
2. Agregá o editá su entrada en `scripts/images.config.mjs`. Si es una foto original y no una captura, sacá `crop` y `scale`.
3. Si se ven matrículas, agregá `plates: [{ x, y, w, h }]`, en fracciones de 0 a 1 de la imagen.
4. Corré `npm run images`.
5. Usá el `name` en `src/data/services.ts` o `src/data/gallery.ts`.

No repitas una misma foto en dos secciones.

---

## Simulador 3D

- Código: `src/components/simulator/`.
  - `SimulatorSection.tsx`: interfaz, carga diferida y detección de dispositivo.
  - `CarScene.tsx`: escena 3D.
  - `Fallback2D.tsx`: versión liviana.
- Modelo optimizado: `public/models/auto.glb` (1,7 MB). El original (`modelocarro/`, 43 MB) no se sube.
- **Rendimiento:**
  - Se descarga solo cuando la sección se acerca a la pantalla, con barra de progreso real.
  - El simulador compara "Sin lámina" y "Con lámina de seguridad (20 %)", aplicada a todos los vidrios (incluido el parabrisas). Carrocería blanca (`paint` en `CarScene.tsx`).
  - Renderiza bajo demanda (`frameloop="demand"`) y se pausa fuera de pantalla.
  - En celular, el auto no captura el scroll hasta tocar "Tocá para girar el auto".
- **Versión liviana:** si no hay WebGL, si el render es por software o si el equipo tiene poca memoria o CPU (o ahorro de datos), se muestra con imágenes del vehículo en 6 ángulos y la lámina como una capa enmascarada sobre los vidrios. Se puede forzar con `?sim=2d` y forzar el 3D con `?sim=3d`.

### Cambiar el modelo 3D

1. Poné el modelo nuevo (glTF o GLB) en una carpeta, por ejemplo `modelocarro/`.
2. En `scripts/optimize-model.mjs`, ajustá `SRC` y el mapa `GLASS_NAMES`, que dice qué mesh es cada vidrio: `glass_windshield` (parabrisas), `glass_rear` (luneta) y `glass_*` para los laterales. Para identificarlos, mirá los nombres y las posiciones de los meshes (el frente del auto tiene que apuntar a +Z).
3. Corré `npm run model`. Genera `public/models/auto.glb` y `src/data/model.json`.
4. Si cambia el tamaño del auto, ajustá en `CarScene.tsx` las constantes de cámara (`EXT_TARGET`, `EXT_DISTANCE`, `DRIVER_EYE` y `DRIVER_LOOK`, que es la posición del conductor) y los puntos de la rajadura en `WindshieldFx`.
5. Regenerá las imágenes de la versión liviana:
   ```bash
   npm run build && npm run render:fallback && npm run build
   ```
6. Actualizá el crédito y la licencia en `business.modelCredit`.

---

## Desplegar en Netlify

El repo incluye `netlify.toml` (build `npm run build`, publica `out/`, Node 22, cabeceras de caché). Cada push a `main` se publica automáticamente.

1. En Netlify: **Add new site → Import an existing project → GitHub** y elegí `zahireldebal/autoglass_parabrisas`.
2. Netlify lee la configuración de `netlify.toml`, así que no hace falta tocar nada más.
3. **Deploy.** La URL actual es `https://autoglassparabriss.netlify.app`. Está definida en **un solo lugar**: `DEFAULT_SITE_URL` en `src/data/business.ts` (o la variable `NEXT_PUBLIC_SITE_URL`, que tiene prioridad). De ahí salen el canonical, og:url, og:image, twitter:image, `sitemap.xml`, `robots.txt` y el JSON-LD.

### Dominio final (autoglassparabrisas.com)

Cuando el cliente apruebe:

1. En Netlify: **Site configuration → Environment variables**, agregá `NEXT_PUBLIC_SITE_URL = https://autoglassparabrisas.com` y volvé a desplegar. También se puede cambiar `DEFAULT_SITE_URL` en `src/data/business.ts`. Esto actualiza el canonical, `sitemap.xml`, `robots.txt`, Open Graph y el JSON-LD.
2. **Domain management → Add a domain:** `autoglassparabrisas.com`. Seguí las instrucciones de DNS de Netlify (registros A/ALIAS al balanceador de Netlify, o cambiar los nameservers a Netlify DNS) y agregá también `www`.
3. Esperá a que se emita el certificado HTTPS (Let's Encrypt, automático).
4. Enviá `https://autoglassparabrisas.com/sitemap.xml` en Google Search Console.

---

## Rendimiento (Lighthouse)

Medido en local sobre el build de producción (`out/`, servido con gzip), con Lighthouse 12. La página incluye el simulador, que se carga en forma diferida.

| Perfil | Performance | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Mobile (Moto G simulado, 4G lenta, CPU ×4) | **75 a 92** según la corrida (mejores: 91 y 92) | 100 | 100 | 100 |
| Desktop | **95 a 99** | 100 | 100 | 100 |

- **Métricas mobile:** FCP 1,5 s · LCP 3,2 a 3,6 s · CLS 0 a 0,003 · TBT 100 a 660 ms.
- **Por qué varía:** el TBT cambia mucho de una corrida a otra en la máquina de desarrollo, que tenía otros procesos abiertos.
- **JS inicial:** 118 KB. El 3D, el formulario, el modal y el lightbox se descargan recién cuando hacen falta.

Para volver a medir:

```bash
npm run build && node scripts/serve-out.mjs 4300
npx lighthouse http://localhost:4300/ --view
```

Medilo también con [PageSpeed Insights](https://pagespeed.web.dev/) sobre la URL publicada en Netlify: es la medición que vale para un celular real.

---

## Créditos

- © 2026 Autoglass Parabrisas · Diseño y desarrollo: MundoWeb · Todos los derechos reservados.
- Modelo 3D: ["Generic Sedan Car"](https://sketchfab.com/3d-models/generic-sedan-car-58c33766470d46e7b2aed542650494e5) por [Márcio Meireles](https://sketchfab.com/marciomeireles), licencia [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/). El modelo fue optimizado (se quitaron partes no visibles y se comprimieron la geometría y las texturas) y el color de la carrocería se modifica en el simulador.

Pendientes de contenido: ver [`PENDIENTES.md`](PENDIENTES.md).
