export type PolicyCategory = "Tilgang" | "Logging" | "Hendelser" | string;

export interface Policy {
  id: string;
  title: string;
  category: PolicyCategory;
  version: string;
  body: string;
  createdAt: Date;
}
