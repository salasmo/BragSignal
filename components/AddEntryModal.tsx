"use client";

import { useState } from "react";
import { NewBragEntry, EntryCategory, CATEGORY_LABEL } from "@/lib/entries";

const CATEGORIES: EntryCategory[] = ["impact", "shipped", "learned", "recognition"];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AddEntryModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (entry: NewBragEntry) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [metric, setMetric] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState<EntryCategory>("impact");
  const [date, setDate] = useState(today());
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function reset() {
    setTitle("");
    setDetail("");
    setMetric("");
    setRole("");
    setCategory("impact");
    setDate(today());
    setTags("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        detail: detail.trim(),
        metric: metric.trim() || undefined,
        role: role.trim() || undefined,
        category,
        date,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-entry-title"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="glass-strong shadow-glass max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl p-6 sm:rounded-3xl sm:p-8"
      >
        <h2 id="add-entry-title" className="font-display text-xl font-semibold text-white">
          Registrar un logro
        </h2>
        <p className="mt-1 text-sm text-white/50">
          Guárdalo mientras está fresco. Tú del futuro te lo va a agradecer en la próxima revisión de desempeño.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs text-white/50" htmlFor="title">
              Título
            </label>
            <input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Automaticé el reporte semanal de KPIs"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-vital-500/50"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-white/50" htmlFor="detail">
              Detalle
            </label>
            <textarea
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={3}
              placeholder="¿Qué hiciste, con qué herramientas, y por qué importó?"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-vital-500/50"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-white/50" htmlFor="role">
              Puesto / contexto
            </label>
            <input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Ej. Data Analyst Intern, J&J MedTech"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-vital-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-mono text-xs text-white/50" htmlFor="date">
                Fecha
              </label>
              <input
                id="date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-colors [color-scheme:dark] focus:border-vital-500/50"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-white/50" htmlFor="category">
                Categoría
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as EntryCategory)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-vital-500/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-graphite-900">
                    {CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-white/50" htmlFor="metric">
              Métrica (opcional)
            </label>
            <input
              id="metric"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              placeholder="-30% tiempo de proceso"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-vital-500/50"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-white/50" htmlFor="tags">
              Tags (separados por coma)
            </label>
            <input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Power BI, Automatización"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-vital-500/50"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-vital-500 px-4 py-2.5 text-sm font-semibold text-graphite-950 transition-transform duration-150 hover:bg-vital-400 active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
