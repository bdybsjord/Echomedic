import type { Risk } from "../types/risk";
import RiskLevelBadge from "./RiskLevelBadge";
import { useNavigate } from "react-router-dom";
import RiskStatusBadge from "./RiskStatusBadge";

// Props interface - tar imot array av risks
// Dette gjør komponenten gjenbrukbar og klar for API senere

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
          <span className="font-semibold text-slate-200">“Ny risiko”</span> for
          å starte risikoregisteret.
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
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Risiko
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sannsynlighet
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Konsekvens
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Nivå
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
              <td className="px-4 py-3 align-top text-xs font-mono text-slate-400">
                {risk.id}
              </td>
              <td className="px-4 py-3 align-top">
                <div className="text-sm font-medium text-slate-50">
                  {risk.title}
                </div>
                {risk.description && (
                  <div className="text-xs text-slate-400 line-clamp-2">
                    {risk.description}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 align-top text-xs text-slate-200">
                {risk.likelihood} / 5
              </td>
              <td className="px-4 py-3 align-top text-xs text-slate-200">
                {risk.consequence} / 5
              </td>
              <td className="px-4 py-3 align-top">
                <RiskLevelBadge level={risk.level} />
              </td>
              <td className="px-4 py-3 align-top">
                <RiskStatusBadge status={risk.status} />
              </td>
              <td className="px-4 py-3 align-top text-xs text-slate-200">
                {risk.owner}
              </td>
              <td className="px-4 py-3 align-top text-right text-xs font-mono text-slate-100">
                {risk.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
