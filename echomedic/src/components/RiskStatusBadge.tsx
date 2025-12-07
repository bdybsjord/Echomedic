import type { RiskStatus } from "../types/risk";

interface RiskStatusBadgeProps {
  status: RiskStatus;
}

export default function RiskStatusBadge({ status }: RiskStatusBadgeProps) {
  const styles: Record<RiskStatus, string> = {
    Open: "bg-rose-950/60 text-rose-300 border-rose-700",
    InProgress: "bg-amber-950/60 text-amber-300 border-amber-700",
    Closed: "bg-emerald-950/60 text-emerald-300 border-emerald-700",
  };

  const labels: Record<RiskStatus, string> = {
    Open: "Åpen",
    InProgress: "Under behandling",
    Closed: "Lukket",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
