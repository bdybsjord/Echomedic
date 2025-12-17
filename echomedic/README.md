# Echomedic Dashboard

Dette er frontend-applikasjonen for **Echomedic Dashboard**, utviklet som del av prosjekteksamen i
**PRO203 – Smidig prosjekt (Høyskolen Kristiania, Høst 2025)**.

Applikasjonen er et webbasert dashboard for **informasjonssikkerhet og risikostyring** i helseselskapet Echomedic. Løsningen støtter arbeid med **risikovurderinger**, **ISO/IEC 27001/27002-kontroller (Statement of Applicability – SoA)** og **policyer**, og er utviklet med fokus på oversikt, sporbarhet og rollebasert tilgang.

Denne mappen inneholder selve React-applikasjonen som utgjør produktinkrementet i prosjektet.

---

## Stack

* [React 18](https://react.dev)
* [Vite](https://vitejs.dev)
* [TypeScript (strict mode)](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com)
* [pnpm](https://pnpm.io)
* Firebase (Authentication + Firestore)

---

## Funksjonell oversikt

Applikasjonen inneholder følgende kjernefunksjonalitet:

* Autentisering (Firebase Authentication)
* Rollebeskyttede ruter (ProtectedRoute / AdminProtectedRoute)
* Dashboard med samlet oversikt og navigasjon
* Risikoregister:

  * listevisning
  * detaljside
  * opprettelse og redigering
* ISO-kontroller (SoA):

  * oversikt over kontroller
  * status (Implemented / Planned / NotRelevant)
  * eier og begrunnelse
* Policyer:

  * oversikt
  * detaljvisning
  * opprettelse og redigering
* Admin-funksjonalitet:

  * audit log for administrative hendelser
* Egen **Unauthorized**-side ved manglende tilgang

Applikasjonen kan kjøres både med **Firebase som datakilde** og i **demomodus med mockdata**, for å sikre demonstrerbar funksjonalitet ved innlevering.

---

## Komme i gang (lokalt)

### Forutsetninger

* Node.js (LTS anbefalt)
* pnpm installert globalt (`npm install -g pnpm`)
* Firebase-prosjekt med:

  * Firestore aktivert
  * Authentication (e-post/passord)
* `.env.local` basert på `.env.example`

### Installere og starte applikasjonen

```bash
pnpm install
pnpm dev
```

Applikasjonen er deretter tilgjengelig på:

```
http://localhost:5173
```

Innlogging krever en testbruker konfigurert i Firebase Authentication.

---

## Miljøvariabler

Opprett en `.env.local`-fil i denne mappen med følgende variabler:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> Merk: Alle klient-variabler i Vite må prefikses med `VITE_`.

---

## Scripts

Kjør fra denne mappen:

```bash
pnpm dev        # Starter lokal utviklingsserver
pnpm build      # Bygger produksjonsklar bundle
pnpm preview    # Forhåndsviser build lokalt
pnpm lint       # Kjører ESLint
```

---

## Eksempeldata (Firestore)

For å demonstrere funksjonalitet kan følgende eksempeldata brukes i Firestore.

### Eksempel-dokumenter – `controls` collection

```json
{
  "isoId": "A.9.2.3",
  "title": "Management of privileged access rights",
  "description": "Privilegerte tilganger skal gis, overvåkes og revideres regelmessig for å sikre at kun autoriserte personer har tilgang til sensitive systemer.",
  "status": "Implemented",
  "justification": "RBAC er etablert. Tilgangsrettigheter revideres kvartalsvis."
}
```

```json
{
  "isoId": "A.12.3.1",
  "title": "Information backup",
  "description": "Organisasjonen skal etablere rutiner for regelmessig sikkerhetskopiering og gjenoppretting av informasjon og systemer.",
  "status": "Planned",
  "justification": "Backup-rutiner planlegges etablert i neste iterasjon."
}
```

```json
{
  "isoId": "A.11.1.6",
  "title": "Delivery and loading areas",
  "description": "Fysiske lasteramper og leveringsområder skal sikres mot uautorisert tilgang.",
  "status": "NotRelevant",
  "justification": "Echomedic har kun digital drift uten fysisk logistikk."
}
```

---

### Eksempel-dokumenter – `policies` collection

```json
{
  "title": "Tilgangskontroll-policy",
  "category": "Tilgang",
  "version": "1.0",
  "body": "Denne policyen etablerer regler for hvordan brukere gis tilgang til systemer og data. Tilganger gis etter prinsippet om minste privilegium og revideres minimum hver 90. dag.",
  "createdAt": { "_seconds": 1736445000, "_nanoseconds": 0 }
}
```

```json
{
  "title": "Logging- og overvåkningspolicy",
  "category": "Logging",
  "version": "1.0",
  "body": "Systemet skal logge sikkerhetsrelevante hendelser som pålogginger, endringer på risikoobjekter og administrative handlinger. Loggene gjennomgås periodisk.",
  "createdAt": { "_seconds": 1736445100, "_nanoseconds": 0 }
}
```

```json
{
  "title": "Hendelseshåndteringspolicy",
  "category": "Hendelser",
  "version": "1.0",
  "body": "Alle sikkerhetshendelser skal rapporteres umiddelbart, klassifiseres etter alvorlighetsgrad og behandles i henhold til etablerte prosedyrer.",
  "createdAt": { "_seconds": 1736445200, "_nanoseconds": 0 }
}
```

---

## Kvalitet og sikkerhet

* TypeScript (strict) for økt typesikkerhet
* Rollebasert tilgang og autorisasjon
* Fokus på tydelige UI-tilstander (loading, error, tomtilstander)
* Lint- og build-sjekker via CI

Videre anbefalt arbeid:

* Automatiserte tester (unit og E2E)
* Gjennomgang av Firestore Security Rules
* Mer avansert logging og revisjonsspor

---

## Forhold til prosjektleveransen

Denne applikasjonen utgjør **produktinkrementet** i PRO203-prosjektet. Overordnet prosess, Scrum-artefakter, risikoanalyse, SoA, policyer og refleksjoner er dokumentert i prosjektets hoved-README og i `docs/`-mappen på rotnivå.

---

## Lisens

Dette er et skoleprosjekt utviklet som del av eksamen i **PRO203 – Smidig prosjekt**.
Ingen kommersiell lisens er tiltenkt med mindre annet er spesifisert.
