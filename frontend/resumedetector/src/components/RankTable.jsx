import ScoreGauge from './ScoreGauge'
import SkillBadge from './SkillBadge'

export default function RankTable({ candidates }) {
  if (!candidates || candidates.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '2rem' }}>
        No candidates ranked yet
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Candidate</th>
            <th>Email</th>
            <th>Fit Score</th>
            <th>Matched Skills</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => {
            const skillMatch = c.skillMatchJson
              ? JSON.parse(c.skillMatchJson) : { matched: [], missing: [] }
            return (
              <tr key={c.resumeId}>
                <td style={{
                  fontFamily: 'var(--mono)', fontWeight: 700,
                  color: c.rank === 1 ? '#FFD700'
                       : c.rank === 2 ? '#C0C0C0'
                       : c.rank === 3 ? '#CD7F32'
                       : 'var(--text2)'
                }}>#{c.rank}</td>
                <td style={{ fontWeight: 600 }}>{c.candidateName || '—'}</td>
                <td style={{ fontSize: '13px', color: 'var(--text2)' }}>
                  {c.candidateEmail || '—'}
                </td>
                <td><ScoreGauge score={c.fitScore} /></td>
                <td>
                  {skillMatch.matched?.slice(0, 3).map(s => (
                    <SkillBadge key={s} skill={s} matched={true} />
                  ))}
                  {skillMatch.matched?.length > 3 && (
                    <span style={{ fontSize: '11px', color: 'var(--text2)' }}>
                      +{skillMatch.matched.length - 3} more
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}