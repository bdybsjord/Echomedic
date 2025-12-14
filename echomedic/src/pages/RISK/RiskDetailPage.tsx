import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteRisk, fetchRiskById } from "../../services/riskService";
import type { Risk } from "../../types/risk";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import RiskLevelBadge from "../../components/risk/RiskLevelBadge";
import RiskStatusBadge from "../../components/risk/RiskStatusBadge";
import { mockRisks } from "../../data/mockRisks";
import { mapMockRiskToDomain } from "../../adapters/mockRiskAdapter";
import { useAuth } from "../../context/useAuth";

export const RiskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const isReader = user?.role === "leser";
  const canManage = !!user && !isReader;

  const isMockRisk = useMemo(
    () => (id ? mockRisks.some((m) => m.id === id) : false),
    [id],
  );

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const r = await fetchRiskById(id);

        if (r) {
          setRisk(r);
          return;
        }

        const mock = mockRisks.find((m) => m.id === id);
        if (mock) setRisk(mapMockRiskToDomain(mock));
        else setError("Fant ikke risiko");
      } catch {
        setError("Kunne ikke hente risiko");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleDelete = async () => {
    if (!risk || !user || isMockRisk) return;

    const confirmed = window.confirm(
      "Er du sikker på at du vil slette denne risikoen? Dette kan ikke angres.",
    );
    if (!confirmed) return;

    try {
      await deleteRisk(risk.id, user);
      navigate("/risks");
    } catch (err) {
      console.error(err);
      setError("Kunne ikke slette risiko.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!risk) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-mono text-slate-500">
            {risk.reportId ? `${risk.reportId} • ` : null}
            {risk.id}
          </p>
          <h1 className="text-xl font-semibold text-slate-50">{risk.title}</h1>
          {risk.category ? (
            <p className="mt-1 text-xs text-slate-400">Kategori: {risk.category}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/risks"
            className="text-sm font-medium text-violet-300 hover:text-violet-200"
          >
            ← Tilbake til register
          </Link>

          {canManage && !isMockRisk && (
            <>
              <button
                type="button"
                onClick={() => navigate(`/risks/${risk.id}/edit`)}
                className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
              >
                Rediger
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-rose-500/70 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/20"
              >
                Slett
              </button>
            </>
          )}

          {isMockRisk ? (
            <p className="text-[10px] text-slate-500">Demo-risiko (mock) – kan ikke slettes.</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Core */}
        <section className="glass-panel rounded-2xl p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-100">Risiko (nåværende)</h2>

          <dl className="grid gap-3 sm:grid-cols-2 text-sm text-slate-200">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Status</dt>
              <dd><RiskStatusBadge status={risk.status} /></dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Eier</dt>
              <dd className="font-medium">{risk.owner}</dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Score</dt>
              <dd className="flex items-center gap-2 font-mono">
                <span>{risk.score}</span>
                <RiskLevelBadge level={risk.level} />
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">S / K</dt>
              <dd>{risk.likelihood} / 5 • {risk.consequence} / 5</dd>
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>Opprettet: {risk.createdAt.toLocaleDateString("nb-NO")}</span>
              <span>Sist oppdatert: {risk.updatedAt.toLocaleDateString("nb-NO")}</span>
            </div>
          </dl>
        </section>

        {/* Treatment */}
        <section className="glass-panel rounded-2xl p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-100">Behandling</h2>

          <div className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Strategi</span>
              <span className="font-medium">{risk.treatment ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status</span>
              <span className="font-medium">{risk.treatmentStatus ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Estimert tid</span>
              <span className="font-medium">
                {risk.estimatedHours != null ? `${risk.estimatedHours}t` : "—"}
              </span>
            </div>

            {risk.affectedAssets?.length ? (
              <div className="pt-2 text-xs text-slate-400">
                Berørte eiendeler:{" "}
                <span className="text-slate-200">{risk.affectedAssets.join(", ")}</span>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {/* Residual */}
      <section className="glass-panel rounded-2xl p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">Rest-risiko</h2>
        {risk.residualScore == null ? (
          <p className="text-sm text-slate-400">
            Ikke vurdert enda. (Legg inn rest S/K etter tiltak for å vise modenhet i registeret.)
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-mono">
              Rest S/K: {risk.residualLikelihood ?? "—"} / {risk.residualConsequence ?? "—"}
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-mono">
              Rest score: {risk.residualScore}
            </span>
            {risk.residualLevel ? <RiskLevelBadge level={risk.residualLevel} /> : null}
          </div>
        )}
      </section>

      {/* Measures + description */}
      <section className="glass-panel rounded-2xl p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">Tiltak</h2>
        <p className="text-sm text-slate-200">{risk.measures || "Ingen tiltak registrert ennå."}</p>
      </section>

      <section className="glass-panel rounded-2xl p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">Beskrivelse</h2>
        <p className="text-sm text-slate-200">{risk.description || "Ingen beskrivelse registrert."}</p>
      </section>

      {/* Links */}
      {(risk.controlIds?.length || risk.policyIds?.length) ? (
        <section className="glass-panel rounded-2xl p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-100">Koblinger</h2>

          <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-200">
            <div>
              <p className="text-xs text-slate-400">Kontroller (SoA)</p>
              <p className="mt-1">{risk.controlIds?.length ? risk.controlIds.join(", ") : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Policyer</p>
              <p className="mt-1">{risk.policyIds?.length ? risk.policyIds.join(", ") : "—"}</p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};
