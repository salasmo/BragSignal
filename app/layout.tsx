import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://brag-signal.vercel.app";
const OWNER_NAME = "Santiago";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Brag Signal — tu bitácora de logros profesionales",
    template: "%s · Brag Signal",
  },
  description:
    "Brag Signal es tu brag document personal: registra logros, métricas y aprendizajes a lo largo del tiempo para reviews, entrevistas y promociones.",
  openGraph: {
    title: "Brag Signal — tu bitácora de logros profesionales",
    description:
      "Registra logros, métricas y aprendizajes a lo largo del tiempo. Nunca más llegues a tu review sin evidencia.",
    url: SITE_URL,
    siteName: "Brag Signal",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brag Signal — tu bitácora de logros profesionales",
    description: "Registra logros, métricas y aprendizajes a lo largo del tiempo.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: OWNER_NAME,
    url: SITE_URL,
    jobTitle: "Biomedical Engineering Student & Data/AI Practitioner",
    worksFor: {
      "@type": "Organization",
      name: "Johnson & Johnson MedTech",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Tecnológico de Monterrey",
    },
  };

  return (
    <html lang="es">
      <body className="grain relative font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
