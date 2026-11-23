import { useState } from 'react'
import { authService } from '../services/authService'
import { useApp } from '../context/AppContext'

export function AuthPage() {
  const { loginUser } = useApp()
  const [mode, setMode] = useState('login') // 'login' or 'register'

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setErrorMessage('Nama lengkap wajib diisi.')
          setIsLoading(false)
          return
        }

        const data = await authService.register({ name: name.trim(), email: email.trim(), password })
        loginUser(data)
      } else {
        const data = await authService.login({ email: email.trim(), password })
        loginUser(data)
      }
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat menghubungi server.')
    } finally {
      setIsLoading(false)
    }
  }

  // Quick fill demo user for testing convenience
  const fillDemoLogin = () => {
    setEmail('sujon@example.com')
    setPassword('password123')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: 'var(--color-bg)'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px 32px',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(15, 118, 74, 0.08)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #15803d 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 800,
              marginBottom: '14px',
              boxShadow: '0 4px 12px rgba(15, 118, 74, 0.25)'
            }}
          >
            AI
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
            AI Job Tracker & CV Analyzer
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            {mode === 'login'
              ? 'Masuk untuk memantau lowongan & lamaran kerja Anda'
              : 'Daftar akun baru dan temukan lowongan yang cocok'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#eef1ef',
            borderRadius: 'var(--radius-pill)',
            padding: '4px',
            marginBottom: '24px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setErrorMessage('')
            }}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: mode === 'login' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register')
              setErrorMessage('')
            }}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: mode === 'register' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Daftar Akun
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="info-banner info-banner-danger" style={{ marginBottom: '20px', fontSize: '13px' }}>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="info-banner" style={{ marginBottom: '20px', fontSize: '13px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderColor: 'var(--color-primary-border)' }}>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-name">
                Nama Lengkap
              </label>
              <input
                id="auth-name"
                type="text"
                className="input-text"
                placeholder="Contoh: Sujon Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">
              Alamat Email
            </label>
            <input
              id="auth-email"
              type="email"
              className="input-text"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className="input-text"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              minHeight: '44px',
              marginTop: '8px',
              fontSize: '14px',
              fontWeight: 700
            }}
            disabled={isLoading}
          >
            {isLoading
              ? 'Memproses...'
              : mode === 'login'
              ? 'Masuk ke Akun'
              : 'Daftar & Lanjutkan'}
          </button>
        </form>

        {/* Backend notice / helper info */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: 'var(--color-text-subtle)', lineHeight: 1.5 }}>
            Terhubung dengan Database MySQL Laravel via REST API
          </p>
        </div>
      </div>
    </div>
  )
}
