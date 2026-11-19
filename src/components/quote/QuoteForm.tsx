'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useForm, type FieldErrors, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { business } from '@/data/business';
import { GLASS_SCOPE_OPTIONS, LOCATION_OPTIONS, SERVICE_OPTIONS, TIME_SLOTS, ZONE_OPTIONS } from '@/data/options';
import { emptyQuote, quoteSchema, type QuoteFormValues } from '@/lib/quoteSchema';
import { buildWhatsAppMessage, buildWhatsAppUrl, type QuoteData } from '@/lib/whatsapp';
import type { QuotePreset } from './QuoteContext';
import { IconWhatsApp } from '@/components/ui/Icons';

const DRAFT_KEY = 'autoglass-cotizacion-borrador-v1';

function loadDraft(): Partial<QuoteFormValues> {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<QuoteFormValues>) : {};
  } catch {
    return {};
  }
}
function saveDraft(v: QuoteFormValues) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(v));
  } catch {
    /* modo privado o almacenamiento bloqueado: no pasa nada */
  }
}

function todayIso() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

function presetToValues(p?: QuotePreset | null): Partial<QuoteFormValues> {
  if (!p) return {};
  const v: Partial<QuoteFormValues> = {};
  if (p.service) v.service = p.service;
  if (p.glassScope) v.glassScope = p.glassScope;
  if (p.location) v.location = p.location;
  return v;
}

type Props = {
  preset?: QuotePreset | null;
  /** Cambia en cada apertura del modal para volver a aplicar el preset. */
  nonce?: number;
  /** Para el título del modal / foco inicial. */
  autoFocus?: boolean;
  compact?: boolean;
};

export function QuoteForm({ preset, nonce, autoFocus }: Props) {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [message, setMessage] = useState('');
  const previewRef = useRef<HTMLHeadingElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: emptyQuote,
  });

  // Borrador + preset (al montar y cada vez que se reabre con otro preset)
  useEffect(() => {
    reset({ ...emptyQuote, ...loadDraft(), ...presetToValues(preset) });
    setStep('form');
    // En táctiles no enfocamos un input (abriría el teclado de golpe)
    if (autoFocus && window.matchMedia('(pointer: fine)').matches) setTimeout(() => setFocus('name'), 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  // Guardar borrador (con pequeña espera)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const sub = watch((values) => {
      clearTimeout(t);
      t = setTimeout(() => saveDraft(values as QuoteFormValues), 300);
    });
    return () => {
      clearTimeout(t);
      sub.unsubscribe();
    };
  }, [watch]);

  const service = watch('service');
  const location = watch('location');
  const glassScope = watch('glassScope');
  const timeSlot = watch('timeSlot');
  const zone = watch('zone');

  // Si deja de ser domicilio, limpiar la zona
  useEffect(() => {
    if (location !== 'domicilio' && zone) setValue('zone', '');
  }, [location, zone, setValue]);

  const onSubmit = (values: QuoteFormValues) => {
    setMessage(buildWhatsAppMessage(values as QuoteData));
    setStep('preview');
    setTimeout(() => previewRef.current?.focus(), 50);
  };
  const onInvalid = (errs: FieldErrors<QuoteFormValues>) => {
    const first = Object.keys(errs)[0] as keyof QuoteFormValues | undefined;
    if (first) setFocus(first);
  };

  const waUrl = useMemo(() => buildWhatsAppUrl(message), [message]);
  const minDay = useMemo(() => todayIso(), []);

  if (step === 'preview') {
    return (
      <div>
        <h3 ref={previewRef} tabIndex={-1} className="h-display text-3xl outline-none">
          Revisá tu mensaje
        </h3>
        <p className="mt-1 text-mist">Así le va a llegar a Autoglass por WhatsApp. Podés editarlo antes de enviarlo.</p>
        <div className="mt-5 rounded-2xl bg-[#0b141a] p-4 sm:p-5">
          <div className="ml-auto max-w-[92%] rounded-xl rounded-tr-sm bg-[#005c4b] px-4 py-3 text-[0.98rem] leading-relaxed whitespace-pre-wrap text-white shadow">
            <WhatsAppFormatted text={message} />
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setStep('form');
              setTimeout(() => formTopRef.current?.querySelector<HTMLElement>('input,select')?.focus(), 50);
            }}
          >
            Editar
          </button>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-testid="send-whatsapp">
            <IconWhatsApp className="h-6 w-6" /> Enviar por WhatsApp
          </a>
        </div>
        <p className="mt-4 rounded-lg border border-line bg-ink/60 p-3 text-sm text-mist">
          📷 Si tenés fotos del daño, podés mandarlas en el chat de WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate aria-describedby={id('req')}>
      <div ref={formTopRef} className="grid gap-5">
        <p id={id('req')} className="text-sm text-mist">
          Los campos con <span className="text-brand">*</span> son obligatorios. Te respondemos por WhatsApp.
        </p>

        <Field label="Nombre" required id={id('name')} error={errors.name?.message}>
          <input
            id={id('name')}
            className="field"
            autoComplete="name"
            placeholder="Ej. Juan Pérez"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? id('name-err') : undefined}
            {...register('name')}
          />
        </Field>

        <Field label="Servicio" required id={id('service')} error={errors.service?.message}>
          <select
            id={id('service')}
            className="field appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20fill=%22none%22%20stroke=%22%23f0b331%22%20stroke-width=%222.5%22%3E%3Cpath%20d=%22m5%208%205%205%205-5%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_0.8rem_center] bg-no-repeat pr-10"
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? id('service-err') : undefined}
            {...register('service')}
          >
            <option value="">Elegí un servicio…</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <AnimatePresence initial={false}>
          {service === 'Láminas de seguridad' && (
            <motion.fieldset
              key="lamina"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid gap-4 overflow-hidden rounded-xl border border-brand/40 bg-brand/[0.04] p-4"
            >
              <legend className="sr-only">Detalles de la lámina de seguridad</legend>
              <p className="text-sm text-mist">Lámina de seguridad Security Film, tono 20 %.</p>
              <ChipGroup label="¿Qué vidrios?" name="glassScope" options={GLASS_SCOPE_OPTIONS} value={glassScope} register={register('glassScope')} uid={id('scope')} />
            </motion.fieldset>
          )}
        </AnimatePresence>

        <fieldset className="grid gap-3">
          <legend className="field-label">
            Vehículo <span className="text-brand">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_7rem]">
            <div>
              <label htmlFor={id('brand')} className="mb-1 block text-sm text-mist">
                Marca
              </label>
              <input
                id={id('brand')}
                className="field"
                placeholder="Ej. Toyota"
                aria-invalid={!!errors.brand}
                aria-describedby={errors.brand ? id('brand-err') : undefined}
                {...register('brand')}
              />
              {errors.brand && (
                <p id={id('brand-err')} className="field-error" role="alert">
                  {errors.brand.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor={id('model')} className="mb-1 block text-sm text-mist">
                Modelo
              </label>
              <input
                id={id('model')}
                className="field"
                placeholder="Ej. Corolla"
                aria-invalid={!!errors.model}
                aria-describedby={errors.model ? id('model-err') : undefined}
                {...register('model')}
              />
              {errors.model && (
                <p id={id('model-err')} className="field-error" role="alert">
                  {errors.model.message}
                </p>
              )}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor={id('year')} className="mb-1 block text-sm text-mist">
                Año (opcional)
              </label>
              <input
                id={id('year')}
                className="field"
                inputMode="numeric"
                maxLength={4}
                placeholder="Ej. 2018"
                aria-invalid={!!errors.year}
                aria-describedby={errors.year ? id('year-err') : undefined}
                {...register('year')}
              />
              {errors.year && (
                <p id={id('year-err')} className="field-error" role="alert">
                  {errors.year.message}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {business.homeService && (
          <div className="grid gap-3">
            <ChipGroup label="¿En el taller o a domicilio?" name="location" options={LOCATION_OPTIONS} value={location} register={register('location')} uid={id('loc')} />
            {location === 'domicilio' && (
              <div className="grid gap-2">
                <ChipGroup
                  label="Zona"
                  required
                  name="zone"
                  options={ZONE_OPTIONS.map((z) => ({ value: z, label: z }))}
                  value={zone}
                  register={register('zone')}
                  uid={id('zone')}
                  error={errors.zone?.message}
                />
                <p className="text-sm text-mist">
                  El domicilio sin costo es solo en {business.homeServiceZones.join(', ').replace(/, ([^,]*)$/, ' y $1')}. Para otras zonas, te confirmamos por WhatsApp.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Día preferido (opcional)" id={id('day')} error={errors.preferredDay?.message}>
            <input
              id={id('day')}
              type="date"
              min={minDay}
              className="field [color-scheme:dark]"
              aria-invalid={!!errors.preferredDay}
              aria-describedby={errors.preferredDay ? id('day-err') : undefined}
              {...register('preferredDay')}
            />
          </Field>
          <ChipGroup label="Franja (opcional)" name="timeSlot" options={TIME_SLOTS} value={timeSlot} register={register('timeSlot')} uid={id('slot')} allowClear />
        </div>

        <Field label="Comentario (opcional)" id={id('comment')} error={errors.comment?.message}>
          <textarea
            id={id('comment')}
            rows={3}
            className="field resize-y"
            placeholder="Ej. tiene una rajadura del lado del conductor."
            {...register('comment')}
          />
        </Field>

        <button type="submit" className="btn btn-primary w-full text-xl">
          <IconWhatsApp className="h-6 w-6" /> Ver mensaje
        </button>
        <p className="-mt-2 text-center text-sm text-mist">Antes de enviar vas a ver el mensaje. No hace falta turno.</p>
      </div>
    </form>
  );
}

function Field({ label, id, required, error, children }: { label: string; id: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function ChipGroup({
  label,
  name,
  options,
  value,
  register,
  uid,
  required,
  error,
  allowClear,
}: {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
  value?: string;
  register: UseFormRegisterReturn;
  uid: string;
  required?: boolean;
  error?: string;
  allowClear?: boolean;
}) {
  return (
    <fieldset aria-describedby={error ? `${uid}-err` : undefined}>
      <legend className="field-label">
        {label} {required && <span className="text-brand">*</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <label key={o.value} className="chip has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand" data-active={active}>
              <input
                type="radio"
                value={o.value}
                className="sr-only"
                {...register}
                name={name}
                onClick={(e) => {
                  // permitir desmarcar en grupos opcionales
                  if (allowClear && active) {
                    (e.target as HTMLInputElement).checked = false;
                    register.onChange({ target: { name, value: '' }, type: 'change' });
                  }
                }}
              />
              {o.label}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${uid}-err`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** Muestra *negrita* como en WhatsApp. */
function WhatsAppFormatted({ text }: { text: string }) {
  const parts = text.split(/(\*[^*\n]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') && p.length > 2 ? <strong key={i}>{p.slice(1, -1)}</strong> : <span key={i}>{p}</span>,
      )}
    </>
  );
}
