"use client";

import { useMemo, useState } from "react";
import {
  BragEntry,
  EntryCategory,
  CATEGORY_LABEL,
  CATEGORY_DOT,
  monthKey,
} from "@/lib/entries";

const MONTH_LABEL = new Intl.DateTimeFormat("es-MX", { month: "short" });
const CATEGORY_ORDER: EntryCategory[] = ["impact", "shipped", "learned", "recognition"];
const CATEGORY_HEX: Record<EntryCategory, string> = {
  impact: "#34D399",
  shipped: "#22D3EE",
  learned: "#FBBF24",
  recognition: "#E879F9",
};

type RangeOption = "3" | "6" | "12" | "all";
const RANGE_OPTIONS: { value: RangeOption; label: string }[] = [
  { value: "3", label: "3M" },
  { value: "6", label: "6M" },
  { value: "12", label: "12M" },
  { value: "all", label: "Todo" },
];

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - (n - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function lastNMonthKeys(n: number): string[] {
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
  const [range, setRange] = useState<RangeOption>("6");
  const [activeCategories, setActiveCategories] = useState<Set<EntryCategory>>(
    new Set(CATEGORY_ORDER)
  );
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const allRoles = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.role?.trim() && set.add(e.role.trim()));
    return [...set].sort();
  }, [entries]);

  function toggleCategory(cat: EntryCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size === 1) return prev; // keep at least one active
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  const filtered = useMemo(() => {
    const cutoff = range === "all" ? null : monthsAgo(Number(range));
    return entries.filter((e) => {
      if (!activeCategories.has(e.category)) return false;
      if (roleFilter !== "all" && e.role !== roleFilter) return false;
      if (cutoff && new Date(e.date + "T00:00:00") < cutoff) return false;
      return true;
    });
  }, [entries, activeCategories, roleFilter, range]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const withMetric = filtered.filter((e) => e.metric).length;

    const byCategory: Record<EntryCategory, number> = {
      impact: 0,
      shipped: 0,
      learned: 0,
      recognition: 0,
    };
    filtered.forEach((e) => byCategory[e.category]++);

    const roleCounts = new Map<string, number>();
    filtered.forEach((e) => {
      const key = e.role?.trim();
      if (!key) return;
      roleCounts.set(key, (roleCounts.get(key) ?? 0) + 1);
    });
    const topRoles = [...roleCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    const tagCounts = new Map<string, number>();
    filtered.forEach((e) => e.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)));
    const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

    const monthsWindow = range === "all" ? 12 : Math.max(Number(range), 6);
    const months = lastNMonthKeys(monthsWindow);
    const monthCounts = months.map((m) => ({
      month: m,
      count: filtered.filter((e) => monthKey(e.date) === m).length,
    }));
    const maxMonthCount = Math.max(1, ...monthCounts.map((m) => m.count));

    const monthsSet = new Set(entries.map((e) => monthKey(e.date))); // streak always from all entries, not filtered
    const streak = currentStreak(monthsSet);

    const activeMonths = monthCounts.filter((m) => m.count > 0).length;
    const avgPerMonth = activeMonths ? (total / monthCounts.length).toFixed(1) : "0";

    // Momentum: this window's count vs an equal-length window right before it
    let momentum: number | null = null;
    if (range !== "all") {
      const n = Number(range);
      const windowStart = monthsAgo(n);
      const prevWindowStart = monthsAgo(n * 2);
      const prevCount = entries.filter((e) => {
        const d = new Date(e.date + "T00:00:00");
        return d >= prevWindowStart && d < windowStart;
      }).length;
      if (prevCount > 0) {
        momentum = Math.round(((total - prevCount) / prevCount) * 100);
      } else if (total > 0) {
        momentum = 100;
      }
    }

    return {
      total,
      withMetric,
      byCategory,
      topRoles,
      topTags,
      monthCounts,
      maxMonthCount,
      streak,
      avgPerMonth,
      momentum,
    };
  }, [filtered, entries, range]);

  if (entries.length === 0) return null;

  const metricPct = stats.total ? Math.round((stats.withMetric / stats.total) * 100) : 0;

  // Donut geometry
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;
  const donutSegments = CATEGORY_ORDER.map((cat) => {
    const count = stats.byCategory[cat];
    const fraction = stats.total ? count / stats.total : 0;
    const dash = fraction * circumference;
    const segment = {
      cat,
      count,
      dash,
      gap: circumference - dash,
      offset: -cumulative,
    };
    cumulative += dash;
    return segment;
  });

  return (
    <section aria-labelledby="dashboard-heading" className="mb-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="dashboard-heading" className="font-display text-lg font-semibold text-white">
          Resumen
        </h2>

        {/* Time range filter */}
        <div className="glass flex gap-1 rounded-full p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                range === opt.value
                  ? "bg-vital-500 text-graphite-950"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category + role filters */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {CATEGORY_ORDER.map((cat) => {
          const active = activeCategories.has(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-all ${
                active
                  ? "border-white/20 bg-white/10 text-white/80"
                  : "border-white/5 text-white/25 hover:text-white/50"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${active ? CATEGORY_DOT[cat] : "bg-white/20"}`}
              />
              {CATEGORY_LABEL[cat]}
            </button>
          );
        })}

        {allRoles.length > 0 && (
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/60 outline-none transition-colors focus:border-vital-500/50"
          >
            <option value="all" className="bg-graphite-900">
              Todos los roles
            </option>
            {allRoles.map((r) => (
              <option key={r} value={r} className="bg-graphite-900">
                {r}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* KPI row */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <BigStat label="Logros" value={stats.total} accent="text-white" />
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
        <BigStat label="Promedio/mes" value={stats.avgPerMonth} accent="text-amber-400" />
        <BigStat
          label="Momentum"
          value={
            stats.momentum === null
              ? "—"
              : `${stats.momentum > 0 ? "+" : ""}${stats.momentum}%`
          }
          accent={
            stats.momentum === null
              ? "text-white/40"
              : stats.momentum >= 0
                ? "text-signal-400"
                : "text-red-400"
          }
          sub={stats.momentum === null ? undefined : "vs. periodo anterior"}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Monthly activity */}
        <div className="glass shadow-card rounded-2xl p-5 lg:col-span-3">
          <p className="font-mono text-xs uppercase tracking-wide text-white/40">
            Actividad mensual
          </p>
          <div className="mt-5 flex h-32 items-end gap-2 sm:gap-3">
            {stats.monthCounts.map(({ month, count }) => {
              const [y, m] = month.split("-");
              const heightPct = Math.max(6, (count / stats.maxMonthCount) * 100);
              return (
                <div key={month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex h-24 w-full items-end justify-center">
                    <div
                      className="w-full max-w-[26px] rounded-t-md bg-gradient-to-t from-vital-600 to-signal-400 shadow-glow transition-all duration-500 hover:from-vital-500 hover:to-signal-300"
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

        {/* Category donut */}
        <div className="glass shadow-card flex flex-col items-center rounded-2xl p-5 lg:col-span-2">
          <p className="self-start font-mono text-xs uppercase tracking-wide text-white/40">
            Mezcla de categorías
          </p>
          <div className="relative mt-3 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-36 w-36 -rotate-90">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              {donutSegments.map((seg) =>
                seg.count > 0 ? (
                  <circle
                    key={seg.cat}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={CATEGORY_HEX[seg.cat]}
                    strokeWidth="12"
                    strokeDasharray={`${seg.dash} ${seg.gap}`}
                    strokeDashoffset={seg.offset}
                    strokeLinecap="butt"
                    className="transition-all duration-700"
                  />
                ) : null
              )}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-display text-2xl font-bold text-white">{stats.total}</span>
              <span className="font-mono text-[10px] uppercase text-white/40">logros</span>
            </div>
          </div>
          <ul className="mt-4 w-full space-y-1.5">
            {CATEGORY_ORDER.map((cat) => (
              <li key={cat} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-white/60">
                  <span className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[cat]}`} />
                  {CATEGORY_LABEL[cat]}
                </span>
                <span className="font-mono text-white/40">{stats.byCategory[cat]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(stats.topRoles.length > 0 || stats.topTags.length > 0) && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stats.topRoles.length > 0 && (
            <div className="glass shadow-card rounded-2xl p-5">
              <p className="font-mono text-xs uppercase tracking-wide text-white/40">
                Dónde pasó
              </p>
              <ul className="mt-3 space-y-3">
                {stats.topRoles.map(([role, count]) => {
                  const pct = stats.total ? (count / stats.total) * 100 : 0;
                  return (
                    <li key={role}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate text-white/70">{role}</span>
                        <span className="shrink-0 font-mono text-vital-400">{count}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-vital-500 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
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

      {filtered.length === 0 && (
        <p className="mt-6 text-center font-mono text-xs text-white/35">
          Ningún logro coincide con estos filtros.
        </p>
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
