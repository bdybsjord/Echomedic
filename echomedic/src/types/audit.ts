export type AuditAction = "RISK_CREATED" | "RISK_UPDATED";

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  riskId: string;
  description: string;

  userId: string;
  userEmail: string | null;

  before?: unknown;
  after?: unknown;

  timestamp: Date;
}
