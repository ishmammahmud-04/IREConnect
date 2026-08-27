export type UserRole = 'student' | 'alumni' | 'faculty' | 'former_faculty' | 'admin';

export type VerificationState =
  | 'Pending Verification'
  | 'Verified Student'
  | 'Verified Alumni'
  | 'Verified Faculty'
  | 'Admin'
  | 'Rejected';

export type VisibilityLevel = 'public' | 'department' | 'connections' | 'private';

export interface UserSkill {
  name: string;
  category?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number | string;
}

export interface Experience {
  id: string;
  organization: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExternalLinks {
  linkedin?: string;
  github?: string;
  googleScholar?: string;
  orcid?: string;
  portfolio?: string;
  website?: string;
  email?: string;
  phone?: string;
}

export interface PrivacySettings {
  cv: VisibilityLevel;
  email: VisibilityLevel;
  phone: VisibilityLevel;
  experience: VisibilityLevel;
  projects: VisibilityLevel;
  achievements: VisibilityLevel;
  publications: VisibilityLevel;
  externalLinks: VisibilityLevel;
}

export interface NotificationSettings {
  connectionRequests: boolean;
  acceptedConnections: boolean;
  opportunityAlerts: boolean;
  deadlineReminders: boolean;
  announcements: boolean;
  events: boolean;
  contentInteractions: boolean;
  mentorshipRequests: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verificationStatus: VerificationState;
  avatar: string;
  bannerUrl?: string;
  avatarPath?: string;
  bannerPath?: string;
  batch?: string;
  graduationYear?: number | string;
  studentId?: string;
  department: string;
  headline: string;
  bio: string;
  location: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  externalLinks: ExternalLinks;
  privacy: PrivacySettings;
  notificationSettings: NotificationSettings;
  cvUrl?: string;
  isAvailableForMentorship?: boolean;
  mentorshipCategories?: string[];
  mutualConnectionsCount?: number;
  // Faculty specific fields:
  designation?: string;
  isFormerFaculty?: boolean;
  periodServed?: string;
  specialization?: string[];
  researchInterests?: string[];
  coursesTaught?: { code: string; name: string; term: string; level: 'UG' | 'PG' }[];
  supervisedStudentsCount?: { phd: number; masters: number; bachelors: number };
  currentAffiliation?: string; // for former faculty
}

export interface Project {
  id: string;
  title: string;
  coverImage: string;
  category: 'Robotics' | 'AI' | 'IoT' | 'Embedded Systems' | 'Assistive Tech' | 'Computer Vision' | 'Autonomous Systems';
  batch: string;
  year: string;
  problem: string;
  solution: string;
  description: string;
  technologies: string[];
  teamMembers: { id: string; name: string; role: string; avatar: string }[];
  supervisor: { id: string; name: string; designation: string; avatar: string };
  githubUrl?: string;
  demoUrl?: string;
  docUrl?: string;
  mediaGallery?: string[];
  relatedAchievements?: { id: string; title: string; category: string }[];
  relatedPublications?: { id: string; title: string; journal: string }[];
  status: 'Active' | 'Completed' | 'Published' | 'Ongoing';
  likesCount: number;
}

export type PublicationStatus = 'Published' | 'Accepted' | 'Under Review' | 'Preprint';

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  publicationType: 'Research Paper' | 'Journal' | 'Conference Proceedings' | 'Book Chapter' | 'Thesis';
  journal: string;
  conference?: string;
  doi: string;
  date: string;
  abstract: string;
  keywords: string[];
  researchArea: string;
  pdfUrl?: string;
  externalUrl?: string;
  googleScholarUrl?: string;
  orcid?: string;
  status: PublicationStatus;
  coverImage?: string;
  citations?: number;
  visibility: VisibilityLevel;
  relatedProjectId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Award' | 'Competition' | 'Certification' | 'Hackathon' | 'Patent' | 'Scholarship' | 'Professional Milestone';
  organization: string;
  personName: string;
  personRole: string;
  personAvatar: string;
  date: string;
  description: string;
  image?: string;
  certificateUrl?: string;
  verificationUrl?: string;
  isVerified: boolean;
  relatedProjectId?: string;
  relatedProjectName?: string;
  appliedSkills: string[];
  collaborators?: { name: string; role: string; avatar?: string }[];
  visibility: VisibilityLevel;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  body: string[];
  author: { id: string; name: string; role: string; avatar: string; bio: string };
  category: string;
  tags: string[];
  readingTime: string;
  date: string;
  relatedProjectId?: string;
  relatedResearchId?: string;
  views?: number;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  organizationLogo?: string;
  type: 'Internship' | 'Job' | 'Research' | 'Collaboration' | 'Scholarship' | 'Competition';
  description: string;
  requirements: string[];
  requiredSkills: string[];
  location: string;
  deadline: string;
  applicationUrl?: string;
  contactEmail?: string;
  postedBy: { name: string; role: string; avatar: string };
  isRecommended?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'Exam Notice' | 'Workshop' | 'Competition' | 'General' | 'Announcement';
  author?: string;
  isPinned?: boolean;
  image?: string;
  attachmentName?: string;
}

export interface DepartmentEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  organizerLogo?: string;
  coverImage: string;
  isUpcoming: boolean;
  category: string;
  participantsCount: number;
  attendeesAvatars: string[];
  attendeesCount?: number;
  isUserRsvped?: boolean;
}

export interface HallOfFameEntry {
  id: string;
  title: string;
  recipient: string;
  role: string;
  year: string;
  badge: string;
  description: string;
  image: string;
}

export interface DepartmentHistoryMilestone {
  year: string;
  title: string;
  description: string;
  category: string;
}

export interface LinkedInImportItem {
  id: string;
  source: 'LinkedIn';
  type: 'Certification' | 'Publication' | 'Experience' | 'Post' | 'Achievement';
  title: string;
  subtitle: string;
  date: string;
  preview: string;
  selected: boolean;
  credentialId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isToday: boolean;
  isRead: boolean;
  type: 'connection' | 'mentorship' | 'opportunity' | 'announcement' | 'event' | 'verification';
  avatar?: string;
}

export interface ConnectionRequest {
  id: string;
  user: User;
  mutualConnections: number;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
  isIncoming: boolean;
}

export interface ModerationReport {
  id: string;
  contentId: string;
  contentType: 'Article' | 'Project' | 'Comment' | 'User Profile';
  contentTitle: string;
  reason: 'Inappropriate Content' | 'Spam' | 'Fake Profile' | 'Harassment' | 'Copyright Violation' | 'Misinformation';
  reportedBy: string;
  reporterAvatar?: string;
  date: string;
  status: 'Under Review' | 'Flagged' | 'Resolved' | 'Dismissed';
  details?: string;
}

export interface VerificationRequest {
  id: string;
  user: User;
  submittedAt: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  evidenceDocUrl?: string;
  scanMatchScore?: number;
  degreeProgram?: string;
}

export interface WorkflowItem {
  id: string;
  workflow_type: 'connection_request' | 'mentorship_request' | 'verification_request' | 'moderation_report';
  requester_id: string;
  recipient_id?: string | null;
  status: string;
  data: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}
