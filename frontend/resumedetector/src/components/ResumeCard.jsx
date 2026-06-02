import { formatDate } from '../utils/formatDate'
import SkillBadge from './SkillBadge'

export default function ResumeCard({ resume, onDelete }) {
  const skills = resume.skillsJson ? JSON.parse(resume.skillsJson) : []

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>
            {resume.fileName}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px' }}>
            Uploaded: {formatDate(resume.uploadedAt)} &nbsp;|&nbsp;
            Type: <span style={{ fontFamily: 'var(--mono)' }}>{resume.fileType}</span>
          </div>
          <div>
            {skills.slice(0, 6).map(s => (
              <SkillBadge key={s} skill={s} matched={true} />
            ))}
            {skills.length > 6 && (
              <span style={{ fontSize: '11px', color: 'var(--text2)' }}>
                +{skills.length - 6} more
              </span>
            )}
          </div>
        </div>
        <button className="btn-danger" onClick={() => onDelete(resume.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}