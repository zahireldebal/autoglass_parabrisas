import type { QuotePreset } from '@/components/quote/QuoteContext';
import { business } from '@/data/business';

/**
 * Preguntas frecuentes. Las marcadas con `pending` tienen un dato a confirmar
 * con la clienta (ver PENDIENTES.md); el texto visible ya no lleva marcadores.
 */
export const faq: { q: string; a: string; list?: string[]; pending?: boolean; cta?: { label: string; preset: QuotePreset } }[] = [
  {
    q: '¿Cuánto tarda un cambio de parabrisas?',
    a: 'En la mayoría de los casos lo resolvemos en menos de 1 hora, y en el taller trabajamos sin turno: llegás, lo cambiamos y seguís camino. El tiempo puede variar según el vehículo.',
    pending: true,
  },
  {
    q: '¿Cuándo puedo manejar después del cambio?',
    a: 'Al terminar la colocación te indicamos el tiempo de espera recomendado.',
    pending: true,
  },
  {
    q: '¿Qué cuidados hay que tener después de colocar un parabrisas?',
    a: 'Tené en cuenta estos cuidados:',
    list: [
      'No retires la cinta de sujeción durante las primeras 24 horas.',
      'No laves el vehículo con hidrolavadora.',
      'Si salís a la ruta, manejá a velocidad moderada.',
    ],
    pending: true,
  },
  {
    q: '¿El seguro cubre el cambio?',
    a: 'En la mayoría de los casos, sí. El trámite lo hacés vos directamente con tu aseguradora; nosotros te asesoramos sobre qué pedir y cómo hacerlo. Trabajamos con Mapfre, Porto Seguro, SURA, Sancor, Surco, Berkley, San Cristóbal y HDI.',
  },
  {
    q: '¿Qué es la lámina de seguridad?',
    a: 'Es una lámina que, además de darle tonalidad al vidrio, lo mantiene unido ante un impacto y dificulta el ingreso al vehículo. Tono 20 %.',
  },
  {
    q: '¿Qué cuidados hay que tener con las láminas de seguridad después de la instalación?',
    a: 'Tené en cuenta estos cuidados:',
    list: [
      'No bajes los vidrios durante las primeras 24 horas.',
      'No enciendas el desempañador.',
      'Si podés, dejá el vehículo al sol: ayuda a que la lámina seque mejor.',
    ],
    pending: true,
  },
  {
    q: '¿Venden por mayor?',
    a: 'Sí, cristales y láminas para talleres. Consultanos.',
  },
  {
    q: '¿Van a domicilio?',
    a: 'Sí, siempre con agenda previa. A domicilio sin costo en Piriápolis, Maldonado y San Carlos; también llegamos a Rocha. Estos son nuestros días de recorrido (los trabajos por día son limitados, así que agendá por WhatsApp):',
    list: business.homeServiceDays.map((d) => `${d.zone}: ${d.days.toLowerCase()}.`),
    cta: { label: 'Agendá por WhatsApp', preset: { service: 'Cambio de parabrisas', location: 'domicilio', source: 'servicio' } },
  },
  {
    q: '¿La colocación tiene costo?',
    a: 'Con la compra del cristal, la colocación es sin costo.',
  },
  {
    q: '¿Cómo puedo pagar?',
    a: 'Hasta 6 pagos con todas las tarjetas.',
  },
];
