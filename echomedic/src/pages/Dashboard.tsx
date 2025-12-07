import { Link } from "react-router-dom";
import { useRisks } from "../hooks/useRisks";
import Card from "../components/ui/Card";
import RiskTable from "../components/RiskTable";
import RiskLevelBadge from "../components/RiskLevelBadge";
import type { Risk } from "../types/risk";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorBanner } from "../components/common/ErrorBanner";
import { mockRisks } from "../data/mockRisks";
import { mapMockRisksToDomain } from "../adapters/mockRiskAdapter";

// Mock-trend
const trendData: { month: string; count: number }[] = [
  { month: "Jan", count: 3 },
  { month: "Feb", count: 4 },
  { month: "Mar", count: 6 },
  { month: "Apr", count: 5 },
  { month: "Mai", count: 7 },
  { month: "Jun", count: 6 },
];

// Mock-kategorier
const categoryData = [
  { label: "Teknisk", value: 7, color: "bg-cyan-400" },
  { label: "Prosess", value: 4, color: "bg-violet-300" },
  { label: "Personell", value: 3, color: "bg-fuchsia-400" },
];

export default function Dashboard() {
  const { risks, loading, error } = useRisks();

  // Loading/error
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} />;

  // Bruk mock hvis databasen er tom
  const displayRisks: Risk[] =
    risks.length > 0 ? risks : mapMockRisksToDomain(mockRisks);

  // KPI-beregninger
  const total = displayRisks.length;
  const high = displayRisks.filter((r) => r.level === "High").length;
  const medium = displayRisks.filter((r) => r.level === "Medium").length;
  const low = displayRisks.filter((r) => r.level === "Low").length;

  const open = displayRisks.filter(
    (r) => r.status === "Open" || r.status === "InProgress",
  ).length;
  const closed = displayRisks.filter((r) => r.status === "Closed").length;

  const lastUpdated = new Date().toLocaleDateString("nb-NO");

  const topHigh = [...displayRisks]
    .filter((r) => r.level === "High")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const latest = [...displayRisks]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const totalCategory = categoryData.reduce((s, c) => s + c.value, 0);
  const categoryWithPct = categoryData.map((c) => ({
    ...c,
    pct: Math.round((c.value / totalCategory) * 100),
  }));

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
            Oversikt over nøkkeltall, trender og kritiske risikoer.
          </p>
        </div>

        <div className="text-right text-xs text-slate-400">
          <p className="font-medium text-slate-300">Sist oppdatert</p>
          <p className="text-sm font-semibold text-slate-50">
            {lastUpdated}
          </p>
        </div>
      </header>

      {/* KPI-KORT */}
      <section className="grid gap-4 md:grid-cols-4">
        <Card className="flex flex-col gap-1 border-violet-500/30 bg-slate-950/60 shadow-[0_0_40px_rgba(88,28,135,0.35)]">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Totalt antall risikoer
          </span>
          <span className="text-3xl font-semibold text-slate-50">{total}</span>
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
            «Åpen» = både åpne og under behandling.
          </span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Fokus for Sprint 2
          </span>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• Firestore som datakilde</li>
            <li>• Ny risiko &amp; detaljer</li>
            <li>• Dashboard med KPI-er og topp 3</li>
          </ul>
        </Card>
      </section>

      {/* TRENDS + KATEGORI */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* TREND */}
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-slate-50">
            Utvikling i antall risikoer (mock)
          </h3>

          <div className="mt-4 flex h-40 items-end gap-3 border-t border-slate-800 pt-4">
            {trendData.map((item) => {
              const max = Math.max(...trendData.map((t) => t.count));
              const heightPct = (item.count / max) * 100;

              return (
                <div
                  key={item.month}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-violet-600/40 via-violet-400/80 to-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.45)]"
                    style={{ height: `${20 + heightPct}%` }}
                  />
                  <span className="text-[11px] text-slate-400">
                    {item.month}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* DONUT */}
        <Card className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-50">
              Risikoer per kategori (mock)
            </h3>
            <p className="text-xs text-slate-400">
              Kategorier kobles mot reelle data i senere sprint.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-full bg-slate-900" />
              <div className="absolute inset-1.5 rounded-full bg-slate-950" />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundImage:
                    "conic-gradient(from 270deg, rgb(139 92 246) 0deg 140deg, rgb(56 189 248) 140deg 240deg, rgb(244 114 182) 240deg 360deg)",
                }}
              />
            </div>

            <div className="flex-1 space-y-2 text-xs">
              {categoryWithPct.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
                    <span className="text-slate-200">{c.label}</span>
                  </div>
                  <div className="text-right text-slate-400">
                    <span className="font-mono text-slate-100">{c.value}</span>
                    <span className="ml-1 text-[11px]">({c.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* TOPP 3 + SISTE */}
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* TOPP 3 */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-50">
              Topp 3 kritiske risikoer
            </h3>
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
                    <p className="text-xs font-mono text-slate-400">
                      {risk.id}
                    </p>
                    <p className="text-sm font-semibold text-slate-50">
                      {risk.title}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Eier:{" "}
                      <span className="text-slate-200">{risk.owner}</span>
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

            {topHigh.length === 0 && (
              <p className="text-xs text-slate-500">
                Ingen røde risikoer registrert.
              </p>
            )}
          </ul>
        </Card>

        {/* SISTE RISIKOER */}
        <Card className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-50">
            Siste registrerte risikoer
          </h3>
          <p className="text-xs text-slate-400">
            Viser de nyeste risikoene i registeret.
          </p>
          <RiskTable risks={latest} />
        </Card>
      </section>
    </div>
  );
}
