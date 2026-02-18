# ClinSight — Frontend

Hospital-grade Clinical Decision Support System (CDSS) **frontend only**. Built with React, TypeScript, Tailwind CSS, and the design system in `docs/design.json`.

## Design

- **UX spec:** See `../FRONTEND_DESIGN.md` for screen-by-screen UX, roles, and edge states.
- **Design system:** Colors, typography, and components follow `docs/design.json` (teal primary, Inter, cards, sidebar, table).

## Roles (demo login)

| Username   | Password | Role           |
|-----------|----------|----------------|
| intake    | demo     | Intake Officer |
| nurse     | demo     | Nurse          |
| radiologist | demo   | Radiologist    |
| physician | demo     | Physician      |
| admin     | demo     | Hospital Admin |
| compliance | demo    | Compliance     |

## Screens

1. **Login** — Username/password; MFA step (UI only).
2. **Home dashboard** — Role-based shortcuts.
3. **Patient registration** — Intake only.
4. **Bulk document upload** — Intake only.
5. **Patient worklist** — Search/filter, open patient.
6. **Patient overview** — Demographics, alerts, timeline, links to Labs/Imaging/Notes/Support.
7. **Imaging review** — Study list, image placeholder, radiologist notes (Radiologist can edit).
8. **Labs & vitals** — Tables with reference ranges; Nurse can add observations.
9. **Clinical notes** — SOAP notes; Physician/Nurse can add/edit per design.
10. **Diagnostic support** — Physician only; disclaimer, suggestions, evidence, citations.
11. **Audit log** — Admin/Compliance only; read-only logs.

## Run

```bash
cd clinsight-app
npm install
npm run dev
```

Open http://localhost:5173. Sign in with any role above to see role-specific nav and screens.

## Build

```bash
npm run build
npm run preview
```

## Stack

- React 18, TypeScript, Vite
- React Router 6
- Tailwind CSS (tokens from docs/design.json)
- Lucide React (icons per docs/design.json)

No backend; all data is mock. Backend systems are assumed to exist and be secure per the frontend design document.
