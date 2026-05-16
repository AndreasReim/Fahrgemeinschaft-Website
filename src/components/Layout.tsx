import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Fahrgemeinschaft — gemeinsam unterwegs, weniger CO₂.</p>
      </footer>
    </div>
  )
}
