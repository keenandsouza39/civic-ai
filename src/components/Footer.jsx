// AGENT: FRONTEND — Footer Component

export default function Footer() {
  return (
    <footer style={{
      borderTop: '2px solid var(--rule)',
      background: 'var(--paper-dark)',
      padding: '1.5rem',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 860,
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--navy)',
        }}>
          Civic AI
        </div>

        <p style={{
          fontSize: '0.78rem',
          color: 'var(--muted)',
          fontFamily: 'var(--font-mono)',
          textAlign: 'center',
          flex: 1,
          minWidth: 200,
        }}>
          Nonpartisan · AI-powered · No account required · Files processed in memory, never stored
        </p>

        <p style={{
          fontSize: '0.75rem',
          color: 'var(--muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          Powered by Anthropic Claude
        </p>
      </div>
    </footer>
  )
}
