// Type definition for risk levels - bruker union type for å sikre at kun gyldige verdier kan brukes
export type RiskLevel = "High" | "Medium" | "Low";

// Status på risikoer
export type RiskStatus = "Åpen" | "Under behandling" | "Lukket";

// Interface for Risk - definerer strukturen på risiko-objektene
// Bruker interface fordi vi kan utvide den senere hvis vi trenger det

// Utvidet litt - Benedikte
export interface Risk {
  id: string;
  name: string; // kort tittel
  description: string; // lengre tekst
  likelihood: 1 | 2 | 3 | 4 | 5; // sannsynlighet
  impact: 1 | 2 | 3 | 4 | 5; // konsekvens
  level: RiskLevel; // ferdigkalkulert i mock
  status: RiskStatus;
  owner: string;
  mitigation: string;
}

// Mock data - dette erstattes senere med API-kall
// Har lagt til 10 eksempler for å få en god oversikt i tabellen
export const mockRisks: Risk[] = [
  {
    id: "R-001",
    name: "Uautorisert tilgang til pasientjournal",
    description:
      "Svak rolle- og tilgangsstyring gjør at enkelte brukere får innsyn i journaler de ikke skal ha tilgang til.",
    likelihood: 4,
    impact: 5,
    level: "High",
    status: "Åpen",
    owner: "Sikkerhetsleder",
    mitigation:
      "Stramme inn rollemodell, nye tilgangsrevisjoner, aktivere MFA på tvers av systemer.",
  },
  {
    id: "R-002",
    name: "Manglende kryptering mellom systemer",
    description:
      "Eldre API-integrasjoner bruker HTTP i stedet for TLS-basert kommunikasjon.",
    likelihood: 3,
    impact: 4,
    level: "High",
    status: "Under behandling",
    owner: "Integrasjonsansvarlig",
    mitigation: "Migrere alle endepunkter til TLS 1.2+, oppdatere dokumentasjon.",
  },
  {
    id: "R-003",
    name: "Backup-gjenoppretting ikke testet",
    description:
      "Backup-jobber kjører, men restore-prosessen er ikke bekreftet på produksjonsnære data.",
    likelihood: 3,
    impact: 3,
    level: "Medium",
    status: "Åpen",
    owner: "Driftsansvarlig",
    mitigation:
      "Månedlige restore-tester og bedre feilmeldingshåndtering i backup-systemet.",
  },
  {
    id: "R-004",
    name: "Delte brukerkontoer i klinikk",
    description:
      "Ansatte i travle skift deler brukerkontoer, noe som reduserer sporbarhet og sikkerhet.",
    likelihood: 4,
    impact: 3,
    level: "Medium",
    status: "Under behandling",
    owner: "Klinikksjef",
    mitigation: "Fase ut generiske konti, innføre personlig innlogging og opplæring.",
  },
  {
    id: "R-005",
    name: "Ufullstendig sikkerhetslogging",
    description:
      "Autorisasjonsfeil og innloggingsforsøk logges ikke korrekt i alle tjenester.",
    likelihood: 2,
    impact: 4,
    level: "Low",
    status: "Lukket",
    owner: "Produktansvarlig",
    mitigation:
      "Implementert sentral loggtjeneste og forbedret hendelsessporingsformat.",
  },
  {
    id: "R-006",
    name: "Sårbar tredjepartsleverandør",
    description:
      "En ekstern modul benyttet av Echomedic har kjent sårbarhet som ikke er patchet.",
    likelihood: 3,
    impact: 5,
    level: "High",
    status: "Åpen",
    owner: "Leverandøransvarlig",
    mitigation:
      "Kreve sikkerhetspatch fra leverandør, midlertidig isolere integrasjonen.",
  },
  {
    id: "R-007",
    name: "Ransomware-angrep",
    description:
      "Økt aktivitet i sektoren viser risikobilde for angrep rettet mot helsesystemer.",
    likelihood: 2,
    impact: 5,
    level: "High",
    status: "Åpen",
    owner: "IT-sikkerhetsteam",
    mitigation:
      "Segmentering av nettverk, antivirus på endepunkter, forbedret backup-rutine.",
  },
  {
    id: "R-008",
    name: "Manglende patch-rutiner",
    description:
      "Servere og klienter har ustabile patchsykluser som gir høyere eksponeringstid.",
    likelihood: 4,
    impact: 2,
    level: "Medium",
    status: "Under behandling",
    owner: "Driftsansvarlig",
    mitigation:
      "Automatisert patching via CI/CD, varsling for mislukkede patchjobs.",
  },
  {
    id: "R-009",
    name: "Feil konfigurert brannmur",
    description:
      "Tester viser at flere porter er åpne uten gyldig forretningsbehov.",
    likelihood: 3,
    impact: 3,
    level: "Medium",
    status: "Åpen",
    owner: "Nettverksansvarlig",
    mitigation: "Brannmurrevisjon, fjerne åpne regler, innføre strengere ACL.",
  },
  {
    id: "R-010",
    name: "Svak passordpolicy",
    description:
      "Passordkravene tillater for enkle passord og mangler tvungen rotasjon.",
    likelihood: 5,
    impact: 2,
    level: "Medium",
    status: "Lukket",
    owner: "Sikkerhetsleder",
    mitigation:
      "Ny passordpolicy er rullet ut, MFA anbefales dog fortsatt som tillegg.",
  },
];