import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RegisterPage() {
  const { signUp, configured } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const err = await signUp(email, password, displayName)
    setSubmitting(false)
    if (err) {
      setError(err)
      return
    }
    setSuccess(true)
  }

  if (!configured) {
    return (
      <section className="card auth-card">
        <h1>Registrieren</h1>
        <p>Bitte Supabase zuerst konfigurieren (siehe README).</p>
      </section>
    )
  }

  if (success) {
    return (
      <section className="card auth-card">
        <h1>Fast geschafft!</h1>
        <p>
          Wir haben Ihnen eine Bestätigungs-E-Mail gesendet (falls in Supabase aktiviert).
          Nach der Bestätigung können Sie sich{' '}
          <Link to="/login">anmelden</Link>.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>
          Zur Anmeldung
        </button>
      </section>
    )
  }

  return (
    <section className="card auth-card">
      <h1>Registrieren</h1>
      <form onSubmit={(e) => void handleSubmit(e)} className="auth-form">
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>
          Anzeigename
          <input
            type="text"
            required
            minLength={2}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ihr Name für andere Nutzer"
          />
        </label>
        <label>
          E-Mail
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Passwort
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Wird erstellt …' : 'Konto erstellen'}
        </button>
      </form>
      <p className="auth-switch">
        Bereits registriert? <Link to="/login">Anmelden</Link>
      </p>
    </section>
  )
}
