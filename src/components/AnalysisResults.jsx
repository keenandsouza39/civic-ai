// AGENT: FRONTEND — AnalysisResults Component
// Displays AI analysis in a tabbed interface

import { useState } from 'react'
import AlignmentChart from './AlignmentChart'

const TABS = [
  { id: 'summary', label: 'Summary', icon: '📋' },
  { id: 'simplified', label: 'Simplified', icon: '💡' },
  { id: 'impacts', label: 'Policy Impacts', icon: '⚖️' },
  { id: 'alignment', label: 'Alignment', icon: '🗳️' },
]

const DIRECTION_CONFIG = {
  positive: { color: '#16a34a', bg: 'rgba(22, 163, 74, 0.08)', label: '↑ Positive', border: '#86efac' },
  negative: { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.08)', label: '↓ Negative', border: '#fca5a5' },
  neutral: { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.08)', label: '→ Neutral', border: '#d1d5db' },
  mixed: { color: '#d97706', bg: 'rgba(217, 119, 6, 0.08)', label: '↕ Mixed', border: '#fcd34d' },
}

const DOC_TYPE_LABELS = {
  ballot_proposition: 'Ballot Proposition',
  voter_guide: 'Voter Guide',
  policy_document: 'Policy Document',
  candidate_guide: 'Candidate Guide',
  other: 'Civic Document',
}

export default function AnalysisResults({ analysis, fileName, onReset }) {
  const [activeTab, setActiveTab] = useState('summary')

  return (
    <div style={{ marginTop: '2.5rem' }}>
      {/* Results header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '0.5rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#16a34a',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'rgba(22, 163, 74, 0.1)',
              padding: '2px 8px',
              borderRadius: 2,
              border: '1px solid rgba(22, 163, 74, 0.3)',
            }}>
              ✓ Analysis Complete
            </span>
            {analysis.documentType && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--muted)',
                background: 'var(--paper-dark)',
                padding: '2px 8px',
                borderRadius: 2,
                border: '1px solid var(--rule)',
              }}>
                {DOC_TYPE_LABELS[analysis.documentType] || analysis.documentType}
              </span>
            )}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            color: 'var(--navy)',
            fontWeight: 900,
            lineHeight: 1.2,
          }}>
            {analysis.title}
          </h2>
          {fileName && (
            <p style={{
              marginTop: '0.35rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--muted)',
            }}>
              {fileName}
            </p>
          )}
        </div>

        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: '1px solid var(--rule)',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--muted)',
            cursor: 'pointer',
            borderRadius: 2,
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--navy)'; e.target.style.color = 'var(--navy)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--rule)'; e.target.style.color = 'var(--muted)' }}
        >
          ← Analyze Another
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 2, background: 'var(--amber)', width: 60, marginBottom: '1.75rem' }} />

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 0,
        borderBottom: '2px solid var(--rule)',
        marginBottom: '1.75rem',
        overflowX: 'auto',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--navy)' : '2px solid transparent',
              marginBottom: '-2px',
              padding: '0.6rem 1.25rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? 'var(--navy)' : 'var(--muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'summary' && (
        <SummaryTab summary={analysis.summary} />
      )}
      {activeTab === 'simplified' && (
        <SimplifiedTab simplified={analysis.simplified} />
      )}
      {activeTab === 'impacts' && (
        <ImpactsTab impacts={analysis.impacts} />
      )}
      {activeTab === 'alignment' && (
        <AlignmentTab alignment={analysis.alignment} />
      )}

      {/* Disclaimer */}
      <div style={{
        marginTop: '2.5rem',
        padding: '1rem',
        background: 'var(--paper-dark)',
        borderRadius: 2,
        border: '1px solid var(--rule)',
        fontSize: '0.78rem',
        color: 'var(--muted)',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1.6,
      }}>
        <strong style={{ fontFamily: 'var(--font-body)' }}>Nonpartisan Disclaimer:</strong>{' '}
        This analysis is generated by AI for educational purposes. Political alignment indicators
        are based on documented party platform positions, not endorsements. Always verify
        information with official government and campaign sources before voting.
      </div>
    </div>
  )
}

function SummaryTab({ summary }) {
  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.15rem',
        lineHeight: 1.8,
        color: 'var(--ink)',
        fontStyle: 'italic',
        borderLeft: '3px solid var(--amber)',
        paddingLeft: '1.25rem',
      }}>
        {summary}
      </p>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

function SimplifiedTab({ simplified }) {
  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      <div style={{
        background: 'rgba(14, 31, 61, 0.04)',
        border: '1px solid rgba(14, 31, 61, 0.12)',
        borderRadius: 4,
        padding: '1.5rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          💡 Plain Language Explanation
        </div>
        <p style={{
          fontSize: '1.05rem',
          lineHeight: 1.8,
          color: 'var(--ink)',
        }}>
          {simplified}
        </p>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

function ImpactsTab({ impacts }) {
  if (!impacts || impacts.length === 0) {
    return <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No impact data available.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', animation: 'fadeIn 0.25s ease' }}>
      {impacts.map((impact, i) => {
        const config = DIRECTION_CONFIG[impact.direction] || DIRECTION_CONFIG.neutral
        return (
          <div key={i} style={{
            padding: '1rem 1.25rem',
            background: config.bg,
            border: `1px solid ${config.border}`,
            borderRadius: 2,
            borderLeft: `3px solid ${config.color}`,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '0.4rem',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--navy)',
              }}>
                {impact.area}
              </h3>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: config.color,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                padding: '2px 8px',
                background: 'rgba(255,255,255,0.6)',
                borderRadius: 2,
                border: `1px solid ${config.border}`,
              }}>
                {config.label}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink)' }}>
              {impact.description}
            </p>
          </div>
        )
      })}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

function AlignmentTab({ alignment }) {
  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      <p style={{
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
        color: 'var(--muted)',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1.6,
      }}>
        Scores indicate policy alignment based on documented party platform positions (0 = low alignment, 100 = high alignment).
        This is informational only — not an endorsement.
      </p>
      <AlignmentChart alignment={alignment} />
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
