# Echomedic Dashboard

Dette er en React-applikasjon utviklet som del av bachelorprosjektet i PRO203 – Smidig prosjekt (Høsten 2025).  
Løsningen er et lettvekts dashboard for informasjonssikkerhet og risikostyring for helseselskapet Echomedic.

---

##  Stack

- [React 18](https://react.dev)
- [Vite](https://vitejs.dev)
- [TypeScript (strict mode)](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com)
- [pnpm](https://pnpm.io)

---

## Komme i gang (lokalt)

### Forutsetninger

- Node LTS
- pnpm installert globalt (`npm install -g pnpm`)
- Firebase-prosjekt med Firestore og Authentication (e-post/passord) aktivert
- `.env.local` basert på `.env.example`

### Installere og starte

```bash
pnpm install
pnpm dev


Applikasjonen er da tilgjengelig på http://localhost:5173.
Innlogging krever en testbruker som er satt opp i Firebase Authentication.

### Eksempel-dokumenter til controls

Bruk disse som dokumenter i collection `controls`:

```json
{
  "isoId": "A.9.2.3",
  "title": "Management of privileged access rights",
  "description": "Privilegerte tilganger skal gis, overvåkes og revideres regelmessig for å sikre at kun autoriserte personer har tilgang til sensitive systemer.",
  "status": "Implemented",
  "justification": "RBAC er satt opp i løsningen. Tilgangsrettigheter revideres kvartalsvis."
}

{
  "isoId": "A.12.3.1",
  "title": "Information backup",
  "description": "Organisasjonen skal etablere rutiner for regelmessig sikkerhetskopiering og gjenoppretting av informasjon og systemer.",
  "status": "Planned",
  "justification": "Backup-rutiner implementeres som del av neste sprint. Scope inkluderer database og konfigurasjonsdata."
}

{
  "isoId": "A.11.1.6",
  "title": "Delivery and loading areas",
  "description": "Fysiske lasteramper og leveringsområder skal sikres mot uautorisert tilgang.",
  "status": "NotRelevant",
  "justification": "Echomedic har ikke fysisk lager eller logistikkvirksomhet. Kun digital drift."
}

### Eksempel-dokumenter til policies

{
  "title": "Tilgangskontroll-policy",
  "category": "Tilgang",
  "version": "1.0",
  "body": "Denne policyen etablerer regler for hvordan brukere gis tilgang til systemer og data. Alle brukere skal autentiseres via godkjent metode (e-post og passord samt MFA når dette innføres). Tilganger gis etter prinsippet om minste privilegium og revideres minimum hver 90. dag.",
  "createdAt": { "_seconds": 1736445000, "_nanoseconds": 0 }
}

{
  "title": "Logging- og overvåkningspolicy",
  "category": "Logging",
  "version": "1.0",
  "body": "Systemet skal logge alle sikkerhetsrelevante hendelser, inkludert pålogginger, tilganger til sensitive data, endringer på risikoobjekter og administrative handlinger. Loggene skal gjennomgås periodisk og lagres på en måte som hindrer uautorisert endring.",
  "createdAt": { "_seconds": 1736445100, "_nanoseconds": 0 }
}

{
  "title": "Hendelseshåndteringspolicy",
  "category": "Hendelser",
  "version": "1.0",
  "body": "Alle sikkerhetshendelser skal rapporteres umiddelbart til sikkerhetsansvarlig. Hendelser skal klassifiseres etter alvorlighetsgrad og behandles i henhold til etablerte prosesser. Etter en hendelse skal det gjennomføres en rotårsaksanalyse og tiltak skal dokumenteres.",
  "createdAt": { "_seconds": 1736445200, "_nanoseconds": 0 }
}
