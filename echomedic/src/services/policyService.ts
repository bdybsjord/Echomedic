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
import type { Policy, PolicyStatus } from "../types/policy";
import type { AuthUser } from "../types/auth";
import { logAuditEvent } from "./auditLogService";

const POLICIES_COLLECTION = "policies";

interface PolicyDocData {
  title?: string;
  category?: string;
  version?: string;
  body?: string;
  status?: PolicyStatus | string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Funker både for getDocs().docs og getDoc()
const mapDocToPolicy = (
  docSnap:
    | QueryDocumentSnapshot<DocumentData>
    | { id: string; data: () => DocumentData | undefined },
): Policy => {
  const rawData = docSnap.data();
  const data = (rawData ?? {}) as PolicyDocData;

  const status: PolicyStatus =
    data.status === "Under revisjon" ? "Under revisjon" : "Gyldig";

  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date();

  const updatedAt =
    data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate()
      : createdAt;

  return {
    id: docSnap.id,
    title: data.title ?? "",
    category: (data.category ?? "Tilgang") as Policy["category"],
    version: data.version ?? "1.0",
    body: data.body ?? "",
    status,
    createdAt,
    updatedAt,
  };
};

export const fetchPolicies = async (): Promise<Policy[]> => {
  const q = query(
    collection(firebaseDb, POLICIES_COLLECTION),
    orderBy("updatedAt", "desc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => mapDocToPolicy(docSnap));
};

export const fetchPolicyById = async (id: string): Promise<Policy | null> => {
  const ref = doc(firebaseDb, POLICIES_COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return mapDocToPolicy(
    snap as { id: string; data: () => DocumentData | undefined },
  );
};

// Input-type for ny policy
export interface PolicyInput {
  title: string;
  category: string;
  version: string;
  body: string;
  status: PolicyStatus;
}

// Opprett ny policy + audit-logg
export const createPolicy = async (
  input: PolicyInput,
  user?: AuthUser,
): Promise<string> => {
  const now = new Date();

  const ref = await addDoc(collection(firebaseDb, POLICIES_COLLECTION), {
    title: input.title,
    category: input.category,
    version: input.version,
    body: input.body,
    status: input.status,
    createdAt: now,
    updatedAt: now,
  });

  if (user) {
    await logAuditEvent({
      action: "POLICY_CREATED",
      description: `Ny policy opprettet: ${input.title} (v${input.version})`,
      policyId: ref.id,
      user,
      before: null,
      after: {
        ...input,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    });
  }

  return ref.id;
};

// Oppdater policy + audit-logg
export const updatePolicy = async (
  id: string,
  input: Partial<PolicyInput>,
  user?: AuthUser,
): Promise<void> => {
  const ref = doc(firebaseDb, POLICIES_COLLECTION, id);

  const beforeSnap = await getDoc(ref);
  const beforeData = beforeSnap.exists() ? beforeSnap.data() : null;

  const now = new Date();

  await updateDoc(ref, {
    ...input,
    updatedAt: now,
  });

  if (user) {
    await logAuditEvent({
      action: "POLICY_UPDATED",
      description: `Policy oppdatert: ${id}`,
      policyId: id,
      user,
      before: beforeData,
      after: {
        ...input,
        updatedAt: now.toISOString(),
      },
    });
  }
};

// Slett policy + audit-logg
export const deletePolicy = async (
  id: string,
  user?: AuthUser,
): Promise<void> => {
  const ref = doc(firebaseDb, POLICIES_COLLECTION, id);

  const beforeSnap = await getDoc(ref);
  const beforeData = beforeSnap.exists() ? beforeSnap.data() : null;

  await deleteDoc(ref);

  if (user) {
    await logAuditEvent({
      action: "POLICY_DELETED",
      description: `Policy slettet: ${id}`,
      policyId: id,
      user,
      before: beforeData,
      after: null,
    });
  }
};
