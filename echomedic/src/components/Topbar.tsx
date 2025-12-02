export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur-md">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">
          Echomedic – Risikoportal
        </h1>
        <p className="text-xs text-slate-400">
          Oversikt over risiko, tiltak og modenhet.
        </p>
      </div>
    </header>
  );
}
