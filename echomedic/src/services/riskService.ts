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
import type {
  Risk,
  RiskCategory,
  RiskLevel,
  RiskStatus,
  RiskTreatment,
  TreatmentStatus,
} from "../types/risk";
import type { AuthUser } from "../types/auth";
import { logAuditEvent } from "./auditLogService";

const RISKS_COLLECTION = "risks";

export interface RiskInput {
  // rapportnært
  reportId?: string;
  category?: RiskCategory;
  affectedAssets?: string[];
  treatment?: RiskTreatment;
  treatmentStatus?: TreatmentStatus;
  estimatedHours?: number;

  // koblinger
  controlIds?: string[];
  policyIds?: string[];

  // core
  title: string;
  description?: string;
  likelihood: number; // 1–5
  consequence: number; // 1–5
  measures?: string;
  owner: string;
  status: RiskStatus;

  // residual
  residualLikelihood?: number; // 1-5
  residualConsequence?: number; // 1-5
}

interface RiskDocData {
  reportId?: string;
  category?: RiskCategory | string;
  affectedAssets?: unknown;

  treatment?: RiskTreatment | string;
  treatmentStatus?: TreatmentStatus | string;
  estimatedHours?: number;

  controlIds?: unknown;
  policyIds?: unknown;

  title?: string;
  description?: string;
  likelihood?: number;
  consequence?: number;
  measures?: string;
  owner?: string;
  status?: RiskStatus | string;

  score?: number;
  level?: RiskLevel;

  residualLikelihood?: number;
  residualConsequence?: number;
  residualScore?: number;
  residualLevel?: RiskLevel;

  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

const calculateScore = (likelihood: number, consequence: number): number =>
  likelihood * consequence;

const calculateLevel = (score: number): RiskLevel => {
  if (score >= 15) return "High";
  if (score >= 8) return "Medium";
  return "Low";
};

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");

const normalizeCategory = (value: unknown): RiskCategory | undefined => {
  if (
    value === "Teknisk" ||
    value === "Prosess" ||
    value === "Personell" ||
    value === "Juridisk"
  ) {
    return value;
  }
  return undefined;
};

const normalizeTreatment = (value: unknown): RiskTreatment | undefined => {
  if (
    value === "Unngå" ||
    value === "Redusere" ||
    value === "Overføre" ||
    value === "Akseptere"
  ) {
    return value;
  }
  return undefined;
};

const normalizeTreatmentStatus = (
  value: unknown,
): TreatmentStatus | undefined => {
  if (value === "Planlagt" || value === "Pågår" || value === "Implementert") {
    return value;
  }
  return undefined;
};

const toDateSafe = (value: unknown): Date => {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date();
};

const toTimestampSafe = (value: unknown): Timestamp => {
  if (value instanceof Timestamp) return value;
  if (value instanceof Date) return Timestamp.fromDate(value);
  return Timestamp.fromDate(new Date());
};

// ✅ hjelper: legg kun inn felt hvis de er "meningsfulle"
const addIfString = (obj: Record<string, unknown>, key: string, v?: string) => {
  const s = v?.trim();
  if (s) obj[key] = s;
};

const addIfNumber = (obj: Record<string, unknown>, key: string, v?: number) => {
  if (typeof v === "number" && Number.isFinite(v)) obj[key] = v;
};

const addIfStringArray = (
  obj: Record<string, unknown>,
  key: string,
  v?: string[],
) => {
  if (Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string")) {
    obj[key] = v;
  }
};

const mapDocToRisk = (docSnap: QueryDocumentSnapshot<DocumentData>): Risk => {
  const data = docSnap.data() as RiskDocData;

  const likelihood = Number(data.likelihood ?? 1);
  const consequence = Number(data.consequence ?? 1);

  const score =
    typeof data.score === "number"
      ? data.score
      : calculateScore(likelihood, consequence);

  const level: RiskLevel =
    data.level === "High" || data.level === "Medium" || data.level === "Low"
      ? data.level
      : calculateLevel(score);

  const statusValue = (data.status ?? "Open") as RiskStatus;

  const residualLikelihood =
    typeof data.residualLikelihood === "number"
      ? data.residualLikelihood
      : undefined;
  const residualConsequence =
    typeof data.residualConsequence === "number"
      ? data.residualConsequence
      : undefined;

  const residualScore =
    typeof data.residualScore === "number"
      ? data.residualScore
      : residualLikelihood != null && residualConsequence != null
        ? calculateScore(residualLikelihood, residualConsequence)
        : undefined;

  const residualLevel: RiskLevel | undefined =
    data.residualLevel === "High" ||
    data.residualLevel === "Medium" ||
    data.residualLevel === "Low"
      ? data.residualLevel
      : residualScore != null
        ? calculateLevel(residualScore)
        : undefined;

  const affectedAssets = isStringArray(data.affectedAssets)
    ? data.affectedAssets
    : undefined;
  const controlIds = isStringArray(data.controlIds) ? data.controlIds : undefined;
  const policyIds = isStringArray(data.policyIds) ? data.policyIds : undefined;

  return {
    id: docSnap.id,

    reportId:
      typeof data.reportId === "string" && data.reportId.trim()
        ? data.reportId
        : undefined,
    category: normalizeCategory(data.category),
    affectedAssets,
    treatment: normalizeTreatment(data.treatment),
    treatmentStatus: normalizeTreatmentStatus(data.treatmentStatus),
    estimatedHours:
      typeof data.estimatedHours === "number" ? data.estimatedHours : undefined,

    controlIds,
    policyIds,

    title: data.title ?? "",
    description: data.description ?? undefined,
    measures: data.measures ?? undefined,
    owner: data.owner ?? "",
    likelihood,
    consequence,
    score,
    level,
    status: statusValue,

    residualLikelihood,
    residualConsequence,
    residualScore,
    residualLevel,

    createdAt: toDateSafe(data.createdAt),
    updatedAt: toDateSafe(data.updatedAt),
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

//  Opprett ny risiko + AUDIT (uten null-verdier)
export const createRisk = async (
  input: RiskInput,
  user: AuthUser,
): Promise<string> => {
  const likelihood = Number(input.likelihood);
  const consequence = Number(input.consequence);

  const score = calculateScore(likelihood, consequence);
  const level = calculateLevel(score);

  const residualScore =
    input.residualLikelihood != null && input.residualConsequence != null
      ? calculateScore(Number(input.residualLikelihood), Number(input.residualConsequence))
      : undefined;

  const residualLevel = residualScore != null ? calculateLevel(residualScore) : undefined;

  const now = Timestamp.now();

  const payload: Record<string, unknown> = {
    // core (må matche reglene)
    title: input.title.trim(),
    owner: input.owner.trim(),
    status: input.status,
    likelihood,
    consequence,
    score,
    level,

    // timestamps (reglene: timestamp)
    createdAt: now,
    updatedAt: now,
  };

  // optionals – bare hvis de finnes (aldri null)
  addIfString(payload, "description", input.description);
  addIfString(payload, "measures", input.measures);

  addIfString(payload, "reportId", input.reportId);
  if (input.category) payload.category = input.category;
  if (input.treatment) payload.treatment = input.treatment;
  if (input.treatmentStatus) payload.treatmentStatus = input.treatmentStatus;
  addIfNumber(payload, "estimatedHours", input.estimatedHours);

  addIfStringArray(payload, "affectedAssets", input.affectedAssets);
  addIfStringArray(payload, "controlIds", input.controlIds);
  addIfStringArray(payload, "policyIds", input.policyIds);

  addIfNumber(payload, "residualLikelihood", input.residualLikelihood);
  addIfNumber(payload, "residualConsequence", input.residualConsequence);
  if (typeof residualScore === "number") payload.residualScore = residualScore;
  if (residualLevel) payload.residualLevel = residualLevel;

  const ref = await addDoc(collection(firebaseDb, RISKS_COLLECTION), payload);

  await logAuditEvent({
    action: "RISK_CREATED",
    riskId: ref.id,
    description: `Risiko opprettet: ${input.title}`,
    user,
    before: null,
    after: payload,
  });

  return ref.id;
};

export const updateRisk = async (
  id: string,
  input: Partial<RiskInput>,
  user: AuthUser,
): Promise<void> => {
  const ref = doc(firebaseDb, RISKS_COLLECTION, id);

  const existingSnap = await getDoc(ref);
  if (!existingSnap.exists()) throw new Error("Risk not found");

  const beforeData = existingSnap.data() as RiskDocData;

  const likelihood = Number(input.likelihood ?? beforeData.likelihood ?? 1);
  const consequence = Number(input.consequence ?? beforeData.consequence ?? 1);

  const score = calculateScore(likelihood, consequence);
  const level = calculateLevel(score);

  const residualLikelihood = Number(
    input.residualLikelihood ?? beforeData.residualLikelihood,
  );
  const residualConsequence = Number(
    input.residualConsequence ?? beforeData.residualConsequence,
  );

  const hasResidual =
    Number.isFinite(residualLikelihood) &&
    residualLikelihood >= 1 &&
    residualLikelihood <= 5 &&
    Number.isFinite(residualConsequence) &&
    residualConsequence >= 1 &&
    residualConsequence <= 5;

  const residualScore = hasResidual
    ? calculateScore(residualLikelihood, residualConsequence)
    : undefined;

  const residualLevel = residualScore != null ? calculateLevel(residualScore) : undefined;

  const now = Timestamp.now();

  const fullUpdate: Record<string, unknown> = {
    // core (må finnes / være riktig type)
    title: String(input.title ?? beforeData.title ?? "").trim(),
    owner: String(input.owner ?? beforeData.owner ?? "").trim(),
    status: (input.status ?? (beforeData.status as RiskStatus) ?? "Open") as RiskStatus,
    likelihood,
    consequence,
    score,
    level,

    // timestamps (behold createdAt, oppdater updatedAt)
    createdAt: toTimestampSafe(beforeData.createdAt),
    updatedAt: now,
  };

  // optionals – bare hvis de finnes (ingen null)
  addIfString(fullUpdate, "description", (input.description ?? beforeData.description) as string | undefined);
  addIfString(fullUpdate, "measures", (input.measures ?? beforeData.measures) as string | undefined);

  addIfString(fullUpdate, "reportId", (input.reportId ?? beforeData.reportId) as string | undefined);

  const cat = input.category ?? (beforeData.category as RiskCategory | undefined);
  if (cat) fullUpdate.category = cat;

  const tr = input.treatment ?? (beforeData.treatment as RiskTreatment | undefined);
  if (tr) fullUpdate.treatment = tr;

  const ts = input.treatmentStatus ?? (beforeData.treatmentStatus as TreatmentStatus | undefined);
  if (ts) fullUpdate.treatmentStatus = ts;

  const est = input.estimatedHours ?? beforeData.estimatedHours;
  addIfNumber(fullUpdate, "estimatedHours", typeof est === "number" ? est : undefined);

  // arrays
  const aa = input.affectedAssets ?? (isStringArray(beforeData.affectedAssets) ? beforeData.affectedAssets : undefined);
  addIfStringArray(fullUpdate, "affectedAssets", aa);

  const cids = input.controlIds ?? (isStringArray(beforeData.controlIds) ? beforeData.controlIds : undefined);
  addIfStringArray(fullUpdate, "controlIds", cids);

  const pids = input.policyIds ?? (isStringArray(beforeData.policyIds) ? beforeData.policyIds : undefined);
  addIfStringArray(fullUpdate, "policyIds", pids);

  // residual
  if (hasResidual) {
    fullUpdate.residualLikelihood = residualLikelihood;
    fullUpdate.residualConsequence = residualConsequence;
    fullUpdate.residualScore = residualScore!;
    fullUpdate.residualLevel = residualLevel!;
  } else {
    // 
  }

  await updateDoc(ref, fullUpdate);

  await logAuditEvent({
    action: "RISK_UPDATED",
    riskId: id,
    description: `Risiko oppdatert (${id})`,
    user,
    before: beforeData,
    after: fullUpdate,
  });
};

// Slett risiko + AUDIT
export const deleteRisk = async (id: string, user: AuthUser): Promise<void> => {
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
