import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RideCard } from '../components/RideCard'
import { useAuth } from '../context/AuthContext'
import { deleteRide, getMyRides } from '../lib/rides'
import type { Ride } from '../types/database'

export function MyRidesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rides, setRides] = useState<Ride[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadRides = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error: err } = await getMyRides(user.id)
    setRides(data)
    setError(err)
    setLoading(false)
  }, [user])

  useEffect(() => {
    void loadRides()
  }, [loadRides])

  async function handleDelete(id: string) {
    if (!confirm('Diese Fahrt wirklich löschen?')) return
    const { error: err } = await deleteRide(id)
    if (err) {
      setError(err)
      return
    }
    setRides((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <section>
      <header className="page-header page-header-row">
        <div>
          <h1>Meine Fahrten</h1>
          <p className="page-subtitle">Von Ihnen angebotene Fahrgemeinschaften</p>
        </div>
        <Link to="/offer" className="btn btn-primary">
          Neue Fahrt
        </Link>
      </header>

      {loading && <p className="loading-state">Wird geladen …</p>}
      {error && <p className="form-error" role="alert">{error}</p>}

      {!loading && rides.length === 0 && (
        <div className="card empty-state">
          <p>Sie haben noch keine Fahrten angeboten.</p>
          <Link to="/offer" className="btn btn-primary">
            Erste Fahrt anbieten
          </Link>
        </div>
      )}

      <ul className="ride-list">
        {rides.map((ride) => (
          <li key={ride.id}>
            <RideCard
              ride={ride}
              showDriver={false}
              onEdit={(id) => navigate(`/my-rides/edit/${id}`)}
              onDelete={handleDelete}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
