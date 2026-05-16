# Fahrgemeinschaft-Website

Web-App zum **Registrieren**, **Anbieten** und **Suchen** von Fahrgemeinschaften.  
Technologie: **React + Vite + TypeScript** (Frontend) und **Supabase** (Auth + PostgreSQL).

Entwicklungsgeschichte und Chat-Zusammenfassung: [ENTWICKLUNG.md](ENTWICKLUNG.md)

## Voraussetzungen

- [Node.js LTS](https://nodejs.org/) (inkl. `npm`)
- Kostenloses [Supabase](https://supabase.com/)-Projekt

## 1. Supabase einrichten

1. Neues Projekt auf [supabase.com](https://supabase.com) anlegen.
2. Unter **SQL** → **New query** den Inhalt von [`supabase/schema.sql`](supabase/schema.sql) ausführen.
3. Unter **Project Settings** → **API** notieren:
   - Project URL
   - `anon` `public` Key
4. Optional unter **Authentication** → **Providers**: E-Mail-Bestätigung deaktivieren (für schnelles lokales Testen).

## 2. Lokal starten

```bash
cd Fahrgemeinschaft-Website
npm install
cp .env.example .env.local
```

`.env.local` anpassen:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

Entwicklungsserver:

```bash
npm run dev
```

App im Browser: `http://localhost:5173`

### Manuell testen

1. **Registrieren** → Konto anlegen  
2. **Anmelden** (ggf. E-Mail bestätigen)  
3. **Anbieten** → Fahrgemeinschaft eintragen  
4. **Suchen** auf der Startseite → Ergebnisse unter `/rides`  
5. Zweiter Test-Account: Suche und Anzeige prüfen  

## 3. Produktion deployen

### Option A: Vercel (empfohlen)

1. Repository auf GitHub pushen.  
2. [vercel.com](https://vercel.com) → **Import Project** → Repo wählen.  
3. Umgebungsvariablen setzen:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — fertig. SPA-Routing funktioniert ohne Zusatzkonfiguration.

### Option B: GitHub Pages

1. Repository auf GitHub.  
2. **Settings** → **Pages** → Source: **GitHub Actions**.  
3. Unter **Settings** → **Secrets and variables** → **Actions**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Push auf `main`/`master` startet [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).  
5. Die App liegt unter `https://<user>.github.io/<repo-name>/`.

Der Workflow setzt `VITE_BASE_PATH` automatisch auf `/<repo-name>/`.

**Wichtig (Reihenfolge):** Zuerst unter **Pages** die Quelle **GitHub Actions** wählen und speichern, danach Secrets anlegen, dann den Workflow erneut starten (**Actions** → **Deploy to GitHub Pages** → **Run workflow**).

**Fehler „Failed to create deployment (status: 404)“:** GitHub Pages ist noch nicht aktiv oder die Quelle ist noch „Deploy from a branch“. Lösung: [Pages-Einstellungen](https://github.com/AndreasReim/Fahrgemeinschaft-Website/settings/pages) → **Build and deployment** → **Source:** **GitHub Actions** → speichern → Workflow neu ausführen.

## Projektstruktur

```
src/
  components/     Layout, Navbar, RideCard, ProtectedRoute
  context/        Auth (Session, Login, Register)
  lib/            Supabase-Client, Fahrt-API
  pages/          Start, Login, Register, Suche, Anbieten, Meine Fahrten
supabase/
  schema.sql      Tabellen profiles & rides + RLS
```

## Sicherheit

- Der `anon`-Key ist im Frontend sichtbar — das ist bei Supabase üblich.  
- Zugriff wird über **Row Level Security** gesteuert (nur eingeloggte Nutzer lesen/schreiben; Fahrten nur vom Ersteller änderbar/löschbar).

## Skripte

| Befehl           | Beschreibung              |
|------------------|---------------------------|
| `npm run dev`    | Entwicklungsserver        |
| `npm run build`  | Produktions-Build (`dist/`) |
| `npm run preview`| Build lokal testen        |

## Lizenz

Privates Lern-/Projekt-Repository.
