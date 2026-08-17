import { supabase } from "@/lib/supabase";

export type EntryCategory = "impact" | "shipped" | "learned" | "recognition";

export interface BragEntry {
  id: string;
  title: string;
  detail: string;
  metric?: string;
  role?: string;
  category: EntryCategory;
  date: string; // ISO yyyy-mm-dd
  tags: string[];
}

export type NewBragEntry = Omit<BragEntry, "id">;

export const CATEGORY_LABEL: Record<EntryCategory, string> = {
  impact: "Impacto medible",
  shipped: "Shippeado",
  learned: "Aprendizaje",
  recognition: "Reconocimiento",
};

export const CATEGORY_COLOR: Record<EntryCategory, string> = {
  impact: "text-signal-400 border-signal-500/40 bg-signal-500/10",
  shipped: "text-vital-400 border-vital-500/40 bg-vital-500/10",
  learned: "text-amber-400 border-amber-500/40 bg-amber-500/10",
  recognition: "text-fuchsia-300 border-fuchsia-400/40 bg-fuchsia-400/10",
};

export const CATEGORY_DOT: Record<EntryCategory, string> = {
  impact: "bg-signal-400",
  shipped: "bg-vital-400",
  learned: "bg-amber-400",
  recognition: "bg-fuchsia-300",
};

export const SEED_ENTRIES: BragEntry[] = [
  {
    id: "seed-eon",
    title: "EON — sistema de agendado de equipo médico",
    detail:
      "Diseñé y lancé una plataforma sobre Power Apps + SharePoint para coordinar la disponibilidad de equipo médico entre representantes y hospitales.",
    metric: "-75% esfuerzo de coordinación manual",
    role: "Interno, J&J MedTech — Electrophysiology",
    category: "impact",
    date: "2025-11-01",
    tags: ["Power Apps", "SharePoint", "MedTech"],
  },
  {
    id: "seed-powerbi",
    title: "Dashboard de costos logísticos — J&J MedTech EP",
    detail:
      "Construí un dashboard en Power BI para dar visibilidad a costos logísticos del área de Electrophysiology, conectado a fuentes de datos operativas.",
    role: "Interno, J&J MedTech — Electrophysiology",
    category: "shipped",
    date: "2026-02-10",
    tags: ["Power BI", "Analytics", "EP"],
  },
  {
    id: "seed-capstone",
    title: "Capstone — plataforma multi-agente para RCM",
    detail:
      "Arranca el kickoff del capstone de la Maestría: una plataforma multi-agente con SLMs locales y arquitectura de adaptadores multi-vertical para automatizar Revenue Cycle Management, patrocinado por Alignity IQ EDGE, para un piloto hospitalario.",
    role: "Maestría en IA Aplicada, Tec de Monterrey",
    category: "shipped",
    date: "2026-08-01",
    tags: ["Multi-agent AI", "SLMs", "Healthcare", "Capstone"],
  },
  {
    id: "seed-estatera",
    title: "Estatera — CRM inmobiliario full-stack",
    detail:
      "Construí de cero un CRM en React + Supabase con pipeline de leads, calendario, reportes, bot de WhatsApp con IA y asignación round-robin, integrado con Meta Ads API. Desplegado en Vercel.",
    role: "Proyecto propio",
    category: "shipped",
    date: "2026-05-15",
    tags: ["React", "Supabase", "WhatsApp API", "Meta Ads"],
  },
  {
    id: "seed-foodloop",
    title: "FoodLoop — Invent for the Planet",
    detail:
      "Desarrollé el concepto y prototipo de FoodLoop, una startup enfocada en reducción de desperdicio de alimentos, para la competencia Invent for the Planet.",
    role: "Proyecto propio",
    category: "recognition",
    date: "2025-03-20",
    tags: ["Entrepreneurship", "Sustainability"],
  },
];

function rowToEntry(row: any): BragEntry {
  return {
    id: row.id,
    title: row.title,
    detail: row.detail ?? "",
    metric: row.metric ?? undefined,
    role: row.role ?? undefined,
    category: row.category,
    date: row.entry_date,
    tags: row.tags ?? [],
  };
}

/**
 * Fetches all entries from Supabase, newest first.
 * Returns { entries, error }. On error (e.g. Supabase not configured yet),
 * callers fall back to SEED_ENTRIES so the page still renders something
 * useful instead of an empty state or a spinner.
 */
export async function fetchEntries(): Promise<{ entries: BragEntry[]; error: string | null }> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("entry_date", { ascending: false });

  if (error) {
    return { entries: [], error: error.message };
  }
  return { entries: (data ?? []).map(rowToEntry), error: null };
}

export async function createEntry(entry: NewBragEntry): Promise<BragEntry> {
  const { data, error } = await supabase
    .from("entries")
    .insert({
      title: entry.title,
      detail: entry.detail,
      metric: entry.metric ?? null,
      role: entry.role ?? null,
      category: entry.category,
      entry_date: entry.date,
      tags: entry.tags,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToEntry(data);
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7); // yyyy-mm
}
