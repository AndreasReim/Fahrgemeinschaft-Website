import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createRide } from '../lib/rides'

export function OfferRidePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureAt, setDepartureAt] = useState('')
  const [seats, setSeats] = useState(3)
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setError(null)
    setSubmitting(true)

    const departure = new Date(departureAt)
    if (Number.isNaN(departure.getTime()) || departure <= new Date()) {
      setError('Bitte ein gültiges Datum in der Zukunft wählen.')
      setSubmitting(false)
      return
    }

    const { error: err } = await createRide({
      driver_id: user.id,
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

  return (
    <section className="card form-page">
      <h1>Fahrgemeinschaft anbieten</h1>
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
              placeholder="z. B. München"
            />
          </label>
          <label>
            Zielort
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="z. B. Frankfurt"
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
            placeholder="Treffpunkt, Gepäck, Kostenbeteiligung …"
          />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Wird gespeichert …' : 'Fahrt veröffentlichen'}
        </button>
      </form>
    </section>
  )
}
