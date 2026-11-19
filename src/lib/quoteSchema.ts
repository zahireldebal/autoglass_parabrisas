import { z } from 'zod';
import { business } from '@/data/business';
import { SERVICE_OPTIONS, ZONE_OPTIONS } from '@/data/options';

const currentYear = new Date().getFullYear();

export const quoteSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Contanos tu nombre (al menos 2 letras).')
      .max(60, 'El nombre es muy largo.'),
    service: z.union([z.enum(SERVICE_OPTIONS), z.literal('')]).refine((v) => v !== '', 'Elegí un servicio.'),
    glassScope: z.string().optional(),
    brand: z.string().trim().min(2, 'Indicá la marca (ej. Toyota).').max(30, 'Muy largo.'),
    model: z.string().trim().min(1, 'Indicá el modelo (ej. Corolla).').max(40, 'Muy largo.'),
    year: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || (/^\d{4}$/.test(v) && Number(v) >= 1950 && Number(v) <= currentYear + 1), {
        message: `El año tiene que ser de 4 cifras, entre 1950 y ${currentYear + 1}.`,
      }),
    preferredDay: z.string().optional(),
    timeSlot: z.enum(['mañana', 'tarde', '']).optional(),
    location: z.enum(['taller', 'domicilio', '']).optional(),
    zone: z.string().optional(),
    comment: z.string().max(500, 'Máximo 500 caracteres.').optional(),
  })
  .superRefine((d, ctx) => {
    if (business.homeService && d.location === 'domicilio' && !(ZONE_OPTIONS as readonly string[]).includes(d.zone ?? '')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['zone'], message: 'Elegí la zona para ir a domicilio.' });
    }
    if (d.preferredDay) {
      const today = new Date();
      const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (d.preferredDay < iso) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['preferredDay'], message: 'Elegí un día de hoy en adelante.' });
      }
    }
  });

export type QuoteFormValues = z.input<typeof quoteSchema>;

export const emptyQuote: QuoteFormValues = {
  name: '',
  service: '',
  glassScope: '',
  brand: '',
  model: '',
  year: '',
  preferredDay: '',
  timeSlot: '',
  location: '',
  zone: '',
  comment: '',
};
