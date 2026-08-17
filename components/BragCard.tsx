"use client";

import { BragEntry, CATEGORY_COLOR, CATEGORY_LABEL, formatDate } from "@/lib/entries";

export default function BragCard({
  entry,
  index,
  onDelete,
}: {
  entry: BragEntry;
  index: number;
  onDelete: (id: string) => void;
}) {
  return (
    <article
      className="glass shadow-card group relative animate-floatUp rounded-2xl p-5 opacity-0 transition-all duration-300 hover:-translate-y-1 hover:border-vital-500/40 hover:shadow-glow sm:p-6"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${CATEGORY_COLOR[entry.category]}`}
        >
          {CATEGORY_LABEL[entry.category]}
        </span>
        <time
          dateTime={entry.date}
          className="shrink-0 font-mono text-[11px] text-white/40"
        >
          {formatDate(entry.date)}
        </time>
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-white">
        {entry.title}
      </h3>
      {entry.role && (
        <p className="mt-1 font-mono text-xs text-white/40">{entry.role}</p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-white/65">{entry.detail}</p>

      {entry.metric && (
        <p className="mt-3 font-mono text-sm font-medium text-signal-400">{entry.metric}</p>
      )}

      {entry.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/50"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => onDelete(entry.id)}
        aria-label={`Eliminar "${entry.title}"`}
        className="absolute right-4 top-4 hidden font-mono text-[10px] text-white/30 transition-colors hover:text-red-400 group-hover:block"
      >
        eliminar
      </button>
    </article>
  );
}
