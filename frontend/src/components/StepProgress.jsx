import { useApp } from '../context/AppContext'

const STEPS = [
  { key: 'preferences', label: '1. Preferensi' },
  { key: 'upload', label: '2. Unggah CV' },
  { key: 'review', label: '3. Tinjau Profil' },
  { key: 'recommendations', label: '4. Rekomendasi' }
]

export function StepProgress() {
  const { activeView, setActiveView, cvFile, extractedProfile } = useApp()

  const currentIndex = STEPS.findIndex((s) => s.key === activeView)
  const hasCv = Boolean(cvFile && extractedProfile)

  // Determine if a step is accessible - Tahap 3 & 4 hanya aktif jika CV sudah diunggah & dianalisis
  const isStepAccessible = (stepKey) => {
    if (stepKey === 'preferences') return true
    if (stepKey === 'upload') return true
    if (stepKey === 'review') return hasCv
    if (stepKey === 'recommendations') return hasCv
    return false
  }

  if (currentIndex === -1) {
    return null
  }

  return (
    <nav className="step-progress-wrapper" aria-label="Alur Analisis CV dan Rekomendasi">
      <ol className="step-progress-list">
        {STEPS.map((step, index) => {
          const isActive = step.key === activeView
          const isCompleted = currentIndex > index
          const accessible = isStepAccessible(step.key)

          return (
            <li key={step.key}>
              <button
                type="button"
                className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  if (accessible) {
                    setActiveView(step.key)
                  }
                }}
                disabled={!accessible}
                aria-current={isActive ? 'step' : undefined}
                style={{ width: '100%', textAlign: 'left', cursor: accessible ? 'pointer' : 'not-allowed', opacity: accessible ? 1 : 0.55 }}
              >
                <span className="step-number" aria-hidden="true">
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span>{step.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
