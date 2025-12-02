// Type definition for risk levels - bruker union type for å sikre at kun gyldige verdier kan brukes
export type RiskLevel = "Low" | "Medium" | "High";

// Interface for Risk - definerer strukturen på risiko-objektene
// Bruker interface fordi vi kan utvide den senere hvis vi trenger det
export interface Risk {
  id: string;
  name: string;
  level: RiskLevel;
  mitigation: string;
}

// Mock data - dette erstattes senere med API-kall
// Har lagt til 10 eksempler for å få en god oversikt i tabellen
export const mockRisks: Risk[] = [
  {
    id: "1",
    name: "Uautorisert tilgang til pasientdata",
    level: "High",
    mitigation: "Implementere to-faktor autentisering og rollbasert tilgangskontroll",
  },
  {
    id: "2",
    name: "Manglende backup av kritiske systemer",
    level: "High",
    mitigation: "Etablere daglige automatiske backups med kryptering",
  },
  {
    id: "3",
    name: "Phishing-angrep mot ansatte",
    level: "Medium",
    mitigation: "Regelmessig opplæring og simulering av phishing-angrep",
  },
  {
    id: "4",
    name: "Sårbarheter i tredjepartssystemer",
    level: "Medium",
    mitigation: "Kontinuerlig overvåking og oppdatering av avhengigheter",
  },
  {
    id: "5",
    name: "Manglende dokumentasjon av sikkerhetsprosedyrer",
    level: "Low",
    mitigation: "Oppdatere og vedlikeholde sikkerhetsdokumentasjon kvartalsvis",
  },
  {
    id: "6",
    name: "Fysisk sikkerhet i datasenter",
    level: "Medium",
    mitigation: "Regelmessige sikkerhetsrevisjoner og tilgangskontroll",
  },
  {
    id: "7",
    name: "Ransomware-angrep",
    level: "High",
    mitigation: "Isolerte backups, end-point protection og ansatt-opplæring",
  },
  {
    id: "8",
    name: "Datainnbrudd gjennom utdatert programvare",
    level: "Medium",
    mitigation: "Automatiserte sikkerhetsoppdateringer og patch-management",
  },
  {
    id: "9",
    name: "Manglende logging og overvåking",
    level: "Low",
    mitigation: "Implementere sentralisert logging og SIEM-system",
  },
  {
    id: "10",
    name: "Svak passordpolicy",
    level: "Low",
    mitigation: "Kreve komplekse passord og passordhåndteringsverktøy",
  },
];

