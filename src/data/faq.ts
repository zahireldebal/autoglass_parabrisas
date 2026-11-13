/**
 * Preguntas frecuentes. Las respuestas marcadas con [CONFIRMAR CON EL CLIENTE]
 * están listadas en PENDIENTES.md.
 */
export const faq: { q: string; a: string; pending?: boolean }[] = [
  {
    q: '¿Cuánto tarda un cambio de parabrisas?',
    a: 'En la mayoría de los casos lo resolvemos en menos de 1 hora, y trabajamos sin turno: llegás, lo cambiamos y seguís camino. El tiempo puede variar según el vehículo.',
    pending: true,
  },
  {
    q: '¿Cuándo puedo manejar después del cambio?',
    a: '[CONFIRMAR CON EL CLIENTE] Te indicamos el tiempo de espera recomendado al terminar la colocación.',
    pending: true,
  },
  {
    q: '¿Trabajan con seguros?',
    a: 'Sí. Si tenés seguro, gestionamos el cambio de tu parabrisas o cristal, que puede salirte gratis según tu cobertura. Contanos con qué aseguradora estás al consultar.',
  },
  {
    q: '¿Van a domicilio?',
    a: 'Sí, vamos a domicilio sin costo adicional en Piriápolis, Maldonado, San Carlos y Rocha. Para otras zonas, consultanos.',
  },
  {
    q: '¿Cuánto dura el polarizado?',
    a: '[CONFIRMAR CON EL CLIENTE] La duración depende de la línea de lámina elegida (Window Films, Nano Cerámico o Nano Carbon HP). Consultanos y te contamos la garantía de cada una.',
    pending: true,
  },
  {
    q: '¿Qué tonos de polarizado están permitidos?',
    a: '[CONFIRMAR CON EL CLIENTE] El polarizado está regulado, sobre todo en el parabrisas y los vidrios delanteros. Consultanos y te asesoramos sobre qué está permitido para tu vehículo.',
    pending: true,
  },
  {
    q: '¿La colocación tiene costo?',
    a: 'Con la compra del cristal, la colocación es gratis.',
  },
  {
    q: '¿Cómo puedo pagar?',
    a: 'Hasta 6 pagos con todas las tarjetas.',
  },
];
