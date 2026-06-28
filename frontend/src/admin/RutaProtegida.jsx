import { Navigate } from 'react-router-dom'
import { useAdminAuth } from './AuthContext'

export default function RutaProtegida({ children }) {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
