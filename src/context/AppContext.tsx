import React, { createContext, useContext, useMemo, useState } from 'react';
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
  VerificationRequest,
  WorkflowItem
} from '../types';
import { supabase } from '../lib/supabase';

export type MainTab = 'home' | 'discover' | 'network' | 'opportunities' | 'profile' | 'department' | 'admin';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
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
  linkedInImports: LinkedInImportItem[];
  savedItemIds: Set<string>;
  networkStats: { students: number; alumni: number; projects: number };
  getConnectionCount: (userId: string) => number;
  updateProfileImage: (file: File, type: 'avatar' | 'banner') => Promise<void>;
  isUploadingProfileImage: boolean;
  
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
  submitMentorshipRequest: (request: { mentorId: string; topic: string; goals: string; preferredFrequency: string }) => void;
  addProject: (project: Project) => void;
  addAchievement: (achievement: Achievement) => void;
  addPublication: (publication: Publication) => void;
  addArticle: (article: Article) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  addAnnouncement: (announcement: Partial<Announcement> & { title: string; description: string }) => void;
  publishAnnouncement?: (announcement: Partial<Announcement> & { title: string; description: string }) => void;
  submitReport: (contentTitle: string, reason: string, details: string) => void;
  getConnectionStatus: (userId: string) => 'connected' | 'pending' | 'none';
  applyLinkedInData: (data: { headline?: string; skills?: string[]; experience?: any[]; education?: any[] }) => void;
  syncLinkedInSelected: (selectedIds: string[]) => void;
  syncLinkedInAll: () => void;
  toggleLinkedInSelect: (id: string) => void;
  updateUserPrivacy: (settings: User['privacy']) => void;
  updateNotificationSettings: (settings: User['notificationSettings']) => void;
  updateProfileBio: (bio: string) => void;
  updateProfileDetails: (details: { headline: string; skills: string[]; education: User['education']; experience: User['experience']; externalLinks: User['externalLinks'] }) => void;
  markNotificationsAsRead: () => void;
  hydrateNotifications: (notifications: AppNotification[]) => void;
  hydratePersistedAccount: (data: { user: User; notifications: AppNotification[]; savedItemIds: string[] }) => void;
  hydratePersistedContent: (data: { projects: Project[]; achievements: Achievement[]; publications: Publication[]; articles: Article[]; opportunities: Opportunity[]; announcements: Announcement[] }) => void;
  hydrateDirectory: (users: User[]) => void;
  hydrateWorkflows: (workflows: WorkflowItem[]) => void;
  
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
  selectedMentorForRequest: User | null;
  openMentorshipRequest: (user: User) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'pending';
  setAuthModalMode: (mode: 'login' | 'register' | 'pending') => void;
  
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const emptyUser: User = {
  id: '', name: '', email: '', role: 'student', verificationStatus: 'Pending Verification', avatar: '',
  department: '', headline: '', bio: '', location: '', skills: [], education: [], experience: [], externalLinks: {},
  privacy: { cv: 'private', email: 'private', phone: 'private', experience: 'private', projects: 'private', achievements: 'private', publications: 'private', externalLinks: 'private' },
  notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(emptyUser);
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([]);
  const [linkedInImports, setLinkedInImports] = useState<LinkedInImportItem[]>([]);
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set());
  
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
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);

  const connectionRequests = useMemo(
    () => workflowToConnectionRequests(workflowItems, users, currentUser.id),
    [workflowItems, users, currentUser.id]
  );
  const networkStats = useMemo(() => ({
    students: 330 + users.filter((user) => user.role === 'student').length,
    alumni: 65 + users.filter((user) => user.role === 'alumni').length,
    projects: projects.length
  }), [projects.length, users]);
  const getConnectionCount = (userId: string) => workflowItems.filter(
    (item) => item.workflow_type === 'connection_request' && item.status === 'accepted' && (item.requester_id === userId || item.recipient_id === userId)
  ).length;
  const getConnectionStatus = (userId: string): 'connected' | 'pending' | 'none' => {
    const workflow = workflowItems.find((item) => item.workflow_type === 'connection_request' &&
      ((item.requester_id === currentUser.id && item.recipient_id === userId) || (item.requester_id === userId && item.recipient_id === currentUser.id)));
    if (!workflow) return 'none';
    return workflow.status === 'accepted' ? 'connected' : workflow.status === 'pending' ? 'pending' : 'none';
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const updateWorkflowStatus = async (workflowId: string, status: string, successMessage: string, errorMessage: string) => {
    const { error } = await supabase.from('workflow_items').update({ status, updated_at: new Date().toISOString() }).eq('id', workflowId);
    if (error) {
      showToast(errorMessage);
      return;
    }
    setWorkflowItems((prev) => prev.map((item) => item.id === workflowId ? { ...item, status, updated_at: new Date().toISOString() } : item));
    showToast(successMessage);
  };

  const invokeAdminAction = async (payload: Record<string, string>, successMessage: string, errorMessage: string) => {
    const { data, error } = await supabase.functions.invoke('admin-action', { body: payload });
    if (error || data?.error) {
      showToast(data?.error || errorMessage);
      return;
    }
    if (payload.workflowId) {
      const nextStatus = payload.action === 'verify_user' ? 'verified' : payload.action === 'reject_verification' ? 'rejected' : payload.action === 'remove_content' ? 'dismissed' : 'resolved';
      setWorkflowItems((prev) => prev.map((item) => item.id === payload.workflowId ? { ...item, status: nextStatus, updated_at: new Date().toISOString() } : item));
    }
    showToast(successMessage);
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
    const isSaved = savedItemIds.has(id);
    void (isSaved
      ? supabase.from('saved_items').delete().eq('user_id', currentUser.id).eq('item_id', id)
      : supabase.from('saved_items').upsert({ user_id: currentUser.id, item_id: id }));
  };

  const isItemSaved = (id: string) => savedItemIds.has(id);

  const acceptConnectionRequest = (requestId: string) => {
    void updateWorkflowStatus(requestId, 'accepted', 'Connection request accepted!', 'Could not accept the connection request.');
  };

  const declineConnectionRequest = (requestId: string) => {
    void updateWorkflowStatus(requestId, 'declined', 'Connection request declined', 'Could not decline the connection request.');
  };

  const sendConnectionRequest = (userId: string) => {
    const targetUser = users.find((user) => user.id === userId);
    if (!targetUser || !isUuid(userId)) {
      showToast('This demo profile cannot receive a request yet. Ask the member to register first.');
      return;
    }
    const workflowItem: WorkflowItem = {
      id: `connection-${currentUser.id}-${userId}`,
      workflow_type: 'connection_request',
      requester_id: currentUser.id,
      recipient_id: userId,
      status: 'pending',
      data: { requester: currentUser, recipientName: targetUser.name },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setWorkflowItems((prev) => [workflowItem, ...prev.filter((item) => item.id !== workflowItem.id)]);
    void supabase.from('workflow_items').upsert(workflowItem).then(({ error }) => showToast(error ? 'Could not send the connection request.' : 'Connection request sent!'));
  };

  const submitMentorshipRequest = (request: { mentorId: string; topic: string; goals: string; preferredFrequency: string }) => {
    const mentor = users.find((user) => user.id === request.mentorId);
    if (!mentor || !isUuid(request.mentorId)) {
      showToast('This demo profile cannot receive a request yet. Ask the mentor to register first.');
      return;
    }
    const workflowItem: WorkflowItem = {
      id: `mentorship-${currentUser.id}-${request.mentorId}-${Date.now()}`,
      workflow_type: 'mentorship_request',
      requester_id: currentUser.id,
      recipient_id: request.mentorId,
      status: 'pending',
      data: { requester: currentUser, topic: request.topic, goals: request.goals, preferredFrequency: request.preferredFrequency },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setWorkflowItems((prev) => [workflowItem, ...prev.filter((item) => item.id !== workflowItem.id)]);
    void supabase.from('workflow_items').upsert(workflowItem).then(({ error }) => showToast(error ? 'Could not send the mentorship request.' : 'Mentorship request sent!'));
    setIsMentorshipModalOpen(false);
  };

  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
    void persistContent('project', project);
    showToast(`Project "${project.title}" published successfully!`);
  };

  const addAchievement = (achievement: Achievement) => {
    setAchievements((prev) => [achievement, ...prev]);
    void persistContent('achievement', achievement);
    showToast(`Achievement "${achievement.title}" recorded!`);
  };

  const addPublication = (publication: Publication) => {
    setPublications((prev) => [publication, ...prev]);
    void persistContent('publication', publication);
    showToast(`Publication "${publication.title}" submitted!`);
  };

  const addArticle = (article: Article) => {
    setArticles((prev) => [article, ...prev]);
    void persistContent('article', article);
    showToast(`Article "${article.title}" published!`);
  };

  const addOpportunity = (opportunity: Opportunity) => {
    setOpportunities((prev) => [opportunity, ...prev]);
    void persistContent('opportunity', opportunity);
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
    void persistContent('announcement', newAnn);
    showToast(`Announcement "${ann.title}" published!`);
  };

  const publishAnnouncement = (ann: Partial<Announcement> & { title: string; description: string }) => {
    void (async () => {
      const { data, error } = await supabase.functions.invoke('admin-action', {
        body: { action: 'publish_announcement', title: ann.title, description: ann.description, category: String(ann.category || 'General'), isPinned: String(!!ann.isPinned) }
      });
      if (error || data?.error) {
        showToast(data?.error || 'Announcement publishing failed.');
        return;
      }
      if (data?.announcement) setAnnouncements((prev) => [data.announcement as Announcement, ...prev]);
      showToast(`Announcement "${ann.title}" published successfully!`);
    })();
  };

  const applyLinkedInData = (data: {
    headline?: string;
    skills?: string[];
    experience?: any[];
    education?: any[];
  }) => {
    const updatedUser = {
      ...currentUser,
      headline: data.headline || currentUser.headline,
      skills: data.skills || currentUser.skills,
      experience: data.experience || currentUser.experience,
      education: data.education || currentUser.education
    };
    setCurrentUser(updatedUser);
    void supabase.from('profiles').update({
      headline: updatedUser.headline,
      skills: updatedUser.skills,
      experience: updatedUser.experience,
      education: updatedUser.education,
      updated_at: new Date().toISOString()
    }).eq('user_id', currentUser.id);
    showToast('LinkedIn profile synchronized successfully!');
    setIsLinkedInModalOpen(false);
  };

  const submitReport = (contentTitle: string, reason: string, details: string) => {
    const workflowItem: WorkflowItem = {
      id: `report-${Date.now()}`,
      workflow_type: 'moderation_report',
      requester_id: currentUser.id,
      recipient_id: null,
      status: 'pending',
      data: {
        contentId: 'custom-id',
        contentType: 'Article',
        contentTitle,
        reason,
        reportedBy: currentUser.name,
        reporterAvatar: currentUser.avatar,
        date: 'Just now',
        details
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setWorkflowItems((prev) => [workflowItem, ...prev.filter((item) => item.id !== workflowItem.id)]);
    showToast('Report submitted confidentially to Department Administration.');
    setIsReportModalOpen(false);
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
    void supabase.from('profiles').update({ privacy: settings, updated_at: new Date().toISOString() }).eq('user_id', currentUser.id);
    showToast('Privacy settings updated successfully');
  };

  const updateNotificationSettings = (settings: User['notificationSettings']) => {
    setCurrentUser((prev) => ({ ...prev, notificationSettings: settings }));
    void supabase.from('profiles').update({ notification_settings: settings, updated_at: new Date().toISOString() }).eq('user_id', currentUser.id);
    showToast('Notification preferences saved');
  };

  const updateProfileBio = (bio: string) => {
    const trimmedBio = bio.trim().slice(0, 280);
    setCurrentUser((prev) => ({ ...prev, bio: trimmedBio }));
    void supabase.from('profiles').update({ bio: trimmedBio, updated_at: new Date().toISOString() }).eq('user_id', currentUser.id);
  };

  const updateProfileDetails = (details: { headline: string; skills: string[]; education: User['education']; experience: User['experience']; externalLinks: User['externalLinks'] }) => {
    setCurrentUser((previous) => ({ ...previous, ...details }));
    void supabase.from('profiles').update({
      headline: details.headline.trim(),
      skills: details.skills,
      education: details.education,
      experience: details.experience,
      external_links: details.externalLinks,
      updated_at: new Date().toISOString()
    }).eq('user_id', currentUser.id);
  };

  const updateProfileImage = async (file: File, type: 'avatar' | 'banner') => {
    if (!currentUser.id || !file.type.startsWith('image/')) {
      showToast('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Images must be 5 MB or smaller.');
      return;
    }
    setIsUploadingProfileImage(true);
    try {
      const processedFile = await prepareProfileImage(file, type);
      const path = `${currentUser.id}/${type}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage.from('profile-media').upload(path, processedFile, { upsert: false, contentType: 'image/jpeg' });
      if (uploadError) {
        showToast(`Could not upload image: ${uploadError.message}`);
        return;
      }
      const { data } = supabase.storage.from('profile-media').getPublicUrl(path);
      const column = type === 'avatar' ? 'avatar_url' : 'banner_url';
      const pathColumn = type === 'avatar' ? 'avatar_path' : 'banner_path';
      const oldPath = type === 'avatar' ? currentUser.avatarPath : currentUser.bannerPath;
      const { error: profileError } = await supabase.from('profiles').update({ [column]: data.publicUrl, [pathColumn]: path, updated_at: new Date().toISOString() }).eq('user_id', currentUser.id);
      if (profileError) {
        showToast(`Image uploaded, but profile update failed: ${profileError.message}`);
        return;
      }
      if (oldPath) await supabase.storage.from('profile-media').remove([oldPath]);
      setCurrentUser((previous) => ({ ...previous, ...(type === 'avatar' ? { avatar: data.publicUrl, avatarPath: path } : { bannerUrl: data.publicUrl, bannerPath: path }) }));
      showToast(type === 'avatar' ? 'Profile photo updated.' : 'Profile banner updated.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not process that image.');
    } finally {
      setIsUploadingProfileImage(false);
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    void supabase.from('notifications').update({ is_read: true }).eq('user_id', currentUser.id).eq('is_read', false);
    showToast('All notifications marked as read');
  };

  const hydratePersistedAccount = ({ user, notifications: persistedNotifications, savedItemIds: persistedSavedItemIds }: { user: User; notifications: AppNotification[]; savedItemIds: string[] }) => {
    setCurrentUser(user);
    setNotifications(persistedNotifications);
    setSavedItemIds(new Set(persistedSavedItemIds));
  };
  const hydrateNotifications = (nextNotifications: AppNotification[]) => setNotifications(nextNotifications);
  const hydrateWorkflows = (nextWorkflows: WorkflowItem[]) => setWorkflowItems(nextWorkflows);

  const hydratePersistedContent = (data: { projects: Project[]; achievements: Achievement[]; publications: Publication[]; articles: Article[]; opportunities: Opportunity[]; announcements: Announcement[] }) => {
    const merge = <T extends { id: string }>(existing: T[], persisted: T[]) => [...persisted, ...existing.filter((item) => !persisted.some((storedItem) => storedItem.id === item.id))];
    setProjects((previous) => merge(previous, data.projects));
    setAchievements((previous) => merge(previous, data.achievements));
    setPublications((previous) => merge(previous, data.publications));
    setArticles((previous) => merge(previous, data.articles));
    setOpportunities((previous) => merge(previous, data.opportunities));
    setAnnouncements((previous) => merge(previous, data.announcements));
  };
  const hydrateDirectory = (persistedUsers: User[]) => setUsers(persistedUsers);

  const persistContent = (contentType: string, data: { id: string }) =>
    supabase.from('content_items').upsert({ id: data.id, owner_id: currentUser.id, content_type: contentType, data });

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
        linkedInImports,
        savedItemIds,
        networkStats,
        getConnectionCount,
        getConnectionStatus,
        updateProfileImage,
        isUploadingProfileImage,
        globalSearchQuery,
        setGlobalSearchQuery,
        activeDiscoverCategory,
        setActiveDiscoverCategory,
        toggleSaveItem,
        isItemSaved,
        acceptConnectionRequest,
        declineConnectionRequest,
        sendConnectionRequest,
        submitMentorshipRequest,
        addProject,
        addAchievement,
        addPublication,
        addArticle,
        addOpportunity,
        addAnnouncement,
        publishAnnouncement,
        submitReport,
        applyLinkedInData,
        syncLinkedInSelected,
        syncLinkedInAll,
        toggleLinkedInSelect,
        updateUserPrivacy,
        updateNotificationSettings,
        updateProfileBio,
        updateProfileDetails,
        markNotificationsAsRead,
        hydrateNotifications,
        hydrateWorkflows,
        hydratePersistedAccount,
        hydratePersistedContent,
        hydrateDirectory,
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
        selectedMentorForRequest: mentorTargetUser,
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

const workflowToConnectionRequests = (items: WorkflowItem[], users: User[], currentUserId: string): ConnectionRequest[] => items
  .filter((item) => item.workflow_type === 'connection_request' && item.recipient_id === currentUserId && item.status === 'pending')
  .map((item) => ({
    id: item.id,
    user: users.find((user) => user.id === item.requester_id) || item.data.user as User,
    mutualConnections: Number(item.data.mutualConnections || 0),
    timestamp: item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now',
    status: 'pending',
    isIncoming: true
  }));

const workflowToVerificationRequests = (items: WorkflowItem[], users: User[]): VerificationRequest[] => items
  .filter((item) => item.workflow_type === 'verification_request' && item.status === 'pending')
  .map((item) => ({
    id: item.id,
    user: users.find((user) => user.id === item.requester_id) || item.data.user as User,
    submittedAt: String(item.data.submittedAt || item.created_at || 'Recent'),
    status: 'Pending',
    evidenceDocUrl: typeof item.data.evidenceDocUrl === 'string' ? item.data.evidenceDocUrl : undefined,
    degreeProgram: typeof item.data.degreeProgram === 'string' ? item.data.degreeProgram : undefined
  }));

const workflowToModerationReports = (items: WorkflowItem[]): ModerationReport[] => items
  .filter((item) => item.workflow_type === 'moderation_report' && item.status === 'pending')
  .map((item) => ({
    id: item.id,
    contentId: String(item.data.contentId || ''),
    contentType: (item.data.contentType || 'Article') as ModerationReport['contentType'],
    contentTitle: String(item.data.contentTitle || 'Flagged Record'),
    reason: (item.data.reason || 'Spam') as ModerationReport['reason'],
    reportedBy: String(item.data.reportedBy || 'Department User'),
    reporterAvatar: typeof item.data.reporterAvatar === 'string' ? item.data.reporterAvatar : undefined,
    date: String(item.data.date || item.created_at || 'Recent'),
    status: 'Under Review',
    details: typeof item.data.details === 'string' ? item.data.details : undefined
  }));

const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const prepareProfileImage = (file: File, type: 'avatar' | 'banner'): Promise<File> => new Promise((resolve, reject) => {
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);
  image.onload = () => {
    const targetRatio = type === 'avatar' ? 1 : 3;
    const sourceRatio = image.width / image.height;
    const sourceWidth = sourceRatio > targetRatio ? image.height * targetRatio : image.width;
    const sourceHeight = sourceRatio > targetRatio ? image.height : image.width / targetRatio;
    const scale = Math.min(1600 / sourceWidth, 1600 / sourceHeight, 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    canvas.getContext('2d')?.drawImage(image, (image.width - sourceWidth) / 2, (image.height - sourceHeight) / 2, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      URL.revokeObjectURL(objectUrl);
      if (blob) resolve(new File([blob], `${type}.jpg`, { type: 'image/jpeg' }));
      else reject(new Error('Image processing failed.'));
    }, 'image/jpeg', 0.82);
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('Image processing failed.'));
  };
  image.src = objectUrl;
});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
