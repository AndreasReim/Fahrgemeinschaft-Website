import type { Ride, RideWithDriver } from '../types/database'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getDriverInfo(ride: Ride | RideWithDriver) {
  if (!('profiles' in ride) || !ride.profiles) {
    return { name: null as string | null, phone: null as string | null }
  }
  const profile = Array.isArray(ride.profiles) ? ride.profiles[0] : ride.profiles
  return {
    name: profile?.display_name ?? null,
    phone: profile?.phone ?? null,
  }
}

interface RideCardProps {
  ride: Ride | RideWithDriver
  showDriver?: boolean
  showContact?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function RideCard({
  ride,
  showDriver = true,
  showContact = false,
  onEdit,
  onDelete,
}: RideCardProps) {
  const { name: driver, phone } = getDriverInfo(ride)

  return (
    <article className="ride-card">
      <div className="ride-route">
        <span className="ride-city">{ride.origin}</span>
        <span className="ride-arrow" aria-hidden>
          →
        </span>
        <span className="ride-city">{ride.destination}</span>
      </div>
      <p className="ride-meta">
        <time dateTime={ride.departure_at}>{formatDateTime(ride.departure_at)}</time>
        <span className="ride-seats">{ride.seats_available} freie Plätze</span>
      </p>
      {ride.description && <p className="ride-description">{ride.description}</p>}
      {showDriver && driver && (
        <p className="ride-driver">
          Fahrer:in: <strong>{driver}</strong>
          {showContact && (
            <>
              {' · '}
              {phone ? (
                <>
                  Tel.:{' '}
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="ride-phone">
                    {phone}
                  </a>
                </>
              ) : (
                <span className="ride-no-phone">Keine Telefonnummer hinterlegt</span>
              )}
            </>
          )}
        </p>
      )}
      {(onEdit || onDelete) && (
        <div className="ride-actions">
          {onEdit && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(ride.id)}>
              Bearbeiten
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(ride.id)}
            >
              Löschen
            </button>
          )}
        </div>
      )}
    </article>
  )
}
