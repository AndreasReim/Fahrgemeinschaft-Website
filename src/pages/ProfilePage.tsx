import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export function ProfilePage() {
  const { user, profile, updateProfile } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name)
      setPhone(profile.phone ?? '')
    }
  }, [profile])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)

    const err = await updateProfile(displayName, phone || null)
    setSubmitting(false)

    if (err) {
      setError(err)
      return
    }
    setSuccess(true)
  }

  return (
    <section className="card form-page">
      <h1>Mein Profil</h1>
      <p className="page-subtitle">Ihre Angaben für andere Nutzer bei Fahrgemeinschaften</p>

      <form onSubmit={(e) => void handleSubmit(e)} className="auth-form">
        {error && <p className="form-error" role="alert">{error}</p>}
        {success && (
          <p className="form-success" role="status">
            Profil wurde gespeichert.
          </p>
        )}

        <label>
          E-Mail
          <input type="email" value={user?.email ?? ''} disabled />
          <span className="field-hint">Die E-Mail kann hier nicht geändert werden.</span>
        </label>

        <label>
          Anzeigename
          <input
            type="text"
            required
            minLength={2}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>

        <label>
          Telefon (optional)
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="z. B. 0170 1234567"
            autoComplete="tel"
          />
          <span className="field-hint">
            Wird anderen Nutzern bei Ihren Fahrten in der Suche angezeigt.
          </span>
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Wird gespeichert …' : 'Änderungen speichern'}
        </button>
      </form>
    </section>
  )
}
