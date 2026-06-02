import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginApi } from '../api/authApi'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi(form)
      const { token, name, role,id } = res.data.data
      login(token, { id, name, role })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 1rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '13px',
            color: 'var(--accent2)', marginBottom: '8px',
            letterSpacing: '2px', textTransform: 'uppercase'
          }}>AI Resume Detector</div>
          <h1 style={{ fontSize: '26px', fontWeight: 700 }}>Welcome back</h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '4px' }}>
            Sign in to your account
          </p>
        </div>

        <div className="card">
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px', display: 'block' }}>
                Email
              </label>
              <input type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px', display: 'block' }}>
                Password
              </label>
              <input type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required />
            </div>
            <button className="btn-primary" type="submit"
              disabled={loading} style={{ marginTop: '6px', padding: '12px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: 'var(--text2)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent2)', fontWeight: 600 }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
