import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth()
  const location = useLocation()

  if (!configured) {
    return (
      <section className="card config-card">
        <h1>Einrichtung erforderlich</h1>
        <p>
          Legen Sie eine Datei <code>.env.local</code> mit Ihren Supabase-Zugangsdaten an
          und starten Sie den Entwicklungsserver neu. Details stehen in der README.
        </p>
      </section>
    )
  }

  if (loading) {
    return <p className="loading-state">Wird geladen …</p>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
