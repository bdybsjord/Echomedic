import type { Risk } from "../../types/risk";
import RiskLevelBadge from "./RiskLevelBadge";
import RiskStatusBadge from "./RiskStatusBadge";
import { useNavigate } from "react-router-dom";

interface RiskTableProps {
  risks: Risk[];
}

export default function RiskTable({ risks }: RiskTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (id: string) => {
    navigate(`/risks/${id}`);
  };

  if (risks.length === 0) {
    return (
      <div className="glass-panel rounded-3xl border border-slate-800 px-6 py-10 text-center">
        <p className="text-sm text-slate-400">
          Ingen risikoer registrert ennå. Klikk{" "}
          <span className="font-semibold text-slate-200">“Ny risiko”</span> for å starte risikoregisteret.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full glass-panel rounded-3xl border border-slate-800">
        <thead>
          <tr className="bg-slate-950/60">
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Rapport-ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Risiko
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              S / K
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Nivå
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Behandling
            </th>
            <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Estimat
            </th>
            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Eier
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Score
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800/60">
          {risks.map((risk) => (
            <tr
              key={risk.id}
              className="cursor-pointer hover:bg-slate-900/50 transition-colors"
              onClick={() => handleRowClick(risk.id)}
            >
              <td className="px-4 py-3 align-top text-xs font-mono text-slate-300">
                {risk.reportId ?? "—"}
              </td>

              <td className="px-4 py-3 align-top">
                <div className="text-sm font-medium text-slate-50">{risk.title}</div>

                {risk.description ? (
                  <div className="text-xs text-slate-400 line-clamp-2">{risk.description}</div>
                ) : null}

                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Sist: {risk.updatedAt.toLocaleDateString("nb-NO")}</span>
                  {risk.affectedAssets?.length ? (
                    <span>• Eiendeler: {risk.affectedAssets.join(", ")}</span>
                  ) : null}
                </div>
              </td>

              <td className="hidden md:table-cell px-4 py-3 align-top text-xs text-slate-200">
                {risk.category ?? "—"}
              </td>

              <td className="px-4 py-3 align-top text-xs text-slate-200">
                {risk.likelihood} / {risk.consequence}
                {risk.residualScore != null ? (
                  <div className="text-[11px] text-slate-500">
                    Rest: {risk.residualLikelihood ?? "—"} / {risk.residualConsequence ?? "—"}
                  </div>
                ) : null}
              </td>

              <td className="px-4 py-3 align-top">
                <RiskLevelBadge level={risk.level} />
                {risk.residualLevel ? (
                  <div className="mt-1">
                    <span className="text-[11px] text-slate-500">Rest:</span>{" "}
                    <RiskLevelBadge level={risk.residualLevel} />
                  </div>
                ) : null}
              </td>

              <td className="px-4 py-3 align-top">
                <RiskStatusBadge status={risk.status} />
              </td>

              <td className="hidden lg:table-cell px-4 py-3 align-top text-xs text-slate-200">
                {risk.treatment ?? "—"}
                {risk.treatmentStatus ? (
                  <div className="text-[11px] text-slate-500">{risk.treatmentStatus}</div>
                ) : null}
              </td>

              <td className="hidden lg:table-cell px-4 py-3 align-top text-xs text-slate-200">
                {risk.estimatedHours != null ? `${risk.estimatedHours}t` : "—"}
              </td>

              <td className="hidden sm:table-cell px-4 py-3 align-top text-xs text-slate-200">
                {risk.owner}
              </td>

              <td className="px-4 py-3 align-top text-right text-xs font-mono text-slate-100">
                {risk.score}
                {risk.residualScore != null ? (
                  <div className="text-[11px] text-slate-500">Rest: {risk.residualScore}</div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
