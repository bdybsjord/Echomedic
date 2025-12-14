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

export const createControl = async (
  input: ControlInput,
  user?: AuthUser,
): Promise<string> => {
  const payload: Record<string, unknown> = {
    isoId: input.isoId.trim(),
    title: input.title.trim(),
    description: input.description.trim(),
    status: input.status,
    ...(input.justification?.trim()
      ? { justification: input.justification.trim() }
      : {}),
    ...(input.owner?.trim() ? { owner: input.owner.trim() } : {}),
  };

  const ref = await addDoc(collection(firebaseDb, CONTROLS_COLLECTION), payload);

  if (user) {
    await logAuditEvent({
      action: "CONTROL_CREATED",
      description: `Ny kontroll opprettet: ${input.isoId} - ${input.title}`,
      controlId: ref.id,
      user,
      before: null,
      after: payload,
    });
  }

  return ref.id;
};


export const updateControl = async (
  id: string,
  input: Partial<ControlInput>,
  user?: AuthUser,
): Promise<void> => {
  const ref = doc(firebaseDb, CONTROLS_COLLECTION, id);

  const beforeSnap = await getDoc(ref);
  const beforeData = beforeSnap.exists() ? beforeSnap.data() : null;

  const patch: Record<string, unknown> = {};

  if (typeof input.isoId === "string" && input.isoId.trim()) patch.isoId = input.isoId.trim();
  if (typeof input.title === "string" && input.title.trim()) patch.title = input.title.trim();
  if (typeof input.description === "string" && input.description.trim())
    patch.description = input.description.trim();
  if (input.status) patch.status = input.status;
  if (typeof input.justification === "string" && input.justification.trim())
    patch.justification = input.justification.trim();
  if (typeof input.owner === "string" && input.owner.trim()) patch.owner = input.owner.trim();

  await updateDoc(ref, patch);

  if (user) {
    await logAuditEvent({
      action: "CONTROL_UPDATED",
      description: `Kontroll oppdatert: ${id}`,
      controlId: id,
      user,
      before: beforeData,
      after: patch,
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
