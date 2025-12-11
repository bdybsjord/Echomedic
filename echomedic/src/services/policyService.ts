import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { firebaseDb } from "../lib/firebase";
import type { Policy, PolicyStatus } from "../types/policy";

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

  return mapDocToPolicy(snap as { id: string; data: () => DocumentData | undefined });
};
