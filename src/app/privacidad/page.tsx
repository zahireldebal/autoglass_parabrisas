import type { Metadata } from 'next';
import { business, SITE_URL, telHref } from '@/data/business';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/** Fecha de la última actualización de esta política. Cambiarla si se modifica el texto. */
const UPDATED = '19 de noviembre de 2026';

const title = `Política de privacidad · ${business.name}`;
const description = `Qué datos personales recibe ${business.name} cuando le escribís desde la web, para qué los usa y cómo podés pedir que se corrijan o se borren (Ley 18.331).`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/privacidad/` },
  openGraph: { type: 'website', locale: 'es_UY', url: `${SITE_URL}/privacidad/`, siteName: business.name, title, description, images: ['/og-image.jpg'] },
};

const h2 = 'h-display mt-12 text-2xl text-brand sm:text-3xl';
const p = 'mt-4 leading-relaxed text-mist';
const ul = 'mt-4 list-disc space-y-2 pl-5 leading-relaxed text-mist marker:text-brand';
const link = 'font-semibold text-snow underline underline-offset-2 hover:text-brand';

export default function Privacidad() {
  const wa = buildWhatsAppUrl('Hola, quiero hacer una consulta sobre mis datos personales.');
  return (
    <article className="container-x max-w-3xl pt-32 pb-20 sm:pt-36">
      <p className="eyebrow">Legal</p>
      <h1 className="h-display mt-3 text-5xl sm:text-6xl">Política de privacidad</h1>
      <p className="mt-4 text-sm text-mist">Última actualización: {UPDATED}</p>

      <p className="mt-8 text-lg leading-relaxed">
        En {business.name} usamos tus datos solo para responder tu consulta y hacer el trabajo que nos pedís. No los vendemos ni los
        usamos para publicidad. Acá te contamos qué datos recibimos, para qué y cómo podés pedir que los corrijamos o los borremos,
        según la Ley N.º 18.331 de Protección de Datos Personales de Uruguay.
      </p>

      <h2 className={h2}>Quién es responsable de tus datos</h2>
      <p className={p}>
        {business.name}, con taller en {business.address.street}, {business.address.locality}, {business.address.countryName}. Podés
        escribirnos por{' '}
        <a href={wa} target="_blank" rel="noopener noreferrer" className={link}>
          WhatsApp al {business.whatsappDisplay}
        </a>{' '}
        o llamarnos al{' '}
        <a href={telHref} className={link}>
          {business.phoneDisplay}
        </a>
        .
      </p>

      <h2 className={h2}>Qué datos recibimos</h2>
      <p className={p}>Cuando completás el formulario de consulta, nos llegan los datos que vos escribís:</p>
      <ul className={ul}>
        <li>tu nombre;</li>
        <li>el servicio que te interesa y los datos de tu vehículo (marca, modelo y año);</li>
        <li>si el trabajo es por seguro y, si nos la indicás, tu aseguradora;</li>
        <li>el día, la franja horaria y el lugar que preferís (taller o domicilio y zona);</li>
        <li>el comentario que quieras agregar.</li>
      </ul>
      <p className={p}>
        Al escribirnos por WhatsApp también recibimos tu número de teléfono y lo que nos mandes por el chat, como fotos del daño.
      </p>

      <h2 className={h2}>Para qué los usamos</h2>
      <ul className={ul}>
        <li>Responder tu consulta y pasarte un presupuesto.</li>
        <li>Coordinar el día, el horario y el lugar del trabajo.</li>
        <li>Emitir la factura y cumplir con nuestras obligaciones legales.</li>
      </ul>
      <p className={p}>
        No compartimos tus datos con terceros, salvo cuando una ley nos lo exige.
      </p>

      <h2 className={h2}>Cómo nos llegan</h2>
      <p className={p}>
        El formulario no guarda tus datos en ningún servidor: arma el mensaje en tu propio navegador y sos vos quien lo envía desde
        tu WhatsApp. Desde ese momento, el mensaje viaja por WhatsApp, que es un servicio de Meta con su propia política de
        privacidad.
      </p>

      <h2 className={h2}>Qué queda guardado en tu dispositivo</h2>
      <p className={p}>
        Mientras completás el formulario, guardamos un borrador en tu navegador para que no pierdas lo que escribiste si cerrás la
        página. Ese borrador queda solo en tu dispositivo: no nos llega a nosotros y lo podés eliminar borrando los datos de este
        sitio en tu navegador.
      </p>
      <p className={p}>
        La web no usa cookies de publicidad ni herramientas de seguimiento o estadísticas.
      </p>

      <h2 className={h2}>Servicios de otras empresas</h2>
      <ul className={ul}>
        <li>
          <strong className="text-snow">Google Maps:</strong> el mapa de la sección de contacto se carga recién cuando lo tocás. A
          partir de ahí, Google puede usar cookies según su propia política de privacidad.
        </li>
        <li>
          <strong className="text-snow">WhatsApp e Instagram:</strong> los botones te llevan a esas aplicaciones, que tienen sus
          propias políticas de privacidad.
        </li>
      </ul>

      <h2 className={h2}>Cuánto tiempo los guardamos</h2>
      <p className={p}>
        El tiempo necesario para atender tu consulta y hacer el trabajo, y el que exijan las normas, por ejemplo para la
        facturación. Después los borramos.
      </p>

      <h2 className={h2}>Tus derechos</h2>
      <p className={p}>
        En cualquier momento podés pedirnos ver qué datos tuyos tenemos, corregirlos, actualizarlos o borrarlos. Escribinos por{' '}
        <a href={wa} target="_blank" rel="noopener noreferrer" className={link}>
          WhatsApp
        </a>{' '}
        o acercate al taller, y te respondemos dentro de los plazos que fija la ley. Si no quedás conforme con la respuesta, podés
        hacer un reclamo ante la Unidad Reguladora y de Control de Datos Personales (URCDP).
      </p>

      <h2 className={h2}>Cambios en esta política</h2>
      <p className={p}>
        Si cambiamos esta política, publicamos la versión nueva en esta misma página con la fecha de actualización.
      </p>

      <div className="mt-14 border-t border-line pt-8">
        <a href="/" className="btn btn-outline">
          Volver al inicio
        </a>
      </div>
    </article>
  );
}
