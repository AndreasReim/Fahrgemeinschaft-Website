import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { RideCard } from '../components/RideCard'
import { useAuth } from '../context/AuthContext'
import { searchRides } from '../lib/rides'
import type { RideWithDriver } from '../types/database'

export function SearchRidesPage() {
  const { user, loading: authLoading, configured } = useAuth()
  const [searchParams] = useSearchParams()
  const [rides, setRides] = useState<RideWithDriver[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const origin = searchParams.get('origin') ?? undefined
  const destination = searchParams.get('destination') ?? undefined
  const dateFrom = searchParams.get('dateFrom') ?? undefined

  useEffect(() => {
    if (!configured || authLoading) return
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    void searchRides({ origin, destination, dateFrom }).then(({ data, error: err }) => {
      setRides(data)
      setError(err)
      setLoading(false)
    })
  }, [origin, destination, dateFrom, user, authLoading, configured])

  if (!configured) {
    return (
      <section className="card">
        <h1>Suchergebnisse</h1>
        <p>Supabase ist nicht konfiguriert.</p>
      </section>
    )
  }

  if (!authLoading && !user) {
    return (
      <section className="card">
        <h1>Suchergebnisse</h1>
        <p>
          Bitte <Link to="/login">melden Sie sich an</Link>, um Fahrgemeinschaften zu sehen.
        </p>
      </section>
    )
  }

  return (
    <section>
      <header className="page-header">
        <h1>Suchergebnisse</h1>
        <p className="page-subtitle">
          {[origin && `Von: ${origin}`, destination && `Nach: ${destination}`, dateFrom && `Ab: ${dateFrom}`]
            .filter(Boolean)
            .join(' · ') || 'Alle kommenden Fahrten'}
        </p>
      </header>

      {loading && <p className="loading-state">Fahrten werden geladen …</p>}
      {error && <p className="form-error" role="alert">{error}</p>}

      {!loading && !error && rides.length === 0 && (
        <div className="card empty-state">
          <p>Keine passenden Fahrten gefunden.</p>
          <Link to="/" className="btn btn-ghost">
            Neue Suche
          </Link>
        </div>
      )}

      <ul className="ride-list">
        {rides.map((ride) => (
          <li key={ride.id}>
            <RideCard ride={ride} showContact />
          </li>
        ))}
      </ul>
    </section>
  )
}
