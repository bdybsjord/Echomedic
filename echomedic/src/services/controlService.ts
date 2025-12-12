import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { firebaseDb } from "../lib/firebase";
import type { Control, ControlStatus } from "../types/control";
import type { AuthUser } from "../types/auth";
import { logAuditEvent } from "./auditLogService";

const CONTROLS_COLLECTION = "controls";

interface ControlDocData {
  isoId?: string;
  title?: string;
  description?: string;
  status?: ControlStatus | string;
  justification?: string;
  owner?: string;
}

const mapDocToControl = (
  docSnap: QueryDocumentSnapshot<DocumentData>,
): Control => {
  const data = docSnap.data() as ControlDocData;

  const status: ControlStatus =
    data.status === "Implemented" ||
    data.status === "Planned" ||
    data.status === "NotRelevant"
      ? data.status
      : "Planned";

  return {
    id: docSnap.id,
    isoId: data.isoId ?? "",
    title: data.title ?? "",
    description: data.description ?? "",
    status,
    justification: data.justification,
    owner: data.owner,
  };
};

export const fetchControls = async (): Promise<Control[]> => {
  const snapshot = await getDocs(collection(firebaseDb, CONTROLS_COLLECTION));
  return snapshot.docs.map((doc) => mapDocToControl(doc));
};

// Input-type for opprettelse
export interface ControlInput {
  isoId: string;
  title: string;
  description: string;
  status: ControlStatus;
  justification?: string;
  owner?: string;
}

// Opprett ny kontroll + audit-logg
export const createControl = async (
  input: ControlInput,
  user?: AuthUser,
): Promise<string> => {
  const ref = await addDoc(collection(firebaseDb, CONTROLS_COLLECTION), {
    isoId: input.isoId,
    title: input.title,
    description: input.description,
    status: input.status,
    justification: input.justification ?? null,
    owner: input.owner ?? null,
  });

  if (user) {
    await logAuditEvent({
      action: "CONTROL_CREATED",
      description: `Ny kontroll opprettet: ${input.isoId} - ${input.title}`,
      controlId: ref.id,
      user,
      before: null,
      after: input,
    });
  }

  return ref.id;
};

// Oppdater kontroll + audit-logg
export const updateControl = async (
  id: string,
  input: Partial<ControlInput>,
  user?: AuthUser,
): Promise<void> => {
  const ref = doc(firebaseDb, CONTROLS_COLLECTION, id);

  const beforeSnap = await getDoc(ref);
  const beforeData = beforeSnap.exists() ? beforeSnap.data() : null;

  await updateDoc(ref, {
    ...input,
  });

  if (user) {
    await logAuditEvent({
      action: "CONTROL_UPDATED",
      description: `Kontroll oppdatert: ${id}`,
      controlId: id,
      user,
      before: beforeData,
      after: input,
    });
  }
};

// Slett kontroll + audit-logg
export const deleteControl = async (
  id: string,
  user?: AuthUser,
): Promise<void> => {
  const ref = doc(firebaseDb, CONTROLS_COLLECTION, id);

  const beforeSnap = await getDoc(ref);
  const beforeData = beforeSnap.exists() ? beforeSnap.data() : null;

  await deleteDoc(ref);

  if (user) {
    await logAuditEvent({
      action: "CONTROL_DELETED",
      description: `Kontroll slettet: ${id}`,
      controlId: id,
      user,
      before: beforeData,
      after: null,
    });
  }
};
