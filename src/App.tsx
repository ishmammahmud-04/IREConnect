import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { DiscoverEditorial } from './components/DiscoverEditorial';
import { PeopleDirectory } from './components/PeopleDirectory';
import { NetworkingView } from './components/NetworkingView';
import { OpportunitiesBoard } from './components/OpportunitiesBoard';
import { DepartmentHub } from './components/DepartmentHub';
import { ProfileView } from './components/ProfileView';
import { AdminControlSuite } from './components/AdminControlSuite';

// Modals
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { ResearchDetailModal } from './components/ResearchDetailModal';
import { AchievementDetailModal } from './components/AchievementDetailModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { CreateModal } from './components/CreateModal';
import { LinkedInImportModal } from './components/LinkedInImportModal';
import { MentorshipModal } from './components/MentorshipModal';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { SavedBookmarksModal } from './components/SavedBookmarksModal';

const MainContent: React.FC = () => {
  const { currentTab, selectedUserForProfile, setSelectedUserForProfile, toastMessage } = useApp();

  const renderActiveScreen = () => {
    // If a user profile is selected from any screen, show that user's profile
    if (selectedUserForProfile) {
      return (
        <ProfileView
          userOverride={selectedUserForProfile}
          onBack={() => setSelectedUserForProfile(null)}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return <HomeDashboard />;
      case 'discover':
        return <DiscoverEditorial />;
      case 'network':
        return <NetworkingView />;
      case 'opportunities':
        return <OpportunitiesBoard />;
      case 'department':
        return <DepartmentHub />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminControlSuite />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-500/20 selection:text-blue-600">
      {/* Top App Header */}
      <Header />

      {/* Main Body Shell */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Screen View */}
        <main className="flex-1 min-w-0 p-4 sm:p-5 lg:p-6 overflow-y-auto">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <BottomNav />

      {/* Global Interactive Modals */}
      <ArticleDetailModal />
      <ResearchDetailModal />
      <AchievementDetailModal />
      <ProjectDetailModal />
      <OpportunityDetailModal />
      <CreateModal />
      <LinkedInImportModal />
      <MentorshipModal />
      <PrivacySettingsModal />
      <SavedBookmarksModal />

      {/* Global Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700/60 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <span className="material-symbols-outlined text-blue-400 text-[18px]">info</span>
          <span className="text-xs font-medium text-slate-200">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
