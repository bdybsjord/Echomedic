import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firebaseDb } from "../lib/firebase";
import type { AuthUser } from "../types/auth";

export type AuditAction =
  | "RISK_CREATED"
  | "RISK_UPDATED"
  | "RISK_DELETED"
  | "CONTROL_CREATED"
  | "CONTROL_UPDATED"
  | "CONTROL_DELETED"
  | "POLICY_CREATED"
  | "POLICY_UPDATED"
  | "POLICY_DELETED";

export interface AuditLogPayload {
  action: AuditAction;
  description: string;

  // hvem gjorde det
  user: AuthUser;

  // domene-kontekst (en av disse vil typisk være satt)
  riskId?: string;
  controlId?: string;
  policyId?: string;

  // diff
  before?: unknown;
  after?: unknown;
}

export const logAuditEvent = async (
  payload: AuditLogPayload,
): Promise<void> => {
  const { user, ...rest } = payload;

  await addDoc(collection(firebaseDb, "auditLogs"), {
    ...rest,
    userId: user.uid,
    userEmail: user.email ?? null,
    timestamp: serverTimestamp(),
  });
};
