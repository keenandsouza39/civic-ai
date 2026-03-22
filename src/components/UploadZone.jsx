// AGENT: FRONTEND — UploadZone Component
// Handles drag-and-drop and click-to-browse PDF upload

import { useState, useRef, useCallback } from 'react'

const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export default function UploadZone({ onFileSubmit }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const inputRef = useRef(null)

  const validateFile = useCallback((file) => {
    if (!file) return 'No file selected.'
    if (file.type !== 'application/pdf') return 'Only PDF files are supported.'
    if (file.size > MAX_SIZE_BYTES) return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`
    return null
  }, [])

  const handleFile = useCallback((file) => {
    const error = validateFile(file)
    if (error) {
      setFileError(error)
      setSelectedFile(null)
      return
    }
    setFileError('')
    setSelectedFile(file)
  }, [validateFile])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleSubmit = useCallback(() => {
    if (selectedFile) onFileSubmit(selectedFile)
  }, [selectedFile, onFileSubmit])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }, [])

  return (
    <section style={{ marginTop: '2.5rem' }}>
      {/* Section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: 'var(--amber)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>Step 1</span>
        <div style={{ height: 1, flex: 1, background: 'var(--rule)' }} />
      </div>

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        marginBottom: '1rem',
        color: 'var(--navy)',
      }}>
        Upload Your Document
      </h2>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload PDF — click or drag and drop"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        style={{
          border: `2px dashed ${dragActive ? 'var(--amber)' : selectedFile ? '#16a34a' : 'var(--rule)'}`,
          borderRadius: 4,
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragActive
            ? 'rgba(212, 132, 10, 0.06)'
            : selectedFile
              ? 'rgba(22, 163, 74, 0.04)'
              : 'rgba(200, 184, 154, 0.08)',
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleInputChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        {!selectedFile ? (
          <>
            {/* Upload icon */}
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              filter: dragActive ? 'none' : 'grayscale(0.3)',
              transition: 'filter 0.2s',
            }}>
              📄
            </div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--navy)',
              marginBottom: '0.4rem',
            }}>
              {dragActive ? 'Drop your PDF here' : 'Drag & drop your PDF'}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--muted)',
              marginBottom: '1.25rem',
            }}>
              or click to browse your files
            </p>
            <div style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--muted)',
              background: 'var(--paper-dark)',
              padding: '4px 12px',
              borderRadius: 2,
              border: '1px solid var(--rule)',
            }}>
              PDF only · Max {MAX_SIZE_MB}MB
            </div>
          </>
        ) : (
          /* File selected state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '2rem' }}>✅</div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#15803d',
            }}>
              File ready
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--muted)',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {selectedFile.name}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click to choose a different file
            </p>
          </div>
        )}
      </div>

      {/* File error */}
      {fileError && (
        <p style={{
          marginTop: '0.75rem',
          color: 'var(--red)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          ⚠️ {fileError}
        </p>
      )}

      {/* Accepted formats note */}
      <p style={{
        marginTop: '0.75rem',
        fontSize: '0.8rem',
        color: 'var(--muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        Accepts: voter guides, ballot propositions, candidate platforms, policy documents
      </p>

      {/* Submit button */}
      {selectedFile && !fileError && (
        <div style={{ marginTop: '1.75rem' }}>
          <button
            onClick={handleSubmit}
            style={{
              background: 'var(--navy)',
              color: 'var(--paper)',
              border: 'none',
              padding: '0.875rem 2.5rem',
              fontSize: '1rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              letterSpacing: '0.02em',
              cursor: 'pointer',
              borderRadius: 2,
              transition: 'background 0.2s, transform 0.1s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
            onMouseEnter={e => e.target.style.background = 'var(--navy-mid)'}
            onMouseLeave={e => e.target.style.background = 'var(--navy)'}
          >
            <span>⚡</span>
            Analyze Document
          </button>
        </div>
      )}
    </section>
  )
}
