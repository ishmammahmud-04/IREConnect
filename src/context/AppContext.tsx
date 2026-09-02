import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
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
  syncCurrentTabFromPath: (path: string) => void;
  
  // Data
  users: User[];
  projects: Project[];
  achievements: Achievement[];
  publications: Publication[];
  articles: Article[];
  opportunities: Opportunity[];
  announcements: Announcement[];
  events: DepartmentEvent[];
  toggleEventRsvp: (eventId: string) => void;
  createDepartmentEvent: (event: DepartmentEvent) => Promise<void>;
  notifications: AppNotification[];
  directorySearchResults: User[] | null;
  searchDirectoryUsers: (query: string) => Promise<void>;
  adminVerificationQueue: VerificationRequest[];
  verificationRequests: VerificationRequest[];
  approveVerification: (requestId: string) => void;
  rejectVerification: (requestId: string) => void;
  flaggedItems: ModerationReport[];
  moderationReports: ModerationReport[];
  resolveFlaggedItem: (reportId: string, action: 'dismiss' | 'remove') => void;
  resolveModerationReport: (reportId: string, action: 'approve' | 'remove') => void;
  connectionRequests: ConnectionRequest[];
  linkedInImports: LinkedInImportItem[];
  savedItemIds: Set<string>;
  networkStats: { students: number; alumni: number; projects: number };
  getConnectionCount: (userId: string) => number;
  getMutualConnectionCount: (userId: string) => number;
  getConnectionUsers: (status: 'connected' | 'pending', direction?: 'incoming' | 'outgoing') => User[];
  updateProfileImage: (file: File, type: 'avatar' | 'banner') => Promise<void>;
  updateProfileCV: (file: File) => Promise<void>;
  deleteProfileCV: () => Promise<void>;
  isUploadingProfileImage: boolean;
  isUploadingCV: boolean;
  
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
  createProject: (project: Project) => void;
  addProject: (project: Project) => void;
  createAchievement: (achievement: Achievement) => void;
  addAchievement: (achievement: Achievement) => void;
  createPublication: (publication: Publication) => void;
  addPublication: (publication: Publication) => void;
  createArticle: (article: Article) => void;
  addArticle: (article: Article) => void;
  createOpportunity: (opportunity: Opportunity) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  createAnnouncement: (announcement: Partial<Announcement> & { title: string; description: string }) => void;
  addAnnouncement: (announcement: Partial<Announcement> & { title: string; description: string }) => void;
  deletePublishedContent: (contentType: 'project' | 'publication' | 'achievement' | 'article' | 'opportunity' | 'announcement', id: string) => Promise<boolean>;
  updatePublishedContent: (contentType: 'project' | 'publication' | 'achievement' | 'article' | 'opportunity' | 'announcement', item: any) => Promise<boolean>;
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
  markNotificationsAsRead: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  hydrateNotifications: (notifications: AppNotification[]) => void;
  hydratePersistedAccount: (data: { user: User; notifications: AppNotification[]; savedItemIds: string[] }) => void;
  hydratePersistedContent: (data: { projects: Project[]; achievements: Achievement[]; publications: Publication[]; articles: Article[]; opportunities: Opportunity[]; announcements: Announcement[]; events?: DepartmentEvent[] }) => void;
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
  createModalEditingItem?: { type: 'project' | 'publication' | 'achievement' | 'article' | 'opportunity'; item: any } | null;
  setCreateModalEditingItem: (item: { type: 'project' | 'publication' | 'achievement' | 'article' | 'opportunity'; item: any } | null) => void;
  openCreateModalWithType: (type: string) => void;
  
  isLinkedInModalOpen: boolean;
  setIsLinkedInModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isNotificationsModalOpen: boolean;
  setIsNotificationsModalOpen: (open: boolean) => void;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;
  chatTargetUser: User | null;
  openChat: (user: User) => void;
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
  cvUrl: undefined,
  cvPath: undefined,
  privacy: { cv: 'private', email: 'private', phone: 'private', experience: 'private', projects: 'private', achievements: 'private', publications: 'private', externalLinks: 'private' },
  notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(emptyUser);
  const [currentTab, setCurrentTabState] = useState<MainTab>('home');
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [directorySearchResults, setDirectorySearchResults] = useState<User[] | null>(null);
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
  const [createModalEditingItem, setCreateModalEditingItem] = useState<{ type: 'project' | 'publication' | 'achievement' | 'article' | 'opportunity'; item: any } | null>(null);
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
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState<User | null>(null);

  const toggleEventRsvp = (eventId: string) => {
    setEvents((prev) => prev.map((event) => {
      if (event.id !== eventId) return event;
      const isRsvped = !event.isUserRsvped;
      const attendeesCount = Math.max(0, (event.attendeesCount ?? event.participantsCount ?? 0) + (isRsvped ? 1 : -1));
      return { ...event, isUserRsvped: isRsvped, attendeesCount };
    }));
    const event = events.find((item) => item.id === eventId);
    if (event) {
      showToast(event.isUserRsvped ? `RSVP cancelled for ${event.title}.` : `RSVP confirmed for ${event.title}.`);
    }
  };

  const createDepartmentEvent = async (event: DepartmentEvent) => {
    const ok = await persistContent('event', event);
    if (!ok) return;
    setEvents((previous) => [event, ...previous.filter((existing) => existing.id !== event.id)]);
    showToast(`Event "${event.title}" added to the department calendar.`);
  };

  const searchDirectoryUsers = async (query: string) => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setDirectorySearchResults(null);
      return;
    }
    const pattern = `%${normalizedQuery.replace(/[%_]/g, '\\$&')}%`;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.${pattern},headline.ilike.${pattern},location.ilike.${pattern}`)
      .order('full_name')
      .limit(50);
    if (error) {
      showToast('Directory search is temporarily unavailable.');
      return;
    }
    setDirectorySearchResults((data || []).map((profile) => profileRowToDirectoryUser(profile as Record<string, unknown>)));
  };

  const tabToPath: Record<MainTab, string> = {
    home: '/',
    discover: '/discover',
    network: '/network',
    opportunities: '/opportunities',
    department: '/department',
    profile: '/profile',
    admin: '/admindashboard'
  };

  const setCurrentTab = useCallback((tab: MainTab) => {
    setSelectedUserForProfile(null);
    setCurrentTabState(tab);
    if (typeof window === 'undefined') return;
    const nextPath = tabToPath[tab];
    if (nextPath && window.location.pathname !== nextPath) {
      window.history.pushState({ tab }, '', nextPath);
    }
  }, [tabToPath]);

  const syncCurrentTabFromPath = useCallback((path: string) => {
    const normalizedPath = path.split('?')[0].replace(/\/+$/, '') || '/';
    if (normalizedPath.startsWith('/profile/')) {
      setCurrentTabState('profile');
      return;
    }

    const routeMap: Record<string, MainTab> = {
      '/': 'home',
      '/discover': 'discover',
      '/network': 'network',
      '/opportunities': 'opportunities',
      '/department': 'department',
      '/profile': 'profile',
      '/admin': 'admin',
      '/admindashboard': 'admin'
    };
    setCurrentTabState(routeMap[normalizedPath] || 'home');
  }, []);

  const connectionRequests = useMemo(
    () => workflowToConnectionRequests(workflowItems, users, currentUser.id),
    [workflowItems, users, currentUser.id]
  );
  const verificationRequests = useMemo(
    () => workflowToVerificationRequests(workflowItems, users),
    [workflowItems, users]
  );
  const moderationReports = useMemo(
    () => workflowToModerationReports(workflowItems),
    [workflowItems]
  );
  const adminVerificationQueue = verificationRequests;
  const flaggedItems = moderationReports;
  const networkStats = useMemo(() => ({
    students: 330 + users.filter((user) => user.role === 'student' && isCountedStudent(user)).length,
    alumni: users.filter((user) => user.role === 'alumni').length,
    projects: projects.length
  }), [projects.length, users]);
  const getConnectionCount = (userId: string) => workflowItems.filter(
    (item) => item.workflow_type === 'connection_request' && item.status === 'accepted' && (item.requester_id === userId || item.recipient_id === userId)
  ).length;

  const getMutualConnectionCount = (userId: string) => {
    if (!currentUser.id || userId === currentUser.id) return 0;

    const myAcceptedConnectionIds = new Set(
      workflowItems
        .filter(
          (item) =>
            item.workflow_type === 'connection_request' &&
            item.status === 'accepted' &&
            (item.requester_id === currentUser.id || item.recipient_id === currentUser.id)
        )
        .map((item) => (item.requester_id === currentUser.id ? item.recipient_id : item.requester_id))
        .filter((id): id is string => Boolean(id))
    );

    const otherAcceptedConnectionIds = new Set(
      workflowItems
        .filter(
          (item) =>
            item.workflow_type === 'connection_request' &&
            item.status === 'accepted' &&
            (item.requester_id === userId || item.recipient_id === userId)
        )
        .map((item) => (item.requester_id === userId ? item.recipient_id : item.requester_id))
        .filter((id): id is string => Boolean(id))
    );

    let mutualCount = 0;
    myAcceptedConnectionIds.forEach((id) => {
      if (otherAcceptedConnectionIds.has(id)) mutualCount += 1;
    });

    return mutualCount;
  };

  const getConnectionStatus = (userId: string): 'connected' | 'pending' | 'none' => {
    const workflow = workflowItems.find((item) => item.workflow_type === 'connection_request' &&
      ((item.requester_id === currentUser.id && item.recipient_id === userId) || (item.requester_id === userId && item.recipient_id === currentUser.id)));
    if (!workflow) return 'none';
    return workflow.status === 'accepted' ? 'connected' : workflow.status === 'pending' ? 'pending' : 'none';
  };
  const getConnectionUsers = (status: 'connected' | 'pending', direction?: 'incoming' | 'outgoing') => {
    const ids = new Set(workflowItems
      .filter((item) => item.workflow_type === 'connection_request' && item.status === (status === 'connected' ? 'accepted' : 'pending'))
      .filter((item) => !direction || (direction === 'incoming' ? item.recipient_id === currentUser.id : item.requester_id === currentUser.id))
      .map((item) => item.requester_id === currentUser.id ? item.recipient_id : item.requester_id)
      .filter((id): id is string => Boolean(id)));
    return users.filter((user) => ids.has(user.id));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const confirmAction = (message: string) => {
    if (typeof window === 'undefined' || typeof window.confirm !== 'function') {
      return true;
    }
    return window.confirm(message);
  };

  const updateWorkflowStatus = async (workflowId: string, status: string, successMessage: string, errorMessage: string) => {
    if (!confirmAction('Are you sure you want to update this request?')) {
      return;
    }
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

  const createProject = async (project: Project) => {
    const ok = await persistContent('project', project);
    if (!ok) return;
    setProjects((prev) => [project, ...prev]);
    showToast(`Project "${project.title}" published successfully!`);
  };

  const addProject = createProject;

  const createAchievement = async (achievement: Achievement) => {
    const ok = await persistContent('achievement', achievement);
    if (!ok) return;
    setAchievements((prev) => [achievement, ...prev]);
    showToast(`Achievement "${achievement.title}" recorded!`);
  };

  const addAchievement = createAchievement;

  const createPublication = async (publication: Publication) => {
    const ok = await persistContent('publication', publication);
    if (!ok) return;
    setPublications((prev) => [publication, ...prev]);
    showToast(`Publication "${publication.title}" submitted!`);
  };

  const addPublication = createPublication;

  const createArticle = async (article: Article) => {
    const ok = await persistContent('article', article);
    if (!ok) return;
    setArticles((prev) => [article, ...prev]);
    showToast(`Article "${article.title}" published!`);
  };

  const addArticle = createArticle;

  const createOpportunity = async (opportunity: Opportunity) => {
    const ok = await persistContent('opportunity', opportunity);
    if (!ok) return;
    setOpportunities((prev) => [opportunity, ...prev]);
    showToast(`Opportunity "${opportunity.title}" posted!`);
  };

  const addOpportunity = createOpportunity;

  const createAnnouncement = async (ann: Partial<Announcement> & { title: string; description: string }) => {
    const newAnn: Announcement = {
      id: ann.id || `ann-${Date.now()}`,
      title: ann.title,
      category: (ann.category as any) || 'General',
      description: ann.description,
      isPinned: !!ann.isPinned,
      author: ann.author || 'IRE Admin Desk',
      date: ann.date || 'Just now'
    };
    const ok = await persistContent('announcement', newAnn);
    if (!ok) return;
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast(`Announcement "${ann.title}" published!`);
  };

  const addAnnouncement = createAnnouncement;

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

  const approveVerification = (requestId: string) => {
    void invokeAdminAction({ action: 'verify_user', workflowId: requestId }, 'Verification approved and badge issued.', 'Could not approve the verification request.');
  };

  const rejectVerification = (requestId: string) => {
    void invokeAdminAction({ action: 'reject_verification', workflowId: requestId }, 'Verification request rejected.', 'Could not reject the verification request.');
  };

  const resolveFlaggedItem = (reportId: string, action: 'dismiss' | 'remove') => {
    const resolvedAction = action === 'remove' ? 'remove_content' : 'dismiss_report';
    void invokeAdminAction(
      { action: resolvedAction, workflowId: reportId },
      action === 'remove' ? 'Flagged content removed.' : 'Report dismissed.',
      action === 'remove' ? 'Could not remove the flagged content.' : 'Could not dismiss the report.'
    );
  };

  const resolveModerationReport = (reportId: string, action: 'approve' | 'remove') => {
    const resolvedAction = action === 'remove' ? 'remove_content' : 'dismiss_report';
    void invokeAdminAction(
      { action: resolvedAction, workflowId: reportId },
      action === 'remove' ? 'Moderation report resolved and content removed.' : 'Moderation report approved and closed.',
      action === 'remove' ? 'Could not resolve the moderation report.' : 'Could not approve the moderation report.'
    );
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
    if (!confirmAction('Are you sure you want to save these privacy changes?')) {
      return;
    }
    setCurrentUser((prev) => ({ ...prev, privacy: settings }));
    void supabase.from('profiles').update({ privacy: settings, updated_at: new Date().toISOString() }).eq('user_id', currentUser.id);
    showToast('Privacy settings updated successfully');
  };

  const updateNotificationSettings = (settings: User['notificationSettings']) => {
    if (!confirmAction('Save these notification preferences?')) {
      return;
    }
    setCurrentUser((prev) => ({ ...prev, notificationSettings: settings }));
    void supabase.from('profiles').update({ notification_settings: settings, updated_at: new Date().toISOString() }).eq('user_id', currentUser.id);
    showToast('Notification preferences saved');
  };

  const updateProfileBio = (bio: string) => {
    if (!confirmAction('Save this profile bio update?')) {
      return;
    }
    const trimmedBio = bio.trim().slice(0, 280);
    setCurrentUser((prev) => ({ ...prev, bio: trimmedBio }));
    void supabase.from('profiles').update({ bio: trimmedBio, updated_at: new Date().toISOString() }).eq('user_id', currentUser.id);
  };

  const updateProfileDetails = (details: { headline: string; skills: string[]; education: User['education']; experience: User['experience']; externalLinks: User['externalLinks'] }) => {
    if (!confirmAction('Apply these profile changes?')) {
      return;
    }
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
    const normalizedName = file.name.toLowerCase();
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    const isAllowedPhoto = allowedMimeTypes.includes(file.type) || /\.(jpe?g|png|webp|bmp)$/i.test(normalizedName);

    if (!currentUser.id || !file.type.startsWith('image/')) {
      showToast('Please choose a standard image file.');
      return;
    }
    if (!isAllowedPhoto || /\.(gif|gifv|webm|mp4|mov|avi|m4v|mkv)$/i.test(normalizedName) || file.type === 'image/gif') {
      showToast('Only standard photo formats are allowed: JPG, JPEG, PNG, WEBP, or BMP. GIFs and videos are not supported.');
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

  const updateProfileCV = async (file: File) => {
    if (!currentUser.id) {
      showToast('Please sign in before uploading your CV.');
      return;
    }

    if (!confirmAction('Upload this CV and replace the current one?')) {
      return;
    }

    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      showToast('Only PDF files are allowed for your CV.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Your CV must be 10 MB or smaller.');
      return;
    }

    setIsUploadingCV(true);
    try {
      const path = `${currentUser.id}/cv-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage.from('profile-media').upload(path, file, {
        upsert: false,
        contentType: 'application/pdf'
      });

      if (uploadError) {
        showToast(`Could not upload CV: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage.from('profile-media').getPublicUrl(path);
      const oldPath = currentUser.cvPath;
      const { error: profileError } = await supabase.from('profiles').update({
        cv_url: data.publicUrl,
        cv_path: path,
        updated_at: new Date().toISOString()
      }).eq('user_id', currentUser.id);

      if (profileError) {
        showToast(`CV uploaded, but the profile save failed: ${profileError.message}`);
        return;
      }

      if (oldPath) await supabase.storage.from('profile-media').remove([oldPath]);
      setCurrentUser((previous) => ({ ...previous, cvUrl: data.publicUrl, cvPath: path }));
      showToast('CV uploaded successfully.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not upload that CV file.');
    } finally {
      setIsUploadingCV(false);
    }
  };

  const deleteProfileCV = async () => {
    if (!currentUser.id) {
      showToast('Please sign in before deleting your CV.');
      return;
    }

    if (!currentUser.cvPath && !currentUser.cvUrl) {
      showToast('No CV is currently uploaded.');
      return;
    }

    if (!confirmAction('Delete your uploaded CV? This cannot be undone.')) {
      return;
    }

    try {
      if (currentUser.cvPath) {
        await supabase.storage.from('profile-media').remove([currentUser.cvPath]);
      }

      const { error } = await supabase.from('profiles').update({
        cv_url: null,
        cv_path: null,
        updated_at: new Date().toISOString()
      }).eq('user_id', currentUser.id);

      if (error) {
        showToast(`Could not remove CV: ${error.message}`);
        return;
      }

      setCurrentUser((previous) => ({ ...previous, cvUrl: undefined, cvPath: undefined }));
      showToast('CV removed successfully.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not remove this CV.');
    }
  };

  const markNotificationsAsRead = async () => {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', currentUser.id).eq('is_read', false);
    if (error) {
      showToast(`Could not save notification status: ${error.message}`);
      return;
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
  };

  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId).eq('user_id', currentUser.id);
    if (error) {
      showToast(`Could not save notification status: ${error.message}`);
      return;
    }
    setNotifications((prev) => prev.map((notification) => notification.id === notificationId ? { ...notification, isRead: true } : notification));
  };

  const hydratePersistedAccount = ({ user, notifications: persistedNotifications, savedItemIds: persistedSavedItemIds }: { user: User; notifications: AppNotification[]; savedItemIds: string[] }) => {
    setCurrentUser(user);
    setNotifications(persistedNotifications);
    setSavedItemIds(new Set(persistedSavedItemIds));
  };
  const hydrateNotifications = (nextNotifications: AppNotification[]) => setNotifications(nextNotifications);
  const hydrateWorkflows = (nextWorkflows: WorkflowItem[]) => setWorkflowItems(nextWorkflows);

  const hydratePersistedContent = (data: { projects: Project[]; achievements: Achievement[]; publications: Publication[]; articles: Article[]; opportunities: Opportunity[]; announcements: Announcement[]; events?: DepartmentEvent[] }) => {
    const merge = <T extends { id: string }>(existing: T[], persisted: T[]) => [...persisted, ...existing.filter((item) => !persisted.some((storedItem) => storedItem.id === item.id))];
    setProjects((previous) => merge(previous, data.projects));
    setAchievements((previous) => merge(previous, data.achievements));
    setPublications((previous) => merge(previous, data.publications));
    setArticles((previous) => merge(previous, data.articles));
    setOpportunities((previous) => merge(previous, data.opportunities));
    setAnnouncements((previous) => merge(previous, data.announcements));
    if (data.events) setEvents((previous) => merge(previous, data.events || []));
  };
  const hydrateDirectory = (persistedUsers: User[]) => setUsers(persistedUsers);

  const persistContent = async (contentType: string, data: { id: string; ownerId?: string }) => {
    if (!currentUser.id) {
      showToast('Please sign in before publishing.');
      return false;
    }

    try {
      const { error } = await supabase.from('content_items').upsert({
        id: data.id,
        owner_id: currentUser.id,
        content_type: contentType,
        data: { ...data, ownerId: currentUser.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

      if (error) throw error;
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save this item.';
      showToast(`Publish failed: ${message}`);
      return false;
    }
  };

  const updatePublishedContent = async (contentType: 'project' | 'publication' | 'achievement' | 'article' | 'opportunity' | 'announcement', item: any) => {
    if (!confirmAction('Save these changes to this published item?')) {
      return false;
    }

    const ok = await persistContent(contentType, item);
    if (!ok) return false;

    if (contentType === 'project') {
      setProjects((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, ...item } : entry));
    }
    if (contentType === 'publication') {
      setPublications((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, ...item } : entry));
    }
    if (contentType === 'achievement') {
      setAchievements((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, ...item } : entry));
    }
    if (contentType === 'article') {
      setArticles((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, ...item } : entry));
    }
    if (contentType === 'opportunity') {
      setOpportunities((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, ...item } : entry));
    }
    if (contentType === 'announcement') {
      setAnnouncements((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, ...item } : entry));
    }
    return true;
  };

  const deletePublishedContent = async (contentType: 'project' | 'publication' | 'achievement' | 'article' | 'opportunity' | 'announcement', id: string) => {
    if (!currentUser.id) return false;

    if (!confirmAction('Delete this item? This action cannot be undone.')) {
      return false;
    }

    try {
      const { error } = await supabase.from('content_items').delete().eq('id', id).eq('owner_id', currentUser.id);
      if (error) throw error;

      if (contentType === 'project') setProjects((prev) => prev.filter((entry) => entry.id !== id));
      if (contentType === 'publication') setPublications((prev) => prev.filter((entry) => entry.id !== id));
      if (contentType === 'achievement') setAchievements((prev) => prev.filter((entry) => entry.id !== id));
      if (contentType === 'article') setArticles((prev) => prev.filter((entry) => entry.id !== id));
      if (contentType === 'opportunity') setOpportunities((prev) => prev.filter((entry) => entry.id !== id));
      if (contentType === 'announcement') setAnnouncements((prev) => prev.filter((entry) => entry.id !== id));

      showToast('Published item deleted.');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not delete this item.';
      showToast(`Delete failed: ${message}`);
      return false;
    }
  };

  const openCreateModalWithType = (type: string) => {
    setCreateModalInitialType(type);
    setCreateModalEditingItem(null);
    setIsCreateModalOpen(true);
  };

  const openMentorshipRequest = (user: User) => {
    setMentorTargetUser(user);
    setIsMentorshipModalOpen(true);
  };
  const openChat = (user: User) => {
    if (getConnectionStatus(user.id) !== 'connected') {
      showToast('You can message accepted connections only.');
      return;
    }
    setChatTargetUser(user);
    setIsChatModalOpen(true);
  };

  const contextValue = useMemo(() => ({
    currentUser,
    setCurrentUser,
    currentTab,
    setCurrentTab,
    syncCurrentTabFromPath,
    users,
    projects,
    achievements,
    publications,
    articles,
    opportunities,
    announcements,
    events,
    toggleEventRsvp,
    createDepartmentEvent,
    notifications,
    directorySearchResults,
    searchDirectoryUsers,
    adminVerificationQueue,
    verificationRequests,
    approveVerification,
    rejectVerification,
    flaggedItems,
    moderationReports,
    resolveFlaggedItem,
    resolveModerationReport,
    connectionRequests,
    linkedInImports,
    savedItemIds,
    networkStats,
    getConnectionCount,
    getMutualConnectionCount,
    getConnectionUsers,
    getConnectionStatus,
    updateProfileImage,
    updateProfileCV,
    deleteProfileCV,
    isUploadingProfileImage,
    isUploadingCV,
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
    createProject,
    addProject,
    createAchievement,
    addAchievement,
    createPublication,
    addPublication,
    createArticle,
    addArticle,
    createOpportunity,
    addOpportunity,
    createAnnouncement,
    addAnnouncement,
    deletePublishedContent,
    updatePublishedContent,
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
    markNotificationAsRead,
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
    createModalEditingItem,
    setCreateModalEditingItem,
    openCreateModalWithType,
    isLinkedInModalOpen,
    setIsLinkedInModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isNotificationsModalOpen,
    setIsNotificationsModalOpen,
    isChatModalOpen,
    setIsChatModalOpen,
    chatTargetUser,
    openChat,
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
  }), [
    currentUser,
    setCurrentUser,
    currentTab,
    setCurrentTab,
    syncCurrentTabFromPath,
    users,
    projects,
    achievements,
    publications,
    articles,
    opportunities,
    announcements,
    events,
    toggleEventRsvp,
    createDepartmentEvent,
    notifications,
    directorySearchResults,
    searchDirectoryUsers,
    adminVerificationQueue,
    verificationRequests,
    approveVerification,
    rejectVerification,
    flaggedItems,
    moderationReports,
    resolveFlaggedItem,
    resolveModerationReport,
    connectionRequests,
    linkedInImports,
    savedItemIds,
    networkStats,
    getConnectionCount,
    getMutualConnectionCount,
    getConnectionUsers,
    getConnectionStatus,
    updateProfileImage,
    updateProfileCV,
    isUploadingProfileImage,
    isUploadingCV,
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
    createProject,
    addProject,
    createAchievement,
    addAchievement,
    createPublication,
    addPublication,
    createArticle,
    addArticle,
    createOpportunity,
    addOpportunity,
    createAnnouncement,
    addAnnouncement,
    deletePublishedContent,
    updatePublishedContent,
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
    markNotificationAsRead,
    hydrateNotifications,
    hydrateWorkflows,
    hydratePersistedAccount,
    hydratePersistedContent,
    hydrateDirectory,
    selectedArticle,
    selectedPublication,
    selectedAchievement,
    selectedProject,
    selectedUserForProfile,
    selectedOpportunity,
    selectedEvent,
    isCreateModalOpen,
    createModalInitialType,
    createModalEditingItem,
    openCreateModalWithType,
    isLinkedInModalOpen,
    isSettingsModalOpen,
    isNotificationsModalOpen,
    isChatModalOpen,
    chatTargetUser,
    isSavedModalOpen,
    isReportModalOpen,
    isMentorshipModalOpen,
    mentorTargetUser,
    isAuthModalOpen,
    authModalMode,
    toastMessage,
    showToast,
    setSelectedArticle,
    setSelectedPublication,
    setSelectedAchievement,
    setSelectedProject,
    setSelectedUserForProfile,
    setSelectedOpportunity,
    setSelectedEvent,
    setIsCreateModalOpen,
    setCreateModalEditingItem,
    setIsLinkedInModalOpen,
    setIsSettingsModalOpen,
    setIsNotificationsModalOpen,
    setIsChatModalOpen,
    openChat,
    setIsSavedModalOpen,
    setIsReportModalOpen,
    setIsMentorshipModalOpen,
    openMentorshipRequest,
    setIsAuthModalOpen,
    setAuthModalMode
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

const isCountedStudent = (user: User): boolean => {
  const values = [user.batch, user.graduationYear].filter((value): value is string | number => value !== undefined && value !== null);
  return values.some((value) => {
    const text = String(value);
    const batchMatch = text.match(/batch\s*(\d+)/i);
    const numericBatch = /^\s*\d{1,2}\s*$/.test(text) ? Number(text) : null;
    const yearMatch = text.match(/\b(20\d{2})\b/);
    return Boolean(
      (batchMatch && Number(batchMatch[1]) >= 9) ||
      (numericBatch !== null && numericBatch >= 9) ||
      (yearMatch && Number(yearMatch[1]) >= 2031)
    );
  });
};

const profileRowToDirectoryUser = (profile: Record<string, unknown>): User => {
  const name = typeof profile.full_name === 'string' ? profile.full_name : 'IRE Member';
  const role = profile.role === 'alumni' || profile.role === 'faculty' || profile.role === 'former_faculty' || profile.role === 'admin' ? profile.role : 'student';
  const verificationStatus = profile.verification_status === 'Rejected' ? 'Rejected' : role === 'alumni' ? 'Verified Alumni' : role === 'faculty' || role === 'former_faculty' ? 'Verified Faculty' : 'Verified Student';
  return {
    id: String(profile.user_id || ''), name, email: '', role, verificationStatus,
    avatar: typeof profile.avatar_url === 'string' && profile.avatar_url ? profile.avatar_url : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
    department: typeof profile.department === 'string' ? profile.department : '',
    headline: typeof profile.headline === 'string' ? profile.headline : '',
    bio: typeof profile.bio === 'string' ? profile.bio : '',
    location: typeof profile.location === 'string' ? profile.location : '',
    skills: Array.isArray(profile.skills) ? profile.skills.filter((skill): skill is string => typeof skill === 'string') : [],
    education: Array.isArray(profile.education) ? profile.education as User['education'] : [],
    experience: Array.isArray(profile.experience) ? profile.experience as User['experience'] : [],
    externalLinks: typeof profile.external_links === 'object' && profile.external_links ? profile.external_links as User['externalLinks'] : {},
    privacy: typeof profile.privacy === 'object' && profile.privacy ? profile.privacy as User['privacy'] : { cv: 'private', email: 'private', phone: 'private', experience: 'private', projects: 'private', achievements: 'private', publications: 'private', externalLinks: 'private' },
    notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true },
    batch: typeof profile.batch === 'string' ? profile.batch : undefined,
    studentId: typeof profile.student_id === 'string' ? profile.student_id : undefined,
    isAvailableForMentorship: Boolean(profile.is_available_for_mentorship)
  };
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
