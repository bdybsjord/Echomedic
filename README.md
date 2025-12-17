# Echomedic – Smidig prosjekt (PRO203) | Høst 2025

Dette repoet er **Team Los Angeles** sin leveranse til prosjekteksamen i
**PRO203 – Smidig prosjekt (Høyskolen Kristiania)** høsten 2025.

Prosjektet består av utviklingen av **Echomedic Dashboard**, et webbasert oversikts- og styringsverktøy for **informasjonssikkerhet og risikostyring**. Løsningen støtter arbeid med **risikovurderinger**, **ISO/IEC 27001/27002-kontroller (Statement of Applicability)** og **policyer**, med rollebasert tilgang og sporbarhet.

---

## Innhold

* Produktoversikt
* Funksjonalitet
* Teknologi
* Repo-struktur
* Komme i gang
* Miljøvariabler
* Scripts
* Kvalitet og sikkerhet
* Testing
* Deploy
* Dokumentasjon og vedlegg
* Team
* Lisens

---

## Produktoversikt

**Echomedic Dashboard** er et lettvekts beslutnings- og oversiktsverktøy som gir bedre innsikt i virksomhetens sikkerhetsstatus og støtter kontinuerlig forbedring av sikkerhetsarbeidet.

Løsningen konsoliderer:

* **Risikoregister** med kategori, sannsynlighet, konsekvens og risikonivå
* **Statement of Applicability (SoA)** for ISO-kontroller med status, eier og begrunnelse
* **Policy-bibliotek** for styringsdokumenter
* **Rollebasert tilgang**, inkludert administratortilgang
* **Audit log** for sporbarhet av administrative hendelser (der implementert)

Prosjektet er utviklet iterativt ved bruk av Scrum, med design sprint og påfølgende Scrum-sprinter. Arbeidet er dokumentert gjennom Scrum-artefakter (Product Backlog, Sprint Backlog, burndown-grafer, leveranse- og akseptansetester, tidslogg og GitHub-historikk).

---

## Funksjonalitet

### Kjernefunksjonalitet

* Autentisering og beskyttede ruter (Protected Routes)
* Dashboard med samlet oversikt og navigasjon
* Risikoregister:

  * listevisning
  * detaljside
  * opprettelse og redigering
* SoA / kontroller:

  * oversikt over ISO-kontroller
  * status (Implemented / Planned / NotRelevant)
  * eier og begrunnelse
* Policyer:

  * oversikt
  * detaljside
  * opprettelse og redigering
* Admin-funksjonalitet:

  * audit log (rollebeskyttet)
* Egen **Unauthorized**-side ved manglende tilgang

### Datagrunnlag

* Applikasjonen støtter bruk av **Firebase / Firestore** der dette er konfigurert.
* I utviklings- og demomodus benyttes **mockdata** som fallback for å sikre demo-klar funksjonalitet.

---

## Teknologi

### Frontend

* React 18
* Vite
* TypeScript (strict)
* Tailwind CSS
* React Router

### Plattform / DevOps

* Firebase (Authentication og Firestore) – avhengig av miljøkonfigurasjon
* GitHub Actions for lint og build på pull requests

---

## Repo-struktur

```
.
├── echomedic/                # React 18 + Vite + TypeScript dashboard
│   ├── src/
│   │   ├── pages/            # Sider (Dashboard, Risks, Controls, Policies, osv.)
│   │   ├── components/       # UI-komponenter (tabeller, badges, layout)
│   │   ├── hooks/            # Data-hooks (risks, controls, policies)
│   │   ├── context/          # Auth og tilgang
│   │   ├── types/            # Domene-typer (TypeScript)
│   │   └── data/             # Mockdata
│   └── ...
├── docs/                     # Risikoanalyse, SoA, policyer, prosjektrapport
└── .github/workflows/        # GitHub Actions (lint/build)
```

---

## Komme i gang

### Forutsetninger

* Node.js (LTS anbefalt)
* pnpm

Installer pnpm (om nødvendig):

```
npm install -g pnpm
```

### Lokal utvikling

```
cd echomedic
pnpm install
pnpm run dev
```

Applikasjonen kjører da på:

```
http://localhost:5173
```

---

## Miljøvariabler

Opprett en `.env`-fil i `echomedic/` (eller sett variablene i hosting-miljøet) ved bruk av Firebase:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Alle klient-miljøvariabler i Vite må prefikses med `VITE_`.

---

## Scripts

Kjør fra `echomedic/`:

```
pnpm run dev        # Lokal utviklingsserver
pnpm run build      # Produksjonsbuild
pnpm run preview    # Forhåndsvisning av build
pnpm run lint       # ESLint
pnpm run typecheck  # TypeScript-sjekk (dersom definert)
```

---

## Kvalitet og sikkerhet

* TypeScript for økt typesikkerhet og redusert runtime-feil
* Rollebasert tilgang på ruter (ProtectedRoute / AdminProtectedRoute)
* Robuste UI-tilstander (loading, error, tomtilstander)
* CI-sjekker via GitHub Actions (lint og build)

Anbefalt videre arbeid:

* Utvidede automatiserte tester (unit og E2E)
* Sikkerhetsgjennomgang av Firebase-regler og tilgangsstyring
* Strukturert logging og revisjonsspor
* Pilotering med sluttbrukere og verdimåling

---

## Testing

Per innlevering har prosjektet hatt fokus på leveranse- og akseptanseverifisering av kjerneflyt.

Videre arbeid kan inkludere:

* Unit-tester for domene- og mappinglogikk
* Enkle integrasjonstester for kritiske flyter
* E2E-tester (f.eks. Playwright) for innlogging og CRUD-operasjoner

---

## Deploy

Applikasjonen kan deployes til for eksempel **Vercel** eller **Netlify**.

* Build-kommando: `pnpm run build`
* Output-mappe: `dist/`

Nødvendige `VITE_*`-miljøvariabler må settes i produksjonsmiljøet.

---

## Dokumentasjon og vedlegg

Se `docs/`-mappen for innleveringsdokumenter og vedlegg, inkludert:

* Risikoanalyse og risikoregister
* Statement of Applicability (SoA)
* Policyer
* Prosjektrapport (Del 2)
* Sprint- og prosessdokumentasjon (Dokumentasjon 1–3)

---

## Team

**Team Los Angeles – PRO203 (Høst 2025)**

* Abdallah Jacob Adam Abbo
* Benedikte Dybsjord
* Riffat Hashim
* Raja Daud Ibrahim Nawaz
* Magan Ahmed Yusuf
* Mahdi Ali
* Azaan Khan

---

## Lisens

Dette er et skoleprosjekt utviklet som del av eksamen i **PRO203 – Smidig prosjekt**.
Ingen kommersiell lisens er tiltenkt med mindre annet er spesifisert.
