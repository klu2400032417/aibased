import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getAllCandidatesApi } from '../api/candidateApi'
import { getAllJobsApi } from '../api/jobApi'
import { getResumesByUserApi } from '../api/resumeApi'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ candidates: 0, jobs: 0, resumes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cRes, jRes] = await Promise.all([
          getAllCandidatesApi(),
          getAllJobsApi()
        ])
        setStats({
          candidates: cRes.data.data?.length || 0,
          jobs: jRes.data.data?.length || 0,
          resumes: 0
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Candidates', value: stats.candidates, color: 'var(--accent2)', icon: '👥' },
    { label: 'Active Job Roles', value: stats.jobs,       color: 'var(--green)',   icon: '💼' },
    { label: 'Resumes Parsed',   value: stats.resumes,    color: 'var(--amber)',   icon: '📄' },
  ]

  const quickLinks = [
    { to: '/upload',      label: 'Upload Resume',    desc: 'Parse a new resume with AI', color: 'var(--accent)' },
    { to: '/jobs',        label: 'Manage Jobs',      desc: 'Create and view job roles',  color: 'var(--green)' },
    { to: '/leaderboard', label: 'View Leaderboard', desc: 'See ranked candidates',       color: 'var(--amber)' },
  ]

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>
          Welcome back, {user?.name} 👋
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '4px' }}>
          Here's your AI Resume Detector overview
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((card) => (
          <div key={card.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{card.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: card.color, fontFamily: 'var(--mono)' }}>
              {loading ? '—' : card.value}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '1rem', color: 'var(--text2)' }}>
        Quick Actions
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              cursor: 'pointer', transition: 'border-color 0.2s',
              borderLeft: `3px solid ${link.color}`
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = link.color}
            >
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                {link.label}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{link.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Role info */}
      <div className="card" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '11px',
          background: '#4c1d9544', color: 'var(--accent2)',
          padding: '4px 12px', borderRadius: '20px', border: '1px solid #a78bfa44'
        }}>{user?.role}</span>
        <span style={{ fontSize: '13px', color: 'var(--text2)' }}>
          {user?.role === 'CANDIDATE' && 'Upload your resume and check your job-fit score'}
          {user?.role === 'RECRUITER' && 'Post job roles and view ranked candidates'}
          {user?.role === 'ADMIN' && 'Full access to all features and management tools'}
        </span>
      </div>
    </div>
  )
}
