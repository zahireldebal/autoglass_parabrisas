import { describe, expect, it } from 'vitest';
import { buildWhatsAppMessage, buildWhatsAppUrl, formatDay, vehicleText } from './whatsapp';
import { quoteSchema, emptyQuote } from './quoteSchema';

describe('formatDay', () => {
  it('formatea fecha ISO en español sin desfasaje de zona horaria', () => {
    expect(formatDay('2026-11-20')).toBe('Viernes 20 de noviembre');
    expect(formatDay('2026-01-01')).toBe('Jueves 1 de enero');
  });
  it('devuelve vacío para fechas inválidas', () => {
    expect(formatDay('')).toBe('');
    expect(formatDay('2026-02-31')).toBe('');
    expect(formatDay('20/11/2026')).toBe('');
  });
});

describe('buildWhatsAppMessage', () => {
  it('arma el mensaje completo de un cambio de parabrisas por seguro', () => {
    const msg = buildWhatsAppMessage({
      name: 'Juan Pérez',
      service: 'Cambio de parabrisas',
      brand: 'Toyota',
      model: 'Corolla',
      year: '2018',
      insurance: 'si',
      insurer: 'BSE',
      preferredDay: '2026-11-19',
      timeSlot: 'tarde',
      location: 'taller',
      comment: 'Tiene una rajadura del lado del conductor.',
    });
    expect(msg).toBe(
      [
        'Hola, soy *Juan Pérez*, quiero consultar por *Cambio de parabrisas* 👋',
        'Vehículo: *Toyota Corolla 2018*',
        'Es por seguro: *Sí* (BSE)',
        'Lugar: *En el taller*',
        'Día preferido: *Jueves 19 de noviembre*, por la *tarde*',
        'Comentario: Tiene una rajadura del lado del conductor.',
        '¡Gracias!',
      ].join('\n'),
    );
  });

  it('incluye solo los campos completados', () => {
    const msg = buildWhatsAppMessage({ name: 'Ana', service: 'Luneta', brand: 'Fiat', model: 'Uno' });
    expect(msg).toBe(['Hola, soy *Ana*, quiero consultar por *Luneta* 👋', 'Vehículo: *Fiat Uno*', '¡Gracias!'].join('\n'));
    expect(msg).not.toMatch(/seguro|Día|Lugar|Comentario/);
  });

  it('sin seguro y a domicilio con zona', () => {
    const msg = buildWhatsAppMessage({
      name: 'Luis',
      service: 'Vidrio lateral',
      brand: 'VW',
      model: 'Gol',
      insurance: 'no',
      insurer: 'no debería salir',
      location: 'domicilio',
      zone: 'San Carlos',
    });
    expect(msg).toContain('Es por seguro: *No*\n');
    expect(msg).not.toContain('no debería salir');
    expect(msg).toContain('Lugar: *A domicilio*, zona *San Carlos*');
  });

  it('agrega los detalles de la lámina solo si el servicio es Láminas de seguridad', () => {
    const base = { name: 'Sofi', brand: 'Chevrolet', model: 'Onix', glassScope: 'laterales-luneta' };
    const lam = buildWhatsAppMessage({ ...base, service: 'Láminas de seguridad' });
    expect(lam).toContain('Lámina: *Security Film 20 %*');
    expect(lam).toContain('Vidrios: *Laterales y luneta*');
    const otro = buildWhatsAppMessage({ ...base, service: 'Luneta' });
    expect(otro).not.toContain('Lámina');
    expect(otro).not.toContain('Vidrios');
  });

  it('lámina con asesoramiento sobre los vidrios', () => {
    const msg = buildWhatsAppMessage({ name: 'Sofi', service: 'Láminas de seguridad', glassScope: 'asesoramiento' });
    expect(msg).toContain('Vidrios: *Quiero asesoramiento*');
  });

  it('limpia espacios y asteriscos que romperían el formato', () => {
    const msg = buildWhatsAppMessage({ name: '  *Juan*   Pérez ', service: 'Otro', brand: ' Ford ', model: 'Ka  ' });
    expect(msg.split('\n')[0]).toBe('Hola, soy *Juan Pérez*, quiero consultar por *Otro* 👋');
    expect(msg).toContain('Vehículo: *Ford Ka*');
  });

  it('solo franja horaria sin día', () => {
    expect(buildWhatsAppMessage({ name: 'A B', service: 'Otro', timeSlot: 'mañana' })).toContain('Franja preferida: por la *mañana*');
  });
});

describe('buildWhatsAppUrl', () => {
  it('codifica el mensaje con encodeURIComponent y usa solo dígitos', () => {
    const msg = 'Hola, soy *Ana* 👋\n¿Precio?';
    const url = buildWhatsAppUrl(msg, '+598 96 126 160');
    expect(url).toBe(`https://wa.me/59896126160?text=${encodeURIComponent(msg)}`);
    expect(decodeURIComponent(url.split('text=')[1])).toBe(msg);
  });
  it('usa el número del negocio por defecto', () => {
    expect(buildWhatsAppUrl('x')).toBe('https://wa.me/59896126160?text=x');
  });
});

describe('vehicleText', () => {
  it('une marca, modelo y año', () => {
    expect(vehicleText({ brand: 'Toyota', model: 'Corolla', year: '2018' })).toBe('Toyota Corolla 2018');
    expect(vehicleText({ brand: 'Toyota', model: '', year: '' })).toBe('Toyota');
  });
});

describe('quoteSchema', () => {
  const valid = { ...emptyQuote, name: 'Juan', service: 'Luneta' as const, brand: 'Fiat', model: 'Uno', privacy: true };
  it('acepta un formulario mínimo válido', () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
  });
  it('exige nombre, servicio, marca y modelo con mensajes en español', () => {
    const r = quoteSchema.safeParse(emptyQuote);
    expect(r.success).toBe(false);
    const msgs = r.success ? [] : r.error.issues.map((i) => i.message);
    expect(msgs).toContain('Elegí un servicio.');
    expect(msgs.some((m) => m.includes('nombre'))).toBe(true);
  });
  it('valida el año', () => {
    expect(quoteSchema.safeParse({ ...valid, year: '18' }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...valid, year: '2018' }).success).toBe(true);
  });
  it('pide zona si es a domicilio', () => {
    const r = quoteSchema.safeParse({ ...valid, location: 'domicilio' });
    expect(r.success).toBe(false);
    expect(quoteSchema.safeParse({ ...valid, location: 'domicilio', zone: 'Rocha' }).success).toBe(true);
  });
  it('exige aceptar la política de privacidad', () => {
    const r = quoteSchema.safeParse({ ...valid, privacy: false });
    expect(r.success).toBe(false);
    expect(r.success ? [] : r.error.issues.map((i) => i.message)).toContain('Para continuar, marcá la casilla de la política de privacidad.');
  });
  it('rechaza días pasados', () => {
    expect(quoteSchema.safeParse({ ...valid, preferredDay: '2020-01-01' }).success).toBe(false);
  });
});
