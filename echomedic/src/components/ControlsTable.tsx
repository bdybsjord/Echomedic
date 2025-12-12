import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { Control } from "../types/control";
import ControlStatusBadge from "./ControlStatusBadge";
import { deleteControl } from "../services/controlService";

interface ControlsTableProps {
  controls: Control[];
}

export default function ControlsTable({ controls }: ControlsTableProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rows, setRows] = useState<Control[]>(controls);

  useEffect(() => {
    setRows(controls);
  }, [controls]);

  const isReader = user?.role === "leser";
  const canManage = !!user && !isReader;

  const handleDelete = async (control: Control) => {
    if (!canManage || !user) return;

    const confirmed = window.confirm(
      `Er du sikker på at du vil slette kontrollen "${control.title}"?`,
    );
    if (!confirmed) return;

    try {
      await deleteControl(control.id, user);
      setRows((prev) => prev.filter((c) => c.id !== control.id));
    } catch (err) {
      console.error(err);
      alert("Kunne ikke slette kontroll. Prøv igjen.");
    }
  };

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
            {canManage && (
              <th
                scope="col"
                className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Handlinger
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={canManage ? 6 : 5}
                className="px-6 py-12 text-center"
              >
                <p className="text-slate-500 text-sm">Ingen kontroller funnet</p>
              </td>
            </tr>
          ) : (
            rows.map((control) => (
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
                {canManage && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/controls/${control.id}/edit`)}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-900"
                      >
                        Rediger
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(control)}
                        className="rounded-full border border-rose-500/70 bg-rose-500/10 px-3 py-1 text-xs text-rose-200 hover:bg-rose-500/20"
                      >
                        Slett
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
