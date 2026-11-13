/**
 * Prueba de punta a punta del formulario (requiere `npm run build`).
 * Completa el formulario en varios escenarios y verifica el mensaje y el link de WhatsApp.
 * Uso: node scripts/e2e-form.mjs [--simulador]
 */
import { chromium } from 'playwright';
import { serve } from './serve-out.mjs';

const server = await serve(4175);
const browser = await chromium.launch();
let fails = 0;
const check = (cond, label) => {
  console.log(`${cond ? '✓' : '✗'} ${label}`);
  if (!cond) fails++;
};
const decode = (href) => decodeURIComponent(href.split('text=')[1]);
const show = (msg) => console.log(msg.split('\n').map((l) => '    │ ' + l).join('\n'));

async function scenario(name, viewport, fn) {
  console.log(`\n— ${name} (${viewport.width}px)`);
  const ctx = await browser.newContext({ viewport, hasTouch: viewport.width < 500 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:4175/', { waitUntil: 'networkidle' });
  try {
    await fn(page);
  } catch (e) {
    check(false, `excepción: ${e.message.split('\n')[0]}`);
  }
  check(errors.length === 0, `sin errores JS ${errors.length ? JSON.stringify(errors) : ''}`);
  await ctx.close();
}

// 1) Modal desde el botón de servicio: cambio de parabrisas, CON seguro, en taller
await scenario('Servicio → modal, con seguro, taller', { width: 1440, height: 900 }, async (page) => {
  await page.getByRole('button', { name: 'Consultar por Cambio de parabrisas' }).click();
  const dlg = page.getByRole('dialog');
  await dlg.waitFor();
  check((await dlg.getByLabel('Servicio').inputValue()) === 'Cambio de parabrisas', 'servicio preseleccionado');
  await dlg.getByRole('button', { name: 'Ver mensaje' }).click();
  check(await dlg.getByText('Contanos tu nombre').isVisible(), 'muestra error de nombre en español');
  await dlg.getByLabel('Nombre').fill('Juan Pérez');
  await dlg.getByPlaceholder('Marca (ej. Toyota)').fill('Toyota');
  await dlg.getByPlaceholder('Modelo (ej. Corolla)').fill('Corolla');
  await dlg.getByPlaceholder('Año (ej. 2018)').fill('2018');
  await dlg.locator('label.chip', { hasText: /^Sí$/ }).click();
  await dlg.getByLabel('Aseguradora (opcional)').fill('BSE');
  await dlg.locator('label.chip', { hasText: 'En el taller' }).click();
  await dlg.locator('label.chip', { hasText: 'Tarde' }).click();
  await dlg.getByLabel('Comentario (opcional)').fill('Tiene una rajadura del lado del conductor.');
  await dlg.getByRole('button', { name: 'Ver mensaje' }).click();
  await dlg.getByText('Revisá tu mensaje').waitFor();
  const href = await dlg.getByTestId('send-whatsapp').getAttribute('href');
  const msg = decode(href);
  show(msg);
  check(href.startsWith('https://wa.me/59896126160?text='), 'link wa.me al número del negocio');
  check(msg.startsWith('Hola, soy *Juan Pérez*, quiero consultar por *Cambio de parabrisas*'), 'saludo correcto');
  check(msg.includes('Vehículo: *Toyota Corolla 2018*'), 'vehículo');
  check(msg.includes('Es por seguro: *Sí* (BSE)'), 'seguro con aseguradora');
  check(msg.includes('Lugar: *En el taller*'), 'taller');
  check(msg.includes('Franja preferida: por la *tarde*'), 'franja');
  check(await dlg.getByText('Si tenés fotos del daño').isVisible(), 'aviso de fotos');
  await dlg.getByRole('button', { name: 'Editar' }).click();
  check((await dlg.getByLabel('Nombre').inputValue()) === 'Juan Pérez', 'Editar conserva los datos');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  check((await page.getByRole('dialog').count()) === 0, 'ESC cierra el modal');
  const draft = await page.evaluate(() => localStorage.getItem('autoglass-cotizacion-borrador-v1'));
  check(!!draft && draft.includes('Juan Pérez'), 'borrador guardado en localStorage');
  await page.reload({ waitUntil: 'networkidle' });
  const name = await page.locator('#contacto form').getByLabel('Nombre').inputValue();
  check(name === 'Juan Pérez', 'el borrador se recupera al recargar');
});

// 2) Formulario de contacto en 375 px: SIN seguro, A DOMICILIO con zona
await scenario('Contacto, sin seguro, domicilio', { width: 375, height: 812 }, async (page) => {
  const form = page.locator('#contacto form');
  await form.scrollIntoViewIfNeeded();
  await form.getByLabel('Nombre').fill('Ana Gómez');
  await form.getByLabel('Servicio').selectOption('Vidrio lateral');
  await form.getByPlaceholder('Marca (ej. Toyota)').fill('Volkswagen');
  await form.getByPlaceholder('Modelo (ej. Corolla)').fill('Gol');
  await form.locator('label.chip', { hasText: /^No$/ }).click();
  await form.locator('label.chip', { hasText: 'A domicilio' }).click();
  await form.getByRole('button', { name: 'Ver mensaje' }).click();
  check(await form.getByText('Elegí la zona').isVisible(), 'pide zona si es a domicilio');
  await form.locator('label.chip', { hasText: 'San Carlos' }).click();
  const day = await page.evaluate(() => {
    const d = new Date(Date.now() + 3 * 86400000);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  await form.getByLabel('Día preferido (opcional)').fill(day);
  await form.locator('label.chip', { hasText: 'Mañana' }).click();
  await form.getByRole('button', { name: 'Ver mensaje' }).click();
  const sec = page.locator('#contacto');
  await sec.getByText('Revisá tu mensaje').waitFor();
  const msg = decode(await sec.getByTestId('send-whatsapp').getAttribute('href'));
  show(msg);
  check(msg.includes('Es por seguro: *No*'), 'sin seguro');
  check(msg.includes('Lugar: *A domicilio*, zona *San Carlos*'), 'domicilio con zona');
  check(/Día preferido: \*\S+ \d+ de \S+\*, por la \*mañana\*/u.test(msg), 'día y franja');
  check(!msg.includes('Comentario'), 'omite campos vacíos');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  check(overflow === 0, 'sin scroll horizontal en 375 px');
});

// 3) Polarizado con detalles
await scenario('Polarizado desde tarjeta', { width: 375, height: 812 }, async (page) => {
  await page.getByRole('button', { name: 'Consultar por Polarizado' }).click();
  const dlg = page.getByRole('dialog');
  await dlg.waitFor();
  await dlg.getByLabel('Nombre').fill('Sofi');
  await dlg.locator('label.chip', { hasText: '20 %' }).click();
  await dlg.getByLabel('Tipo de lámina').selectOption('nano-ceramico');
  await dlg.locator('label.chip', { hasText: 'Laterales y luneta' }).click();
  await dlg.getByPlaceholder('Marca (ej. Toyota)').fill('Chevrolet');
  await dlg.getByPlaceholder('Modelo (ej. Corolla)').fill('Onix');
  await dlg.getByRole('button', { name: 'Ver mensaje' }).click();
  await dlg.getByText('Revisá tu mensaje').waitFor();
  const msg = decode(await dlg.getByTestId('send-whatsapp').getAttribute('href'));
  show(msg);
  check(
    msg.includes('Tono deseado: *20 %*') && msg.includes('Lámina: *Nano Cerámico*') && msg.includes('Vidrios: *Laterales y luneta*'),
    'detalles de polarizado',
  );
});

if (process.argv.includes('--simulador')) {
  await scenario('Simulador → Quiero este polarizado', { width: 1440, height: 900 }, async (page) => {
    await page.locator('#simulador').scrollIntoViewIfNeeded();
    await page.locator('#simulador').getByRole('radio', { name: /^35 %/ }).click();
    await page.locator('#simulador').getByRole('radio', { name: /Nano Carbon HP/ }).click();
    await page.getByRole('button', { name: 'Quiero este polarizado' }).click();
    const dlg = page.getByRole('dialog');
    await dlg.waitFor();
    check((await dlg.getByLabel('Servicio').inputValue()) === 'Polarizado', 'servicio Polarizado precargado');
    check(await dlg.locator('input[value="35"]').isChecked(), 'tono 35 % precargado');
    check((await dlg.getByLabel('Tipo de lámina').inputValue()) === 'nano-carbon-hp', 'lámina precargada');
  });
}

await browser.close();
server.close();
console.log(fails ? `\n${fails} verificaciones fallaron` : '\nTodo OK');
process.exit(fails ? 1 : 0);
