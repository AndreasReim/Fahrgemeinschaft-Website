import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { signIn, configured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const err = await signIn(email, password)
    setSubmitting(false)
    if (err) {
      setError(err)
      return
    }
    navigate(from, { replace: true })
  }

  if (!configured) {
    return (
      <section className="card auth-card">
        <h1>Anmelden</h1>
        <p>Bitte Supabase zuerst konfigurieren (siehe README).</p>
      </section>
    )
  }

  return (
    <section className="card auth-card">
      <h1>Anmelden</h1>
      <form onSubmit={(e) => void handleSubmit(e)} className="auth-form">
        {error && <p className="form-error" role="alert">{error}</p>}
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
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Wird angemeldet …' : 'Anmelden'}
        </button>
      </form>
      <p className="auth-switch">
        Noch kein Konto? <Link to="/register">Registrieren</Link>
      </p>
    </section>
  )
}
