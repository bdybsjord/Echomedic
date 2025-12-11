import type { Control } from "../types/control";
import ControlStatusBadge from "./ControlStatusBadge";

interface ControlsTableProps {
  controls: Control[];
}

export default function ControlsTable({ controls }: ControlsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full glass-panel rounded-3xl border border-slate-800">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              ISO ID
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Kontrollnavn
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Eier
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Beskrivelse
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {controls.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <p className="text-slate-500 text-sm">Ingen kontroller funnet</p>
              </td>
            </tr>
          ) : (
            controls.map((control) => (
              <tr
                key={control.id}
                className="hover:bg-slate-900/40 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-50">
                    {control.isoId}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-50">
                    {control.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ControlStatusBadge status={control.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">
                    {control.owner ?? "-"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-300">
                    {control.description}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
