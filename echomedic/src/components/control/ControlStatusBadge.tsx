import type { ControlStatus } from "../../types/control";

interface ControlStatusBadgeProps {
  status: ControlStatus;
}

export default function ControlStatusBadge({ status }: ControlStatusBadgeProps) {
  const styles = {
    Implemented: "bg-emerald-950/60 text-emerald-400 border-emerald-800",
    Planned: "bg-amber-950/60 text-amber-400 border-amber-800",
    NotRelevant: "bg-slate-950/60 text-slate-400 border-slate-800",
  };

  const statusText = {
    Implemented: "Implementert",
    Planned: "Delvis",
    NotRelevant: "Ikke implementert",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${styles[status]}`}
      aria-label={`Status: ${statusText[status]}`}
    >
      {statusText[status]}
    </span>
  );
}

