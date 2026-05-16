import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { parseDatetimeLocal, toDatetimeLocalValue } from '../lib/datetime'
import { getRideById, updateRide } from '../lib/rides'

export function EditRidePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureAt, setDepartureAt] = useState('')
  const [seats, setSeats] = useState(3)
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id || !user) return

    void getRideById(id).then(({ data, error: err }) => {
      if (err || !data) {
        setError(err ?? 'Fahrt nicht gefunden.')
        setLoading(false)
        return
      }
      if (data.driver_id !== user.id) {
        setError('Sie dürfen diese Fahrt nicht bearbeiten.')
        setLoading(false)
        return
      }
      setOrigin(data.origin)
      setDestination(data.destination)
      setDepartureAt(toDatetimeLocalValue(data.departure_at))
      setSeats(data.seats_available)
      setDescription(data.description ?? '')
      setLoading(false)
    })
  }, [id, user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return

    setError(null)
    setSubmitting(true)

    const departure = parseDatetimeLocal(departureAt)
    if (!departure || departure <= new Date()) {
      setError('Bitte ein gültiges Datum in der Zukunft wählen.')
      setSubmitting(false)
      return
    }

    const { error: err } = await updateRide(id, {
      origin: origin.trim(),
      destination: destination.trim(),
      departure_at: departure.toISOString(),
      seats_available: seats,
      description: description.trim() || null,
    })

    setSubmitting(false)
    if (err) {
      setError(err)
      return
    }
    navigate('/my-rides')
  }

  if (loading) {
    return <p className="loading-state">Fahrt wird geladen …</p>
  }

  if (error && !origin) {
    return (
      <section className="card">
        <p className="form-error" role="alert">{error}</p>
        <Link to="/my-rides" className="btn btn-ghost">
          Zurück zu Meine Fahrten
        </Link>
      </section>
    )
  }

  return (
    <section className="card form-page">
      <h1>Fahrt bearbeiten</h1>
      <form onSubmit={(e) => void handleSubmit(e)} className="offer-form">
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-grid">
          <label>
            Startort
            <input
              type="text"
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </label>
          <label>
            Zielort
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </label>
          <label>
            Abfahrt
            <input
              type="datetime-local"
              required
              value={departureAt}
              onChange={(e) => setDepartureAt(e.target.value)}
            />
          </label>
          <label>
            Freie Plätze
            <input
              type="number"
              min={1}
              max={8}
              required
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </label>
        </div>
        <label>
          Beschreibung (optional)
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Wird gespeichert …' : 'Speichern'}
          </button>
          <Link to="/my-rides" className="btn btn-ghost">
            Abbrechen
          </Link>
        </div>
      </form>
    </section>
  )
}
