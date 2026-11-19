/**
 * Lógica del mensaje de WhatsApp: arma el texto con SOLO los campos completados
 * y genera el link wa.me. Sin dependencias de React (testeable con Vitest).
 */
import { business } from '@/data/business';
import { GLASS_SCOPE_OPTIONS, SECURITY_FILM_TINT, type ServiceOption } from '@/data/options';

export type QuoteData = {
  name: string;
  service: ServiceOption | '';
  glassScope?: string;
  brand?: string;
  model?: string;
  year?: string;
  preferredDay?: string; // YYYY-MM-DD
  timeSlot?: 'mañana' | 'tarde' | '';
  location?: 'taller' | 'domicilio' | '';
  zone?: string;
  comment?: string;
};

const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const clean = (v?: string) => (v ?? '').replace(/\s+/g, ' ').trim();
/** Evita que el usuario rompa el formato de negrita de WhatsApp con asteriscos. */
const safe = (v?: string) => clean(v).replace(/\*/g, '');
const bold = (v: string) => `*${v}*`;
const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** "2026-11-20" → "Viernes 20 de noviembre" (sin problemas de zona horaria). */
export function formatDay(iso?: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  if (!m) return '';
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  if (date.getMonth() !== mo - 1) return '';
  return `${capitalize(WEEKDAYS[date.getDay()])} ${d} de ${MONTHS[mo - 1]}`;
}

export function vehicleText(d: Pick<QuoteData, 'brand' | 'model' | 'year'>) {
  return [safe(d.brand), safe(d.model), safe(d.year)].filter(Boolean).join(' ');
}

const labelOf = (list: readonly { value: string; label: string }[], v?: string) =>
  list.find((o) => o.value === v)?.label ?? safe(v);

export function buildWhatsAppMessage(d: QuoteData): string {
  const lines: string[] = [];
  const name = safe(d.name);
  const service = safe(d.service);

  lines.push(
    name && service
      ? `Hola, soy ${bold(name)}, quiero consultar por ${bold(service)} 👋`
      : name
        ? `Hola, soy ${bold(name)} 👋`
        : `Hola, quiero consultar por ${bold(service || 'un servicio')} 👋`,
  );

  if (d.service === 'Láminas de seguridad') {
    lines.push(`Lámina: ${bold(`Security Film ${SECURITY_FILM_TINT.label}`)}`);
    if (d.glassScope) lines.push(`Vidrios: ${bold(labelOf(GLASS_SCOPE_OPTIONS, d.glassScope))}`);
  }

  const vehicle = vehicleText(d);
  if (vehicle) lines.push(`Vehículo: ${bold(vehicle)}`);

  if (business.homeService && d.location) {
    if (d.location === 'domicilio') {
      const zone = safe(d.zone);
      lines.push(`Lugar: ${bold('A domicilio')}${zone ? `, zona ${bold(zone)}` : ''}`);
    } else {
      lines.push(`Lugar: ${bold('En el taller')}`);
    }
  }

  const day = formatDay(d.preferredDay);
  if (day && d.timeSlot) lines.push(`Día preferido: ${bold(day)}, por la ${bold(d.timeSlot)}`);
  else if (day) lines.push(`Día preferido: ${bold(day)}`);
  else if (d.timeSlot) lines.push(`Franja preferida: por la ${bold(d.timeSlot)}`);

  const comment = clean(d.comment);
  if (comment) lines.push(`Comentario: ${comment}`);

  lines.push('¡Gracias!');
  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string, phone: string = business.whatsapp): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
