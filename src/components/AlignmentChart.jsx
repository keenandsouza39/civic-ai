// AGENT: FRONTEND — AlignmentChart Component
// Visual representation of political alignment scores

import { useEffect, useState } from 'react'

const PARTIES = [
  {
    key: 'democratic',
    label: 'Democratic Platform',
    color: '#1a56db',
    bg: 'rgba(26, 86, 219, 0.08)',
    border: 'rgba(26, 86, 219, 0.2)',
    icon: '🔵',
  },
  {
    key: 'republican',
    label: 'Republican Platform',
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.08)',
    border: 'rgba(220, 38, 38, 0.2)',
    icon: '🔴',
  },
  {
    key: 'independent',
    label: 'Centrist / Independent',
    color: '#7c3aed',
    bg: 'rgba(124, 58, 237, 0.08)',
    border: 'rgba(124, 58, 237, 0.2)',
    icon: '🟣',
  },
]

export default function AlignmentChart({ alignment }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {PARTIES.map(party => {
        const data = alignment?.[party.key]
        const score = data?.score ?? 50
        const reasoning = data?.reasoning || ''

        return (
          <div key={party.key} style={{
            padding: '1.25rem',
            background: party.bg,
            border: `1px solid ${party.border}`,
            borderRadius: 4,
          }}>
            {/* Header row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.875rem',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span>{party.icon}</span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--navy)',
                }}>
                  {party.label}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                fontSize: '1.2rem',
                color: party.color,
              }}>
                {score}
                <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--muted)' }}>/100</span>
              </span>
            </div>

            {/* Progress bar */}
            <div style={{
              height: 8,
              background: 'rgba(0,0,0,0.08)',
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: '0.875rem',
            }}>
              <div style={{
                height: '100%',
                width: animated ? `${score}%` : '0%',
                background: `linear-gradient(90deg, ${party.color}88, ${party.color})`,
                borderRadius: 4,
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>

            {/* Alignment label */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>Low alignment</span>
              <AlignmentLabel score={score} color={party.color} />
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>High alignment</span>
            </div>

            {/* Reasoning */}
            {reasoning && (
              <p style={{
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: 'var(--ink)',
                borderTop: `1px solid ${party.border}`,
                paddingTop: '0.75rem',
              }}>
                {reasoning}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function AlignmentLabel({ score, color }) {
  let label
  if (score >= 75) label = 'Strong Alignment'
  else if (score >= 55) label = 'Moderate Alignment'
  else if (score >= 45) label = 'Neutral / Mixed'
  else if (score >= 25) label = 'Low Alignment'
  else label = 'Divergent'

  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.7rem',
      fontWeight: 600,
      color,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      {label}
    </span>
  )
}
