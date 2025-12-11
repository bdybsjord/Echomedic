export type PolicyCategory = "Tilgang" | "Logging" | "Hendelser" | string;

export type PolicyStatus = "Gyldig" | "Under revisjon";

export interface Policy {
  id: string;
  title: string;
  category: PolicyCategory;
  version: string;
  body: string;
  status: PolicyStatus;
  createdAt: Date;
  updatedAt: Date;
}
