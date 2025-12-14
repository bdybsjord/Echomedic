import { Link } from "react-router-dom";
import { useRisks } from "../hooks/useRisks";
import { useControls } from "../hooks/useControls";
import { usePolicies } from "../hooks/usePolicies";
import Card from "../components/ui/Card";
import RiskTable from "../components/risk/RiskTable";
import RiskLevelBadge from "../components/risk/RiskLevelBadge";
import type { Risk, RiskCategory } from "../types/risk";
import type { Control } from "../types/control";
import type { Policy } from "../types/policy";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorBanner } from "../components/common/ErrorBanner";
import { mockRisks } from "../data/mockRisks";
import { mockControls } from "../data/mockControls";
import { mockPolicies } from "../data/mockPolicies";
import { mapMockRisksToDomain } from "../adapters/mockRiskAdapter";

const CATEGORY_COLORS: Record<RiskCategory, string> = {
  Teknisk: "bg-cyan-400",
  Prosess: "bg-fuchsia-400",
  Personell: "bg-violet-300",
  Juridisk: "bg-amber-300",
};

type CategoryLabel = RiskCategory | "Uten kategori";

type CategoryChartItem = {
  label: CategoryLabel;
  value: number;
  pct: number;
  color: string;
};

const COLOR_HEX: Record<CategoryLabel, string> = {
  Teknisk: "#22d3ee", // cyan-400
  Prosess: "#e879f9", // fuchsia-400
  Personell: "#c4b5fd", // violet-300
  Juridisk: "#fcd34d", // amber-300
  "Uten kategori": "#94a3b8", // slate-400
};

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

function monthLabelNb(key: string) {
  const [y, mm] = key.split("-");
  const date = new Date(Number(y), Number(mm) - 1, 1);
  return date.toLocaleDateString("nb-NO", { month: "short" });
}

function toConicGradient(items: CategoryChartItem[]): string {
  if (!items.length) {
    return "conic-gradient(from 270deg, rgba(148,163,184,0.3) 0deg 360deg)";
  }

  let start = 0;
  const stops = items.map((i) => {
    const deg = (i.pct / 100) * 360;
    const from = start;
    const to = start + deg;
    start = to;
    return `${COLOR_HEX[i.label]} ${from}deg ${to}deg`;
  });

  // dersom avrunding gjør at vi ikke ender på 360, fyll siste med resten (hindrer “gap”)
  const totalPct = items.reduce((s, i) => s + i.pct, 0);
  if (totalPct < 100) {
    const last = items[items.length - 1];
    const missingDeg = ((100 - totalPct) / 100) * 360;
    const from = start;
    const to = start + missingDeg;
    stops.push(`${COLOR_HEX[last.label]} ${from}deg ${to}deg`);
  }

  return `conic-gradient(from 270deg, ${stops.join(", ")})`;
}

/**
 * Returnerer siste N måneder som keys "YYYY-MM", inkl. nåværende måned.
 * Stabilt: alltid N keys, i kronologisk rekkefølge.
 */
function lastNMonthKeys(n: number): string[] {
  const now = new Date();
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(monthKey(d));
  }
  return keys;
}

export default function Dashboard() {
  const { risks, loading: risksLoading, error: risksError } = useRisks();
  const { controls, loading: controlsLoading, error: controlsError } =
    useControls();
  const { policies, loading: policiesLoading, error: policiesError } =
    usePolicies();

  const isLoading = risksLoading || controlsLoading || policiesLoading;
  const firstError = risksError || controlsError || policiesError;

  if (isLoading) return <LoadingSpinner />;
  if (firstError) return <ErrorBanner message={firstError} />;

  const displayRisks: Risk[] =
    risks.length > 0 ? risks : mapMockRisksToDomain(mockRisks);
  const displayControls: Control[] =
    controls.length > 0 ? controls : mockControls;
  const displayPolicies: Policy[] =
    policies.length > 0 ? policies : (mockPolicies as unknown as Policy[]);

  // KPIer (risiko)
  const totalRisks = displayRisks.length;
  const high = displayRisks.filter((r) => r.level === "High").length;
  const medium = displayRisks.filter((r) => r.level === "Medium").length;
  const low = displayRisks.filter((r) => r.level === "Low").length;

  const open = displayRisks.filter(
    (r) => r.status === "Open" || r.status === "InProgress",
  ).length;
  const closed = displayRisks.filter((r) => r.status === "Closed").length;

  // Kritiske å “ta før go-live”
  const mustFixBeforeGoLive = [...displayRisks]
    .filter((r) => r.level === "High" && r.score >= 9)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  // Topplist
  const topHigh = [...displayRisks]
    .filter((r) => r.level === "High")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const latest = [...displayRisks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  // SoA / Controls
  const totalControls = displayControls.length;
  const implementedControls = displayControls.filter(
    (c) => c.status === "Implemented",
  ).length;

  // Policies
  const totalPolicies = displayPolicies.length;
  const validPolicies = displayPolicies.filter((p) => p.status === "Gyldig").length;
  const underRevision = displayPolicies.filter(
    (p) => p.status === "Under revisjon",
  ).length;

  // Kategori (fra reelle felt)
  const categoryCounts = displayRisks.reduce<Record<CategoryLabel, number>>(
    (acc, r) => {
      const key: CategoryLabel = (r.category ?? "Uten kategori") as CategoryLabel;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<CategoryLabel, number>,
  );

  const categoryItems = Object.entries(categoryCounts)
    .map(([label, value]) => {
      const typedLabel = label as CategoryLabel;
      const color =
        typedLabel === "Uten kategori"
          ? "bg-slate-400"
          : CATEGORY_COLORS[typedLabel];
      return { label: typedLabel, value, color };
    })
    .sort((a, b) =>
      a.label === "Uten kategori"
        ? 1
        : b.label === "Uten kategori"
          ? -1
          : b.value - a.value,
    );

  const totalCategory = categoryItems.reduce((s, c) => s + c.value, 0);
  const categoryWithPct: CategoryChartItem[] = categoryItems.map((c) => ({
    ...c,
    pct: totalCategory ? Math.round((c.value / totalCategory) * 100) : 0,
  }));

  // Trend siste 6 mnd (basert på createdAt) – ALWAYS 6 keys
  const byMonth = displayRisks.reduce<Record<string, number>>((acc, r) => {
    const key = monthKey(r.createdAt);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const last6Keys = lastNMonthKeys(6);

  const trendData = last6Keys.map((k) => ({
    monthKey: k,
    month: monthLabelNb(k),
    count: byMonth[k] ?? 0,
  }));

  const trendTotal = trendData.reduce((s, x) => s + x.count, 0);
  const trendMax = Math.max(1, ...trendData.map((t) => t.count));

  const lastUpdated =
    displayRisks.length > 0
      ? new Date(
          Math.max(...displayRisks.map((r) => r.updatedAt.getTime())),
        ).toLocaleDateString("nb-NO")
      : new Date().toLocaleDateString("nb-NO");

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50">
            Enklere risikostyring,
            <span className="ml-2 bg-gradient-to-r from-violet-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
              mer tid til pasienten
            </span>
          </h2>

          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Oversikt over risikoer, kontroller (SoA) og sikkerhetspolicyer i
            Echomedic.
          </p>
        </div>

        <div className="text-right text-xs text-slate-400">
          <p className="font-medium text-slate-300">Sist oppdatert</p>
          <p className="text-sm font-semibold text-slate-50">{lastUpdated}</p>
        </div>
      </header>

      {/* KPI */}
      <section className="grid gap-4 md:grid-cols-4">
        <Card className="flex flex-col gap-1 border-violet-500/30 bg-slate-950/60 shadow-[0_0_40px_rgba(88,28,135,0.35)]">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Totalt antall risikoer
          </span>
          <span className="text-3xl font-semibold text-slate-50">{totalRisks}</span>
          <span className="text-xs text-slate-500">
            Alle registrerte risikoer i registeret.
          </span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Fordeling risikonivå
          </span>
          <div className="flex items-baseline gap-3 text-sm">
            <span className="flex items-center gap-1 text-rose-300">
              <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(248,113,113,0.9)]" />
              Rød: {high}
            </span>
            <span className="flex items-center gap-1 text-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
              Gul: {medium}
            </span>
            <span className="flex items-center gap-1 text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              Grønn: {low}
            </span>
          </div>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Status på risikoer
          </span>
          <div className="flex items-baseline gap-3 text-sm">
            <span className="flex items-center gap-1 text-violet-200">
              <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.9)]" />
              Åpne: {open}
            </span>
            <span className="flex items-center gap-1 text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
              Lukket: {closed}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            «Åpen» = åpne + under behandling.
          </span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Styring &amp; kontroll
          </span>
          <div className="space-y-1 text-xs text-slate-300">
            <p>
              <span className="font-semibold text-slate-50">
                {implementedControls}/{totalControls}
              </span>{" "}
              kontroller implementert (SoA).
            </p>
            <p>
              <span className="font-semibold text-slate-50">
                {validPolicies}/{totalPolicies}
              </span>{" "}
              policyer gyldige,{" "}
              <span className="text-amber-300">{underRevision} under revisjon</span>.
            </p>
          </div>
          <div className="mt-1 flex gap-2 text-[11px]">
            <Link to="/controls" className="text-violet-300 hover:text-violet-200">
              Se kontroller →
            </Link>
            <Link to="/policies" className="text-cyan-300 hover:text-cyan-200">
              Se policyer →
            </Link>
          </div>
        </Card>
      </section>

      {/* MUST FIX + KATEGORI */}
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* MUST FIX */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-50">Må håndteres før go-live</h3>
            <Link
              to="/risks"
              className="text-xs font-medium text-violet-300 hover:text-violet-200"
            >
              Gå til risikoregister →
            </Link>
          </div>
          <p className="text-xs text-slate-400">
            Henter de høyest prioriterte risikoene (praktisk filter: score ≥ 9).
          </p>

          <ul className="space-y-3">
            {mustFixBeforeGoLive.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-mono text-slate-400">{r.reportId ?? r.id}</p>
                    <p className="text-sm font-semibold text-slate-50">{r.title}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Eier: <span className="text-slate-200">{r.owner}</span>
                      {r.category ? <span> • {r.category}</span> : null}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <RiskLevelBadge level={r.level} />
                    <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[11px] text-slate-200">
                      Score: {r.score}
                    </span>
                  </div>
                </div>
              </li>
            ))}

            {mustFixBeforeGoLive.length === 0 ? (
              <p className="text-xs text-slate-500">Ingen “score ≥ 9” risikoer funnet.</p>
            ) : null}
          </ul>
        </Card>

        {/* KATEGORI (OPPGRADERT) */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-50">Risikoer per kategori</h3>
              <p className="text-xs text-slate-400">
                Basert på kategorifeltet i risikoregisteret.
              </p>
            </div>

            <div className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-[11px] text-slate-300">
              {totalCategory} total
            </div>
          </div>

          {categoryWithPct.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-center">
              <p className="text-sm text-slate-400">Ingen kategoridata enda.</p>
              <p className="mt-1 text-xs text-slate-500">
                Legg til “kategori” på risikoene for å få fordeling.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[180px_1fr]">
              {/* DONUT */}
              <div className="flex items-center justify-center">
                <div className="relative h-44 w-44">
                  <div className="absolute inset-0 rounded-full blur-xl opacity-30 bg-violet-500/40" />

                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundImage: toConicGradient(categoryWithPct) }}
                  />

                  <div className="absolute inset-[18px] rounded-full bg-slate-950" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="text-2xl font-semibold text-slate-50">
                      {totalCategory}
                    </div>
                    <div className="text-[11px] text-slate-400">risikoer</div>
                  </div>

                  <div className="absolute inset-0 rounded-full ring-1 ring-slate-800" />
                </div>
              </div>

              {/* LEGEND */}
              <div className="space-y-3">
                {categoryWithPct.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
                        <span className="text-sm font-medium text-slate-100">
                          {c.label}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 text-xs">
                        <span className="font-mono text-slate-100">{c.value}</span>
                        <span className="text-slate-500">({c.pct}%)</span>
                      </div>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-900">
                      <div
                        className={`h-full ${c.color}`}
                        style={{ width: `${Math.max(2, c.pct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* TREND + TOPP */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* TREND */}
        <Card className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Utvikling i registrerte risikoer
              </h3>
              <p className="text-xs text-slate-400">
                Siste 6 måneder basert på opprettelsesdato.
              </p>
            </div>

            <div className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-[11px] text-slate-300">
              {trendTotal} nye (6 mnd)
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-4">
            {trendData.every((x) => x.count === 0) ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-center">
                <p className="text-sm text-slate-400">Ingen trenddata enda.</p>
                <p className="mt-1 text-xs text-slate-500">
                  Opprett risikoer for å se utvikling over tid.
                </p>
              </div>
            ) : (
              (() => {
                const chartHeight = 160; // px

                return (
                  <div className="relative" style={{ height: chartHeight + 44 }}>
                    {/* grid */}
                    <div className="absolute inset-x-0 top-0 h-px bg-slate-800/60" />
                    <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/30" />
                    <div className="absolute inset-x-0 bottom-10 h-px bg-slate-800/60" />

                    {/* y labels */}
                    <div className="absolute right-0 top-0 text-[10px] text-slate-500">
                      {trendMax}
                    </div>
                    <div className="absolute right-0 bottom-10 text-[10px] text-slate-600">
                      0
                    </div>

                    {/* bars */}
                    <div className="absolute inset-x-0 bottom-10 flex h-[160px] items-end gap-3">
                      {trendData.map((item) => {
                        const h = Math.max(
                          6,
                          Math.round((item.count / trendMax) * chartHeight),
                        );
                        const isMax = item.count === trendMax && trendMax > 0;
                        const isZero = item.count === 0;

                        return (
                          <div
                            key={item.monthKey}
                            className="group flex min-w-0 flex-1 flex-col items-center justify-end"
                          >
                            {/* value pill */}
                            <div className="mb-2 opacity-80 transition-opacity group-hover:opacity-100">
                              <span
                                className={[
                                  "rounded-full border px-2 py-0.5 text-[11px]",
                                  isZero
                                    ? "border-slate-800 bg-slate-950/60 text-slate-500"
                                    : "border-slate-800 bg-slate-950/80 text-slate-200",
                                ].join(" ")}
                              >
                                {item.count}
                              </span>
                            </div>

                            <div
                              className={[
                                "w-full rounded-2xl ring-1 ring-slate-800/70 transition-transform",
                                "group-hover:-translate-y-0.5",
                                isZero
                                  ? "bg-slate-900/50"
                                  : "bg-gradient-to-t from-violet-600/35 via-violet-400/85 to-cyan-300",
                                isMax && !isZero
                                  ? "shadow-[0_0_28px_rgba(139,92,246,0.55)]"
                                  : !isZero
                                    ? "shadow-[0_0_18px_rgba(56,189,248,0.35)]"
                                    : "",
                              ].join(" ")}
                              style={{ height: `${h}px` }}
                              aria-label={`${item.month}: ${item.count} risikoer`}
                              title={`${item.month}: ${item.count}`}
                            />

                            <div className="mt-3 text-[11px] text-slate-400">
                              {item.month}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </Card>

        {/* TOPP 3 */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-50">Topp 3 kritiske risikoer</h3>
            <Link
              to="/risks"
              className="text-xs font-medium text-violet-300 hover:text-violet-200"
            >
              Gå til risikoregister →
            </Link>
          </div>

          <ul className="space-y-3">
            {topHigh.map((risk) => (
              <li
                key={risk.id}
                className="rounded-2xl border border-violet-700/70 bg-violet-950/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-mono text-slate-400">{risk.reportId ?? risk.id}</p>
                    <p className="text-sm font-semibold text-slate-50">{risk.title}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Eier: <span className="text-slate-200">{risk.owner}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <RiskLevelBadge level={risk.level} />
                    <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[11px] text-slate-200">
                      Score: {risk.score}
                    </span>
                  </div>
                </div>
              </li>
            ))}
            {topHigh.length === 0 ? (
              <p className="text-xs text-slate-500">Ingen røde risikoer registrert.</p>
            ) : null}
          </ul>
        </Card>
      </section>

      {/* SISTE */}
      <section>
        <Card className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-50">Siste oppdaterte risikoer</h3>
          <p className="text-xs text-slate-400">Viser de nyeste endringene i registeret.</p>
          <RiskTable risks={latest} />
        </Card>
      </section>
    </div>
  );
}
