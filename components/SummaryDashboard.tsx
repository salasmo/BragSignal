"use client";

import { useMemo } from "react";
import { BragEntry, EntryCategory, CATEGORY_LABEL, CATEGORY_DOT, monthKey } from "@/lib/entries";

const MONTH_LABEL = new Intl.DateTimeFormat("es-MX", { month: "short" });
const CATEGORY_ORDER: EntryCategory[] = ["impact", "shipped", "learned", "recognition"];

function lastNMonths(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

function currentStreak(monthsWithEntries: Set<string>): number {
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthsWithEntries.has(key)) {
      streak++;
    } else if (i === 0) {
      continue; // give current month a pass if nothing logged yet
    } else {
      break;
    }
  }
  return streak;
}

export default function SummaryDashboard({ entries }: { entries: BragEntry[] }) {
  const stats = useMemo(() => {
    const total = entries.length;
    const withMetric = entries.filter((e) => e.metric).length;

    const byCategory: Record<EntryCategory, number> = {
      impact: 0,
      shipped: 0,
      learned: 0,
      recognition: 0,
    };
    entries.forEach((e) => byCategory[e.category]++);

    const roleCounts = new Map<string, number>();
    entries.forEach((e) => {
      const key = e.role?.trim();
      if (!key) return;
      roleCounts.set(key, (roleCounts.get(key) ?? 0) + 1);
    });
    const topRoles = [...roleCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);

    const tagCounts = new Map<string, number>();
    entries.forEach((e) => e.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)));
    const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

    const monthsSet = new Set(entries.map((e) => monthKey(e.date)));
    const months = lastNMonths(6);
    const monthCounts = months.map((m) => ({
      month: m,
      count: entries.filter((e) => monthKey(e.date) === m).length,
    }));
    const maxMonthCount = Math.max(1, ...monthCounts.map((m) => m.count));
    const streak = currentStreak(monthsSet);

    return { total, withMetric, byCategory, topRoles, topTags, monthCounts, maxMonthCount, streak };
  }, [entries]);

  if (entries.length === 0) return null;

  const metricPct = stats.total ? Math.round((stats.withMetric / stats.total) * 100) : 0;

  return (
    <section aria-labelledby="dashboard-heading" className="mb-14">
      <div className="flex items-baseline justify-between">
        <h2 id="dashboard-heading" className="font-display text-lg font-semibold text-white">
          Resumen
        </h2>
        <span className="font-mono text-[11px] text-white/35">últimos 6 meses</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <BigStat label="Logros totales" value={stats.total} accent="text-white" />
        <BigStat
          label="Con métrica"
          value={`${metricPct}%`}
          accent="text-signal-400"
          sub={`${stats.withMetric} de ${stats.total}`}
        />
        <BigStat
          label="Racha activa"
          value={`${stats.streak} mes${stats.streak === 1 ? "" : "es"}`}
          accent="text-vital-400"
        />
        <BigStat label="Roles distintos" value={stats.topRoles.length} accent="text-amber-400" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Monthly activity */}
        <div className="glass shadow-card rounded-2xl p-5 lg:col-span-3">
          <p className="font-mono text-xs uppercase tracking-wide text-white/40">
            Actividad mensual
          </p>
          <div className="mt-5 flex h-32 items-end gap-3 sm:gap-4">
            {stats.monthCounts.map(({ month, count }) => {
              const [y, m] = month.split("-");
              const heightPct = Math.max(6, (count / stats.maxMonthCount) * 100);
              return (
                <div key={month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex h-24 w-full items-end justify-center">
                    <div
                      className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-vital-600 to-signal-400 shadow-glow transition-all duration-500 hover:from-vital-500 hover:to-signal-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-white/40">
                    {count > 0 ? count : ""}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-white/35">
                    {MONTH_LABEL.format(new Date(Number(y), Number(m) - 1, 1))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="glass shadow-card rounded-2xl p-5 lg:col-span-2">
          <p className="font-mono text-xs uppercase tracking-wide text-white/40">Por categoría</p>
          <div className="mt-5 space-y-3.5">
            {CATEGORY_ORDER.map((cat) => {
              const count = stats.byCategory[cat];
              const pct = stats.total ? (count / stats.total) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-white/70">
                      <span className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[cat]}`} />
                      {CATEGORY_LABEL[cat]}
                    </span>
                    <span className="font-mono text-white/40">{count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${CATEGORY_DOT[cat]} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {(stats.topRoles.length > 0 || stats.topTags.length > 0) && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stats.topRoles.length > 0 && (
            <div className="glass shadow-card rounded-2xl p-5">
              <p className="font-mono text-xs uppercase tracking-wide text-white/40">
                Dónde pasó
              </p>
              <ul className="mt-3 space-y-2">
                {stats.topRoles.map(([role, count]) => (
                  <li key={role} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-white/70">{role}</span>
                    <span className="shrink-0 font-mono text-xs text-vital-400">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stats.topTags.length > 0 && (
            <div className="glass shadow-card rounded-2xl p-5">
              <p className="font-mono text-xs uppercase tracking-wide text-white/40">
                Skills más usadas
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {stats.topTags.map(([tag, count]) => (
                  <li
                    key={tag}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-white/60 transition-colors hover:border-vital-500/40 hover:text-vital-300"
                  >
                    {tag} <span className="text-white/30">×{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function BigStat({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="glass shadow-card rounded-2xl px-4 py-4 transition-transform duration-200 hover:-translate-y-0.5">
      <p className={`font-display text-2xl font-bold ${accent}`}>{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-white/40">{label}</p>
      {sub && <p className="mt-0.5 font-mono text-[10px] text-white/30">{sub}</p>}
    </div>
  );
}
