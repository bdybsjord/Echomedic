import type { RiskLevel } from "../data/mockRisks";

// Komponent for å vise risikonivå med farger
// Bruker objekt med level som key for å mappe til riktig styling
interface RiskLevelBadgeProps {
  level: RiskLevel;
}

export default function RiskLevelBadge({ level }: RiskLevelBadgeProps) {
  const styles = {
    High: "bg-rose-950/60 text-rose-400 border-rose-800",
    Medium: "bg-amber-950/60 text-amber-400 border-amber-800",
    Low: "bg-emerald-950/60 text-emerald-400 border-emerald-800",
  };

  const levelText = {
    High: "Høy",
    Medium: "Middels",
    Low: "Lav",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${styles[level]}`}
      aria-label={`Risikonivå: ${levelText[level]}`}
    >
      {levelText[level]}
    </span>
  );
}

