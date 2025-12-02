import type { Risk } from "../data/mockRisks";
import RiskLevelBadge from "./RiskLevelBadge";

// Props interface - tar imot array av risks
// Dette gjør komponenten gjenbrukbar og klar for API senere
interface RiskTableProps {
  risks: Risk[];
}

export default function RiskTable({ risks }: RiskTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full glass-panel rounded-3xl border border-slate-800">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Risiko
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Nivå
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Tiltak
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {risks.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center">
                <p className="text-slate-500 text-sm">Ingen risikoer funnet</p>
              </td>
            </tr>
          ) : (
            risks.map((risk) => (
              <tr
                key={risk.id}
                className="hover:bg-slate-900/40 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-50">
                    {risk.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RiskLevelBadge level={risk.level} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-300">{risk.mitigation}</div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

