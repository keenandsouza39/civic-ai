// AGENT: FRONTEND
// Civic AI Platform — Main App Component

import { useState, useCallback } from 'react'
import HeroHeader from './components/HeroHeader'
import UploadZone from './components/UploadZone'
import LoadingState from './components/LoadingState'
import AnalysisResults from './components/AnalysisResults'
import Footer from './components/Footer'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

// App state machine: idle → uploading → analyzing → done | error
export default function App() {
  const [phase, setPhase] = useState('idle') // 'idle' | 'uploading' | 'analyzing' | 'done' | 'error'
  const [analysis, setAnalysis] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFileSubmit = useCallback(async (file) => {
    setPhase('uploading')
    setErrorMsg('')
    setFileName(file.name)

    const formData = new FormData()
    formData.append('file', file)

    try {
      setPhase('analyzing')

      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Server error (${response.status})`)
      }

      setAnalysis(data.analysis)
      setPhase('done')
    } catch (err) {
      console.error('Analysis failed:', err)
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
      setPhase('error')
    }
  }, [])

  const handleReset = useCallback(() => {
    setPhase('idle')
    setAnalysis(null)
    setErrorMsg('')
    setFileName('')
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeroHeader />

      <main style={{ flex: 1, maxWidth: 860, margin: '0 auto', width: '100%', padding: '0 1.5rem 4rem' }}>
        {(phase === 'idle' || phase === 'error') && (
          <>
            <UploadZone onFileSubmit={handleFileSubmit} />
            {phase === 'error' && (
              <ErrorBanner message={errorMsg} onDismiss={handleReset} />
            )}
          </>
        )}

        {(phase === 'uploading' || phase === 'analyzing') && (
          <LoadingState phase={phase} fileName={fileName} />
        )}

        {phase === 'done' && analysis && (
          <AnalysisResults analysis={analysis} fileName={fileName} onReset={handleReset} />
        )}
      </main>

      <Footer />
    </div>
  )
}

function ErrorBanner({ message, onDismiss }) {
  return (
    <div style={{
      marginTop: '1.5rem',
      padding: '1rem 1.25rem',
      background: '#fef2f2',
      border: '1px solid #fca5a5',
      borderLeft: '4px solid var(--red)',
      borderRadius: 'var(--radius)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '1rem',
    }}>
      <div>
        <p style={{ fontWeight: 600, color: '#991b1b', marginBottom: 4, fontFamily: 'var(--font-display)' }}>
          Analysis Failed
        </p>
        <p style={{ fontSize: '0.9rem', color: '#7f1d1d' }}>{message}</p>
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#991b1b',
          fontWeight: 600,
          fontSize: '0.85rem',
          padding: '2px 8px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        Try Again
      </button>
    </div>
  )
}
