import {
  User,
  Project,
  Publication,
  Achievement,
  Article,
  Opportunity,
  Announcement,
  DepartmentEvent,
  HallOfFameEntry,
  DepartmentHistoryMilestone,
  LinkedInImportItem,
  AppNotification,
  ConnectionRequest,
  ModerationReport,
  VerificationRequest
} from '../types';

export const CURRENT_USER_STUDENT: User = {
  id: 'usr-student-1',
  name: 'Sarah Chen',
  email: 'sarah.chen@university.edu',
  role: 'student',
  verificationStatus: 'Verified Student',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0nMIqwp8dEAIp1pfG9DjJgfIzhCHpLMM2NDqNuC_uUFJKnR4kUc-EOItJyCOJugS5UDIbhOmuUPAUX79ykTOwkvizL7A28qE0yQXJoqdQ9-IO1yBq_lsz-pc5MU2jEhTq_Y7KjyHSKdhfJUEZW_IuQ9YY7yrJBDbcEVGlBwVmABP8dx8-8FjgebJ3PcNKM8StMIgytp__tQv4YvHrOACsqYhhT6D0Pc5Aj9YQOFJkuZg1yXq1KggaPg',
  batch: 'Batch 7',
  graduationYear: '2026',
  studentId: 'IRE-2022-049',
  department: 'Internet of Things and Robotics Engineering (IRE)',
  headline: 'IoT Enthusiast | Robotics Researcher | Lead Systems Engineer',
  bio: 'Passionate robotics researcher and IoT enthusiast exploring autonomous navigation systems. Dedicated to bridging the gap between hardware capabilities and intelligent software solutions for real-world research.',
  location: 'Engineering Building Lab 402',
  skills: ['ROS', 'Python', 'SLAM', 'C++', 'Computer Vision', 'Embedded C', 'Hardware Int.', 'TensorFlow'],
  cvUrl: 'https://example.com/sarah_chen_resume.pdf',
  isAvailableForMentorship: false,
  mutualConnectionsCount: 154,
  education: [
    {
      id: 'edu-1',
      institution: 'University Department of IRE',
      degree: 'B.Sc. in Internet of Things & Robotics Engineering',
      field: 'Autonomous Systems & Edge AI',
      startYear: 2022,
      endYear: '2026 (Expected)'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      organization: 'Autonomous Systems Lab',
      position: 'Lead Student Researcher',
      startDate: 'Jun 2023',
      endDate: 'Present',
      description: 'Architecting sensor fusion pipelines with LiDAR and IMU telemetry on custom micro-rovers.'
    }
  ],
  externalLinks: {
    linkedin: 'linkedin.com/in/sarah-chen-robotics',
    github: 'github.com/sarahchen-dev',
    googleScholar: 'scholar.google.com/citations?user=schen2026',
    orcid: '0009-0004-9218-4421',
    portfolio: 'sarahchen.me',
    email: 'sarah.chen@university.edu',
    phone: '+1 (555) 382-9104'
  },
  privacy: {
    cv: 'department',
    email: 'private',
    phone: 'connections',
    experience: 'public',
    projects: 'public',
    achievements: 'public',
    publications: 'public',
    externalLinks: 'public'
  },
  notificationSettings: {
    connectionRequests: true,
    acceptedConnections: true,
    opportunityAlerts: true,
    deadlineReminders: true,
    announcements: true,
    events: false,
    contentInteractions: true,
    mentorshipRequests: true
  }
};

export const CURRENT_USER_ALUMNI: User = {
  id: 'usr-alumni-1',
  name: 'James Miller',
  email: 'james.miller@deepmind.com',
  role: 'alumni',
  verificationStatus: 'Verified Alumni',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD40EyBSVkG4X3pl2949JAl2ZbcebR_hy2m9rBgqTSvJ8WdVhg6aLu_s9JXGOn9OEgspxJC8A5eXfnI99AjnFpUqQw6gE9LJLNP_ASRc8I1_LfC5ghrgEnqxvp9GZSQ8evWk3NRKG-Gq3SM8GomngDmCKhw64VeEdfxnhZT0XtWTnszp7mm49y2z1EpWLDaKfp7J5VrZnfbwy38vzZVNMoQA0n8eglb2ItutjV5vpaQPFqNYBEr538DCA',
  batch: 'Batch 3',
  graduationYear: '2021',
  department: 'Internet of Things and Robotics Engineering (IRE)',
  headline: 'Senior AI Researcher @ Google DeepMind | Alumni Batch 3',
  bio: 'Specializing in deep reinforcement learning for robotic control and autonomous manipulation. Happy to guide undergraduate students with graduate research applications and industry transitions.',
  location: 'London, UK (Alumni)',
  skills: ['Reinforcement Learning', 'PyTorch', 'Robotics Simulation', 'Python', 'Control Theory', 'C++'],
  cvUrl: 'https://example.com/james_miller_cv.pdf',
  isAvailableForMentorship: true,
  mentorshipCategories: ['AI', 'Career', 'Interview Prep', 'Higher Studies'],
  mutualConnectionsCount: 42,
  education: [
    {
      id: 'edu-al-1',
      institution: 'University Department of IRE',
      degree: 'B.Sc. in IoT & Robotics Engineering',
      field: 'Robotics',
      startYear: 2017,
      endYear: 2021
    }
  ],
  experience: [
    {
      id: 'exp-al-1',
      organization: 'Google DeepMind',
      position: 'Senior Research Scientist',
      startDate: 'Jan 2022',
      endDate: 'Present',
      description: 'Focusing on policy search algorithms and sim-to-real transfer for robotic manipulators.'
    }
  ],
  externalLinks: {
    linkedin: 'linkedin.com/in/james-miller-ai',
    github: 'github.com/jmiller-robotics',
    googleScholar: 'scholar.google.com/citations?user=jmiller',
    orcid: '0000-0002-8319-9021'
  },
  privacy: {
    cv: 'connections',
    email: 'department',
    phone: 'private',
    experience: 'public',
    projects: 'public',
    achievements: 'public',
    publications: 'public',
    externalLinks: 'public'
  },
  notificationSettings: {
    connectionRequests: true,
    acceptedConnections: true,
    opportunityAlerts: false,
    deadlineReminders: true,
    announcements: true,
    events: true,
    contentInteractions: true,
    mentorshipRequests: true
  }
};

export const CURRENT_USER_FACULTY: User = {
  id: 'usr-faculty-1',
  name: 'Dr. Elena Rossi',
  email: 'e.rossi@university.edu',
  role: 'faculty',
  verificationStatus: 'Verified Faculty',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS200kxQLUYpwOwQXaCfz_h-5ZTY2KgLU4WjDhhkTqqvjtEZSKG9hUSZWWSFVPbVt1hL1sm_dBPUav-qG84tM1U96fAWfYTNLKCBtKOjAtrLuPFaoaCg5AEJaU9pPdLbRDgPsnmObJpyNmYMFJgog3OU3mxaOveXIkAQ6rsJVk2XhFW0zH1vSBhiRk2dqiaazIBCwS2vCWJl2Ia0ZbMDVWBjOZyh47AkqfmGkaPNNY7hPe84g1E1IBqg',
  department: 'Internet of Things and Robotics Engineering (IRE)',
  headline: 'Professor of Robotics & AI Ethics | Head of Autonomous Systems Lab',
  designation: 'Professor & Senior Researcher',
  isFormerFaculty: false,
  bio: 'Leading research at the intersection of autonomous systems, moral constraint frameworks, and low-latency edge AI. Dedicated to advising undergraduate and postgraduate robotics thesis initiatives.',
  location: 'Faculty Hall Office 310',
  skills: ['Robotics Architecture', 'AI Ethics', 'SLAM', 'Autonomous Systems', 'Control Theory', 'Embedded RTOS'],
  specialization: ['AI Ethics', 'Human-Robot Interaction', 'Machine Learning', 'Autonomous Systems'],
  researchInterests: ['Moral Decision-Making in Swarms', 'Sub-millisecond Edge Inference', 'Tactile Grippers'],
  coursesTaught: [
    { code: 'IRE-301', name: 'Introduction to Robotics & Actuators', term: 'Fall 2024', level: 'UG' },
    { code: 'IRE-540', name: 'Ethics in Autonomous Systems', term: 'Spring 2024', level: 'PG' },
    { code: 'IRE-601', name: 'Advanced Machine Learning & SLAM', term: 'Fall 2023', level: 'PG' }
  ],
  supervisedStudentsCount: { phd: 4, masters: 8, bachelors: 12 },
  cvUrl: 'https://example.com/dr_elena_rossi_cv.pdf',
  isAvailableForMentorship: true,
  mentorshipCategories: ['Research', 'Higher Studies', 'AI', 'Robotics'],
  education: [
    {
      id: 'edu-fac-1',
      institution: 'ETH Zurich',
      degree: 'Ph.D. in Robotics and Control Systems',
      field: 'Autonomous Manipulation',
      startYear: 2011,
      endYear: 2015
    }
  ],
  experience: [
    {
      id: 'exp-fac-1',
      organization: 'Department of IRE',
      position: 'Professor & Lab Director',
      startDate: 'Aug 2018',
      endDate: 'Present',
      description: 'Supervising university grant research projects and authoring IEEE peer-reviewed studies.'
    }
  ],
  externalLinks: {
    linkedin: 'linkedin.com/in/dr-elena-rossi',
    googleScholar: 'scholar.google.com/citations?user=erossi',
    orcid: '0000-0001-9872-3341',
    email: 'e.rossi@university.edu'
  },
  privacy: {
    cv: 'public',
    email: 'public',
    phone: 'private',
    experience: 'public',
    projects: 'public',
    achievements: 'public',
    publications: 'public',
    externalLinks: 'public'
  },
  notificationSettings: {
    connectionRequests: true,
    acceptedConnections: true,
    opportunityAlerts: true,
    deadlineReminders: true,
    announcements: true,
    events: true,
    contentInteractions: true,
    mentorshipRequests: true
  }
};

export const CURRENT_USER_ADMIN: User = {
  id: 'usr-admin-1',
  name: 'Admin Central',
  email: 'admin@ire-department.edu',
  role: 'admin',
  verificationStatus: 'Admin',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1phhP_NEzf5W0GvDWrfj4Yykjtn2imUJD03MOFQOzgHX1ECXxp9sRX37fWgCpFp5iJNwtXYBZTx7_bzEuqsDoHOZUzR4nYSdNpicPsSVzOhtfzN-4c2eauBDO3NqLCYC5SNc9_-vF-Wqfiz_qFVTgtQrFQ7VxQZE7QzFBodXHnqcG1iSK6xQvBYU_N-WRO-tKwbK6Viz9npRuVyZy9oqmeU2-3h2BraruScVZPceE9ZEG6fjb18QXew',
  department: 'Internet of Things and Robotics Engineering (IRE)',
  headline: 'IRE Department Operations & Verification Administrator',
  bio: 'Department administrative operations, user identity approval, opportunity review, and academic archive maintenance.',
  location: 'Department Office Block A',
  skills: ['Ecosystem Management', 'Academic Accreditation', 'Policy Moderation'],
  education: [],
  experience: [],
  externalLinks: {
    email: 'admin@ire-department.edu'
  },
  privacy: {
    cv: 'public',
    email: 'department',
    phone: 'private',
    experience: 'public',
    projects: 'public',
    achievements: 'public',
    publications: 'public',
    externalLinks: 'public'
  },
  notificationSettings: {
    connectionRequests: true,
    acceptedConnections: true,
    opportunityAlerts: true,
    deadlineReminders: true,
    announcements: true,
    events: true,
    contentInteractions: true,
    mentorshipRequests: false
  }
};

export const MOCK_ALL_USERS: User[] = [
  CURRENT_USER_STUDENT,
  CURRENT_USER_ALUMNI,
  CURRENT_USER_FACULTY,
  CURRENT_USER_ADMIN,
  {
    id: 'usr-student-2',
    name: 'Ahmed Rahman',
    email: 'ahmed.rahman@university.edu',
    role: 'student',
    verificationStatus: 'Verified Student',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDFPXrS5u1ogF44Q_T_g2VNa4OWqAIIz5Ac5x3JLhHeYTZrUA1NO-bpT5a70ju-WjYzvEhWnKwQIvpAsOxyQqycK-Zi1vTalHYE-QT19_rHaJ8NEj5zqu0xORSmm7yVV9Qvl5XZjhY4ZDxfcWORkv-qvCc7Xxl51v0Ip73Anh8tImIBMnMiY6TzLe9a3agECw-LnOdoircpd3LLU9x_XJ3Cw-LSdmKheP-TA6u5ZBYkC4r6j1dX1WjZg',
    batch: 'Batch 7',
    graduationYear: '2026',
    department: 'IRE',
    headline: 'Robotics Hardware Developer | ROS Specialist',
    bio: 'Focused on low-cost autonomous ground vehicles and real-time SLAM algorithms on micro-controllers.',
    location: 'Robotics Lab Bench 3',
    skills: ['ROS', 'Python', 'SLAM', 'C++', 'Raspberry Pi', 'Arduino'],
    mutualConnectionsCount: 18,
    education: [],
    experience: [],
    externalLinks: { github: 'github.com/ahmed-rahman' },
    privacy: { cv: 'public', email: 'department', phone: 'private', experience: 'public', projects: 'public', achievements: 'public', publications: 'public', externalLinks: 'public' },
    notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true }
  },
  {
    id: 'usr-student-3',
    name: 'David Kim',
    email: 'david.kim@university.edu',
    role: 'student',
    verificationStatus: 'Verified Student',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMRWUSpMcD-KgjKr7bRdIfjGk5t3KQneSAX12W6I7phnf9mU4oqy3Y3C6SmNTgqRVkNo2AdXNTJudZE6zkCDXB5z1z0-QzWKEZCTqAu-gJln787hTfjNmZBGkbupwm_y-x7IyGmvsuCQfpJiwntXajpAi_ndhwQFKlT_YMLcAe-IHF8osYoqdzeorKCa1_V1k3A9RedRhAHUwD8zRIupSvlDJT45aBUaMwLu4WfBEQw8TXfnTU0su7qQ',
    batch: 'Batch 6',
    graduationYear: '2025',
    department: 'IRE',
    headline: 'Hardware Lead & Circuitry Designer',
    bio: 'Building custom PCBs, brushless motor drivers, and low-latency sensor boards for autonomous systems.',
    location: 'Electronics Prototyping Workshop',
    skills: ['Altium', 'Embedded C', 'Hardware Integration', 'KiCAD', 'Sensor Fusion'],
    mutualConnectionsCount: 9,
    education: [],
    experience: [],
    externalLinks: {},
    privacy: { cv: 'public', email: 'department', phone: 'private', experience: 'public', projects: 'public', achievements: 'public', publications: 'public', externalLinks: 'public' },
    notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true }
  },
  {
    id: 'usr-student-4',
    name: 'Elena Rostova',
    email: 'e.rostova@university.edu',
    role: 'student',
    verificationStatus: 'Verified Student',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAZ14-j0f2Cj2TBJQJwBJuNMwejMEvbzHegeOm1-MUQ4TRbRmhr9KmhzR8iw7oa5M45DtzCR5VDFwGuKBxIe83B38w0qgGvifFMzXUoSPXKUq-hXH52nk2kz4BThBQfo45Pe7Ifx9-jCtr81lRXF0xm42K4TtThuP3h0zE7igAleGoNH8535AVVck2TcGpRH825wI4HkY5G7H1EYM1Di0DBYz4aZCGuk5R6y3g2B3vBF-JQdrSgtbpPg',
    batch: 'Batch 6',
    graduationYear: '2025',
    department: 'IRE',
    headline: 'Systems Architect & Quantum Sensor Developer',
    bio: 'Researches scalable quantum architecture and sensor fusion for unstructured extreme environments.',
    location: 'Quantum Sensor Bench',
    skills: ['Quantum Computing', 'Python', 'C++', 'Signal Processing', 'ROS2'],
    mutualConnectionsCount: 14,
    education: [],
    experience: [],
    externalLinks: {},
    privacy: { cv: 'public', email: 'department', phone: 'private', experience: 'public', projects: 'public', achievements: 'public', publications: 'public', externalLinks: 'public' },
    notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true }
  },
  {
    id: 'usr-alumni-2',
    name: 'David Chen',
    email: 'd.chen@cisco.com',
    role: 'alumni',
    verificationStatus: 'Verified Alumni',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgOGZj8HWKLLzxuYNF87_mV90sB7EpQ2qveajHTqIiMBO54cvKdOyNYGxalRJh-785QcWWJsmGS16fZOtVy8SmyzrIKH5mvvMZMPWwEiL1s5CSbu2cwJ_D1FHfAyLEiohba15xIpx6rZpidAv2jbvVaX8Wp17gF4GLd5sbIAp6JQiSAAyIWeYBh5vfW1rk25cn0lFiYTm6in1m-Vu7acXo9fWYxiUUY0A1ybOUC6SxLU_XTu6VIeH3DA',
    batch: 'Batch 2',
    graduationYear: '2020',
    department: 'IRE',
    headline: 'Lead IoT Engineer @ Cisco | Alumni Batch 2',
    bio: 'Architecting industrial IoT sensor meshes and MQTT protocol gateways. Providing career mentorship for graduating seniors.',
    location: 'San Jose, CA',
    skills: ['MQTT', 'Embedded C', 'IoT Architecture', 'Network Protocols', 'C++'],
    isAvailableForMentorship: true,
    mentorshipCategories: ['IoT', 'Career', 'Interview Prep'],
    mutualConnectionsCount: 22,
    education: [],
    experience: [],
    externalLinks: { linkedin: 'linkedin.com/in/davidchen-iot' },
    privacy: { cv: 'public', email: 'department', phone: 'private', experience: 'public', projects: 'public', achievements: 'public', publications: 'public', externalLinks: 'public' },
    notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true }
  },
  {
    id: 'usr-faculty-former',
    name: 'Dr. Arthur Vance',
    email: 'a.vance@emeritus.edu',
    role: 'former_faculty',
    verificationStatus: 'Verified Faculty',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKtUpQMS1cJ1tELq-IQ2_hjgEqy7KqqdjTSXltzEO91Td5qISFNPhZ5O58avcpSgmGJF4ky6ZTU4WMDFke_i2upI0rgn0g5GozVl0cAmr6ZY4EB5spdIGfOANpo7iU-MsBV2ZhahPky2jtIPi6eJFMadg_Zn8AunKIOW3GhwWecgS_biVMc7zHuzOD2gSgNrTU4DgzHmd6JnSgslkNlPtCiPn72Zg_yKoRCvgNlNWywYwMF7hF6B9liA',
    department: 'IRE',
    headline: 'Former Faculty & Professor Emeritus in Cognitive Robotics',
    designation: 'Former Faculty (2014 - 2022)',
    isFormerFaculty: true,
    periodServed: '2014 – 2022',
    currentAffiliation: 'Senior Advisory Board, European AI Council',
    bio: 'Served as foundational Chair of the IRE department from 2014 to 2022. Mentored 30+ alumni batches in machine perception and cognitive control.',
    location: 'Zurich / Remote',
    skills: ['Cognitive Robotics', 'Robotics History', 'Academic Leadership', 'Computer Vision'],
    specialization: ['Cognitive Science', 'Robotic Vision', 'Neural Kinematics'],
    researchInterests: ['Biological Neural Models in Silicon', 'Kinematics History'],
    education: [],
    experience: [],
    externalLinks: { googleScholar: 'scholar.google.com/citations?user=avance' },
    privacy: { cv: 'public', email: 'public', phone: 'private', experience: 'public', projects: 'public', achievements: 'public', publications: 'public', externalLinks: 'public' },
    notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: false, deadlineReminders: false, announcements: true, events: true, contentInteractions: false, mentorshipRequests: true }
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: "Autonomous Rover 'Ares'",
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY08ysuZqT4qIv9HzfxWKvQliamnURkPru-Ubd0mS0u-y-uABymAdmefO2QiEGOwrTqSam0wThQjmUdjZZP9yy96qwQ3wAMVWtyvlxRKJPvb8OajWEtL7WkZStozAvTgJx-Wg2sPU-fFsS9ewveypRZtWePjrRSbmkMjPjbNKG1RRyjpj7229Oyc_TFfRdCGWy_1EhGmOz6aKeB_vjpmfnjoeLEm0aNZrvFtG-xqWaQWfxK7Z8QsCyqg',
    category: 'Autonomous Systems',
    batch: 'Batch 7',
    year: '2025 - 2026',
    problem: 'Navigating unstructured simulated disaster and Martian environments without pre-existing GPS frameworks causes catastrophic mapping failures.',
    solution: 'Engineered a multi-sensor fusion pipeline coupling 3D LiDAR point clouds, IMU telemetry, and customized SLAM algorithms on a distributed Raspberry Pi 4 + Arduino Mega architecture.',
    description: 'An advanced exploration rover designed for autonomous obstacle negotiation and real-time 3D topographical map generation under severe compute constraints.',
    technologies: ['ROS', 'Python', 'SLAM', 'C++', 'LiDAR', 'Sensor Fusion', 'Raspberry Pi'],
    teamMembers: [
      { id: 'usr-student-1', name: 'Sarah Chen', role: 'Lead Systems Engineer', avatar: CURRENT_USER_STUDENT.avatar },
      { id: 'usr-student-2', name: 'Ahmed Rahman', role: 'Low-Level Controls & Drivers', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDFPXrS5u1ogF44Q_T_g2VNa4OWqAIIz5Ac5x3JLhHeYTZrUA1NO-bpT5a70ju-WjYzvEhWnKwQIvpAsOxyQqycK-Zi1vTalHYE-QT19_rHaJ8NEj5zqu0xORSmm7yVV9Qvl5XZjhY4ZDxfcWORkv-qvCc7Xxl51v0Ip73Anh8tImIBMnMiY6TzLe9a3agECw-LnOdoircpd3LLU9x_XJ3Cw-LSdmKheP-TA6u5ZBYkC4r6j1dX1WjZg' },
      { id: 'usr-student-3', name: 'David Kim', role: 'Hardware & Chassis Lead', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMRWUSpMcD-KgjKr7bRdIfjGk5t3KQneSAX12W6I7phnf9mU4oqy3Y3C6SmNTgqRVkNo2AdXNTJudZE6zkCDXB5z1z0-QzWKEZCTqAu-gJln787hTfjNmZBGkbupwm_y-x7IyGmvsuCQfpJiwntXajpAi_ndhwQFKlT_YMLcAe-IHF8osYoqdzeorKCa1_V1k3A9RedRhAHUwD8zRIupSvlDJT45aBUaMwLu4WfBEQw8TXfnTU0su7qQ' }
    ],
    supervisor: { id: 'usr-faculty-1', name: 'Dr. Elena Rossi', designation: 'Professor of Robotics', avatar: CURRENT_USER_FACULTY.avatar },
    githubUrl: 'https://github.com/ire-lab/autonomous-rover-ares',
    demoUrl: 'https://rover-ares.ire.edu',
    docUrl: 'https://docs.rover-ares.ire.edu',
    mediaGallery: [
      'https://lh3.googleusercontent.com/aida/AEtjO1UlhsBDnU14z1I6TwyN7z3ahTb0co45C80kHQ1DpWqLQ_vDtsAjxc1cvpF5vD9qIHo796IuQl05LYhe6VBKumeCaMOx18v-TrkfT3yc-RyCbhUnpP8Q1qsn4cocQyIXDBPfCAtC1TxK7YO0zHyjwI8OgusGt4iyhieKj5A3_HiopZSw-jKKEoo9tJu1LNyrwKPltAZl8Rab32LQlYC652hkCCZHYCIERdaG22y0QUAqQb7xMUtp5d-37N0',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHKlrbHUeluzuUQSymEVoIDGboAZrJOUs27cmMzHZtvMreI3ZCzxHJMgq_TwXnapUxWeStWS7a98k8NpVXz-TZ5hDjqLcrMa2v0Cn7sdMxtek7qzasYGBTvwTB03r4eqDVKtzwrUjyfZHIP-RYDHiCun3ikh2-gEXiDVFiqLHWTXmCOdHDJnOXurSIqnInUeh-MaNYMdrKuGqYK4q6gIvqtPhaCjVnb-PvI8X5r-Nmngv6KaaoZL_ciA'
    ],
    relatedAchievements: [{ id: 'ach-1', title: '1st Place — National Robotics Challenge 2026', category: 'Competition' }],
    relatedPublications: [{ id: 'pub-1', title: 'Real-Time Edge Intelligence for Autonomous Navigation', journal: 'International Journal of Robotics Research' }],
    status: 'Active',
    likesCount: 148
  },
  {
    id: 'proj-2',
    title: 'Smart Cane for Assistive Navigation',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJtG6gRmSV4FHjyV4qq-JpjqyOYOLfdFQ-Eim39Wfs_U5nPeLUAlpcbn4YV05sftW7UjGwtJOzBPyo9JJai1hihZILj1EvjtxD1_W38gvPZlBxuqQ1ubpUORAoCXze2lcDYKyQTkntmnPW5iNHYaup8JPjdJN9nhr4F-YLX4uMap4fhtgw3kIb8rwvpjWX3sq2m3QndRV9Iw-gZ0ACeV6gQgRd0IITHhfgHjsFuWg8tYYix0F3sXtvCg',
    category: 'Assistive Tech',
    batch: 'Batch 7',
    year: '2025',
    problem: 'Visually impaired students face extreme difficulty navigating multi-level university corridors and dynamic construction obstacles.',
    solution: 'Designed an ergonomic cane embedded with dual ultrasonic arrays, haptic feedback actuators, and a BLE beacon trilateration module.',
    description: 'An assistive hardware-software hybrid system providing discreet haptic direction cues for indoor campus mobility.',
    technologies: ['Arduino', 'C++', 'BLE', 'Haptics', 'Sensors'],
    teamMembers: [
      { id: 'usr-student-1', name: 'Sarah Chen', role: 'Firmware Dev', avatar: CURRENT_USER_STUDENT.avatar },
      { id: 'usr-student-2', name: 'Ahmed Rahman', role: 'Hardware Enclosure', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDFPXrS5u1ogF44Q_T_g2VNa4OWqAIIz5Ac5x3JLhHeYTZrUA1NO-bpT5a70ju-WjYzvEhWnKwQIvpAsOxyQqycK-Zi1vTalHYE-QT19_rHaJ8NEj5zqu0xORSmm7yVV9Qvl5XZjhY4ZDxfcWORkv-qvCc7Xxl51v0Ip73Anh8tImIBMnMiY6TzLe9a3agECw-LnOdoircpd3LLU9x_XJ3Cw-LSdmKheP-TA6u5ZBYkC4r6j1dX1WjZg' }
    ],
    supervisor: { id: 'usr-faculty-1', name: 'Dr. Elena Rossi', designation: 'Professor of Robotics', avatar: CURRENT_USER_FACULTY.avatar },
    githubUrl: 'https://github.com/ire-lab/smart-cane-assist',
    status: 'Completed',
    likesCount: 92
  },
  {
    id: 'proj-3',
    title: 'Autonomous Drone Survey Swarm',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK4R8sspeBTkVo9f0p4oVkyIujqJpbRL1hSOUgvTnW5DgNoRprPDqM9eczMyH20FdQ_x68cGjG6F1kXy0QU093Un4u5PWhwLpZ724l3u1cUrT-VTnTLHn86Kjxy-S9t4_kLTZ5aM_U3leS9U4XxSV1HT1fzzuw384AM0ZOhPOBtuCODXvR0B3vIhWWmB0YtXveBmPcL5TAjYE63OMFwavNkw1_SV0-Tt4Kt5u4flwZlT6fg_GgyyMLkg',
    category: 'Robotics',
    batch: 'Batch 6',
    year: '2024 - 2025',
    problem: 'Single-agent drones suffer from strict battery limitations during wide-area agricultural and environmental surveys.',
    solution: 'Reinforcement learning based decentralized flight path planning for cooperative quadcopter swarms.',
    description: 'Autonomous multi-drone topology mapping with synchronized sensor fusion and dynamic flight path optimization.',
    technologies: ['ROS2', 'Python', 'Machine Learning', 'Gazebo', 'PX4'],
    teamMembers: [
      { id: 'usr-student-4', name: 'Elena Rostova', role: 'Flight Stack Lead', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAZ14-j0f2Cj2TBJQJwBJuNMwejMEvbzHegeOm1-MUQ4TRbRmhr9KmhzR8iw7oa5M45DtzCR5VDFwGuKBxIe83B38w0qgGvifFMzXUoSPXKUq-hXH52nk2kz4BThBQfo45Pe7Ifx9-jCtr81lRXF0xm42K4TtThuP3h0zE7igAleGoNH8535AVVck2TcGpRH825wI4HkY5G7H1EYM1Di0DBYz4aZCGuk5R6y3g2B3vBF-JQdrSgtbpPg' }
    ],
    supervisor: { id: 'usr-faculty-1', name: 'Dr. Elena Rossi', designation: 'Professor of Robotics', avatar: CURRENT_USER_FACULTY.avatar },
    status: 'Ongoing',
    likesCount: 110
  }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: '1st Place — National Robotics Challenge 2026',
    category: 'Award',
    organization: 'XYZ Robotics Consortium',
    personName: 'Sarah Chen',
    personRole: 'Lead Systems Engineer',
    personAvatar: CURRENT_USER_STUDENT.avatar,
    date: 'October 15, 2026',
    description: 'Secured 1st place in the Advanced Autonomous Division at the National Robotics Challenge 2026, outpacing 50+ institutional teams with 42% higher SLAM mapping efficiency.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY08ysuZqT4qIv9HzfxWKvQliamnURkPru-Ubd0mS0u-y-uABymAdmefO2QiEGOwrTqSam0wThQjmUdjZZP9yy96qwQ3wAMVWtyvlxRKJPvb8OajWEtL7WkZStozAvTgJx-Wg2sPU-fFsS9ewveypRZtWePjrRSbmkMjPjbNKG1RRyjpj7229Oyc_TFfRdCGWy_1EhGmOz6aKeB_vjpmfnjoeLEm0aNZrvFtG-xqWaQWfxK7Z8QsCyqg',
    certificateUrl: 'https://example.com/certificates/nrc-2026.pdf',
    verificationUrl: 'https://nrc2026.org/verify/ARES-772',
    isVerified: true,
    relatedProjectId: 'proj-1',
    relatedProjectName: "Autonomous Rover 'Ares'",
    appliedSkills: ['ROS', 'Python', 'SLAM', 'Hardware Int.', 'Sensor Fusion'],
    collaborators: [
      { name: 'David Kim', role: 'Hardware Lead', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMRWUSpMcD-KgjKr7bRdIfjGk5t3KQneSAX12W6I7phnf9mU4oqy3Y3C6SmNTgqRVkNo2AdXNTJudZE6zkCDXB5z1z0-QzWKEZCTqAu-gJln787hTfjNmZBGkbupwm_y-x7IyGmvsuCQfpJiwntXajpAi_ndhwQFKlT_YMLcAe-IHF8osYoqdzeorKCa1_V1k3A9RedRhAHUwD8zRIupSvlDJT45aBUaMwLu4WfBEQw8TXfnTU0su7qQ' },
      { name: 'Elena Rostova', role: 'Systems Architect', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAZ14-j0f2Cj2TBJQJwBJuNMwejMEvbzHegeOm1-MUQ4TRbRmhr9KmhzR8iw7oa5M45DtzCR5VDFwGuKBxIe83B38w0qgGvifFMzXUoSPXKUq-hXH52nk2kz4BThBQfo45Pe7Ifx9-jCtr81lRXF0xm42K4TtThuP3h0zE7igAleGoNH8535AVVck2TcGpRH825wI4HkY5G7H1EYM1Di0DBYz4aZCGuk5R6y3g2B3vBF-JQdrSgtbpPg' }
    ],
    visibility: 'public'
  },
  {
    id: 'ach-2',
    title: 'NVIDIA Deep Learning Institute Certification',
    category: 'Certification',
    organization: 'NVIDIA DLI',
    personName: 'Sarah Chen',
    personRole: 'Student',
    personAvatar: CURRENT_USER_STUDENT.avatar,
    date: 'January 2026',
    description: 'Demonstrated mastery in optimizing neural network architectures for resource-constrained edge computing boards and Jetson hardware.',
    certificateUrl: 'https://courses.nvidia.com/certificates/882190',
    verificationUrl: 'https://verify.nvidia.com/882190',
    isVerified: true,
    appliedSkills: ['Deep Learning', 'PyTorch', 'TensorRT', 'Edge AI'],
    visibility: 'public'
  },
  {
    id: 'ach-3',
    title: 'University Hackathon Finalist — Tech for Good',
    category: 'Hackathon',
    organization: 'IRE Innovation League',
    personName: 'Ahmed Rahman',
    personRole: 'Student',
    personAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDFPXrS5u1ogF44Q_T_g2VNa4OWqAIIz5Ac5x3JLhHeYTZrUA1NO-bpT5a70ju-WjYzvEhWnKwQIvpAsOxyQqycK-Zi1vTalHYE-QT19_rHaJ8NEj5zqu0xORSmm7yVV9Qvl5XZjhY4ZDxfcWORkv-qvCc7Xxl51v0Ip73Anh8tImIBMnMiY6TzLe9a3agECw-LnOdoircpd3LLU9x_XJ3Cw-LSdmKheP-TA6u5ZBYkC4r6j1dX1WjZg',
    date: 'November 2025',
    description: 'Prototyped the assistive Smart Cane navigation module in 48 hours, earning praise from disability advocates.',
    isVerified: true,
    relatedProjectId: 'proj-2',
    appliedSkills: ['Arduino', 'C++', 'Sensors'],
    visibility: 'public'
  }
];

export const MOCK_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    title: 'Real-Time Edge Intelligence for Autonomous Navigation',
    authors: ['Ahmed Rahman', 'Sarah Chen', 'Dr. Elena Rossi'],
    publicationType: 'Research Paper',
    journal: 'International Journal of Robotics Research (IJRR)',
    doi: '10.1234/ijrr.2026.9876543',
    date: 'October 15, 2023',
    abstract: 'This paper presents a novel framework for integrating real-time edge intelligence into autonomous navigation systems. By migrating critical computational loads from centralized cloud architectures to edge nodes, we demonstrate a significant reduction in latency and bandwidth consumption. Experimental results in simulated urban environments indicate a 40% improvement in response times compared to traditional cloud-based approaches.',
    keywords: ['Edge AI', 'Autonomous Navigation', 'SLAM', 'Robotics', 'Embedded Optimization'],
    researchArea: 'Computer Science & Robotics',
    pdfUrl: 'https://example.com/papers/edge-intelligence-navigation.pdf',
    externalUrl: 'https://doi.org/10.1234/ijrr.2026.9876543',
    googleScholarUrl: 'https://scholar.google.com',
    orcid: '0000-0001-9872-3341',
    status: 'Published',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoAZWp5ijL0CWqJRHYL8rjeAu0_fjS1uKpahJM80u8BlOwmtr5-PCc808JSrIZ0yBLJUxQaGXhlmQwF0YSf7J44kiHRLcKlZbVksRiVmwN68HUrzyKy6x5ee9MnGeogmhg4tLCCXbBjUPH3gc2J0mbgMc7RiGcPAfYIwlGFcbqKtVuGrBSPCn_MyFzwJPlcJv8eHRnJgTBei6IfHPO0gamWwQNz3TC72ha5CSwwoDKO_W6ERd_-HYB6g',
    citations: 42,
    visibility: 'public',
    relatedProjectId: 'proj-1'
  },
  {
    id: 'pub-2',
    title: 'Moral Constraints in Autonomous Navigation Systems: A Framework for Urban Robotics',
    authors: ['Dr. Elena Rossi', 'Sarah Chen', 'Marcus Johnson'],
    publicationType: 'Journal',
    journal: 'IEEE Robotics and Automation Letters (RA-L)',
    doi: '10.1109/LRA.2025.3129841',
    date: 'January 10, 2026',
    abstract: 'Investigates ethical decision boundaries in unavoidable collision scenarios for micro-autonomous ground units in high-density pedestrian corridors.',
    keywords: ['Ethics in AI', 'Autonomous Vehicles', 'Control Theory', 'Safety Verification'],
    researchArea: 'Robotics & AI Ethics',
    status: 'Published',
    citations: 18,
    visibility: 'public'
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Building a Low-Cost Autonomous Rover with ROS',
    subtitle: 'An exploration into democratizing robotics research using off-the-shelf components and open-source software frameworks.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLtvxuytr9t_QdLqloUvpqTwNR9jbwok5O0wL8vz5HDhut6bWsx5sl445W8q5X7N5wtkNxjE6Xpp1ouHRs2dJwgWspMI3Jq2fLC_oERioR4uFXisCfOu7zqHflFJnhoBte3UeZe8ppDrkw4w3e7dxJJhVbULreb48ryqOcTUcV0h1WASN9BRArZm_1MNkm7FaDd7rKOqBaR__TosJ_vok_2DIr4lctPxF0rMzNy9q4LsAKQkPStQLnWw',
    author: {
      id: 'usr-student-2',
      name: 'Ahmed Rahman',
      role: 'Student • Batch 7',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDFPXrS5u1ogF44Q_T_g2VNa4OWqAIIz5Ac5x3JLhHeYTZrUA1NO-bpT5a70ju-WjYzvEhWnKwQIvpAsOxyQqycK-Zi1vTalHYE-QT19_rHaJ8NEj5zqu0xORSmm7yVV9Qvl5XZjhY4ZDxfcWORkv-qvCc7Xxl51v0Ip73Anh8tImIBMnMiY6TzLe9a3agECw-LnOdoircpd3LLU9x_XJ3Cw-LSdmKheP-TA6u5ZBYkC4r6j1dX1WjZg',
      bio: 'Ahmed is an undergraduate researcher exploring affordable hardware integration and SLAM on open-source Linux boards.'
    },
    category: 'Robotics & AI',
    tags: ['Robotics', 'ROS', 'Hardware', 'SLAM'],
    readingTime: '6 min read',
    date: 'Aug 12, 2026',
    views: 1240,
    body: [
      'The democratization of robotics has significantly accelerated in recent years. What once required million-dollar lab setups can now be prototyped on a workbench using microcontrollers and 3D-printed parts. In this project, our team set out to build a fully autonomous rover capable of navigating complex indoor environments without human intervention, relying entirely on budget-friendly hardware and the Robot Operating System (ROS).',
      'Hardware Selection & Architecture: The foundation of our rover is built upon a modified RC chassis, which provides robust mobility at a fraction of the cost of specialized robotic platforms. The central processing unit is a Raspberry Pi 4, acting as the high-level decision-maker running ROS Noetic.',
      'For low-level motor control and sensor polling, we utilized an Arduino Mega, communicating with the Pi via serial. This distributed architecture ensures that real-time tasks like PWM signal generation are not interrupted by the heavy computational loads of path planning.',
      'Implementing SLAM Algorithms: Simultaneous Localization and Mapping (SLAM) is the cornerstone of autonomous navigation. We opted for the gmapping package within ROS, which builds a 2D occupancy grid map from laser scan data and odometry.',
      'By fusing data from a low-cost RPLIDAR A1 and wheel encoders, the rover can accurately determine its pose within a dynamically generated map. The resulting map is then utilized by the move_base node to plan global paths and execute local obstacle avoidance trajectories.'
    ]
  },
  {
    id: 'art-2',
    title: 'Optimizing Drone Flight Paths using Machine Learning',
    subtitle: 'An analysis of reinforcement learning models applied to quadcopter navigation in dense urban environments.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK4R8sspeBTkVo9f0p4oVkyIujqJpbRL1hSOUgvTnW5DgNoRprPDqM9eczMyH20FdQ_x68cGjG6F1kXy0QU093Un4u5PWhwLpZ724l3u1cUrT-VTnTLHn86Kjxy-S9t4_kLTZ5aM_U3leS9U4XxSV1HT1fzzuw384AM0ZOhPOBtuCODXvR0B3vIhWWmB0YtXveBmPcL5TAjYE63OMFwavNkw1_SV0-Tt4Kt5u4flwZlT6fg_GgyyMLkg',
    author: {
      id: 'usr-student-3',
      name: 'David Kim',
      role: 'Student • Batch 6',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMRWUSpMcD-KgjKr7bRdIfjGk5t3KQneSAX12W6I7phnf9mU4oqy3Y3C6SmNTgqRVkNo2AdXNTJudZE6zkCDXB5z1z0-QzWKEZCTqAu-gJln787hTfjNmZBGkbupwm_y-x7IyGmvsuCQfpJiwntXajpAi_ndhwQFKlT_YMLcAe-IHF8osYoqdzeorKCa1_V1k3A9RedRhAHUwD8zRIupSvlDJT45aBUaMwLu4WfBEQw8TXfnTU0su7qQ',
      bio: 'David specializes in hardware-software co-design and edge AI acceleration.'
    },
    category: 'AI & Drones',
    tags: ['Machine Learning', 'Drones', 'Control Systems'],
    readingTime: '4 min read',
    date: 'Jul 28, 2026',
    views: 890,
    body: [
      'Multi-rotor UAVs operating in urban canopies encounter severe aerodynamic turbulence and non-line-of-sight signal loss.',
      'By applying continuous actor-critic reinforcement models on simulated Gazebo models, our team achieved a 30% reduction in battery draw during dynamic wind shear maneuvers.'
    ]
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Robotics Engineering Intern',
    organization: 'Boston Dynamics',
    organizationLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFhQfqIEf_F8-doRG2Vpwzfwz7ddtNFon0pN4fxxdZuHqSfyGqoSeI4O9fRgMQ7KaDwjqAFvgMEE7WCP_87ls1oDHlZqwwUcayLN_FTLVuBUwwe7qDyWHBDdXSLlVChRoGnpuXQEqdEFCihSX0GRjmCMyaymS2EY39hfd3eekT75t7r5-Kkpaz27fxp_cNxANT2pRWjfl7mBoFFEVhFlGkywwU8Wf7V4XhipYFgcDAr8BL69RAfSESIg',
    type: 'Internship',
    description: 'Join the mobile manipulation research team developing state estimation and trajectory optimization for multi-terrain quadrupeds.',
    requirements: ['Enrolled in B.Sc./M.Sc. in IRE or CS', 'Proficiency in C++ and ROS/ROS2', 'Experience with LiDAR and visual odometry'],
    requiredSkills: ['C++', 'ROS', 'Python', 'SLAM'],
    location: 'Waltham, MA (Onsite)',
    deadline: 'Nov 30, 2026',
    applicationUrl: 'https://bostondynamics.com/careers/intern-89',
    postedBy: { name: 'James Miller', role: 'Alumni Ref', avatar: CURRENT_USER_ALUMNI.avatar },
    isRecommended: true
  },
  {
    id: 'opp-2',
    title: 'IoT Systems & Firmware Developer',
    organization: 'Cisco Systems',
    organizationLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXlYmfi6jVziOwRmBD-TJ6lIh-xBHH7UlVLQpC-nadUowZMGseJcfktC7-0KezgeVrU90GpjF1Qhq1nakOp6Oi9VB0fI9b-Y-nueuS0QNxuVX7oHAswdwahWlMfPw1UcA0NS14kzXKGNSyVC5PfyPvph8zyenBAd_PsVp_jfd9c_CSZJpq6zxQwUUN3MWKPrh1acjEzNF1zKTjLdMF5x6Chrg6QoYDMeU6rU7qnpE28QM5d9wx-gMQ4Q',
    type: 'Job',
    description: 'Develop next-gen low-power industrial mesh networking gateways and edge telemetry processors.',
    requirements: ['Degree in IRE, EE, or Computer Engineering', 'Experience with FreeRTOS and MQTT/CoAP protocols', 'PCB troubleshooting skills'],
    requiredSkills: ['Embedded C', 'MQTT', 'RTOS', 'Hardware Debugging'],
    location: 'San Jose, CA (Hybrid)',
    deadline: 'Dec 15, 2026',
    applicationUrl: 'https://cisco.com/jobs/iot-491',
    postedBy: { name: 'David Chen', role: 'Alumni Staff', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgOGZj8HWKLLzxuYNF87_mV90sB7EpQ2qveajHTqIiMBO54cvKdOyNYGxalRJh-785QcWWJsmGS16fZOtVy8SmyzrIKH5mvvMZMPWwEiL1s5CSbu2cwJ_D1FHfAyLEiohba15xIpx6rZpidAv2jbvVaX8Wp17gF4GLd5sbIAp6JQiSAAyIWeYBh5vfW1rk25cn0lFiYTm6in1m-Vu7acXo9fWYxiUUY0A1ybOUC6SxLU_XTu6VIeH3DA' },
    isRecommended: true
  },
  {
    id: 'opp-3',
    title: 'Research Assistant: Moral Frameworks in AI',
    organization: 'Autonomous Systems Lab',
    type: 'Research',
    description: 'Funded undergraduate research assistantship examining formal verification of ethical boundaries in autonomous delivery bots.',
    requirements: ['IRE student with 3.5+ GPA', 'Comfortable reading peer-reviewed IEEE papers', 'Python simulation experience'],
    requiredSkills: ['Python', 'AI Ethics', 'Simulation'],
    location: 'Lab 310 Campus',
    deadline: 'Jan 15, 2027',
    postedBy: { name: 'Dr. Elena Rossi', role: 'Faculty Supervisor', avatar: CURRENT_USER_FACULTY.avatar },
    isRecommended: false
  },
  {
    id: 'opp-4',
    title: 'Looking for Teammates: Autonomous Underwater Vehicle (AUV)',
    organization: 'Student Team Collab',
    type: 'Collaboration',
    description: 'Developing an autonomous submersible for environmental coral bed mapping. Looking for dedicated members for mechanical sealing and CV classification.',
    requirements: ['Passion for robotics', '10 hrs/week commitment'],
    requiredSkills: ['Computer Vision', 'Mechanical Design', 'Embedded Systems'],
    location: 'Campus Marine Tank Lab',
    deadline: 'Rolling',
    postedBy: { name: 'Sarah Chen', role: 'Project Lead', avatar: CURRENT_USER_STUDENT.avatar },
    isRecommended: true
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Final Semester Examination Schedule Released',
    description: 'The schedule for the upcoming final semester examinations and thesis defense sessions has been finalized. Review lab allocations and submission deadlines.',
    date: '2 hours ago',
    category: 'Exam Notice',
    isPinned: true
  },
  {
    id: 'ann-2',
    title: 'Advanced ROS2 & Gazebo Simulation Intensive 3-Day Workshop',
    description: 'Join department faculty and visiting alumni for an intensive 3-day deep dive into micro-ROS, hardware-in-the-loop simulation, and real-time path planning.',
    date: 'Oct 24, 2026',
    category: 'Workshop',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1UlhsBDnU14z1I6TwyN7z3ahTb0co45C80kHQ1DpWqLQ_vDtsAjxc1cvpF5vD9qIHo796IuQl05LYhe6VBKumeCaMOx18v-TrkfT3yc-RyCbhUnpP8Q1qsn4cocQyIXDBPfCAtC1TxK7YO0zHyjwI8OgusGt4iyhieKj5A3_HiopZSw-jKKEoo9tJu1LNyrwKPltAZl8Rab32LQlYC652hkCCZHYCIERdaG22y0QUAqQb7xMUtp5d-37N0'
  },
  {
    id: 'ann-3',
    title: 'Annual Robotics Innovators Department Challenge 2026',
    description: 'Registration is now open for the annual department innovation challenge. Grand prize includes $10,000 in prototype research grants and direct alumni mentorship.',
    date: 'Oct 22, 2026',
    category: 'Competition'
  },
  {
    id: 'ann-4',
    title: 'New High-Precision 6-DoF Robotic Arms Installed in Lab 2',
    description: 'The department has completed calibration of 6 new industrial robotic arms for student coursework and thesis research.',
    date: 'Oct 20, 2026',
    category: 'General'
  }
];

export const MOCK_EVENTS: DepartmentEvent[] = [
  {
    id: 'evt-1',
    title: 'Next-Gen AI & Robotics Integration Symposium',
    date: 'Nov 15, 2026',
    time: '10:00 AM - 4:00 PM',
    location: 'Main Auditorium, Engineering Block',
    description: 'Full-day academic symposium bringing together leading researchers, alumni in robotics startups, and industry leaders to discuss the sensory gap in physical intelligence.',
    organizer: 'IRE Robotics Club & Dept. Faculty',
    organizerLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANO2a9r803YBFOMKCA7QOCxyvVTFE2QwGohBho3_c9hxWLGKyYvF98B9wQB1s-VwIwapsNvDYu_L2IkiLG3IKDr-IM1fDnz-d3luNpZo3ImoldcP_GhlSkpVPiyr6p6reVWD3PIRy4pxs9hL2LurkIPQzlq_B9puReLWFX_pUY5dwlENRaEBlOvIivl6J5FMbAbNZ_5XeF07w8aduI6ZoYYfowXZsKRNFnzFO_SFKQMAwNZ8jq0VsrPA',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDomnhWmcg3TaunQMvX30GzEDvkAdFa3ZXtU9kHPFn0F1C1dbFsP4lvTLyGSiBJq-t82POKFthLdubOhsK7ZYTmblQpencebSWUoFtQ6WU55Kx6-kwGocO6qXnAtTTb3os6lUOo4MOdAqkXq_y6fwIl8nu2-xxZibJK6vP1pKh9jjXAlfkenBioFl3ZChGEa5H3I_sshQrRaTY7hxktHJmOIPfFvx5SjF1r7aVpD11NUHsvWTnqYO2dZQ',
    isUpcoming: true,
    category: 'Symposium',
    participantsCount: 148,
    attendeesAvatars: [
      CURRENT_USER_STUDENT.avatar,
      CURRENT_USER_FACULTY.avatar,
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDFPXrS5u1ogF44Q_T_g2VNa4OWqAIIz5Ac5x3JLhHeYTZrUA1NO-bpT5a70ju-WjYzvEhWnKwQIvpAsOxyQqycK-Zi1vTalHYE-QT19_rHaJ8NEj5zqu0xORSmm7yVV9Qvl5XZjhY4ZDxfcWORkv-qvCc7Xxl51v0Ip73Anh8tImIBMnMiY6TzLe9a3agECw-LnOdoircpd3LLU9x_XJ3Cw-LSdmKheP-TA6u5ZBYkC4r6j1dX1WjZg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD40EyBSVkG4X3pl2949JAl2ZbcebR_hy2m9rBgqTSvJ8WdVhg6aLu_s9JXGOn9OEgspxJC8A5eXfnI99AjnFpUqQw6gE9LJLNP_ASRc8I1_LfC5ghrgEnqxvp9GZSQ8evWk3NRKG-Gq3SM8GomngDmCKhw64VeEdfxnhZT0XtWTnszp7mm49y2z1EpWLDaKfp7J5VrZnfbwy38vzZVNMoQA0n8eglb2ItutjV5vpaQPFqNYBEr538DCA'
    ]
  },
  {
    id: 'evt-2',
    title: 'Global Data Privacy Frameworks Debate & Panel',
    date: 'Nov 18, 2026',
    time: '2:00 PM - 5:00 PM',
    location: 'Virtual / Hall C',
    description: 'Expert debate on GDPR, ethical computer vision retention, and AI surveillance constraints in academic spaces.',
    organizer: 'Dept. of IRE & Ethics Council',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAHfK8A9N2R4LjsFNSaeEUFz31dS2W917dY3EfhGHPBIOpKHOzWf-CoFnyeETHsG5CrNsAj-K-j18nwNFjoou4ZJgUh-NTo5goWU5LDslPbYH58f-2wVp71XWPiMK1JXM8lspKKBcp7AY3lDnNpTpLlxCuZ00Oamr056y2DJLO4kVJLAkP1SnIUY88j1rLElyLYbW-1TT6242xb2JyJ8OVdgDoKQ5wLEopBZQj5eXMGgxM22x7Kt94kg',
    isUpcoming: true,
    category: 'Debate',
    participantsCount: 86,
    attendeesAvatars: [
      CURRENT_USER_FACULTY.avatar,
      CURRENT_USER_STUDENT.avatar
    ]
  },
  {
    id: 'evt-3',
    title: 'Alumni Career Panel & Networking Dinner',
    date: 'Oct 05, 2026',
    time: '6:00 PM',
    location: 'University Faculty Club',
    description: 'Annual fall gathering connecting current senior students with industry alumni in Google, Tesla, and Cisco.',
    organizer: 'IRE Alumni Association',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDomnhWmcg3TaunQMvX30GzEDvkAdFa3ZXtU9kHPFn0F1C1dbFsP4lvTLyGSiBJq-t82POKFthLdubOhsK7ZYTmblQpencebSWUoFtQ6WU55Kx6-kwGocO6qXnAtTTb3os6lUOo4MOdAqkXq_y6fwIl8nu2-xxZibJK6vP1pKh9jjXAlfkenBioFl3ZChGEa5H3I_sshQrRaTY7hxktHJmOIPfFvx5SjF1r7aVpD11NUHsvWTnqYO2dZQ',
    isUpcoming: false,
    category: 'Networking',
    participantsCount: 190,
    attendeesAvatars: [
      CURRENT_USER_ALUMNI.avatar,
      CURRENT_USER_STUDENT.avatar
    ]
  }
];

export const MOCK_HALL_OF_FAME: HallOfFameEntry[] = [
  {
    id: 'hof-1',
    title: '1st Place — National Robotics Challenge Winner',
    recipient: 'Sarah Chen, Ahmed Rahman, David Kim',
    role: 'Student Team Batch 7',
    year: '2026',
    badge: 'National Champion',
    description: 'Designed and deployed an autonomous exploration rover capable of unstructured terrain traversal with record-setting SLAM benchmark efficiency.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhToecxwZ9rh4gmmxDb6OIohOnAUwkRYxqbv4nW7MThREMvNTNCw-ZV5LNbUi8qq_QdfgfhjHyra2sn6wlZPhunJ_-LTcjSbOo2-tlDgyazZx7XfhSSEmbV_nC0w8Lt8dCINTndV1pvGeXLzB4fcqm6XoW7l2jgO__khcQVO23V1RLcRHvO0LJk_pCaUFEy8k92VITPHuw5PBK6LbyrRevyfaSGuhhljsTlPhsMycMNyfv9zSy6PgdRA'
  },
  {
    id: 'hof-2',
    title: 'Top 10 Global Interactive Technologies Research Output',
    recipient: 'Department Faculty & Autonomous Systems Lab',
    role: 'Department Milestone',
    year: '2025',
    badge: 'Global Institutional Honor',
    description: 'The IRE department achieved ranking within the top 10 globally for peer-reviewed journal papers published in human-robot collaboration and edge intelligence.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDufnx6Hs8hcqd3OSHqFQZO4YCZF4RE_OfhpH3-Ceeh9VpbrdSNN32BMk1GSPh5JRbnq_eTHikgesCncYIeoCTlukWWEcH5ltvhIo1nFX8dQXb_7rgxPtJyKEtDYtLFb9oavuyrrVhlJxZvk5JQFrhiOJLWSSh1xoWFu35UlK0HBNqlYFlHZxZxA9tuVRCGdo09JCOqKhFdzVxcVmipr4hBILxTeD7NONZe-sYBTvRMc4-PWW2qlK9mNg'
  },
  {
    id: 'hof-3',
    title: 'DeepMind Senior Research Appointment',
    recipient: 'James Miller',
    role: 'Alumni Batch 3',
    year: '2024',
    badge: 'Alumni Distinction',
    description: 'Pioneering work in sim-to-real robotic policy transfer earned alumnus James Miller an appointment to the foundational AI research division.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD40EyBSVkG4X3pl2949JAl2ZbcebR_hy2m9rBgqTSvJ8WdVhg6aLu_s9JXGOn9OEgspxJC8A5eXfnI99AjnFpUqQw6gE9LJLNP_ASRc8I1_LfC5ghrgEnqxvp9GZSQ8evWk3NRKG-Gq3SM8GomngDmCKhw64VeEdfxnhZT0XtWTnszp7mm49y2z1EpWLDaKfp7J5VrZnfbwy38vzZVNMoQA0n8eglb2ItutjV5vpaQPFqNYBEr538DCA'
  }
];

export const MOCK_HISTORY_MILESTONES: DepartmentHistoryMilestone[] = [
  {
    year: '2026',
    title: 'Autonomous Systems Research Wing Commissioned',
    description: 'Opened the new 8,000 sq ft dedicated robotics testing track, water tank, and multi-spectral sensor testing bay.',
    category: 'Infrastructure'
  },
  {
    year: '2024',
    title: 'Department Curriculum Modernization',
    description: 'Integrated ROS2, Edge AI Hardware accelerators, and formal AI safety verification into core undergraduate degrees.',
    category: 'Academic'
  },
  {
    year: '2021',
    title: 'Foundational Alumni Batch 1 & 2 Global Placements',
    description: 'First graduating batches secured research and engineering roles across Tesla, Boston Dynamics, Cisco, and MIT labs.',
    category: 'Alumni'
  },
  {
    year: '2014',
    title: 'Establishment of the IRE Department',
    description: 'Founded by Professor Emeritus Dr. Arthur Vance to pioneer the convergence of embedded IoT and physical robotic intelligence.',
    category: 'Foundational'
  }
];

export const MOCK_LINKEDIN_IMPORTS: LinkedInImportItem[] = [
  {
    id: 'li-1',
    source: 'LinkedIn',
    type: 'Certification',
    title: 'Advanced Machine Learning Nanodegree',
    subtitle: 'Udacity · Issued Jun 2024',
    date: 'Jun 2024',
    preview: 'Covers deep neural networks, computer vision, reinforcement learning, and PyTorch deployment.',
    selected: true,
    credentialId: '8A9B-2C4D-9981'
  },
  {
    id: 'li-2',
    source: 'LinkedIn',
    type: 'Publication',
    title: 'Predictive Models in Urban Planning',
    subtitle: 'Journal of Urban Tech · Oct 2025',
    date: 'Oct 2025',
    preview: 'Explores machine learning techniques for zoning and sensor telemetry forecasting in municipal corridors.',
    selected: true
  },
  {
    id: 'li-3',
    source: 'LinkedIn',
    type: 'Experience',
    title: 'Guest Lecturer - Data Ethics & Autonomous Mobility',
    subtitle: 'Tech University · Jan 2026 - Present',
    date: 'Jan 2026',
    preview: 'Delivered four guest seminar sessions to graduate engineering students on safety boundaries.',
    selected: false
  },
  {
    id: 'li-4',
    source: 'LinkedIn',
    type: 'Certification',
    title: 'Cloud Architecture Fundamentals - AWS Certified',
    subtitle: 'Amazon Web Services · Jul 2024',
    date: 'Jul 2024',
    preview: 'Validated architecture skills across high-availability cloud deployments and distributed storage.',
    selected: false,
    credentialId: 'AWS-99210-IRE'
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Connection Request',
    message: 'James Miller (Senior AI Researcher @ DeepMind) sent you a connection request.',
    time: '2 hours ago',
    isToday: true,
    isRead: false,
    type: 'connection',
    avatar: CURRENT_USER_ALUMNI.avatar
  },
  {
    id: 'notif-2',
    title: 'Mentorship Request Update',
    message: 'Dr. Elena Rossi accepted your mentorship session on Autonomous Systems Thesis Direction.',
    time: '5 hours ago',
    isToday: true,
    isRead: false,
    type: 'mentorship',
    avatar: CURRENT_USER_FACULTY.avatar
  },
  {
    id: 'notif-3',
    title: 'Opportunity Match Alert',
    message: "New 'Robotics Engineering Intern' role at Boston Dynamics matches your Python + ROS skill profile.",
    time: '8 hours ago',
    isToday: true,
    isRead: false,
    type: 'opportunity'
  },
  {
    id: 'notif-4',
    title: 'Department Announcement',
    message: 'Final Semester Examination Schedule has been officially released for all cohorts.',
    time: 'Yesterday',
    isToday: false,
    isRead: true,
    type: 'announcement'
  },
  {
    id: 'notif-5',
    title: 'Event Reminder',
    message: "Reminder: 'Next-Gen AI & Robotics Integration Symposium' begins in 2 days in the Main Auditorium.",
    time: '2 days ago',
    isToday: false,
    isRead: true,
    type: 'event'
  },
  {
    id: 'notif-6',
    title: 'Profile Verification Completed',
    message: 'Your student identity has been officially verified by the department administration.',
    time: '3 days ago',
    isToday: false,
    isRead: true,
    type: 'verification'
  }
];

export const MOCK_CONNECTION_REQUESTS: ConnectionRequest[] = [
  {
    id: 'req-1',
    user: {
      id: 'usr-sarah-jenkins',
      name: 'Dr. Sarah Jenkins',
      email: 's.jenkins@mit.edu',
      role: 'alumni',
      verificationStatus: 'Verified Alumni',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE_RxuX327zhocfTIj_TmHSaj8i96o57nDz7wD-4Znz1aqXrP-ELoco_HkumJNjOYDJG3uWEv2JprLVqOvi-uese45qaISY7Ppw3mvYJyf_8w4klIQ9ORsmr9Smaa1wbDi31lp4ybTJw1MYOYXJnFyzao-GjrgpJ2Qznm1yV7YvJbojHncHHZXvRQx2kAcSgz_b1TccmUUp8LMidX-3b2Et8ajbyPdKUqinye8HEU63Ed9ZyXf1KJ8uA',
      department: 'IRE Alumni',
      headline: 'Robotics Researcher @ MIT Media Lab',
      bio: 'Alumni Class of 2020 specializing in human-robot collaboration interfaces.',
      location: 'Cambridge, MA',
      skills: ['HRI', 'Python', 'ROS'],
      education: [],
      experience: [],
      externalLinks: {},
      privacy: { cv: 'public', email: 'department', phone: 'private', experience: 'public', projects: 'public', achievements: 'public', publications: 'public', externalLinks: 'public' },
      notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true }
    },
    mutualConnections: 3,
    timestamp: '2 hours ago',
    status: 'pending',
    isIncoming: true
  },
  {
    id: 'req-2',
    user: {
      id: 'usr-marcus-webb',
      name: 'Marcus Webb',
      email: 'm.webb@aithics.org',
      role: 'student',
      verificationStatus: 'Verified Student',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfaGDTkR6KR75DvA72xbqHPInfRyRQVSTZ-OxVVpuvsx71spynbpMMP7_cpCwPtjrTByz3rDZVQ_YNfXHEcK47c2-MrT3291mKrVaL4BAWWRG8OFGI--FCy9K0PcWwW6LoKaM45AV08E8zQTDUx2XnPu_3UVVIIX-R1wjtzy0QMKJ3HAhjDfGNsuNt2NzHHVKjE6GOj0cQXJkKWuGiyaGrgWOpiMYYbFU1tmnmwRSdxvrCo-4G19OsAg',
      department: 'IRE Batch 7',
      headline: 'Data Scientist & AI Ethics Researcher',
      bio: 'Undergraduate student researching bias mitigation in reinforcement learning models.',
      location: 'Campus Lab 402',
      skills: ['Data Science', 'Python', 'AI Ethics'],
      education: [],
      experience: [],
      externalLinks: {},
      privacy: { cv: 'public', email: 'department', phone: 'private', experience: 'public', projects: 'public', achievements: 'public', publications: 'public', externalLinks: 'public' },
      notificationSettings: { connectionRequests: true, acceptedConnections: true, opportunityAlerts: true, deadlineReminders: true, announcements: true, events: true, contentInteractions: true, mentorshipRequests: true }
    },
    mutualConnections: 1,
    timestamp: '5 hours ago',
    status: 'pending',
    isIncoming: true
  }
];

export const MOCK_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'vreq-1',
    user: CURRENT_USER_STUDENT,
    submittedAt: 'Oct 24, 2026 • 09:41 AM',
    status: 'Pending',
    evidenceDocUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDr0GXlgEbrgw-kDTWw0JZwWTL_kd_R7OJC1i7gX0kMOAgUaM04k5CuyQXmBafQAxhS4XwnFXyMVzXRzdf2jZPbtBrMqdyltbFvciFzCjOJ0L7nrpV0yuWCohatdpBmZNWwt3osG2XeMpFzr0f9HyL-JvEr_F1_XHu4J_vU9ciXiNuRzqsaJWRF2JK6lT-FCh6iVd-o9kvsXJYwncuWb0jlX90brRonb42rdSwN6QPisxbuyxMbKxgPg',
    scanMatchScore: 98,
    degreeProgram: 'B.S. IoT & Robotics Engineering (Expected 2026)'
  },
  {
    id: 'vreq-2',
    user: CURRENT_USER_ALUMNI,
    submittedAt: 'Oct 23, 2026 • 02:22 PM',
    status: 'Pending',
    scanMatchScore: 95,
    degreeProgram: 'B.S. IoT & Robotics Engineering (Graduated 2021)'
  },
  {
    id: 'vreq-3',
    user: CURRENT_USER_FACULTY,
    submittedAt: 'Oct 22, 2026 • 08:15 AM',
    status: 'Pending',
    scanMatchScore: 99,
    degreeProgram: 'Faculty Appointment Letter / ID 8840'
  }
];

export const MOCK_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep-1',
    contentId: 'art-1',
    contentType: 'Article',
    contentTitle: 'AI Research Methodology Analysis Claim',
    reason: 'Misinformation',
    reportedBy: 'Dr. S. Chen',
    reporterAvatar: CURRENT_USER_STUDENT.avatar,
    date: 'Oct 24, 2026 • 14:32 UTC',
    status: 'Under Review',
    details: 'User flagged this article for containing unverified benchmark claims.'
  },
  {
    id: 'rep-2',
    contentId: 'ach-claim',
    contentType: 'Project',
    contentTitle: 'Top Performer Q3 Claim',
    reason: 'Fake Profile',
    reportedBy: 'Auto-Flag System',
    date: 'Oct 24, 2026 • 09:15 UTC',
    status: 'Flagged',
    details: 'Claimed achievement does not match internal university records for evaluation.'
  },
  {
    id: 'rep-3',
    contentId: 'com-88',
    contentType: 'Comment',
    contentTitle: "Spam Link on 'Project Alpha Launch'",
    reason: 'Spam',
    reportedBy: 'J. Miller',
    reporterAvatar: CURRENT_USER_ALUMNI.avatar,
    date: 'Oct 23, 2026 • 22:10 UTC',
    status: 'Under Review',
    details: 'External promo link detected.'
  }
];
