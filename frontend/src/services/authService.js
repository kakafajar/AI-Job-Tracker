import { apiClient } from './apiClient'

export const authService = {
  /**
   * Registrasi akun pengguna baru
   */
  async register({ name, email, password }) {
    const data = await apiClient.post('/register', { name, email, password })
    if (data.token) {
      apiClient.setToken(data.token)
    }
    return data
  },

  /**
   * Login pengguna
   */
  async login({ email, password }) {
    const data = await apiClient.post('/login', { email, password })
    if (data.token) {
      apiClient.setToken(data.token)
    }
    return data
  },

  /**
   * Cek sesi pengguna yang sedang aktif
   */
  async getMe() {
    return await apiClient.get('/me')
  },

  /**
   * Simpan hasil pertanyaan profiling (onboarding) pra-dashboard
   */
  async saveOnboarding(onboardingData) {
    return await apiClient.post('/onboarding', onboardingData)
  },

  /**
   * Upload file CV ke server Laravel
   */
  async uploadCvFile(file) {
    const token = apiClient.getToken()
    const formData = new FormData()
    formData.append('cv_file', file)

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
    const res = await fetch(`${API_BASE_URL}/profile/cv`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.message || 'Gagal mengunggah file CV ke server.')
    }
    return data
  },

  /**
   * Keluar dari akun (logout)
   */
  async logout() {
    try {
      await apiClient.post('/logout')
    } catch {
      // Ignore network errors on logout
    } finally {
      apiClient.setToken('')
    }
  }
}
