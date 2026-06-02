import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { uploadResumeApi } from '../api/resumeApi'
import { getAllJobsApi } from '../api/jobApi'
import SkillBadge from '../components/SkillBadge'

export default function UploadResume() {
  const { user } = useAuth()

  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [suggestedJobs, setSuggestedJobs] = useState([])

  const handleFile = (f) => {
    if (!f) return

    if (
      ![
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(f.type)
    ) {
      setError('Only PDF and DOCX files are allowed')
      return
    }

    setFile(f)
    setError('')
    setResult(null)
    setSuggestedJobs([])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!file) return setError('Please select a file first')

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = storedUser?.id

    console.log('storedUser:', storedUser)
    console.log('userId:', userId)

    if (!userId) {
      setError('Session expired — please logout and login again')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await uploadResumeApi(file, userId)

      console.log('Full response:', res)
      console.log('Response data:', res.data)
      console.log('Result:', res.data.data)

      setResult(res.data.data)

      // fetch all jobs and show matches
      const jobRes = await getAllJobsApi()
      const allJobs = jobRes.data.data || []

      // find jobs where resume skills match required skills
      const skills = JSON.parse(res.data.data.skillsJson || '[]')

      const matched = allJobs.map(job => {
  const required = job.requiredSkills
    ?.split(',')
    .map(s => s.trim().toLowerCase()) || []

  // exact same logic as backend getSkillMatchJson
  const matchedSkills = required.filter(req =>
    skills.some(s => s.trim().toLowerCase() === req)  // exact match only
  )

  const matchPct = required.length > 0
    ? Math.round((matchedSkills.length / required.length) * 100)
    : 0

  return { ...job, matchCount: matchedSkills.length, matchPct }
}).filter(j => j.matchCount > 0)
  .sort((a, b) => b.matchPct - a.matchPct)

      setSuggestedJobs(matched)

      setFile(null)

    } catch (e) {
      console.error('Upload error:', e.response)

      setError(
        e.response?.data?.message ||
        `Upload failed: ${e.response?.status} ${e.response?.statusText}`
      )
    } finally {
      setLoading(false)
    }
  }

  const skills = result?.skillsJson
    ? JSON.parse(result.skillsJson)
    : []

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="page-title">Upload Resume</h1>

      {error && <div className="error-msg">{error}</div>}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
        style={{
          border: `2px dashed ${
            dragging
              ? 'var(--accent)'
              : file
              ? 'var(--green)'
              : 'var(--border)'
          }`,
          borderRadius: 'var(--radius)',
          padding: '3rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging
            ? '#6c63ff11'
            : file
            ? '#22c55e11'
            : 'var(--bg2)',
          transition: 'all 0.2s',
          marginBottom: '1.5rem'
        }}
      >
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.docx"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <div style={{ fontSize: '40px', marginBottom: '12px' }}>
          {file ? '✅' : '📄'}
        </div>

        {file ? (
          <>
            <div style={{ fontWeight: 600, color: 'var(--green)' }}>
              {file.name}
            </div>

            <div
              style={{
                fontSize: '13px',
                color: 'var(--text2)',
                marginTop: '4px'
              }}
            >
              {(file.size / 1024).toFixed(1)} KB — click to change
            </div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>
              Drag & drop your resume here
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
              PDF and DOCX supported
            </div>
          </>
        )}
      </div>

      <button
        className="btn-primary"
        onClick={handleUpload}
        disabled={!file || loading}
        style={{
          padding: '12px 28px',
          opacity: (!file || loading) ? 0.6 : 1
        }}
      >
        {loading ? 'Parsing with AI...' : 'Upload & Analyse'}
      </button>

      {result && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '1rem',
              color: 'var(--green)'
            }}
          >
            ✅ Resume parsed successfully!
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1rem'
            }}
          >
            {[
              {
                label: 'Candidate Name',
                value: result.candidateName || '—'
              },
              {
                label: 'Email',
                value: result.candidateEmail || '—'
              },
              {
                label: 'File Type',
                value: result.fileType || '—'
              },
              {
                label: 'Experience',
                value:
                  result.yearsOfExperience != null
                    ? `${result.yearsOfExperience} years`
                    : '—'
              }
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: 'var(--bg3)',
                  padding: '12px',
                  borderRadius: '8px'
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text2)',
                    marginBottom: '4px',
                    fontFamily: 'var(--mono)'
                  }}
                >
                  {label}
                </div>

                <div style={{ fontSize: '14px', fontWeight: 500 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text2)',
                marginBottom: '8px',
                fontFamily: 'var(--mono)'
              }}
            >
              EXTRACTED SKILLS ({skills.length})
            </div>

            <div>
              {skills.length > 0 ? (
                skills.map(s => (
                  <SkillBadge
                    key={s}
                    skill={s}
                    matched={true}
                  />
                ))
              ) : (
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--text2)'
                  }}
                >
                  No skills detected
                </span>
              )}
            </div>
          </div>

          {suggestedJobs.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--text2)',
                  marginBottom: '8px',
                  fontFamily: 'var(--mono)'
                }}
              >
                SUGGESTED JOB MATCHES
              </div>

              {suggestedJobs.map(job => (
                <div
                  key={job.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: 'var(--bg3)',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '14px'
                      }}
                    >
                      {job.title}
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text2)'
                      }}
                    >
                      {job.location}
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '13px',
                      color:
                        job.matchPct >= 75
                          ? 'var(--green)'
                          : 'var(--amber)',
                      fontWeight: 700
                    }}
                  >
                    {job.matchPct}% match
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}