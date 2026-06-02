import { useState, useEffect } from 'react'
import { getAllJobsApi } from '../api/jobApi'
import { getRankedCandidatesApi, scoreAllResumesApi } from '../api/candidateApi'
import ScoreGauge from '../components/ScoreGauge'
import SkillBadge from '../components/SkillBadge'

export default function Leaderboard() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState('')
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [scoring, setScoring] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    getAllJobsApi().then(res => setJobs(res.data.data || []))
  }, [])

  const fetchRanking = async (jobId) => {
    if (!jobId) return
    setLoading(true)
    setError('')
    try {
      const res = await getRankedCandidatesApi(jobId)
      setCandidates(res.data.data || [])
    } catch (e) { setError('Failed to load rankings') }
    finally { setLoading(false) }
  }

  const handleJobChange = (e) => {
    setSelectedJob(e.target.value)
    setCandidates([])
    fetchRanking(e.target.value)
  }

  const handleScoreAll = async () => {
    if (!selectedJob) return
    setScoring(true)
    setError('')
    try {
      await scoreAllResumesApi(selectedJob)
      setSuccess('All resumes scored!')
      setTimeout(() => setSuccess(''), 3000)
      fetchRanking(selectedJob)
    } catch (e) { setError('Scoring failed') }
    finally { setScoring(false) }
  }

  const parseSkillMatch = (json) => {
    try { return JSON.parse(json) }
    catch { return { matched: [], missing: [] } }
  }

  const medalColor = (rank) => {
    if (rank === 1) return '#FFD700'
    if (rank === 2) return '#C0C0C0'
    if (rank === 3) return '#CD7F32'
    return 'var(--text2)'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="page-title">Candidate Leaderboard</h1>

      {error   && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {/* Controls */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px', fontFamily: 'var(--mono)' }}>
            SELECT JOB ROLE
          </label>
          <select value={selectedJob} onChange={handleJobChange}>
            <option value="">-- Choose a job role --</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-outline"
            onClick={() => fetchRanking(selectedJob)}
            disabled={!selectedJob || loading}>
            🔄 Refresh
          </button>
          <button className="btn-primary"
            onClick={handleScoreAll}
            disabled={!selectedJob || scoring}>
            {scoring ? 'Scoring...' : '⚡ Score All Resumes'}
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="loading">Loading rankings...</div>
      ) : candidates.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>
          {selectedJob
            ? 'No scored candidates yet. Click "Score All Resumes" to start.'
            : 'Select a job role to view the leaderboard.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {candidates.map((c) => {
            const skillMatch = parseSkillMatch(c.skillMatchJson)
            const isExpanded = expanded === c.resumeId

            return (
              <div key={c.resumeId} className="card"
                style={{ padding: '1rem 1.25rem', cursor: 'pointer',
                  borderLeft: `3px solid ${medalColor(c.rank)}`,
                  transition: 'border-color 0.2s' }}
                onClick={() => setExpanded(isExpanded ? null : c.resumeId)}>

                {/* Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Rank */}
                  <div style={{
                    minWidth: '36px', height: '36px',
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--mono)', fontWeight: 700,
                    fontSize: '14px', color: medalColor(c.rank),
                    border: `2px solid ${medalColor(c.rank)}`,
                    background: 'var(--bg3)'
                  }}>#{c.rank}</div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>
                      {c.candidateName || 'Unknown Candidate'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                      {c.candidateEmail || '—'}
                    </div>
                  </div>

                  {/* Skills matched */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)' }}>
                      {skillMatch.matchedCount || 0}/{skillMatch.totalRequired || 0}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>skills matched</div>
                  </div>

                  {/* Score Gauge */}
                  <ScoreGauge score={c.fitScore} />

                  {/* Expand arrow */}
                  <div style={{ color: 'var(--text2)', fontSize: '12px' }}>
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>

                {/* Expanded: skill details */}
                {isExpanded && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '8px', fontFamily: 'var(--mono)' }}>
                          ✅ MATCHED SKILLS
                        </div>
                        <div>
                          {skillMatch.matched?.length > 0
                            ? skillMatch.matched.map(s => <SkillBadge key={s} skill={s} matched={true} />)
                            : <span style={{ fontSize: '12px', color: 'var(--text2)' }}>None</span>}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '8px', fontFamily: 'var(--mono)' }}>
                          ❌ MISSING SKILLS
                        </div>
                        <div>
                          {skillMatch.missing?.length > 0
                            ? skillMatch.missing.map(s => <SkillBadge key={s} skill={s} matched={false} />)
                            : <span style={{ fontSize: '12px', color: 'var(--green)' }}>All skills matched! 🎉</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
