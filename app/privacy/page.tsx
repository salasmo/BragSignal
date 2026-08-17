import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

const SITE_URL = "https://brag-signal.vercel.app";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Cómo Brag Signal maneja tus datos: todo se guarda localmente en tu navegador, nada se envía a un servidor.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="relative z-10 mx-auto max-w-2xl px-5 pb-24 pt-8 sm:px-8 sm:pt-12">
      <Breadcrumbs
        siteUrl={SITE_URL}
        items={[
          { label: "Inicio", href: "/" },
          { label: "Aviso de privacidad", href: "/privacy" },
        ]}
      />

      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        Aviso de privacidad
      </h1>
      <p className="mt-2 font-mono text-xs text-white/40">Última actualización: agosto 2026</p>

      <div className="glass mt-8 space-y-6 rounded-2xl p-6 text-sm leading-relaxed text-white/70 sm:p-8">
        <section>
          <h2 className="font-display text-base font-semibold text-white">
            Qué datos se guardan
          </h2>
          <p className="mt-2">
            Brag Signal guarda las entradas que registras (título, detalle, métrica, categoría,
            fecha y tags) directamente en el almacenamiento local de tu navegador
            (<code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">localStorage</code>).
            Nada se envía a un servidor externo ni se comparte con terceros.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-white">Quién tiene acceso</h2>
          <p className="mt-2">
            Solo tú, desde el navegador y dispositivo donde capturaste la información. Si limpias
            los datos del sitio o cambias de navegador, el registro no se transfiere
            automáticamente.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-white">Cookies y analítica</h2>
          <p className="mt-2">
            Esta aplicación no utiliza cookies de rastreo ni servicios de analítica de terceros por
            defecto.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-white">Eliminar tus datos</h2>
          <p className="mt-2">
            Puedes borrar una entrada individual desde su tarjeta, o limpiar todo el
            almacenamiento local del sitio desde la configuración de tu navegador.
          </p>
        </section>
      </div>
    </main>
  );
}
