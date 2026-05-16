# Entwicklungs- und Chatverlauf — Fahrgemeinschaft-Website

Dokumentation der Projektevolution in Zusammenarbeit mit **Cursor (KI-Assistent)**.  
Stand: Mai 2026 · Repository: [github.com/AndreasReim/Fahrgemeinschaft-Website](https://github.com/AndreasReim/Fahrgemeinschaft-Website)

Technische Anleitung zum Starten der App: siehe [README.md](README.md).  
Ausführliche Technologieempfehlung und PDF-Export: [docs/Fahrgemeinschaft-Dokumentation.pdf](docs/Fahrgemeinschaft-Dokumentation.pdf).

---

## 1. Ausgangslage

**Ziel:** Web-App, in der sich Nutzer registrieren, Fahrgemeinschaften anbieten (in einer Datenbank) und bestehende Fahrten suchen können.

**Rahmenbedingungen:**

- Veröffentlichung nach lokalem Test geplant (ursprünglich **GitHub Pages**)
- Leerer Projektordner, kein bestehender Code
- Hosting später als **flexibel** gewählt (Vercel/Netlify/GitHub Pages)

---

## 2. Technologieentscheidung

| Schicht | Gewählt | Begründung |
|---------|---------|------------|
| Frontend | React + Vite + TypeScript | Schnelle Entwicklung, statischer Build, SPA |
| Backend/DB | Supabase (Auth + PostgreSQL) | Kein eigener Server nötig; RLS für Sicherheit |
| Styling | Eigenes CSS (`index.css`) | Konsistentes UI ohne zusätzlichen Build-Schritt |
| Hosting | Vercel **oder** GitHub Pages | Pages nur statisch; Supabase als externer Dienst |

**Warum nicht nur GitHub Pages allein?**  
Pages hostet nur HTML/CSS/JS — keine Datenbank, kein serverseitiges Login. Supabase übernimmt Auth und Persistenz.

**Architektur (vereinfacht):**

```
Browser (React/Vite) → Hosting (Vercel oder GitHub Pages) → Supabase (Auth + DB mit RLS)
```

---

## 3. Chronologischer Entwicklungsverlauf

### Phase 1 — Planung und Grundgerüst

- Technologieempfehlung erstellt und freigegeben
- Vite-React-TypeScript-Projekt angelegt
- Supabase-Schema: Tabellen `profiles`, `rides`, RLS-Policies, Trigger für Profil bei Registrierung
- Seiten: Start/Suche, Login, Registrieren, Fahrten suchen, anbieten, eigene Fahrten
- Auth-Kontext, geschützte Routen, Supabase-Client
- README, `.env.example`, Deploy-Workflow für GitHub Pages, `vercel.json`

### Phase 2 — Lokale Einrichtung und Fehlerbehebung

- **Supabase Schritt 1:** Projekt anlegen, `schema.sql` ausführen, API-Keys notieren
- **Security-Schalter beim Supabase-Projekt:** `Enable Data API` an; übrige Schalter je nach Komfort
- **Schritt 2 lokal:** `.env.local`, `npm install`, `npm run dev`
- **Fehler Registrierung:** `Invalid path specified in request URL` — Ursache: `VITE_SUPABASE_URL` enthielt fälschlich `/rest/v1/`. Korrektur: nur Basis-URL `https://<projekt>.supabase.co`
- **E-Mail-Bestätigung:** Keine Mail angekommen → Hinweis auf Spam, manuelle Bestätigung im Dashboard oder „Confirm email“ für Tests deaktivieren

### Phase 3 — Funktionserweiterungen

- **Profil:** Klick auf Anzeigename → `/profile` (Name, Telefon; E-Mail nur Anzeige)
- **Meine Fahrten:** Fahrten **bearbeiten** (`/my-rides/edit/:id`) zusätzlich zu löschen
- **Suche (`/rides`):** Sortierung nach Abfahrt (Datum/Uhrzeit); Anzeige von Fahrer:in inkl. Telefonnummer

### Phase 4 — Repository und Deployment

- Projekt nach GitHub gepusht: `AndreasReim/Fahrgemeinschaft-Website`
- GitHub Pages: Fehler **404 beim Deploy** → Pages-Quelle muss **GitHub Actions** sein (nicht „Deploy from a branch“)
- Workflow und README um Fehlerbehebung ergänzt
- Secrets für Actions: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (unter Settings → Secrets and variables → Actions)

### Phase 5 — Dokumentation

- PDF/Markdown-Dokumentation aus Chat und Technologieplan (`docs/`)
- Diese Datei `ENTWICKLUNG.md` als Entwicklungslog im Repo

---

## 4. Chatverlauf (inhaltliche Zusammenfassung)

| # | Thema | Ergebnis |
|---|--------|----------|
| 1 | Welche Technologie? GitHub Pages? | Empfehlung React/Vite + Supabase; Plan mit flexiblem Hosting |
| 2 | Plan umsetzen | Vollständige MVP-App implementiert |
| 3 | Supabase Schritt 1 genauer | Anleitung: Projekt, SQL, API-Keys, optional E-Mail-Bestätigung aus |
| 4 | Security-Schalter bei Supabase | Data API an; „expose tables“ optional; Auto-RLS nicht nötig (Schema enthält RLS) |
| 5 | Schritt 2 lokal | `.env.local`, npm, Test unter localhost:5173 |
| 6 | Registrierungsfehler URL | `.env.local` korrigiert (kein `/rest/v1/`) |
| 7 | Keine Bestätigungs-Mail | Supabase-Einstellungen / manuell bestätigen |
| 8 | Profil, Fahrt bearbeiten, Suche | Features umgesetzt |
| 9 | PDF aus Chat + Empfehlung | `docs/Fahrgemeinschaft-Dokumentation.pdf` |
| 10 | Repo auf GitHub | Push auf `main` |
| 11 | Pages Deploy 404 | Pages auf GitHub Actions umstellen |
| 12 | Secrets finden | Pfad: Settings → Secrets and variables → Actions |
| 13 | Git-Installation prüfen | Git OK; `gh` installiert, nicht eingeloggt |
| 14 | ENTWICKLUNG.md | Dieses Dokument |

---

## 5. Aktueller Funktionsumfang

- Registrierung und Login (Supabase Auth)
- Automatisches Profil (`profiles`) bei neuer Registrierung
- Fahrgemeinschaft **anbieten**, **suchen** (Start/Ziel/Datum), **eigene Fahrten** verwalten
- Fahrten **bearbeiten** und **löschen** (nur eigene)
- **Profil bearbeiten** (Anzeigename, Telefon)
- In der Suche: Fahrten chronologisch, Kontakt Telefon des Fahrers (falls hinterlegt)
- Nur eingeloggte Nutzer sehen Fahrtlisten (RLS)

### Wichtige Routen

| Route | Funktion |
|-------|----------|
| `/` | Startseite mit Suchformular |
| `/register`, `/login` | Konto |
| `/rides` | Suchergebnisse |
| `/offer` | Neue Fahrt (geschützt) |
| `/my-rides` | Eigene Fahrten (geschützt) |
| `/my-rides/edit/:id` | Fahrt bearbeiten (geschützt) |
| `/profile` | Profil bearbeiten (geschützt) |

---

## 6. Bekannte Stolpersteine und Lösungen

| Problem | Lösung |
|---------|--------|
| `Invalid path specified in request URL` | `VITE_SUPABASE_URL` ohne `/rest/v1/` |
| Keine E-Mail nach Registrierung | Spam prüfen; User in Supabase bestätigen; oder Confirm email deaktivieren |
| Pages Deploy 404 | Settings → Pages → Source: **GitHub Actions** |
| Secrets nicht gefunden | [Repository Secrets (Actions)](https://github.com/AndreasReim/Fahrgemeinschaft-Website/settings/secrets/actions) |
| Gelber Hinweis „Supabase nicht konfiguriert“ | `.env.local` prüfen, Dev-Server neu starten |
| `gh` Befehle funktionieren nicht | `gh auth login` (optional; Git push geht oft ohne `gh`) |

---

## 7. Lokale Entwicklung (Kurzreferenz)

```powershell
cd Fahrgemeinschaft-Website
npm install
# .env.local aus .env.example anlegen und Supabase-Werte eintragen
npm run dev
```

`.env.local` wird **nicht** ins Repository committet (`.gitignore`).

---

## 8. Deployment

| Variante | URL (Beispiel) | Hinweis |
|----------|----------------|---------|
| GitHub Pages | `https://andreasreim.github.io/Fahrgemeinschaft-Website/` | `VITE_BASE_PATH` im Workflow; Secrets in Actions |
| Vercel | Projektdomain von Vercel | Env-Variablen im Dashboard |

Supabase-URL in Produktion: **nur Projekt-URL**, kein `/rest/v1/`-Suffix.

---

## 9. Werkzeuge auf dem Entwicklungsrechner (Prüfstand)

- **Git:** installiert, Remote erreichbar
- **GitHub CLI (`gh`):** installiert; Anmeldung mit `gh auth login` bei Bedarf
- **Node.js / npm:** für Build und Dev-Server

---

## 10. Mögliche nächste Schritte (noch nicht umgesetzt)

- E-Mail-Bestätigung mit eigenem SMTP (Produktion)
- Passwort zurücksetzen
- Mitfahrer-Anfragen / Buchung von Plätzen
- Bewertungen oder Meldungen
- CI: Lint/Test im GitHub-Workflow

---

*Dieses Dokument wird bei größeren Projektänderungen ergänzt.*
