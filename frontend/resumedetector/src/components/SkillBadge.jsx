export default function SkillBadge({ skill, matched }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontFamily: 'var(--mono)',
      margin: '3px',
      background: matched ? '#14532d44' : '#7f1d1d33',
      color: matched ? 'var(--green)' : 'var(--red)',
      border: `1px solid ${matched ? '#22c55e44' : '#ef444444'}`
    }}>{skill}</span>
  )
}
