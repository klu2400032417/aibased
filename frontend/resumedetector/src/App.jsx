import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadResume from './pages/UploadResume'
import JobRoles from './pages/JobRoles'
import Leaderboard from './pages/Leaderboard'
import Navbar from './components/Navbar'

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth()

  if (loading) return <div className="loading">Loading...</div>

  return token ? children : <Navigate to="/login" />
}

export default function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Navbar />

              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route
                  path="/upload"
                  element={
                    user?.role === 'CANDIDATE' || user?.role === 'ADMIN'
                      ? <UploadResume />
                      : <Navigate to="/dashboard" />
                  }
                />

                <Route path="/jobs" element={<JobRoles />} />

                <Route
                  path="/leaderboard"
                  element={
                    user?.role === 'RECRUITER' || user?.role === 'ADMIN'
                      ? <Leaderboard />
                      : <Navigate to="/dashboard" />
                  }
                />

                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}