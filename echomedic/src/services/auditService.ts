import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firebaseDb } from "../lib/firebase";

export type AuditAction =
  | "RISK_CREATED"
  | "RISK_UPDATED"
  | "CONTROL_CREATED"
  | "POLICY_CREATED";

export interface AuditLogInput {
  action: AuditAction;
  description: string;
  riskId?: string;
  controlId?: string;
  policyId?: string;
  userId: string;
  userEmail: string | null;
  before?: unknown;
  after?: unknown;
}

export const logAuditEvent = async (input: AuditLogInput): Promise<void> => {
  await addDoc(collection(firebaseDb, "auditLogs"), {
    action: input.action,
    description: input.description,
    riskId: input.riskId ?? null,
    controlId: input.controlId ?? null,
    policyId: input.policyId ?? null,
    userId: input.userId,
    userEmail: input.userEmail ?? null,
    before: input.before ?? null,
    after: input.after ?? null,
    timestamp: serverTimestamp(),
  });
};
