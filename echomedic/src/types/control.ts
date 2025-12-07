export type ControlStatus = "Implemented" | "Planned" | "NotRelevant";

export interface Control {
  id: string; // Firestore-id
  isoId: string; // f.eks. "A.9.2.3"
  title: string;
  description: string;
  status: ControlStatus;
  justification?: string;
}
