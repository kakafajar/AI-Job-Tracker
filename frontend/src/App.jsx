import { AppProvider, useApp } from './context/AppContext'
import { Sidebar } from './components/Sidebar'
import { TopHeader } from './components/TopHeader'
import { DashboardOverview } from './pages/DashboardOverview'
import { PreferencesPage } from './pages/PreferencesPage'
import { UploadCvPage } from './pages/UploadCvPage'
import { ProfileReviewPage } from './pages/ProfileReviewPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { JobTrackerPage } from './pages/JobTrackerPage'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { OnboardingPage } from './pages/OnboardingPage'

function AppContent() {
  const { authLoading, isAuthenticated, isOnboarded, activeView, cvFile, extractedProfile } = useApp()

  const hasCv = Boolean(cvFile && extractedProfile)

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-bg)'
        }}
      >
        <div className="spinner" aria-hidden="true" style={{ width: '36px', height: '36px' }} />
      </div>
    )
  }

  // 1. Jika pengguna belum login, arahkan ke Login/Register
  if (!isAuthenticated) {
    return <AuthPage />
  }

  // 2. Jika pengguna baru & belum mengisi kuesioner profil, arahkan ke Onboarding
  if (!isOnboarded) {
    return <OnboardingPage />
  }

  // 3. Jika pengguna sudah login & profil sudah lengkap, masuk ke Dashboard
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />
      case 'preferences':
        return <PreferencesPage />
      case 'upload':
        return <UploadCvPage />
      case 'review':
        return hasCv ? <ProfileReviewPage /> : <UploadCvPage />
      case 'recommendations':
        return hasCv ? <RecommendationsPage /> : <UploadCvPage />
      case 'tracker':
        return <JobTrackerPage />
      case 'landing':
        return <LandingPage />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Floating Island Sidebar */}
      <Sidebar />

      {/* Main Dashboard Canvas */}
      <main className="dashboard-main" id="main-content">
        <TopHeader />
        {renderActiveView()}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
