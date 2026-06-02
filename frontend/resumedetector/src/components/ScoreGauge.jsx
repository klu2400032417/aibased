import { scoreColor } from '../utils/scoreColor'

export default function ScoreGauge({ score }) {
  const color = scoreColor(score)
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={radius} fill="none"
          stroke="var(--bg3)" strokeWidth="6" />
        <circle cx="35" cy="35" r={radius} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 35 35)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        <text x="35" y="40" textAnchor="middle"
          fontSize="13" fontWeight="700"
          fontFamily="var(--mono)" fill={color}>
          {score?.toFixed(0)}
        </text>
      </svg>
      <span style={{ fontSize: '11px', color: 'var(--text2)' }}>fit score</span>
    </div>
  )
}
