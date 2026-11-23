import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { authService } from '../services/authService'

const POPULAR_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Engineer',
  'UI/UX Designer',
  'Mobile Developer',
  'Data Analyst',
  'DevOps Engineer',
  'QA Engineer'
]

const POPULAR_SKILLS = [
  'React',
  'JavaScript',
  'PHP',
  'Laravel',
  'Tailwind CSS',
  'TypeScript',
  'Node.js',
  'MySQL',
  'Figma',
  'HTML5 & CSS3',
  'REST API',
  'Git & GitHub',
  'Python',
  'Docker',
  'Vue.js'
]

const LOCATIONS = ['Semua Lokasi', 'Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya', 'Bali']

const WORK_TYPES = [
  { value: 'Remote', label: 'Remote', desc: 'Bekerja dari mana saja' },
  { value: 'Hybrid', label: 'Hybrid', desc: 'Sebagian WFH & WFO' },
  { value: 'On-site', label: 'On-site', desc: 'Bekerja di kantor' }
]

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract']

const EXPERIENCE_LEVELS = [
  { value: 'Fresh Graduate', label: 'Fresh Graduate', desc: '0 - 1 tahun pengalaman' },
  { value: 'Junior', label: 'Junior', desc: '1 - 2 tahun pengalaman' },
  { value: 'Mid-Level', label: 'Mid-Level', desc: '3 - 5 tahun pengalaman' },
  { value: 'Senior', label: 'Senior', desc: '5+ tahun pengalaman' }
]

export function OnboardingPage() {
  const { currentUser, completeOnboarding } = useApp()

  const [step, setStep] = useState(1) // 1: Target Role, 2: Skills, 3: Work Preferences, 4: Experience

  // Form answers
  const [targetRole, setTargetRole] = useState('')
  const [selectedSkills, setSelectedSkills] = useState(['React', 'JavaScript', 'Tailwind CSS'])
  const [customSkillInput, setCustomSkillInput] = useState('')
  const [location, setLocation] = useState('Semua Lokasi')
  const [workType, setWorkType] = useState('Remote')
  const [jobType, setJobType] = useState('Full-time')
  const [experienceLevel, setExperienceLevel] = useState('Junior')
  const [expectedSalary, setExpectedSalary] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleAddCustomSkill = (e) => {
    e.preventDefault()
    const trimmed = customSkillInput.trim()
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed])
      setCustomSkillInput('')
    }
  }

  const handleNext = () => {
    setErrorMessage('')
    if (step === 1 && !targetRole.trim()) {
      setErrorMessage('Silakan pilih atau ketik posisi pekerjaan yang Anda tuju.')
      return
    }
    if (step === 2 && selectedSkills.length === 0) {
      setErrorMessage('Pilih setidaknya 1 keahlian utama Anda.')
      return
    }
    setStep((prev) => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setErrorMessage('')
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFinish = async () => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      const payload = {
        target_role: targetRole.trim(),
        skills: selectedSkills,
        location: location || 'Semua Lokasi',
        work_type: workType,
        job_type: jobType,
        experience_level: experienceLevel,
        expected_salary: expectedSalary.trim() || null
      }

      const response = await authService.saveOnboarding(payload)
      if (response && response.user) {
        completeOnboarding(response.user)
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menyimpan profil. Silakan coba kembali.')
    } finally {
      setIsLoading(false)
    }
  }

  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Kandidat'

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '36px 32px',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(15, 118, 74, 0.08)'
        }}
      >
        {/* Header Progress */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Langkah {step} dari 4: Melengkapi Profil
            </span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>
              {step === 1 && 'Posisi Pekerjaan'}
              {step === 2 && 'Keahlian Utama'}
              {step === 3 && 'Preferensi Lokasi & Tipe'}
              {step === 4 && 'Tingkat Pengalaman'}
            </span>
          </div>

          {/* Progress Bar Line */}
          <div style={{ width: '100%', height: '6px', backgroundColor: '#eef1ef', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(step / 4) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--color-primary)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>
            Halo, {userName}! Mari sesuaikan profil karier Anda
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Jawaban Anda disimpan di database untuk mencocokkan rekomendasi lowongan kerja secara otomatis.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="info-banner info-banner-danger" style={{ marginBottom: '20px' }}>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Target Role */}
        {step === 1 && (
          <div>
            <label className="form-label" style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
              1. Posisi atau peran apa yang sedang Anda incar? <span style={{ color: 'var(--color-primary)' }}>*</span>
            </label>
            <input
              type="text"
              className="input-text"
              placeholder="Contoh: Frontend React Developer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              style={{ minHeight: '44px', fontSize: '14px', marginBottom: '14px' }}
              autoFocus
            />

            <span style={{ fontSize: '12px', color: 'var(--color-text-subtle)', display: 'block', marginBottom: '8px' }}>
              Pilihan populer (klik untuk memilih):
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {POPULAR_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`btn btn-sm ${targetRole === role ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-pill)', fontSize: '12px' }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Skills Selection */}
        {step === 2 && (
          <div>
            <label className="form-label" style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
              2. Pilih keahlian (skills) yang Anda kuasai <span style={{ color: 'var(--color-primary)' }}>*</span>
            </label>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
              Pilih skill untuk dicocokkan dengan kriteria persyaratan lowongan kerja di database.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {POPULAR_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-pill)', fontSize: '13px' }}
                  >
                    {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                )
              })}
            </div>

            {/* Custom skill add */}
            <form onSubmit={handleAddCustomSkill} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-text"
                placeholder="Tambah keahlian lain..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                style={{ minHeight: '38px', fontSize: '13px' }}
              />
              <button type="submit" className="btn btn-sm btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                + Tambah
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: Work Preferences */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Location */}
            <div>
              <label className="form-label" style={{ fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                Lokasi Kerja yang Diinginkan
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className={`btn btn-sm ${location === loc ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-pill)', fontSize: '12px' }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Type */}
            <div>
              <label className="form-label" style={{ fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                Tipe Kerja <span style={{ color: 'var(--color-primary)' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {WORK_TYPES.map((wt) => {
                  const isSelected = workType === wt.value
                  return (
                    <div
                      key={wt.value}
                      onClick={() => setWorkType(wt.value)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {wt.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
                        {wt.desc}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="form-label" style={{ fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                Jenis Pekerjaan <span style={{ color: 'var(--color-primary)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {JOB_TYPES.map((jt) => (
                  <button
                    key={jt}
                    type="button"
                    onClick={() => setJobType(jt)}
                    className={`btn btn-sm ${jobType === jt ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-pill)', fontSize: '12px' }}
                  >
                    {jt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Experience Level */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                4. Tingkat pengalaman karier Anda saat ini <span style={{ color: 'var(--color-primary)' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {EXPERIENCE_LEVELS.map((el) => {
                  const isSelected = experienceLevel === el.value
                  return (
                    <div
                      key={el.value}
                      onClick={() => setExperienceLevel(el.value)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {el.label}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
                        {el.desc}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="onboard-salary" style={{ fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                Ekspektasi Gaji Bulanan (Opsional)
              </label>
              <input
                id="onboard-salary"
                type="text"
                className="input-text"
                placeholder="Contoh: Rp 8.000.000 - Rp 12.000.000"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                style={{ minHeight: '40px', fontSize: '13px' }}
              />
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          {step > 1 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={isLoading}
            >
              ← Kembali
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
            >
              Lanjutkan →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleFinish}
              disabled={isLoading}
              style={{ fontWeight: 700, padding: '10px 24px' }}
            >
              {isLoading ? 'Menyimpan Profil...' : '✓ Selesai & Masuk ke Dashboard'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
