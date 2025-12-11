import {
  collection,
  getDocs,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { firebaseDb } from "../lib/firebase";
import type { Control, ControlStatus } from "../types/control";

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

  const status =
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
