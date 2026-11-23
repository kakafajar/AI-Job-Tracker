import { createContext, useContext, useEffect, useState } from 'react'
import { storageService } from '../services/storageService'
import { apiClient } from '../services/apiClient'
import { authService } from '../services/authService'

const AppContext = createContext(null)

export const TRACKING_STATUSES = [
  'Disimpan',
  'Sudah Melamar',
  'Wawancara',
  'Diterima',
  'Ditolak'
]

export function AppProvider({ children }) {
  // Navigation view state: default to modern dashboard
  const [activeView, setActiveViewState] = useState('dashboard')

  // Sidebar toggle state for desktop expanded mode (icons + labels)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  // Mobile menu drawer toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Authentication State
  const [token, setToken] = useState(() => apiClient.getToken())
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_tracker_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [authLoading, setAuthLoading] = useState(true)

  // Verifikasi sesi pengguna aktif ke Backend Laravel saat load
  useEffect(() => {
    const verifyAuth = async () => {
      const currentToken = apiClient.getToken()
      if (!currentToken) {
        setAuthLoading(false)
        return
      }

      try {
        const response = await authService.getMe()
        if (response && response.user) {
          setCurrentUser(response.user)
          localStorage.setItem('ai_tracker_user', JSON.stringify(response.user))

          // Sinkronisasi data preferensi dari database profil jika ada
          if (response.user.profile) {
            const p = response.user.profile
            setPreferencesState((prev) => ({
              ...prev,
              targetRole: p.target_role || prev.targetRole,
              location: p.location || prev.location,
              workType: p.work_type || prev.workType,
              jobType: p.job_type || prev.jobType
            }))

            // Pulihkan status CV dari database jika di local belum ada
            if (p.cv_path && !storageService.getCvFile()) {
              const restoredCv = {
                name: p.cv_path,
                size: 1420000,
                type: 'application/pdf',
                uploadedAt: new Date().toISOString()
              }
              setCvFile(restoredCv)
            }
          }
        }
      } catch {
        // Jika token invalid/expired, reset auth
        apiClient.setToken('')
        setToken('')
        setCurrentUser(null)
        localStorage.removeItem('ai_tracker_user')
      } finally {
        setAuthLoading(false)
      }
    }

    verifyAuth()
  }, [])

  const loginUser = (authData) => {
    setToken(authData.token)
    setCurrentUser(authData.user)
    apiClient.setToken(authData.token)
    localStorage.setItem('ai_tracker_user', JSON.stringify(authData.user))

    if (authData.user.profile) {
      const p = authData.user.profile
      if (p.target_role) {
        setPreferencesState((prev) => ({
          ...prev,
          targetRole: p.target_role,
          location: p.location || prev.location,
          workType: p.work_type || prev.workType,
          jobType: p.job_type || prev.jobType
        }))
      }
    }
  }

  const logoutUser = async () => {
    await authService.logout()
    setToken('')
    setCurrentUser(null)
    localStorage.removeItem('ai_tracker_user')
    setActiveView('dashboard')
  }

  const completeOnboarding = (updatedUser) => {
    setCurrentUser(updatedUser)
    localStorage.setItem('ai_tracker_user', JSON.stringify(updatedUser))

    if (updatedUser.profile) {
      const p = updatedUser.profile
      setPreferencesState((prev) => ({
        ...prev,
        targetRole: p.target_role || prev.targetRole,
        location: p.location || prev.location,
        workType: p.work_type || prev.workType,
        jobType: p.job_type || prev.jobType
      }))
    }
  }

  const toggleSidebarExpanded = () => {
    setIsSidebarExpanded((prev) => !prev)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const setActiveView = (view) => {
    setActiveViewState(view)
    setIsMobileMenuOpen(false)
  }

  // Automatically reset mobile drawer if viewport width expands to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Step 2: Job search preferences
  const [preferences, setPreferencesState] = useState(() => {
    return (
      storageService.getPreferences() || {
        location: '',
        workType: 'Remote',
        jobType: 'Full-time',
        targetRole: ''
      }
    )
  })

  // Step 3: Selected CV file (tersimpan di localStorage agar tetap ada saat refresh)
  const [cvFile, setCvFileState] = useState(() => {
    return storageService.getCvFile() || null
  })

  const setCvFile = (fileData) => {
    setCvFileState(fileData)
    if (fileData) {
      storageService.saveCvFile(fileData)
    } else {
      storageService.removeCvFile()
    }
  }

  // Step 4: Extracted profile data (tersimpan di localStorage)
  const [extractedProfile, setExtractedProfileState] = useState(() => {
    return storageService.getExtractedProfile() || null
  })

  // Step 6: Persistent Job Tracker list
  const [trackedJobs, setTrackedJobs] = useState(() => {
    return storageService.getTrackedJobs()
  })

  // Sync tracked jobs changes to localStorage
  useEffect(() => {
    storageService.saveTrackedJobs(trackedJobs)
  }, [trackedJobs])

  // Sync preferences changes to localStorage
  const updatePreferences = (newPrefs) => {
    const updated = { ...preferences, ...newPrefs }
    setPreferencesState(updated)
    storageService.savePreferences(updated)
  }

  // Update extracted profile
  const updateExtractedProfile = (profile) => {
    setExtractedProfileState(profile)
    storageService.saveExtractedProfile(profile)
  }

  // Add a skill to extracted profile
  const addSkill = (skill) => {
    const trimmed = skill.trim()
    if (!trimmed || !extractedProfile) return
    if (extractedProfile.skills.includes(trimmed)) return

    const updatedProfile = {
      ...extractedProfile,
      skills: [...extractedProfile.skills, trimmed]
    }
    updateExtractedProfile(updatedProfile)
  }

  // Remove a skill from extracted profile
  const removeSkill = (skillToRemove) => {
    if (!extractedProfile) return
    const updatedProfile = {
      ...extractedProfile,
      skills: extractedProfile.skills.filter((s) => s !== skillToRemove)
    }
    updateExtractedProfile(updatedProfile)
  }

  // Save or track a job
  const trackJob = (job, status = 'Disimpan') => {
    setTrackedJobs((prev) => {
      const exists = prev.find((item) => item.id === job.id)
      if (exists) {
        return prev.map((item) =>
          item.id === job.id ? { ...item, status, updatedAt: new Date().toISOString() } : item
        )
      }
      return [
        {
          ...job,
          status,
          savedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        ...prev
      ]
    })
  }

  // Update tracking status
  const updateJobStatus = (jobId, newStatus) => {
    setTrackedJobs((prev) =>
      prev.map((item) =>
        item.id === jobId
          ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
          : item
      )
    )
  }

  // Remove job from tracker
  const untrackJob = (jobId) => {
    setTrackedJobs((prev) => prev.filter((item) => item.id !== jobId))
  }

  // Check if a job is in tracker
  const isJobTracked = (jobId) => {
    return trackedJobs.some((item) => item.id === jobId)
  }

  // Get current status of a tracked job
  const getJobTrackedStatus = (jobId) => {
    const item = trackedJobs.find((j) => j.id === jobId)
    return item ? item.status : null
  }

  // Reset the flow back to start
  const resetFlow = () => {
    setCvFile(null)
    updateExtractedProfile(null)
    setActiveView('preferences')
  }

  return (
    <AppContext.Provider
      value={{
        // Auth
        currentUser,
        token,
        authLoading,
        isAuthenticated: !!token && !!currentUser,
        isOnboarded: currentUser ? Boolean(currentUser.is_onboarded) : false,
        loginUser,
        logoutUser,
        completeOnboarding,

        // Navigation
        activeView,
        setActiveView,
        isSidebarExpanded,
        toggleSidebarExpanded,
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,

        // Data & Preferences
        preferences,
        updatePreferences,
        cvFile,
        setCvFile,
        extractedProfile,
        updateExtractedProfile,
        addSkill,
        removeSkill,
        trackedJobs,
        trackJob,
        updateJobStatus,
        untrackJob,
        isJobTracked,
        getJobTrackedStatus,
        resetFlow
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
