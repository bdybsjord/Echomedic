import { Link } from "react-router-dom";
import type { Risk } from "../../types/risk";
import RiskLevelBadge from "../RiskLevelBadge";

interface Props {
  risks: Risk[];
}

export const RiskTable = ({ risks }: Props) => {
  if (risks.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        Ingen risikoer registrert ennå. Klikk{" "}
        <Link to="/risks/new" className="font-medium text-orange-600 underline">
          Ny risiko
        </Link>{" "}
        for å starte.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">ID</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">Risiko</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">Sannsynlighet</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">Konsekvens</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">Score</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">Nivå</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">Eier</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {risks.map((risk) => (
            <tr key={risk.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-xs text-gray-500">{risk.id}</td>
              <td className="px-3 py-2 text-sm font-medium text-gray-900">{risk.title}</td>
              <td className="px-3 py-2 text-sm text-gray-700">{risk.likelihood}</td>
              <td className="px-3 py-2 text-sm text-gray-700">{risk.consequence}</td>
              <td className="px-3 py-2 text-sm text-gray-700">{risk.score}</td>
              <td className="px-3 py-2 text-sm">
                <RiskLevelBadge level={risk.level} />
              </td>
              <td className="px-3 py-2 text-sm text-gray-700">{risk.status}</td>
              <td className="px-3 py-2 text-sm text-gray-700">{risk.owner}</td>
              <td className="px-3 py-2 text-right text-sm">
                <Link
                  to={`/risks/${risk.id}`}
                  className="text-sm font-medium text-orange-600 hover:underline"
                >
                  Detaljer
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
