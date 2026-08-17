import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { fetchEntries, SEED_ENTRIES } from "@/lib/entries";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Registra tus logros, métricas y aprendizajes profesionales en un solo lugar. Tu brag document personal, listo para reviews y entrevistas.",
  alternates: { canonical: "/" },
};

// Always fetch fresh data on request instead of at build time — the page
// depends on Supabase, which isn't available during `next build`.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { entries, error } = await fetchEntries();
  const initialEntries = error ? SEED_ENTRIES : entries;

  return <HomeClient initialEntries={initialEntries} loadError={error} />;
}
