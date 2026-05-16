import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { RideSearchFilters } from '../types/database'

export function HomePage() {
  const navigate = useNavigate()
  const { user, configured } = useAuth()
  const [filters, setFilters] = useState<RideSearchFilters>({
    origin: '',
    destination: '',
    dateFrom: '',
  })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (filters.origin?.trim()) params.set('origin', filters.origin.trim())
    if (filters.destination?.trim()) params.set('destination', filters.destination.trim())
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    navigate(`/rides?${params.toString()}`)
  }

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Fahrgemeinschaften finden</h1>
        <p>
          Registrieren Sie sich, bieten Sie Fahrten an oder suchen Sie Mitfahrgelegenheiten
          in Ihrer Region.
        </p>
        {!user && configured && (
          <p className="hero-hint">
            <Link to="/register">Kostenlos registrieren</Link>, um Fahrten anzubieten und alle
            Details zu sehen.
          </p>
        )}
      </div>

      <form className="card search-card" onSubmit={handleSearch}>
        <h2>Fahrt suchen</h2>
        <div className="form-grid">
          <label>
            Von (Stadt/Ort)
            <input
              type="text"
              placeholder="z. B. Berlin"
              value={filters.origin ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, origin: e.target.value }))}
            />
          </label>
          <label>
            Nach (Stadt/Ort)
            <input
              type="text"
              placeholder="z. B. Hamburg"
              value={filters.destination ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, destination: e.target.value }))}
            />
          </label>
          <label>
            Ab Datum
            <input
              type="date"
              value={filters.dateFrom ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Suchen
        </button>
      </form>
    </section>
  )
}
