import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortalDataProvider } from './context/PortalDataContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineSyncIndicator } from './components/OfflineSyncIndicator';

// Role-based Views
import { ApplicantDashboard } from './components/Applicant/ApplicantDashboard';
import { CentralSchemesTab } from './components/Applicant/CentralSchemesTab';
import { StateSchemesTab } from './components/Applicant/StateSchemesTab';
import { MyDocumentsTab } from './components/Applicant/MyDocumentsTab';
import { SeedingStatusTab } from './components/Applicant/SeedingStatusTab';
import { MyApplicationsTab } from './components/Applicant/MyApplicationsTab';

import { FellowshipPortal } from './components/Fellowship/FellowshipPortal';
import { AiScrutinyTab } from './components/AiScrutiny/AiScrutinyTab';
import { MinistryAnalyticsDashboard } from './components/Analytics/MinistryAnalyticsDashboard';

import { OfficersPortal } from './components/Officers/OfficersPortal';
import { VerifiersPortal } from './components/Verifiers/VerifiersPortal';
import { CommitteePortal } from './components/Committee/CommitteePortal';
import { SuperAdminPortal } from './components/SuperAdmin/SuperAdminPortal';

import { AuthModal } from './components/Auth/AuthModal';
import { ArchitectureSpecsModal } from './components/Specs/ArchitectureSpecsModal';
import { DeviceSyncModal } from './components/Sync/DeviceSyncModal';

const MainPortalContent: React.FC = () => {
  const { activeRole } = useAuth();
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [showSpecsModal, setShowSpecsModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Reset tab to dashboard when activeRole changes
  React.useEffect(() => {
    setCurrentTab('dashboard');
  }, [activeRole]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800 pb-16 md:pb-0">
      {/* Top Navbar */}
      <Navbar
        onOpenSpecsModal={() => setShowSpecsModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenSyncModal={() => setShowSyncModal(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Body with Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dynamic Sidebar (Desktop: fixed; Mobile: drawer) */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tabId) => setCurrentTab(tabId)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Central Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Common Flagship Fellowships Tab (Accessible to Scholars and Officers) */}
            {currentTab === 'fellowship_portal' && <FellowshipPortal />}

            {/* Common AI Document Intelligence Tab */}
            {currentTab === 'ai_scrutiny' && <AiScrutinyTab />}

            {/* Common Ministry Analytics Tab */}
            {currentTab === 'ministry_analytics' && <MinistryAnalyticsDashboard />}

            {/* 1. APPLICANT (TRIBAL SCHOLAR) PORTAL */}
            {activeRole === 'APPLICANT' && (
              <>
                {currentTab === 'dashboard' && (
                  <ApplicantDashboard onNavigateTab={(tab) => setCurrentTab(tab)} />
                )}
                {currentTab === 'central_schemes' && (
                  <CentralSchemesTab onApplicationSubmitted={() => setCurrentTab('my_applications')} />
                )}
                {currentTab === 'state_schemes' && (
                  <StateSchemesTab onApplicationSubmitted={() => setCurrentTab('my_applications')} />
                )}
                {currentTab === 'my_documents' && <MyDocumentsTab />}
                {currentTab === 'seeding_status' && <SeedingStatusTab />}
                {currentTab === 'my_applications' && <MyApplicationsTab />}
              </>
            )}

            {/* 2. STATE & CENTRAL SCHOLARSHIP OFFICERS (SSO / CSO) */}
            {(activeRole === 'SSO' || activeRole === 'CSO') && (
              <>
                {currentTab !== 'fellowship_portal' && currentTab !== 'ministry_analytics' && (
                  <OfficersPortal
                    currentTab={currentTab}
                    onTabChange={(tab) => setCurrentTab(tab)}
                  />
                )}
              </>
            )}

            {/* 3. STATE & CENTRAL VERIFIERS (SV / CV) */}
            {(activeRole === 'SV' || activeRole === 'CV') && (
              <>
                {currentTab !== 'ai_scrutiny' && (
                  <VerifiersPortal
                    currentTab={currentTab}
                    onTabChange={(tab) => setCurrentTab(tab)}
                  />
                )}
              </>
            )}

            {/* 4. SELECTION COMMITTEE MEMBER (SCM) */}
            {activeRole === 'SCM' && (
              <>
                {currentTab !== 'ministry_analytics' && (
                  <CommitteePortal
                    currentTab={currentTab}
                    onTabChange={(tab) => setCurrentTab(tab)}
                  />
                )}
              </>
            )}

            {/* 5. SUPER ADMIN */}
            {activeRole === 'SUPER_ADMIN' && (
              <>
                {currentTab !== 'ministry_analytics' && (
                  <SuperAdminPortal
                    currentTab={currentTab}
                    onTabChange={(tab) => setCurrentTab(tab)}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Touch-Friendly Mobile Bottom Navigation Bar (Smartphones) */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={(tabId) => setCurrentTab(tabId)}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      {/* Offline & Synchronization Toast Indicator */}
      <OfflineSyncIndicator />

      {/* Global Modals */}
      {showSpecsModal && (
        <ArchitectureSpecsModal onClose={() => setShowSpecsModal(false)} />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showSyncModal && (
        <DeviceSyncModal onClose={() => setShowSyncModal(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PortalDataProvider>
          <MainPortalContent />
        </PortalDataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
