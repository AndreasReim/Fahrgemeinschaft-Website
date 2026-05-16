import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { mdToPdf } from 'md-to-pdf'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const transcriptPath =
  process.env.TRANSCRIPT ||
  'C:/Users/Andreas/.cursor/projects/c-Users-Andreas-Fahrgemeinschaft-Website/agent-transcripts/3ce81cd6-6c6b-4cef-a3e3-275322ea1f9d/3ce81cd6-6c6b-4cef-a3e3-275322ea1f9d.jsonl'
const planPath = path.join(
  process.env.USERPROFILE || '',
  '.cursor/plans/fahrgemeinschaft_tech-stack_743393c8.plan.md',
)

function stripUserQuery(text) {
  return text
    .replace(/<\/?user_query>/g, '')
    .replace(/\[REDACTED\]/g, '')
    .replace(/<attached_files>[\s\S]*?<\/attached_files>/g, '')
    .replace(/<system_reminder>[\s\S]*?<\/system_reminder>/g, '')
    .trim()
}

function extractText(message) {
  if (!message?.content) return ''
  const parts = []
  for (const block of message.content) {
    if (block.type === 'text' && block.text) {
      const t = stripUserQuery(block.text)
      if (t.length > 0) parts.push(t)
    }
  }
  return parts.join('\n\n').trim()
}

function parseTranscript(filePath) {
  if (!fs.existsSync(filePath)) return []
  const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n')
  const entries = []
  let turn = 0
  for (const line of lines) {
    try {
      const row = JSON.parse(line)
      const role = row.role
      const text = extractText(row.message)
      if (!text || text.length < 8) continue
      if (role === 'assistant' && text.startsWith('Zuerst prüfe ich')) continue
      if (role === 'assistant' && text.includes('tool_use')) continue
      turn++
      entries.push({ turn, role, text })
    } catch {
      /* skip */
    }
  }
  // Deduplicate consecutive similar assistant stubs
  const deduped = []
  for (const e of entries) {
    const prev = deduped[deduped.length - 1]
    if (prev && prev.role === e.role && prev.text.slice(0, 60) === e.text.slice(0, 60)) continue
    deduped.push(e)
  }
  return deduped
}

function loadPlanMarkdown() {
  const localPlan = path.join(root, 'docs', 'technologieempfehlung.md')
  if (fs.existsSync(localPlan)) {
    return fs.readFileSync(localPlan, 'utf8').replace(/^---[\s\S]*?---\n/, '')
  }
  if (fs.existsSync(planPath)) {
    return fs.readFileSync(planPath, 'utf8').replace(/^---[\s\S]*?---\n/, '')
  }
  return '*Technologieplan nicht gefunden.*'
}

function buildChatSection(entries) {
  let md = ''
  for (const { turn, role, text } of entries) {
    const label = role === 'user' ? '**Andreas (Sie)**' : '**Assistent (Cursor)**'
    md += `### Nachricht ${turn} — ${label}\n\n${text}\n\n---\n\n`
  }
  return md
}

const planBody = loadPlanMarkdown()
const chatEntries = parseTranscript(transcriptPath)

const markdown = `# Fahrgemeinschaft-Website — Dokumentation

**Erstellt am:** ${new Date().toLocaleDateString('de-DE', { dateStyle: 'long' })}  
**Projekt:** Fahrgemeinschaft-Website  
**Inhalt:** Technologieempfehlung und Chatverlauf (Cursor)

---

# Teil 1: Technologieempfehlung

${planBody.replace(/```mermaid[\s\S]*?```/g, (block) => {
  if (block.includes('flowchart')) {
    return '\n*Architektur (vereinfacht):* Browser-App (React/Vite) → Hosting (Vercel/Netlify oder GitHub Pages) → Supabase (Auth + PostgreSQL mit RLS).\n'
  }
  if (block.includes('sequenceDiagram')) {
    return '\n*Ablauf:* Registrieren/Login → Fahrt anlegen → Suche mit Filtern → Ergebnisse anzeigen (alles über Supabase-API).\n'
  }
  return ''
})}

---

# Teil 2: Chatverlauf

Der folgende Verlauf dokumentiert die Zusammenarbeit in Cursor: von der Technologiefrage über Implementierung, Supabase-Einrichtung, Fehlerbehebung bis zu Erweiterungen der App.

${buildChatSection(chatEntries)}

---

# Anhang: Umgesetzte Funktionen (Stand Dokumentation)

- React + Vite + TypeScript mit Supabase (Auth, \`profiles\`, \`rides\`)
- Registrierung, Login, Fahrgemeinschaften anbieten, suchen, eigene Fahrten verwalten
- Profil bearbeiten (Klick auf Anzeigename), Fahrten bearbeiten, Telefon in der Suche
- Lokale Entwicklung: \`npm run dev\` · Deploy: Vercel oder GitHub Actions → Pages

*Ende des Dokuments*
`

const docsDir = path.join(root, 'docs')
fs.mkdirSync(docsDir, { recursive: true })
const mdOut = path.join(docsDir, 'Fahrgemeinschaft-Dokumentation.md')
const pdfOut = path.join(docsDir, 'Fahrgemeinschaft-Dokumentation.pdf')

fs.writeFileSync(mdOut, markdown, 'utf8')
console.log('Markdown geschrieben:', mdOut)

const css = `
  body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 11pt; line-height: 1.45; color: #134e4a; max-width: 100%; }
  h1 { color: #0d9488; font-size: 22pt; border-bottom: 2px solid #99f6e4; padding-bottom: 0.3em; page-break-before: always; }
  h1:first-of-type { page-break-before: avoid; }
  h2 { color: #0f766e; font-size: 16pt; margin-top: 1.2em; }
  h3 { color: #115e59; font-size: 12pt; margin-top: 1em; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 10pt; }
  th, td { border: 1px solid #99f6e4; padding: 6px 8px; text-align: left; }
  th { background: #ecfdf5; }
  code { background: #f0fdfa; padding: 1px 4px; border-radius: 3px; font-size: 9.5pt; }
  hr { border: none; border-top: 1px solid #ccfbf1; margin: 1.5em 0; }
  strong { color: #0f766e; }
`

await mdToPdf(
  { content: markdown },
  {
    dest: pdfOut,
    css,
    pdf_options: {
      format: 'A4',
      margin: { top: '20mm', right: '18mm', bottom: '20mm', left: '18mm' },
      printBackground: true,
    },
  },
)

console.log('PDF erstellt:', pdfOut)
