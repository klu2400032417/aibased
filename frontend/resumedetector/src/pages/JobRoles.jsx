import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getAllJobsApi, createJobApi, deleteJobApi, searchJobsApi } from '../api/jobApi'
import { getResumesByUserApi } from '../api/resumeApi'
import { scoreResumeApi, getRankedCandidatesApi } from '../api/candidateApi'
import { formatDate } from '../utils/formatDate'

export default function JobRoles() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Apply modal state
  const [applyModal, setApplyModal] = useState(null) // job object
  const [userResumes, setUserResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState('')
  const [coverNote, setCoverNote] = useState('')
  const [applying, setApplying] = useState(false)

  // Applicants modal state
  const [applicantsModal, setApplicantsModal] = useState(null) // job object
  const [applicants, setApplicants] = useState([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)

  const [form, setForm] = useState({
    title: '', description: '', requiredSkills: '',
    experienceRequired: '', location: '', status: 'ACTIVE'
  })

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await getAllJobsApi()
      setJobs(res.data.data || [])
    } catch (e) { setError('Failed to load jobs') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchJobs() }, [])

  const handleSearch = async (e) => {
    const val = e.target.value
    setSearch(val)
    if (val.trim().length > 1) {
      const res = await searchJobsApi(val)
      setJobs(res.data.data || [])
    } else { fetchJobs() }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createJobApi(form, user?.id)
      setSuccess('Job role created!')
      setShowForm(false)
      setForm({ title: '', description: '', requiredSkills: '', experienceRequired: '', location: '', status: 'ACTIVE' })
      fetchJobs()
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) { setError('Failed to create job role') }
  }

  const handleDelete = async (job) => {
    if (!window.confirm('Delete this job role?')) return
    try {
      await deleteJobApi(job.id, user?.id, user?.role)
      setJobs(jobs.filter(j => j.id !== job.id))
    } catch (e) { setError('Delete failed') }
  }

  // Open apply modal — fetch user's resumes
  const openApplyModal = async (job) => {
    setApplyModal(job)
    setCoverNote('')
    setSelectedResume('')
    try {
      const res = await getResumesByUserApi(user?.id)
      setUserResumes(res.data.data || [])
    } catch (e) {
      setUserResumes([])
    }
  }

  const handleApply = async () => {
    if (!selectedResume) {
      setError('Please select a resume')
      return
    }
    setApplying(true)
    try {
      await scoreResumeApi(selectedResume, applyModal.id)
      setApplyModal(null)
      setSuccess('Applied successfully! Recruiter can now see your application.')
      setTimeout(() => setSuccess(''), 4000)
    } catch (e) {
      setError('Application failed. You may have already applied.')
    } finally {
      setApplying(false)
    }
  }

  // Open applicants modal — fetch ranked candidates for THIS job
  const openApplicantsModal = async (job) => {
    setApplicantsModal(job)
    setApplicants([])
    setLoadingApplicants(true)
    try {
      const res = await getRankedCandidatesApi(job.id)
      setApplicants(res.data.data || [])
    } catch (e) {
      setApplicants([])
    } finally {
      setLoadingApplicants(false)
    }
  }

  const scoreColor = (score) => {
    if (score >= 75) return 'var(--green)'
    if (score >= 50) return 'var(--amber)'
    return 'var(--red)'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Job Roles</h1>
        {(user?.role === 'ADMIN' || user?.role === 'RECRUITER') && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Job Role'}
          </button>
        )}
      </div>

      {error   && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {/* Create Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '1rem' }}>New Job Role</div>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Job Title *</label>
              <input placeholder="e.g. Java Backend Developer"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Description</label>
              <textarea rows={3} placeholder="Job description..."
                style={{ resize: 'vertical' }}
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>
                Required Skills * (comma-separated)
              </label>
              <input placeholder="Java, Spring Boot, MySQL, REST API"
                value={form.requiredSkills} onChange={e => setForm({ ...form, requiredSkills: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Experience (years)</label>
              <input type="number" min="0" placeholder="0"
                value={form.experienceRequired} onChange={e => setForm({ ...form, experienceRequired: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>Location</label>
              <input placeholder="e.g. Hyderabad / Remote"
                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Create Job Role</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <input placeholder="🔍  Search jobs by title..."
        value={search} onChange={handleSearch}
        style={{ marginBottom: '1.5rem', maxWidth: '360px' }} />

      {/* Jobs Table */}
      {loading ? <div className="loading">Loading jobs...</div> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Required Skills</th>
                <th>Exp</th>
                <th>Location</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text2)', padding: '2rem' }}>
                  No job roles found
                </td></tr>
              ) : jobs.map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600 }}>{job.title}</td>
                  <td style={{ maxWidth: '220px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {job.requiredSkills?.split(',').slice(0, 3).map(s => (
                        <span key={s} className="badge badge-purple">{s.trim()}</span>
                      ))}
                      {job.requiredSkills?.split(',').length > 3 && (
                        <span style={{ fontSize: '11px', color: 'var(--text2)' }}>
                          +{job.requiredSkills.split(',').length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>
                    {job.experienceRequired ?? 0}y
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text2)' }}>{job.location || '—'}</td>
                  <td>
                    <span className={`badge ${job.status === 'ACTIVE' ? 'badge-green' : 'badge-amber'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text2)' }}>{formatDate(job.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>

                      {/* CANDIDATE: Apply button */}
                      {user?.role === 'CANDIDATE' && (
                        <button
                          onClick={() => openApplyModal(job)}
                          style={{
                            background: 'var(--accent)', color: '#fff',
                            border: 'none', padding: '6px 14px',
                            borderRadius: '8px', fontSize: '12px',
                            cursor: 'pointer', fontWeight: 600
                          }}>
                          Apply
                        </button>
                      )}

                      {/* RECRUITER: View Applicants for their own jobs only */}
                      {user?.role === 'RECRUITER' && job.createdBy?.id === user?.id && (
                        <button
                          onClick={() => openApplicantsModal(job)}
                          style={{
                            background: 'var(--bg3)', color: 'var(--accent2)',
                            border: '1px solid var(--accent)', padding: '6px 12px',
                            borderRadius: '8px', fontSize: '12px',
                            cursor: 'pointer'
                          }}>
                          👥 Applicants
                        </button>
                      )}

                      {/* ADMIN: View Applicants for all jobs */}
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={() => openApplicantsModal(job)}
                          style={{
                            background: 'var(--bg3)', color: 'var(--accent2)',
                            border: '1px solid var(--accent)', padding: '6px 12px',
                            borderRadius: '8px', fontSize: '12px',
                            cursor: 'pointer'
                          }}>
                          👥 Applicants
                        </button>
                      )}

                      {/* Delete: ADMIN all, RECRUITER own only */}
                      {user?.role === 'ADMIN' && (
                        <button className="btn-danger" onClick={() => handleDelete(job)}>Delete</button>
                      )}
                      {user?.role === 'RECRUITER' && job.createdBy?.id === user?.id && (
                        <button className="btn-danger" onClick={() => handleDelete(job)}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── APPLY MODAL ───────────────────────────────────── */}
      {applyModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Apply for Job</div>
                <div style={{ fontSize: '13px', color: 'var(--accent2)', marginTop: '2px' }}>{applyModal.title}</div>
              </div>
              <button onClick={() => setApplyModal(null)}
                style={{ background: 'none', color: 'var(--text2)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Job details */}
            <div style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: '8px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '4px' }}>Required Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {applyModal.requiredSkills?.split(',').map(s => (
                  <span key={s} className="badge badge-purple">{s.trim()}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text2)' }}>📍 {applyModal.location || 'Remote'}</span>
                <span style={{ fontSize: '12px', color: 'var(--text2)' }}>💼 {applyModal.experienceRequired || 0}y exp</span>
              </div>
            </div>

            {/* Select Resume */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>
                Select Resume *
              </label>
              {userResumes.length === 0 ? (
                <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: '8px', fontSize: '13px', color: 'var(--red)' }}>
                  ⚠️ No resume found. Please upload your resume first from Upload Resume page.
                </div>
              ) : (
                <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)}>
                  <option value="">-- Select a resume --</option>
                  {userResumes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.fileName} — uploaded {formatDate(r.uploadedAt)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Cover Note */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '12px', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>
                Cover Note (optional)
              </label>
              <textarea
                rows={3}
                placeholder="Why are you a good fit for this role?"
                style={{ resize: 'vertical' }}
                value={coverNote}
                onChange={e => setCoverNote(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn-outline" onClick={() => setApplyModal(null)}>Cancel</button>
              <button
                className="btn-primary"
                onClick={handleApply}
                disabled={applying || userResumes.length === 0}
                style={{ opacity: applying ? 0.6 : 1 }}>
                {applying ? 'Submitting...' : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPLICANTS MODAL ──────────────────────────────── */}
      {applicantsModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '700px', maxWidth: '95vw', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Applicants</div>
                <div style={{ fontSize: '13px', color: 'var(--accent2)', marginTop: '2px' }}>{applicantsModal.title}</div>
              </div>
              <button onClick={() => setApplicantsModal(null)}
                style={{ background: 'none', color: 'var(--text2)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {loadingApplicants ? (
              <div className="loading">Loading applicants...</div>
            ) : applicants.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '2rem' }}>
                No applicants yet for this job role.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {applicants.map((c, idx) => {
                  let skillMatch = { matched: [], missing: [] }
                  try { skillMatch = JSON.parse(c.skillMatchJson) } catch (e) {}
                  return (
                    <div key={c.resumeId} style={{
                      padding: '12px 16px', background: 'var(--bg3)',
                      borderRadius: '10px', display: 'flex',
                      alignItems: 'center', gap: '16px'
                    }}>
                      {/* Rank */}
                      <div style={{
                        minWidth: '36px', height: '36px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '13px',
                        color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'var(--text2)',
                        border: `2px solid ${idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'var(--border)'}`
                      }}>#{c.rank}</div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>
                          {c.candidateName || 'Unknown'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                          {c.candidateEmail || '—'}
                        </div>
                        <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {skillMatch.matched?.map(s => (
                            <span key={s} style={{
                              fontSize: '10px', padding: '2px 8px', borderRadius: '10px',
                              background: '#14532d44', color: 'var(--green)', border: '1px solid #22c55e44'
                            }}>{s}</span>
                          ))}
                          {skillMatch.missing?.map(s => (
                            <span key={s} style={{
                              fontSize: '10px', padding: '2px 8px', borderRadius: '10px',
                              background: '#7f1d1d33', color: 'var(--red)', border: '1px solid #ef444444'
                            }}>{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Score */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '22px', fontWeight: 700,
                          fontFamily: 'var(--mono)',
                          color: scoreColor(c.fitScore)
                        }}>{c.fitScore?.toFixed(0)}%</div>
                        <div style={{ fontSize: '11px', color: 'var(--text2)' }}>fit score</div>
                        <div style={{ fontSize: '11px', color: 'var(--green)', marginTop: '2px' }}>
                          {skillMatch.matchedCount}/{skillMatch.totalRequired} skills
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}