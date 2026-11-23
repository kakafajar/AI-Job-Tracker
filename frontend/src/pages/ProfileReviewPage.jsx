import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { StepProgress } from '../components/StepProgress'

export function ProfileReviewPage() {
  const { extractedProfile, addSkill, removeSkill, setActiveView } = useApp()
  const [newSkillInput, setNewSkillInput] = useState('')
  const [inputError, setInputError] = useState('')

  // Jika CV belum diunggah atau belum dianalisis, kunci halaman ini
  if (!extractedProfile) {
    return (
      <div style={{ width: '100%' }}>
        <StepProgress />

        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
            Dokumen CV Belum Dianalisis
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Tahap Tinjau Profil hanya dapat dibuka setelah Anda mengunggah file CV. Sistem akan mengekstraksi riwayat keahlian dan pengalaman kerja dari dokumen tersebut.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setActiveView('upload')}
              style={{ fontWeight: 600, padding: '10px 24px' }}
            >
              Unggah Dokumen CV Sekarang →
            </button>
          </div>
        </div>
      </div>
    )
  }

  const profile = extractedProfile

  const handleAddSkill = (e) => {
    e.preventDefault()
    const trimmed = newSkillInput.trim()
    if (!trimmed) {
      setInputError('Ketik nama skill terlebih dahulu.')
      return
    }

    if (profile.skills.includes(trimmed)) {
      setInputError('Skill ini sudah ada di dalam daftar.')
      return
    }

    addSkill(trimmed)
    setNewSkillInput('')
    setInputError('')
  }

  return (
    <div style={{ width: '100%' }}>
      <StepProgress />

      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Tinjau Profil</h1>
          <p className="card-subtitle">
            Periksa dan sesuaikan daftar keahlian yang diekstraksi dari CV Anda.
          </p>
        </div>

        {/* Extracted Role & Experience Summary */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '24px'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Rekomendasi Posisi yang Cocok
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
              {profile.matchedRole}
            </h2>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Estimasi Pengalaman
            </span>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginTop: '2px' }}>
              {profile.experienceLevel}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Ringkasan Kualifikasi
            </span>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
              {profile.experienceSummary}
            </p>
          </div>
        </div>

        {/* Editable Skills Section */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Daftar Keahlian / Skill ({profile.skills.length})</span>
            <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-text-subtle)' }}>
              Klik tanda silang untuk menghapus
            </span>
          </label>

          {/* Skill tags with remove button */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '14px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface)',
              minHeight: '60px',
              marginBottom: '14px'
            }}
            role="list"
            aria-label="Daftar keahlian yang diekstraksi"
          >
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="skill-tag"
                style={{
                  padding: '5px 10px',
                  fontSize: '13px',
                  backgroundColor: 'var(--color-primary-light)',
                  borderColor: 'var(--color-primary-border)',
                  color: 'var(--color-primary)',
                  fontWeight: 500
                }}
                role="listitem"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Hapus skill ${skill}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    marginLeft: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    backgroundColor: 'transparent'
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* Add custom skill input */}
          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <input
                type="text"
                className="input-text"
                placeholder="Tambah keahlian baru (contoh: TypeScript, Next.js, Redux)"
                value={newSkillInput}
                onChange={(e) => {
                  setNewSkillInput(e.target.value)
                  setInputError('')
                }}
                aria-label="Nama keahlian baru"
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ flexShrink: 0 }}>
              + Tambah Skill
            </button>
          </form>
          {inputError && (
            <p style={{ color: 'var(--status-rejected-text)', fontSize: '12px', marginTop: '6px' }}>
              {inputError}
            </p>
          )}
        </div>

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
            onClick={() => setActiveView('upload')}
          >
            ← Ganti File CV
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setActiveView('recommendations')}
          >
            Cari Rekomendasi Lowongan →
          </button>
        </div>
      </div>
    </div>
  )
}
