import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return <div className="loading">Loading...</div>
  return token ? children : <Navigate to="/login" />
}