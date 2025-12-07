export type RiskStatus = "Open" | "InProgress" | "Closed";

export type RiskLevel = "Low" | "Medium" | "High";

export interface Risk {
  id: string;
  title: string;
  description?: string;
  likelihood: number;   // 1–5
  consequence: number;  // 1–5
  score: number;        // likelihood * consequence
  level: RiskLevel;
  status: RiskStatus;
  owner: string;
  measures?: string;
  createdAt: Date;
  updatedAt: Date;
}
