// AGENT: FRONTEND — LoadingState Component

import { useEffect, useState } from 'react'

const STEPS = [
  { label: 'Uploading document…', icon: '📤' },
  { label: 'Extracting text from PDF…', icon: '🔍' },
  { label: 'Analyzing policy content…', icon: '⚖️' },
  { label: 'Generating plain-language summary…', icon: '📝' },
  { label: 'Assessing political alignment…', icon: '🗳️' },
]

export default function LoadingState({ phase, fileName }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [dots, setDots] = useState('.')

  useEffect(() => {
    if (phase !== 'analyzing') return
    const interval = setInterval(() => {
      setStepIndex(i => (i < STEPS.length - 1 ? i + 1 : i))
    }, 2200)
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '.' : d + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      marginTop: '3rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '3rem 1rem',
    }}>
      {/* Animated icon */}
      <div style={{
        fontSize: '3rem',
        marginBottom: '1.5rem',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>
        {STEPS[stepIndex].icon}
      </div>

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        color: 'var(--navy)',
        marginBottom: '0.5rem',
      }}>
        Analyzing Your Document{dots}
      </h2>

      {fileName && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--muted)',
          marginBottom: '2rem',
          padding: '4px 12px',
          background: 'var(--paper-dark)',
          borderRadius: 2,
          border: '1px solid var(--rule)',
        }}>
          {fileName}
        </p>
      )}

      {/* Step indicators */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        width: '100%',
        maxWidth: 380,
        marginBottom: '2rem',
      }}>
        {STEPS.map((step, i) => (
          <div key={step.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 1rem',
            borderRadius: 2,
            background: i <= stepIndex ? 'rgba(14, 31, 61, 0.06)' : 'transparent',
            border: `1px solid ${i <= stepIndex ? 'rgba(14, 31, 61, 0.15)' : 'transparent'}`,
            transition: 'all 0.4s ease',
            opacity: i <= stepIndex ? 1 : 0.35,
          }}>
            <span style={{ fontSize: '1rem' }}>
              {i < stepIndex ? '✓' : i === stepIndex ? '⋯' : '○'}
            </span>
            <span style={{
              fontSize: '0.875rem',
              fontFamily: 'var(--font-body)',
              color: i <= stepIndex ? 'var(--navy)' : 'var(--muted)',
              fontWeight: i === stepIndex ? 600 : 400,
            }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <p style={{
        fontSize: '0.8rem',
        color: 'var(--muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        This typically takes 15–30 seconds
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
      `}</style>
    </div>
  )
}
