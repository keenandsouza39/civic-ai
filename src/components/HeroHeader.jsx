// AGENT: FRONTEND — HeroHeader Component

export default function HeroHeader() {
  return (
    <header style={{
      background: 'var(--navy)',
      color: 'var(--paper)',
      padding: '0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top rule strip */}
      <div style={{
        height: 6,
        background: 'linear-gradient(90deg, var(--amber) 0%, var(--amber-light) 50%, var(--amber) 100%)',
      }} />

      <div style={{
        maxWidth: 860,
        margin: '0 auto',
        padding: '2.5rem 1.5rem 2rem',
        position: 'relative',
      }}>
        {/* Masthead row */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '1rem',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            background: 'var(--amber)',
            color: 'var(--navy)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '2px 8px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Nonpartisan · Free · No Account Needed
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
          color: '#ffffff',
        }}>
          Civic AI
        </h1>

        {/* Rule */}
        <div style={{
          height: 2,
          background: 'var(--amber)',
          width: 80,
          marginBottom: '1rem',
        }} />

        {/* Tagline */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: 300,
          color: 'rgba(245, 240, 232, 0.85)',
          maxWidth: 520,
          lineHeight: 1.5,
          marginBottom: '1.5rem',
        }}>
          Upload any voter guide or ballot proposition PDF. Get plain-language
          summaries, policy impact analysis, and nonpartisan alignment context
          — instantly.
        </p>

        {/* Trust signals */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          {[
            ['⚖️', 'Nonpartisan Analysis'],
            ['🔒', 'Files Never Stored'],
            ['🗳️', 'Any Ballot Document'],
          ].map(([icon, label]) => (
            <div key={label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'rgba(245, 240, 232, 0.7)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
            }}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom border rule */}
      <div style={{
        height: 1,
        background: 'rgba(200, 184, 154, 0.3)',
      }} />
    </header>
  )
}
