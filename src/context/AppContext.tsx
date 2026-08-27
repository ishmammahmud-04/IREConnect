import React, { createContext, useContext, useState } from 'react';
import {
  User,
  Project,
  Publication,
  Achievement,
  Article,
  Opportunity,
  Announcement,
  DepartmentEvent,
  LinkedInImportItem,
  AppNotification,
  ConnectionRequest,
  ModerationReport,
  VerificationRequest
} from '../types';
import {
  CURRENT_USER_STUDENT,
  CURRENT_USER_ALUMNI,
  CURRENT_USER_FACULTY,
  CURRENT_USER_ADMIN,
  MOCK_ALL_USERS,
  MOCK_PROJECTS,
  MOCK_ACHIEVEMENTS,
  MOCK_PUBLICATIONS,
  MOCK_ARTICLES,
  MOCK_OPPORTUNITIES,
  MOCK_ANNOUNCEMENTS,
  MOCK_EVENTS,
  MOCK_LINKEDIN_IMPORTS,
  MOCK_NOTIFICATIONS,
  MOCK_CONNECTION_REQUESTS,
  MOCK_VERIFICATION_REQUESTS,
  MOCK_MODERATION_REPORTS
} from '../data/mockData';

export type MainTab = 'home' | 'discover' | 'network' | 'opportunities' | 'profile' | 'department' | 'admin';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: 'student' | 'alumni' | 'faculty' | 'admin') => void;
  currentTab: MainTab;
  setCurrentTab: (tab: MainTab) => void;
  
  // Data
  users: User[];
  projects: Project[];
  achievements: Achievement[];
  publications: Publication[];
  articles: Article[];
  opportunities: Opportunity[];
  announcements: Announcement[];
  events: DepartmentEvent[];
  notifications: AppNotification[];
  connectionRequests: ConnectionRequest[];
  verificationRequests: VerificationRequest[];
  adminVerificationQueue?: VerificationRequest[];
  moderationReports: ModerationReport[];
  flaggedItems?: ModerationReport[];
  linkedInImports: LinkedInImportItem[];
  savedItemIds: Set<string>;
  
  // Search & Filters
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  activeDiscoverCategory: string;
  setActiveDiscoverCategory: (cat: string) => void;
  
  // Actions
  toggleSaveItem: (id: string) => void;
  isItemSaved: (id: string) => boolean;
  acceptConnectionRequest: (requestId: string) => void;
  declineConnectionRequest: (requestId: string) => void;
  sendConnectionRequest: (userId: string) => void;
  addProject: (project: Project) => void;
  addAchievement: (achievement: Achievement) => void;
  addPublication: (publication: Publication) => void;
  addArticle: (article: Article) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  addAnnouncement: (announcement: Partial<Announcement> & { title: string; description: string }) => void;
  publishAnnouncement?: (announcement: Partial<Announcement> & { title: string; description: string }) => void;
  submitReport: (contentTitle: string, reason: string, details: string) => void;
  approveVerification: (requestId: string) => void;
  rejectVerification: (requestId: string) => void;
  resolveModerationReport: (reportId: string, action: 'approve' | 'remove') => void;
  resolveFlaggedItem?: (itemId: string, action: 'dismiss' | 'remove') => void;
  applyLinkedInData: (data: { headline?: string; skills?: string[]; experience?: any[]; education?: any[] }) => void;
  syncLinkedInSelected: (selectedIds: string[]) => void;
  syncLinkedInAll: () => void;
  toggleLinkedInSelect: (id: string) => void;
  updateUserPrivacy: (settings: User['privacy']) => void;
  updateNotificationSettings: (settings: User['notificationSettings']) => void;
  markNotificationsAsRead: () => void;
  
  // Active modals
  selectedArticle: Article | null;
  setSelectedArticle: (art: Article | null) => void;
  selectedPublication: Publication | null;
  setSelectedPublication: (pub: Publication | null) => void;
  selectedAchievement: Achievement | null;
  setSelectedAchievement: (ach: Achievement | null) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  selectedUserForProfile: User | null;
  setSelectedUserForProfile: (user: User | null) => void;
  selectedOpportunity: Opportunity | null;
  setSelectedOpportunity: (opp: Opportunity | null) => void;
  selectedEvent: DepartmentEvent | null;
  setSelectedEvent: (evt: DepartmentEvent | null) => void;
  
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  createModalInitialType?: string;
  openCreateModalWithType: (type: string) => void;
  
  isLinkedInModalOpen: boolean;
  setIsLinkedInModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isNotificationsModalOpen: boolean;
  setIsNotificationsModalOpen: (open: boolean) => void;
  isSavedModalOpen: boolean;
  setIsSavedModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isMentorshipModalOpen: boolean;
  setIsMentorshipModalOpen: (open: boolean) => void;
  mentorTargetUser: User | null;
  openMentorshipRequest: (user: User) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'pending';
  setAuthModalMode: (mode: 'login' | 'register' | 'pending') => void;
  
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER_STUDENT);
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [users, setUsers] = useState<User[]>(MOCK_ALL_USERS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [publications, setPublications] = useState<Publication[]>(MOCK_PUBLICATIONS);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [events, setEvents] = useState<DepartmentEvent[]>(MOCK_EVENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(MOCK_CONNECTION_REQUESTS);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(MOCK_VERIFICATION_REQUESTS);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(MOCK_MODERATION_REPORTS);
  const [linkedInImports, setLinkedInImports] = useState<LinkedInImportItem[]>(MOCK_LINKEDIN_IMPORTS);
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set(['art-1', 'pub-1', 'proj-1', 'opp-1']));
  
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeDiscoverCategory, setActiveDiscoverCategory] = useState('For You');
  
  // Modals state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<User | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<DepartmentEvent | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialType, setCreateModalInitialType] = useState<string>('achievement');
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMentorshipModalOpen, setIsMentorshipModalOpen] = useState(false);
  const [mentorTargetUser, setMentorTargetUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'pending'>('login');
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const switchRole = (role: 'student' | 'alumni' | 'faculty' | 'admin') => {
    if (role === 'student') setCurrentUser(CURRENT_USER_STUDENT);
    else if (role === 'alumni') setCurrentUser(CURRENT_USER_ALUMNI);
    else if (role === 'faculty') setCurrentUser(CURRENT_USER_FACULTY);
    else if (role === 'admin') {
      setCurrentUser(CURRENT_USER_ADMIN);
      setCurrentTab('admin');
    }
    showToast(`Switched active profile to ${role.toUpperCase()}`);
  };

  const toggleSaveItem = (id: string) => {
    setSavedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Removed from Saved bookmarks');
      } else {
        next.add(id);
        showToast('Saved to your bookmarks!');
      }
      return next;
    });
  };

  const isItemSaved = (id: string) => savedItemIds.has(id);

  const acceptConnectionRequest = (requestId: string) => {
    setConnectionRequests((prev) => prev.filter((r) => r.id !== requestId));
    showToast('Connection request accepted!');
  };

  const declineConnectionRequest = (requestId: string) => {
    setConnectionRequests((prev) => prev.filter((r) => r.id !== requestId));
    showToast('Connection request declined');
  };

  const sendConnectionRequest = (userId: string) => {
    showToast('Connection request sent!');
  };

  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
    showToast(`Project "${project.title}" published successfully!`);
  };

  const addAchievement = (achievement: Achievement) => {
    setAchievements((prev) => [achievement, ...prev]);
    showToast(`Achievement "${achievement.title}" recorded!`);
  };

  const addPublication = (publication: Publication) => {
    setPublications((prev) => [publication, ...prev]);
    showToast(`Publication "${publication.title}" submitted!`);
  };

  const addArticle = (article: Article) => {
    setArticles((prev) => [article, ...prev]);
    showToast(`Article "${article.title}" published!`);
  };

  const addOpportunity = (opportunity: Opportunity) => {
    setOpportunities((prev) => [opportunity, ...prev]);
    showToast(`Opportunity "${opportunity.title}" posted!`);
  };

  const addAnnouncement = (ann: Partial<Announcement> & { title: string; description: string }) => {
    const newAnn: Announcement = {
      id: ann.id || `ann-${Date.now()}`,
      title: ann.title,
      category: (ann.category as any) || 'General',
      description: ann.description,
      isPinned: !!ann.isPinned,
      author: ann.author || 'IRE Admin Desk',
      date: ann.date || 'Just now'
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast(`Announcement "${ann.title}" published!`);
  };

  const applyLinkedInData = (data: {
    headline?: string;
    skills?: string[];
    experience?: any[];
    education?: any[];
  }) => {
    setCurrentUser((prev) => ({
      ...prev,
      headline: data.headline || prev.headline,
      skills: data.skills || prev.skills,
      experience: data.experience || prev.experience,
      education: data.education || prev.education
    }));
    showToast('LinkedIn profile synchronized successfully!');
    setIsLinkedInModalOpen(false);
  };

  const submitReport = (contentTitle: string, reason: string, details: string) => {
    const newReport: ModerationReport = {
      id: `rep-${Date.now()}`,
      contentId: 'custom-id',
      contentType: 'Article',
      contentTitle,
      reason: reason as any,
      reportedBy: currentUser.name,
      reporterAvatar: currentUser.avatar,
      date: 'Just now',
      status: 'Under Review',
      details
    };
    setModerationReports((prev) => [newReport, ...prev]);
    showToast('Report submitted confidentially to Department Administration.');
    setIsReportModalOpen(false);
  };

  const approveVerification = (requestId: string) => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Verified' } : r))
    );
    showToast('User identity verified and official badge issued.');
  };

  const rejectVerification = (requestId: string) => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Rejected' } : r))
    );
    showToast('Verification rejected.');
  };

  const resolveModerationReport = (reportId: string, action: 'approve' | 'remove') => {
    setModerationReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: action === 'approve' ? 'Resolved' : 'Dismissed' }
          : r
      )
    );
    showToast(action === 'approve' ? 'Content approved/reinstated' : 'Content removed per safety rules');
  };

  const toggleLinkedInSelect = (id: string) => {
    setLinkedInImports((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const syncLinkedInSelected = (selectedIds: string[]) => {
    showToast(`Successfully imported ${selectedIds.length} items from LinkedIn!`);
    setIsLinkedInModalOpen(false);
  };

  const syncLinkedInAll = () => {
    showToast('Synced all external achievements & certifications from LinkedIn!');
    setIsLinkedInModalOpen(false);
  };

  const updateUserPrivacy = (settings: User['privacy']) => {
    setCurrentUser((prev) => ({ ...prev, privacy: settings }));
    showToast('Privacy settings updated successfully');
  };

  const updateNotificationSettings = (settings: User['notificationSettings']) => {
    setCurrentUser((prev) => ({ ...prev, notificationSettings: settings }));
    showToast('Notification preferences saved');
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
  };

  const openCreateModalWithType = (type: string) => {
    setCreateModalInitialType(type);
    setIsCreateModalOpen(true);
  };

  const openMentorshipRequest = (user: User) => {
    setMentorTargetUser(user);
    setIsMentorshipModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        currentTab,
        setCurrentTab,
        users,
        projects,
        achievements,
        publications,
        articles,
        opportunities,
        announcements,
        events,
        notifications,
        connectionRequests,
        verificationRequests,
        adminVerificationQueue: verificationRequests,
        moderationReports,
        flaggedItems: moderationReports,
        linkedInImports,
        savedItemIds,
        globalSearchQuery,
        setGlobalSearchQuery,
        activeDiscoverCategory,
        setActiveDiscoverCategory,
        toggleSaveItem,
        isItemSaved,
        acceptConnectionRequest,
        declineConnectionRequest,
        sendConnectionRequest,
        addProject,
        addAchievement,
        addPublication,
        addArticle,
        addOpportunity,
        addAnnouncement,
        publishAnnouncement: addAnnouncement,
        submitReport,
        approveVerification,
        rejectVerification,
        resolveModerationReport,
        resolveFlaggedItem: (itemId: string, action: 'dismiss' | 'remove') => {
          resolveModerationReport(itemId, action === 'remove' ? 'remove' : 'approve');
        },
        applyLinkedInData,
        syncLinkedInSelected,
        syncLinkedInAll,
        toggleLinkedInSelect,
        updateUserPrivacy,
        updateNotificationSettings,
        markNotificationsAsRead,
        selectedArticle,
        setSelectedArticle,
        selectedPublication,
        setSelectedPublication,
        selectedAchievement,
        setSelectedAchievement,
        selectedProject,
        setSelectedProject,
        selectedUserForProfile,
        setSelectedUserForProfile,
        selectedOpportunity,
        setSelectedOpportunity,
        selectedEvent,
        setSelectedEvent,
        isCreateModalOpen,
        setIsCreateModalOpen,
        createModalInitialType,
        openCreateModalWithType,
        isLinkedInModalOpen,
        setIsLinkedInModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isNotificationsModalOpen,
        setIsNotificationsModalOpen,
        isSavedModalOpen,
        setIsSavedModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        isMentorshipModalOpen,
        setIsMentorshipModalOpen,
        mentorTargetUser,
        openMentorshipRequest,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
