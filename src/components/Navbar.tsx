import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
  const { user, profile, loading, signOut, configured } = useAuth()

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon" aria-hidden>🚗</span>
        Fahrgemeinschaft
      </Link>
      <nav className="nav-links" aria-label="Hauptnavigation">
        <NavLink to="/" end>
          Suchen
        </NavLink>
        {user && (
          <>
            <NavLink to="/offer">Anbieten</NavLink>
            <NavLink to="/my-rides">Meine Fahrten</NavLink>
          </>
        )}
        {!loading && (
          user ? (
            <div className="nav-user">
              <Link to="/profile" className="nav-user-name" title="Profil bearbeiten">
                {profile?.display_name ?? user.email}
              </Link>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => void signOut()}>
                Abmelden
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login">Anmelden</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm nav-cta">
                Registrieren
              </NavLink>
            </>
          )
        )}
      </nav>
      {!configured && (
        <p className="config-banner" role="status">
          Supabase nicht konfiguriert — siehe README
        </p>
      )}
    </header>
  )
}
