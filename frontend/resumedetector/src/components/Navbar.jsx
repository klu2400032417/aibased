import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Role-based navigation links
  const navLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      roles: ['ADMIN', 'RECRUITER', 'CANDIDATE']
    },
    {
      to: '/upload',
      label: 'Upload Resume',
      roles: ['ADMIN', 'CANDIDATE']
    },
    {
      to: '/jobs',
      label: 'Job Roles',
      roles: ['ADMIN', 'RECRUITER', 'CANDIDATE']
    },
    {
      to: '/leaderboard',
      label: 'Leaderboard',
      roles: ['ADMIN', 'RECRUITER']
    },
  ]

  return (
    <nav
      style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--accent2)'
          }}
        >
          AI Resume Detector
        </span>

        {navLinks
          .filter(link => link.roles.includes(user?.role))
          .map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                fontSize: '14px',
                color: isActive ? 'var(--accent2)' : 'var(--text2)',
                fontWeight: isActive ? 600 : 400,
                borderBottom: isActive
                  ? '2px solid var(--accent)'
                  : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'all 0.2s'
              })}
            >
              {label}
            </NavLink>
          ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text2)' }}>
          {user?.name}

          <span
            style={{
              marginLeft: '6px',
              fontFamily: 'var(--mono)',
              fontSize: '10px',
              color: 'var(--accent2)',
              background: '#4c1d9544',
              padding: '2px 8px',
              borderRadius: '10px'
            }}
          >
            {user?.role}
          </span>
        </span>

        <button
          className="btn-outline"
          onClick={handleLogout}
          style={{ padding: '6px 16px', fontSize: '13px' }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}