import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerApi } from '../api/authApi'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' })
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
      const res = await registerApi(form)
      const { token, name, role, id } = res.data.data
      login(token, { id, name, role })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
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
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '13px',
            color: 'var(--accent2)', marginBottom: '8px',
            letterSpacing: '2px', textTransform: 'uppercase'
          }}>AI Resume Detector</div>
          <h1 style={{ fontSize: '26px', fontWeight: 700 }}>Create account</h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '4px' }}>
            Join and get your resume scored
          </p>
        </div>

        <div className="card">
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px', display: 'block' }}>Full Name</label>
              <input name="name" placeholder="Your full name"
                value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px', display: 'block' }}>Email</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px', display: 'block' }}>Password</label>
              <input type="password" name="password" placeholder="Min 6 characters"
                value={form.password} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px', display: 'block' }}>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="CANDIDATE">Candidate</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>
            <button className="btn-primary" type="submit"
              disabled={loading} style={{ marginTop: '6px', padding: '12px' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: 'var(--text2)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent2)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
