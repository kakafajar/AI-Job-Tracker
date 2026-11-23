const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export const apiClient = {
  getToken() {
    return localStorage.getItem('ai_tracker_token') || ''
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('ai_tracker_token', token)
    } else {
      localStorage.removeItem('ai_tracker_token')
    }
  },

  async request(endpoint, options = {}) {
    const token = this.getToken()
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }

    const config = {
      ...options,
      headers
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || `Terjadi kesalahan (Status ${response.status})`)
      }

      return data
    } catch (err) {
      // If network fails (e.g. Laravel server not started yet)
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Tidak dapat terhubung ke server Laravel (http://127.0.0.1:8000). Pastikan server backend sudah berjalan dengan "php artisan serve".')
      }
      throw err
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) })
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) })
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}
