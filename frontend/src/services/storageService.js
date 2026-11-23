/**
 * Storage service for persistent client-side data
 * Handles localStorage operations for Job Tracker, CV file metadata, and user preferences
 */

const STORAGE_KEYS = {
  PREFERENCES: 'ai_job_tracker_preferences',
  EXTRACTED_PROFILE: 'ai_job_tracker_profile',
  TRACKED_JOBS: 'ai_job_tracker_saved_jobs',
  ACTIVE_VIEW: 'ai_job_tracker_active_view',
  CV_FILE: 'ai_job_tracker_cv_file'
}

export const storageService = {
  getPreferences() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  savePreferences(preferences) {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))
    } catch {
      // localStorage may fail in private mode or quota exceeded
    }
  },

  getCvFile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CV_FILE)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveCvFile(cvFile) {
    try {
      if (!cvFile) {
        localStorage.removeItem(STORAGE_KEYS.CV_FILE)
        return
      }
      // Simpan metadata yang dapat diserialisasi (tanpa raw File object)
      const serializable = {
        name: cvFile.name,
        size: cvFile.size,
        type: cvFile.type,
        uploadedAt: cvFile.uploadedAt || new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEYS.CV_FILE, JSON.stringify(serializable))
    } catch {
      // safe fail
    }
  },

  removeCvFile() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CV_FILE)
    } catch {
      // safe fail
    }
  },

  getExtractedProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXTRACTED_PROFILE)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveExtractedProfile(profile) {
    try {
      if (!profile) {
        localStorage.removeItem(STORAGE_KEYS.EXTRACTED_PROFILE)
        return
      }
      localStorage.setItem(STORAGE_KEYS.EXTRACTED_PROFILE, JSON.stringify(profile))
    } catch {
      // localStorage safe fail
    }
  },

  getTrackedJobs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRACKED_JOBS)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveTrackedJobs(jobs) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRACKED_JOBS, JSON.stringify(jobs))
    } catch {
      // localStorage safe fail
    }
  },

  clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
    } catch {
      // ignore
    }
  }
}
