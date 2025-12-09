import type { Policy } from "../types/policy";

// Utvidet interface for mock-data med status
// Status er ikke i domain-modell ennå, men trengs for UI
export type PolicyStatus = "Gyldig" | "Under revisjon";

export interface MockPolicy extends Policy {
  status: PolicyStatus;
  updatedAt: Date;
}

// Mock data for sikkerhetspolicyer
// Dette erstattes senere med API-kall
export const mockPolicies: MockPolicy[] = [
  {
    id: "POL-001",
    title: "Policy for tilgangskontroll",
    category: "Tilgang",
    version: "2.1",
    body: "Dette dokumentet beskriver prosedyrer for tilgangskontroll til informasjonssystemer.",
    status: "Gyldig",
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-11-20"),
  },
  {
    id: "POL-002",
    title: "Policy for logging og overvåking",
    category: "Logging",
    version: "1.5",
    body: "Retningslinjer for logging av sikkerhetshendelser og overvåking av systemer.",
    status: "Gyldig",
    createdAt: new Date("2024-09-10"),
    updatedAt: new Date("2024-11-15"),
  },
  {
    id: "POL-003",
    title: "Policy for håndtering av sikkerhetshendelser",
    category: "Hendelser",
    version: "3.0",
    body: "Prosedyre for håndtering, rapportering og oppfølging av sikkerhetshendelser.",
    status: "Under revisjon",
    createdAt: new Date("2024-08-05"),
    updatedAt: new Date("2024-12-01"),
  },
  {
    id: "POL-004",
    title: "Policy for passordhåndtering",
    category: "Tilgang",
    version: "1.2",
    body: "Retningslinjer for opprettelse, oppbevaring og endring av passord.",
    status: "Gyldig",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-25"),
  },
  {
    id: "POL-005",
    title: "Policy for datasikkerhet",
    category: "Tilgang",
    version: "2.3",
    body: "Retningslinjer for kryptering, backup og gjenoppretting av data.",
    status: "Gyldig",
    createdAt: new Date("2024-07-20"),
    updatedAt: new Date("2024-11-10"),
  },
  {
    id: "POL-006",
    title: "Policy for utvikling av sikre systemer",
    category: "Tilgang",
    version: "1.0",
    body: "Retningslinjer for sikker utvikling og testing av informasjonssystemer.",
    status: "Under revisjon",
    createdAt: new Date("2024-06-15"),
    updatedAt: new Date("2024-11-28"),
  },
  {
    id: "POL-007",
    title: "Policy for ansatt-opplæring",
    category: "Hendelser",
    version: "1.8",
    body: "Retningslinjer for sikkerhetskurs og opplæring av ansatte.",
    status: "Gyldig",
    createdAt: new Date("2024-05-10"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "POL-008",
    title: "Policy for leverandørhåndtering",
    category: "Tilgang",
    version: "1.5",
    body: "Retningslinjer for evaluering og håndtering av eksterne leverandører.",
    status: "Gyldig",
    createdAt: new Date("2024-04-25"),
    updatedAt: new Date("2024-11-05"),
  },
  {
    id: "POL-009",
    title: "Policy for krisehåndtering",
    category: "Hendelser",
    version: "2.2",
    body: "Prosedyre for håndtering av kriser og katastrofer som påvirker IT-systemer.",
    status: "Gyldig",
    createdAt: new Date("2024-03-18"),
    updatedAt: new Date("2024-11-12"),
  },
  {
    id: "POL-010",
    title: "Policy for informasjonsklassifisering",
    category: "Tilgang",
    version: "1.3",
    body: "Retningslinjer for klassifisering og merking av informasjon etter sensitivitet.",
    status: "Under revisjon",
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-11-30"),
  },
];

