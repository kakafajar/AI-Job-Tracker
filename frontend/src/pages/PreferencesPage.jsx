import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { StepProgress } from '../components/StepProgress'

const WORK_TYPES = ['Remote', 'Hybrid', 'On-site']
const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract']
const POPULAR_LOCATIONS = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali']

export function PreferencesPage() {
  const { preferences, updatePreferences, setActiveView } = useApp()

  const [location, setLocation] = useState(preferences.location || '')
  const [workType, setWorkType] = useState(preferences.workType || 'Remote')
  const [jobType, setJobType] = useState(preferences.jobType || 'Full-time')
  const [targetRole, setTargetRole] = useState(preferences.targetRole || '')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!workType) {
      setErrorMessage('Silakan pilih salah satu tipe kerja.')
      return
    }

    if (!jobType) {
      setErrorMessage('Silakan pilih salah satu jenis pekerjaan.')
      return
    }

    // Save preferences in central context and localStorage
    updatePreferences({
      location: location.trim(),
      workType,
      jobType,
      targetRole: targetRole.trim()
    })

    // Advance to next step
    setActiveView('upload')
  }

  return (
    <div style={{ width: '100%' }}>
      <StepProgress />

      <div className="card">
        <div className="card-header">
          <h1 className="card-title">1. Tentukan Preferensi Pekerjaan</h1>
          <p className="card-subtitle">
            Preferensi ini digunakan sistem untuk menyaring lowongan kerja yang relevan dengan keinginan Anda.
          </p>
        </div>

        {errorMessage && (
          <div className="info-banner info-banner-danger" role="alert">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Location field */}
          <div className="form-group">
            <label htmlFor="pref-location" className="form-label">
              Lokasi yang Diinginkan
            </label>
            <input
              id="pref-location"
              type="text"
              className="input-text"
              placeholder="Contoh: Jakarta, Bandung, atau Semua Lokasi"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
                setErrorMessage('')
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-subtle)' }}>Pilihan populer:</span>
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className="btn btn-sm btn-secondary"
                  style={{ minHeight: '30px', padding: '2px 8px', fontSize: '12px' }}
                  onClick={() => setLocation(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
            <p className="form-hint">
              Kosongkan atau ketik "Semua Lokasi" jika Anda fleksibel dengan penempatan kerja.
            </p>
          </div>

          {/* Work Type */}
          <div className="form-group">
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend className="form-label">
                Tipe Kerja <span style={{ color: 'var(--color-primary)' }}>*</span>
              </legend>
              <div className="radio-pill-group" role="radiogroup" aria-label="Pilihan Tipe Kerja">
                {WORK_TYPES.map((type) => {
                  const isSelected = workType === type
                  return (
                    <label
                      key={type}
                      className={`radio-pill-label ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="workType"
                        value={type}
                        checked={isSelected}
                        onChange={() => setWorkType(type)}
                        className="radio-pill-input"
                      />
                      <span>{type}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>

          {/* Job Type */}
          <div className="form-group">
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend className="form-label">
                Jenis Pekerjaan <span style={{ color: 'var(--color-primary)' }}>*</span>
              </legend>
              <div className="radio-pill-group" role="radiogroup" aria-label="Pilihan Jenis Pekerjaan">
                {JOB_TYPES.map((type) => {
                  const isSelected = jobType === type
                  return (
                    <label
                      key={type}
                      className={`radio-pill-label ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="jobType"
                        value={type}
                        checked={isSelected}
                        onChange={() => setJobType(type)}
                        className="radio-pill-input"
                      />
                      <span>{type}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>

          {/* Target Role (Optional) */}
          <div className="form-group">
            <label htmlFor="pref-targetRole" className="form-label">
              Posisi yang Diminati
              <span className="form-label-optional">(Opsional)</span>
            </label>
            <input
              id="pref-targetRole"
              type="text"
              className="input-text"
              placeholder="Contoh: Frontend Developer, React Engineer, UI Developer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
            <p className="form-hint">
              Jika dikosongkan, sistem akan mengidentifikasi posisi paling relevan dari isi CV Anda.
            </p>
          </div>

          {/* Form navigation actions */}
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
              onClick={() => setActiveView('dashboard')}
            >
              ← Kembali ke Dashboard
            </button>

            <button type="submit" className="btn btn-primary">
              Lanjut Unggah CV →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
