import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
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
import { NotificationsModal } from './components/NotificationsModal';
import { AuthScreen } from './components/AuthScreen';
import { supabase } from './lib/supabase';
import { AppNotification, User } from './types';

const MainContent: React.FC = () => {
  const { currentTab, selectedUserForProfile, setSelectedUserForProfile, toastMessage, currentUser } = useApp();

  useEffect(() => {
    setSelectedUserForProfile(null);
  }, [currentTab, setSelectedUserForProfile]);

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
      <NotificationsModal />

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
      <AuthGate />
    </AppProvider>
  );
}

const AuthGate: React.FC = () => {
  const { setCurrentUser, hydratePersistedAccount, hydratePersistedContent, hydrateDirectory, hydrateWorkflows, hydrateNotifications } = useApp();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    const fallbackUser = toAppUser(session.user);
    setCurrentUser(fallbackUser);
    void Promise.all([
      supabase.from('profiles').select('*').eq('user_id', session.user.id).maybeSingle(),
      supabase.from('notifications').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
      supabase.from('saved_items').select('item_id').eq('user_id', session.user.id),
      supabase.from('content_items').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('workflow_items').select('*').order('created_at', { ascending: false })
    ]).then(([profileResult, notificationResult, savedItemResult, contentResult, directoryResult, workflowResult]) => {
      if (profileResult.error) return;
      hydratePersistedAccount({
        user: profileResult.data ? profileRowToUser(profileResult.data, fallbackUser) : fallbackUser,
        notifications: notificationResult.error ? [] : notificationResult.data.map(notificationRowToAppNotification),
        savedItemIds: savedItemResult.error ? [] : savedItemResult.data.map((item) => item.item_id)
      });
      if (!contentResult.error) hydratePersistedContent(contentRowsToAppData(contentResult.data));
      if (!directoryResult.error) hydrateDirectory(directoryResult.data.map(profileRowToDirectoryUser));
      if (!workflowResult.error) hydrateWorkflows(workflowResult.data as any[]);
    });
  }, [session]);

  useEffect(() => {
    if (!session?.user) return;
    const workflowChannel = supabase
      .channel(`workflow-updates-${session.user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workflow_items' }, async () => {
        const { data } = await supabase.from('workflow_items').select('*').order('created_at', { ascending: false });
        if (data) hydrateWorkflows(data as any[]);
      })
      .subscribe();
    const notificationChannel = supabase
      .channel(`notification-updates-${session.user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${session.user.id}` }, async () => {
        const { data } = await supabase.from('notifications').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
        if (data) hydrateNotifications(data.map(notificationRowToAppNotification));
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(workflowChannel);
      void supabase.removeChannel(notificationChannel);
    };
  }, [session, hydrateNotifications, hydrateWorkflows]);

  if (isLoading) return <main className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-semibold text-slate-600">Loading IRE Network…</main>;
  if (!session) return <AuthScreen />;
  return <MainContent />;
};

const profileRowToUser = (profile: Record<string, unknown>, fallback: User): User => ({
  ...fallback,
  name: typeof profile.full_name === 'string' ? profile.full_name : fallback.name,
  role: profile.role === 'admin' || profile.role === 'alumni' || profile.role === 'faculty' ? profile.role : 'student',
  verificationStatus: profile.role === 'alumni' ? 'Verified Alumni' : profile.role === 'faculty' ? 'Verified Faculty' : 'Verified Student',
  avatar: typeof profile.avatar_url === 'string' && profile.avatar_url ? profile.avatar_url : fallback.avatar,
  bannerUrl: typeof profile.banner_url === 'string' && profile.banner_url ? profile.banner_url : fallback.bannerUrl,
  avatarPath: typeof profile.avatar_path === 'string' ? profile.avatar_path : fallback.avatarPath,
  bannerPath: typeof profile.banner_path === 'string' ? profile.banner_path : fallback.bannerPath,
  batch: typeof profile.batch === 'string' ? profile.batch : fallback.batch,
  studentId: typeof profile.student_id === 'string' ? profile.student_id : fallback.studentId,
  department: typeof profile.department === 'string' ? profile.department : fallback.department,
  headline: typeof profile.headline === 'string' ? profile.headline : fallback.headline,
  bio: typeof profile.bio === 'string' ? profile.bio : fallback.bio,
  location: typeof profile.location === 'string' ? profile.location : fallback.location,
  skills: Array.isArray(profile.skills) ? profile.skills.filter((skill): skill is string => typeof skill === 'string') : [],
  education: Array.isArray(profile.education) ? profile.education as User['education'] : [],
  experience: Array.isArray(profile.experience) ? profile.experience as User['experience'] : [],
  externalLinks: typeof profile.external_links === 'object' && profile.external_links ? profile.external_links as User['externalLinks'] : {},
  privacy: typeof profile.privacy === 'object' && profile.privacy ? { ...fallback.privacy, ...profile.privacy as User['privacy'] } : fallback.privacy,
  notificationSettings: typeof profile.notification_settings === 'object' && profile.notification_settings ? { ...fallback.notificationSettings, ...profile.notification_settings as User['notificationSettings'] } : fallback.notificationSettings
});

const profileRowToDirectoryUser = (profile: Record<string, unknown>): User => {
  const name = typeof profile.full_name === 'string' ? profile.full_name : 'IRE Member';
  return profileRowToUser(profile, {
    id: String(profile.user_id), name, email: '', role: 'student', verificationStatus: 'Verified Student',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`, department: 'IoT & Robotics Engineering', headline: '', bio: '', location: '', skills: [], education: [], experience: [], externalLinks: {},
    privacy: { cv: 'department', email: 'private', phone: 'private', experience: 'public', projects: 'public', achievements: 'public', publications: 'public', externalLinks: 'public' },
    notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true }
  });
};

const notificationRowToAppNotification = (notification: Record<string, unknown>): AppNotification => ({
  id: String(notification.id),
  title: String(notification.title),
  message: String(notification.message),
  time: notification.created_at ? new Date(String(notification.created_at)).toLocaleString() : 'Just now',
  isToday: notification.created_at ? new Date(String(notification.created_at)).toDateString() === new Date().toDateString() : true,
  isRead: Boolean(notification.is_read),
  type: notification.notification_type === 'connection' || notification.notification_type === 'mentorship' || notification.notification_type === 'opportunity' || notification.notification_type === 'announcement' || notification.notification_type === 'event' ? notification.notification_type : 'verification',
  destination: notification.notification_type === 'connection' || notification.notification_type === 'mentorship'
    ? 'network'
    : notification.notification_type === 'opportunity'
      ? 'opportunities'
      : notification.notification_type === 'announcement' || notification.notification_type === 'event'
        ? 'department'
        : 'profile',
  avatar: typeof notification.avatar_url === 'string' ? notification.avatar_url : undefined
});

const contentRowsToAppData = (rows: Array<{ content_type: string; data: unknown }>) => {
  const result = { projects: [] as User extends never ? never[] : any[], achievements: [] as any[], publications: [] as any[], articles: [] as any[], opportunities: [] as any[], announcements: [] as any[] };
  for (const row of rows) {
    if (!row.data || typeof row.data !== 'object') continue;
    if (row.content_type === 'project') result.projects.push(row.data);
    if (row.content_type === 'achievement') result.achievements.push(row.data);
    if (row.content_type === 'publication') result.publications.push(row.data);
    if (row.content_type === 'article') result.articles.push(row.data);
    if (row.content_type === 'opportunity') result.opportunities.push(row.data);
    if (row.content_type === 'announcement') result.announcements.push(row.data);
  }
  return result;
};

const toAppUser = (user: Session['user']): User => {
  const role = user.user_metadata.role === 'alumni' || user.user_metadata.role === 'faculty' ? user.user_metadata.role : 'student';
  const name = user.user_metadata.full_name || user.email?.split('@')[0] || 'IRE Member';
  return {
    id: user.id,
    name,
    email: user.email || '',
    role,
    verificationStatus: role === 'alumni' ? 'Verified Alumni' : role === 'faculty' ? 'Verified Faculty' : 'Verified Student',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
    batch: typeof user.user_metadata.batch === 'string' ? user.user_metadata.batch : undefined,
    studentId: typeof user.user_metadata.student_id === 'string' ? user.user_metadata.student_id : undefined,
    department: 'IoT & Robotics Engineering',
    headline: role === 'faculty' ? 'Faculty member' : role === 'alumni' ? 'IRE Alumni' : 'IRE Student',
    bio: '',
    location: '',
    skills: [],
    education: [],
    experience: [],
    externalLinks: {},
    privacy: { cv: 'department', email: 'private', phone: 'private', experience: 'public', projects: 'public', achievements: 'public', publications: 'public', externalLinks: 'public' },
    notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true }
  };
};
