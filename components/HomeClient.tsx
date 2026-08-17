"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BragEntry,
  EntryCategory,
  NewBragEntry,
  CATEGORY_LABEL,
  createEntry,
  deleteEntry,
} from "@/lib/entries";
import { createClient } from "@/lib/supabase/client";
import BragCard from "@/components/BragCard";
import AddEntryModal from "@/components/AddEntryModal";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import Breadcrumbs from "@/components/Breadcrumbs";
import PulseLine from "@/components/PulseLine";
import SummaryDashboard from "@/components/SummaryDashboard";

const SITE_URL = "https://brag-signal.vercel.app";
const FILTERS: Array<EntryCategory | "all"> = ["all", "impact", "shipped", "learned", "recognition"];

export default function HomeClient({
  initialEntries,
  loadError,
  userEmail,
}: {
  initialEntries: BragEntry[];
  loadError: string | null;
  userEmail: string | null;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [entries, setEntries] = useState<BragEntry[]>(initialEntries);
  const [filter, setFilter] = useState<EntryCategory | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(loadError ? "load" : null);
  const [signingOut, setSigningOut] = useState(false);

  const visible = useMemo(
    () => (filter === "all" ? entries : entries.filter((e) => e.category === filter)),
    [entries, filter]
  );

  const sorted = useMemo(
    () => [...visible].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [visible]
  );

  async function handleSave(newEntry: NewBragEntry) {
    const created = await createEntry(supabase, newEntry);
    setEntries((prev) => [created, ...prev]);
  }

  async function handleDelete(id: string) {
    const prev = entries;
    setEntries((cur) => cur.filter((e) => e.id !== id));
    try {
      await deleteEntry(supabase, id);
    } catch {
      setEntries(prev); // revert on failure
      setBanner("delete");
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const metricsCount = entries.filter((e) => e.metric).length;

  return (
    <>
      <main className="relative z-10 mx-auto max-w-5xl px-5 pb-32 pt-8 sm:px-8 sm:pt-12">
        <div className="mb-6 flex items-center justify-between">
          <Breadcrumbs siteUrl={SITE_URL} items={[{ label: "Inicio", href: "/" }]} />
          {userEmail && (
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-xs text-white/40 sm:inline">{userEmail}</span>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-white/50 transition-colors hover:border-white/25 hover:text-white/80 disabled:opacity-50"
              >
                {signingOut ? "Saliendo…" : "Cerrar sesión"}
              </button>
            </div>
          )}
        </div>

        {banner === "load" && (
          <div className="glass mb-6 rounded-xl border border-amber-400/30 px-4 py-3 text-xs text-amber-200">
            No pude conectar con la base de datos, así que estás viendo datos de ejemplo. Revisa
            que <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> estén configurados
            (ver <code className="font-mono">supabase-schema.sql</code> y el README).
          </div>
        )}
        {banner === "delete" && (
          <div className="glass mb-6 rounded-xl border border-red-400/30 px-4 py-3 text-xs text-red-300">
            No se pudo eliminar esa entrada. Intenta de nuevo.
          </div>
        )}

        {/* Hero — CTA above the fold */}
        <section className="text-center sm:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-vital-400">
            brag document · señal vital de tu carrera
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl">
            Cada logro deja un{" "}
            <span className="bg-gradient-to-r from-vital-400 to-signal-400 bg-clip-text text-transparent">
              latido
            </span>{" "}
            en el registro.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/60 sm:mx-0">
            Un lugar para capturar lo que construiste, automatizaste o mejoraste — antes de que la
            memoria lo comprima a "pues, cositas". Para tu próxima revisión de desempeño, entrevista
            o ronda de negociación.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
            <button
              onClick={() => setModalOpen(true)}
              className="shadow-glow rounded-2xl bg-vital-500 px-6 py-3.5 font-display text-sm font-semibold text-graphite-950 transition-transform duration-150 hover:bg-vital-400 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              + Registrar un logro
            </button>
            <a
              href="#registro"
              className="glass rounded-2xl px-6 py-3.5 font-display text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              Ver mi registro ↓
            </a>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
            <Stat label="Entradas" value={entries.length} />
            <Stat label="Con métrica" value={metricsCount} />
            <Stat label="Categorías" value={4} />
          </div>
        </section>

        <PulseLine className="my-10 h-14 w-full opacity-80 sm:my-14" />

        <SummaryDashboard entries={entries} />

        {/* Filters */}
        <section id="registro">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                  filter === f
                    ? "border-vital-500/60 bg-vital-500/15 text-vital-300"
                    : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
                }`}
              >
                {f === "all" ? "Todo" : CATEGORY_LABEL[f]}
              </button>
            ))}
          </div>

          {sorted.length === 0 ? (
            <div className="glass mt-6 rounded-2xl p-10 text-center">
              <p className="font-display text-lg text-white">Todavía no hay nada aquí.</p>
              <p className="mt-1 text-sm text-white/50">
                Registra tu primer logro y empieza a construir evidencia.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {sorted.map((entry, i) => (
                <BragCard key={entry.id} entry={entry} index={i} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-20 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row">
          <span>Brag Signal — guardado en tu base de Supabase.</span>
          <a href="/privacy" className="transition-colors hover:text-white/70">
            Aviso de privacidad
          </a>
        </footer>
      </main>

      <StickyMobileCTA onAdd={() => setModalOpen(true)} />
      <AddEntryModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-xl px-3 py-2.5 text-center sm:text-left">
      <p className="font-mono text-xl font-semibold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
    </div>
  );
}
