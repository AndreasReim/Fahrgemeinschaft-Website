import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SearchRidesPage } from './pages/SearchRidesPage'
import { OfferRidePage } from './pages/OfferRidePage'
import { MyRidesPage } from './pages/MyRidesPage'
import { ProfilePage } from './pages/ProfilePage'
import { EditRidePage } from './pages/EditRidePage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="rides" element={<SearchRidesPage />} />
            <Route
              path="offer"
              element={
                <ProtectedRoute>
                  <OfferRidePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-rides"
              element={
                <ProtectedRoute>
                  <MyRidesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-rides/edit/:id"
              element={
                <ProtectedRoute>
                  <EditRidePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
