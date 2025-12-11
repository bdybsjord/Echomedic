import { Link } from "react-router-dom";
import type { Policy } from "../types/policy";
import PolicyStatusBadge from "./PolicyStatusBadge";

interface PoliciesTableProps {
  policies: Policy[];
}

export default function PoliciesTable({ policies }: PoliciesTableProps) {
  if (policies.length === 0) {
    return (
      <div className="glass-panel rounded-3xl border border-slate-800 px-6 py-10 text-center">
        <p className="text-sm text-slate-400">
          Ingen policyer registrert ennå.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full glass-panel rounded-3xl border border-slate-800">
        <thead>
          <tr className="bg-slate-950/60">
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Policy-navn
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Versjon
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Endret dato
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {policies.map((policy) => (
            <tr
              key={policy.id}
              className="hover:bg-slate-900/40 transition-colors"
            >
              <td className="px-6 py-4">
                <Link
                  to={`/policies/${policy.id}`}
                  className="text-sm font-medium text-slate-50 hover:underline"
                >
                  {policy.title}
                </Link>
                <div className="text-xs text-slate-400 mt-1">
                  {policy.category}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-200">{policy.version}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">
                  {policy.updatedAt.toLocaleDateString("nb-NO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PolicyStatusBadge status={policy.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
