export type RiskLevel = "Low" | "Medium" | "High";
export type RiskStatus = "Open" | "InProgress" | "Closed";

export type RiskCategory = "Teknisk" | "Prosess" | "Personell" | "Juridisk";
export type RiskTreatment = "Redusere" | "Unngå" | "Overføre" | "Akseptere";

export type TreatmentStatus = "Planlagt" | "Pågår" | "Implementert";

export interface Risk {
  id: string; // Firestore doc id

  // Rapportnære felter
  reportId?: string; // f.eks. "R001"
  category?: RiskCategory;
  affectedAssets?: string[]; // f.eks. ["A-01", "A-02"]
  treatment?: RiskTreatment;
  treatmentStatus?: TreatmentStatus;
  estimatedHours?: number;

  // Koblinger (valgfritt)
  controlIds?: string[];
  policyIds?: string[];

  // Core
  title: string;
  description?: string;
  measures?: string;
  owner: string;

  likelihood: number; // 1-5
  consequence: number; // 1-5
  score: number; // likelihood * consequence
  level: RiskLevel;
  status: RiskStatus;

  // Rest-risiko (valgfritt)
  residualLikelihood?: number; // 1-5
  residualConsequence?: number; // 1-5
  residualScore?: number; // 1-25
  residualLevel?: RiskLevel;

  createdAt: Date;
  updatedAt: Date;
}
