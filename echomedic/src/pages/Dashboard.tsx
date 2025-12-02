export default function Dashboard() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">
            Risiko-oversikt
          </h2>
          <p className="text-sm text-slate-400">
            Her vil du finne risikoregister, status på tiltak og modenhet
            (mock-data i Sprint 1).
          </p>
        </div>

        <div className="flex gap-3 text-xs">
          <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
            <span className="text-slate-400">Antall registrerte risikoer</span>
            <span className="text-lg font-semibold text-slate-50">12</span>
          </div>
          <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
            <span className="text-slate-400">Kritiske (rød)</span>
            <span className="text-lg font-semibold text-rose-400">3</span>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
        <p>
          I Sprint 1 er dette et enkelt mock-dashboard. I senere sprinter skal vi koble på ekte risikoregister, grafer og tabeller.
        </p>
      </section>
    </div>
  );
}
