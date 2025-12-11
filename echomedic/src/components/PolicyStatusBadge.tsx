import type { PolicyStatus } from "../types/policy";

interface PolicyStatusBadgeProps {
  status: PolicyStatus;
}

export default function PolicyStatusBadge({ status }: PolicyStatusBadgeProps) {
  const styles: Record<PolicyStatus, string> = {
    Gyldig: "bg-emerald-950/60 text-emerald-400 border-emerald-800",
    "Under revisjon": "bg-amber-950/60 text-amber-400 border-amber-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${styles[status]}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}
