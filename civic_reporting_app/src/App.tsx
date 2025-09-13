import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { AadhaarVerification } from './components/AadhaarVerification';
import { Navigation, NavigationView } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { CreateReport } from './components/CreateReport';
import { ReportDetail } from './components/ReportDetail';
import { MapView } from './components/MapView';
import { Wallet } from './components/Wallet';
import { Profile } from './components/Profile';
import { Toaster } from './components/ui/sonner';
import { Shield } from 'lucide-react';

type AppView = 'splash' | 'login' | 'signup' | 'aadhaar' | 'main';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showAadhaarVerification, setShowAadhaarVerification] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode detection and toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('civiccred_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldUseDark);
    
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('civiccred_theme', newMode ? 'dark' : 'light');
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getAppView = (): AppView => {
    if (showSplash) return 'splash';
    if (!isAuthenticated) return authMode;
    if (showAadhaarVerification) return 'aadhaar';
    return 'main';
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleAuthToggle = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  const handleCreateReport = () => {
    setShowCreateReport(true);
    setCurrentView('create');
  };

  const handleReportCreated = (reportId: string) => {
    setShowCreateReport(false);
    setSelectedReportId(reportId);
    setCurrentView('dashboard');
  };

  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const handleBackFromReport = () => {
    setSelectedReportId(null);
  };

  const handleCancelCreate = () => {
    setShowCreateReport(false);
    setCurrentView('dashboard');
  };

  const handleAadhaarComplete = () => {
    setShowAadhaarVerification(false);
  };

  const renderMainContent = () => {
    // Show report details if a report is selected
    if (selectedReportId) {
      return (
        <ReportDetail
          reportId={selectedReportId}
          onBack={handleBackFromReport}
        />
      );
    }

    // Show create report form
    if (showCreateReport) {
      return (
        <CreateReport
          onSuccess={handleReportCreated}
          onCancel={handleCancelCreate}
        />
      );
    }

    // Show main navigation views
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onCreateReport={handleCreateReport}
            onViewReport={handleViewReport}
          />
        );
      case 'create':
        return (
          <CreateReport
            onSuccess={handleReportCreated}
            onCancel={handleCancelCreate}
          />
        );
      case 'map':
        return (
          <MapView
            onCreateReport={handleCreateReport}
            onViewReport={handleViewReport}
          />
        );
      case 'wallet':
        return <Wallet />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <Dashboard
            onCreateReport={handleCreateReport}
            onViewReport={handleViewReport}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CivicCred...</p>
        </div>
      </div>
    );
  }

  const appView = getAppView();

  return (
    <>
      {appView === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {appView === 'login' && (
        <LoginScreen onToggleMode={handleAuthToggle} />
      )}

      {appView === 'signup' && (
        <SignupScreen onToggleMode={handleAuthToggle} />
      )}

      {appView === 'aadhaar' && (
        <AadhaarVerification onComplete={handleAadhaarComplete} />
      )}

      {appView === 'main' && (
        <div className="min-h-screen bg-background">
          <Navigation
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          
          <main className="container mx-auto px-4 pt-4 pb-20 md:pb-6 md:ml-64 max-w-4xl">
            {renderMainContent()}
          </main>

          {/* Aadhaar Verification Prompt - Mobile Optimized */}
          {user && !user.aadhaarVerified && !showAadhaarVerification && (
            <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-primary/5 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 shadow-2xl animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Get Verified ✨
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Verify your identity to unlock premium features and earn bonus points.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAadhaarVerification(true)}
                      className="text-xs bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium transition-colors touch-target"
                    >
                      Verify Now
                    </button>
                    <button className="text-xs text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted touch-target">
                      Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Toaster />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}