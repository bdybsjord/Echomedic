import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { firebaseDb } from "../lib/firebase";
import type { Risk, RiskLevel, RiskStatus } from "../types/risk";
import type { AuthUser } from "../types/auth";
import { logAuditEvent } from "./auditLogService";

const RISKS_COLLECTION = "risks";

export interface RiskInput {
  title: string;
  description?: string;
  likelihood: number; // 1–5
  consequence: number; // 1–5
  measures?: string;
  owner: string;
  status: RiskStatus;
}

interface RiskDocData {
  title?: string;
  description?: string;
  likelihood?: number;
  consequence?: number;
  score?: number;
  level?: RiskLevel;
  status?: RiskStatus | string;
  owner?: string;
  measures?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const calculateScore = (likelihood: number, consequence: number): number =>
  likelihood * consequence;

const calculateLevel = (score: number): RiskLevel => {
  if (score >= 15) return "High";
  if (score >= 8) return "Medium";
  return "Low";
};

const mapDocToRisk = (
  docSnap: QueryDocumentSnapshot<DocumentData>,
): Risk => {
  const data = docSnap.data() as RiskDocData;

  const likelihood = Number(data.likelihood ?? 1);
  const consequence = Number(data.consequence ?? 1);

  const score =
    typeof data.score === "number"
      ? data.score
      : calculateScore(likelihood, consequence);

  let level: RiskLevel;
  if (data.level === "High" || data.level === "Medium" || data.level === "Low") {
    level = data.level;
  } else {
    level = calculateLevel(score);
  }

  const createdAtTs = data.createdAt;
  const updatedAtTs = data.updatedAt;

  const statusValue = (data.status ?? "Open") as RiskStatus;

  return {
    id: docSnap.id,
    title: data.title ?? "",
    description: data.description ?? undefined,
    likelihood,
    consequence,
    score,
    level,
    status: statusValue,
    owner: data.owner ?? "",
    measures: data.measures ?? undefined,
    createdAt: createdAtTs?.toDate() ?? new Date(),
    updatedAt: updatedAtTs?.toDate() ?? new Date(),
  };
};

// Hent alle risikoer (liste)
export const fetchRisks = async (): Promise<Risk[]> => {
  const q = query(
    collection(firebaseDb, RISKS_COLLECTION),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => mapDocToRisk(docSnap));
};

// Hent én risiko
export const fetchRiskById = async (id: string): Promise<Risk | null> => {
  const ref = doc(firebaseDb, RISKS_COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return mapDocToRisk(snap as QueryDocumentSnapshot<DocumentData>);
};

// Opprett ny risiko + AUDIT
export const createRisk = async (
  input: RiskInput,
  user: AuthUser,
): Promise<string> => {
  const score = calculateScore(input.likelihood, input.consequence);
  const level = calculateLevel(score);
  const now = new Date();

  const ref = await addDoc(collection(firebaseDb, RISKS_COLLECTION), {
    ...input,
    score,
    level,
    createdAt: now,
    updatedAt: now,
  });

  await logAuditEvent({
    action: "RISK_CREATED",
    riskId: ref.id,
    description: `Risiko opprettet: ${input.title}`,
    user,
    before: null,
    after: {
      ...input,
      score,
      level,
    },
  });

  return ref.id;
};

// Oppdater eksisterende risiko (partial update) + AUDIT
export const updateRisk = async (
  id: string,
  input: Partial<RiskInput>,
  user: AuthUser,
): Promise<void> => {
  const ref = doc(firebaseDb, RISKS_COLLECTION, id);
  const now = new Date();

  // Hent "før"-data til audit-logg
  const existingSnap = await getDoc(ref);
  const beforeData = existingSnap.exists()
    ? (existingSnap.data() as RiskDocData)
    : null;

  const updateData: Record<string, unknown> = {
    ...input,
    updatedAt: now,
  };

  if (
    typeof input.likelihood === "number" &&
    typeof input.consequence === "number"
  ) {
    const score = calculateScore(input.likelihood, input.consequence);
    updateData["score"] = score;
    updateData["level"] = calculateLevel(score);
  }

  await updateDoc(ref, updateData);

  await logAuditEvent({
    action: "RISK_UPDATED",
    riskId: id,
    description: `Risiko oppdatert (${id})`,
    user,
    before: beforeData,
    after: updateData,
  });
};

// Slett risiko + AUDIT
export const deleteRisk = async (
  id: string,
  user: AuthUser,
): Promise<void> => {
  const ref = doc(firebaseDb, RISKS_COLLECTION, id);

  const existingSnap = await getDoc(ref);
  const beforeData = existingSnap.exists()
    ? (existingSnap.data() as RiskDocData)
    : null;

  await deleteDoc(ref);

  await logAuditEvent({
    action: "RISK_DELETED",
    riskId: id,
    description: `Risiko slettet (${id})`,
    user,
    before: beforeData,
    after: null,
  });
};
