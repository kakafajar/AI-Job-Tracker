import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { StepProgress } from '../components/StepProgress'
import { jobService } from '../services/jobService'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc']
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
]

export function UploadCvPage() {
  const { cvFile, setCvFile, preferences, updateExtractedProfile, setActiveView } = useApp()

  const [isDragging, setIsDragging] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef(null)

  // Validate file type and size
  const validateFile = (file) => {
    if (!file) {
      return 'Silakan pilih file CV Anda.'
    }

    const fileName = file.name.toLowerCase()
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext))
    const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type) || file.type === ''

    if (!hasValidExtension && !hasValidMime) {
      return 'Format file tidak didukung. Mohon gunakan format PDF atau DOCX.'
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      return `Ukuran file (${sizeMb} MB) melebihi batas maksimal 5 MB.`
    }

    return null
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const error = validateFile(file)
    if (error) {
      setErrorMessage(error)
      setCvFile(null)
      return
    }

    setErrorMessage('')
    setCvFile({
      name: file.name,
      size: file.size,
      type: file.type || 'application/pdf',
      rawFile: file,
      uploadedAt: new Date().toISOString()
    })
  }

  // Handle Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    const error = validateFile(file)
    if (error) {
      setErrorMessage(error)
      setCvFile(null)
      return
    }

    setErrorMessage('')
    setCvFile({
      name: file.name,
      size: file.size,
      type: file.type || 'application/pdf',
      rawFile: file,
      uploadedAt: new Date().toISOString()
    })
  }

  // Use demo CV for quick testing
  const handleUseDemoCv = () => {
    setErrorMessage('')
    setCvFile({
      name: 'Resume_Frontend_Developer_Demo.pdf',
      size: 1420000,
      type: 'application/pdf',
      rawFile: null,
      uploadedAt: new Date().toISOString()
    })
  }

  // Trigger simulated analysis
  const handleAnalyzeCv = async () => {
    if (!cvFile) {
      setErrorMessage('Silakan pilih atau unggah file CV terlebih dahulu.')
      return
    }

    setIsAnalyzing(true)
    setErrorMessage('')

    try {
      // Runs simulated analysis without calling external endpoints
      const parsedResult = await jobService.analyzeCv(cvFile, preferences)
      updateExtractedProfile(parsedResult)
      setActiveView('review')
    } catch {
      setErrorMessage('Terjadi kendala saat menganalisis CV demo. Silakan coba lagi.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div style={{ width: '100%' }}>
      <StepProgress />

      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Unggah CV</h1>
          <p className="card-subtitle">
            Format PDF atau DOCX dengan ukuran maksimal 5 MB.
          </p>
        </div>

        {errorMessage && (
          <div className="info-banner info-banner-danger" role="alert">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Upload Dropzone */}
        {!cvFile ? (
          <div>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: isDragging ? 'var(--color-primary-light)' : 'var(--color-surface-muted)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileInputRef.current?.click()
                }
              }}
              aria-label="Area unggah CV. Klik atau seret file PDF atau DOCX ke sini."
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-hidden="true"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
              </div>
              <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text)', marginBottom: '4px' }}>
                Tarik & lepaskan file CV di sini, atau klik untuk memilih
              </p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>
                Mendukung PDF atau DOCX (Maksimal 5 MB)
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {/* Quick demo option */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>
                Belum menyiapkan file CV saat ini?{' '}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleUseDemoCv}
                style={{ marginLeft: '4px' }}
              >
                Gunakan Contoh CV Demo
              </button>
            </div>
          </div>
        ) : (
          /* Selected File Card */
          <div
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              backgroundColor: 'var(--color-surface-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text)' }}>
                  {cvFile.name}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>
                  Ukuran: {formatFileSize(cvFile.size)} - Terverifikasi
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setCvFile(null)
                  setErrorMessage('')
                }}
                disabled={isAnalyzing}
              >
                Ganti File
              </button>
            </div>
          </div>
        )}

        {/* Loading state indicator during analysis */}
        {isAnalyzing && (
          <div className="state-box" style={{ marginTop: '24px' }}>
            <div className="spinner" aria-hidden="true"></div>
            <div>
              <p className="state-title">Menganalisis Dokumen CV...</p>
              <p className="state-desc">
                Sistem sedang menyimulasikan pembacaan struktur teks, mengekstraksi riwayat keahlian, dan mencocokkan kualifikasi posisi.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border)',
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveView('preferences')}
            disabled={isAnalyzing}
          >
            ← Kembali ke Preferensi
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAnalyzeCv}
            disabled={!cvFile || isAnalyzing}
          >
            {isAnalyzing ? 'Sedang Menganalisis...' : 'Analisis CV →'}
          </button>
        </div>
      </div>
    </div>
  )
}
