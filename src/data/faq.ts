/**
 * Preguntas frecuentes. Las marcadas con `pending` tienen un dato a confirmar
 * con la clienta (ver PENDIENTES.md); el texto visible ya no lleva marcadores.
 */
export const faq: { q: string; a: string; pending?: boolean }[] = [
  {
    q: '¿Cuánto tarda un cambio de parabrisas?',
    a: 'En la mayoría de los casos lo resolvemos en menos de 1 hora, y trabajamos sin turno: llegás, lo cambiamos y seguís camino. El tiempo puede variar según el vehículo.',
    pending: true,
  },
  {
    q: '¿Cuándo puedo manejar después del cambio?',
    a: 'Al terminar la colocación te indicamos el tiempo de espera recomendado.',
    pending: true,
  },
  {
    q: '¿Qué es la lámina de seguridad?',
    a: 'Es una lámina que, además de darle tonalidad al vidrio, lo mantiene unido ante un impacto y dificulta el ingreso al vehículo. Tono 20 %.',
  },
  {
    q: '¿Venden por mayor?',
    a: 'Sí, cristales y láminas para talleres. Consultanos.',
  },
  {
    q: '¿Van a domicilio?',
    a: 'Sí, vamos a domicilio sin costo adicional en Piriápolis, Maldonado, San Carlos y Rocha. Para otras zonas, consultanos.',
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
