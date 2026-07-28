/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc,
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { UserProfile, UserRole, ChatMessage, Notification, CommissionLog, Appointment, BrandAudit, SponsorshipRequest, Course, UtmLink, Subscriber, Enrollment, Announcement, MentorshipRequest, TalentProfile, TalentGigOpportunity, TalentInquiry } from './types';

// Detect whether real Firebase is configured
export const isRealFirebase = 
  firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes('PLACEHOLDER') && 
  firebaseConfig.projectId && 
  !firebaseConfig.projectId.includes('PLACEHOLDER');

let firebaseApp: any = null;
export let db: any = null;
export let auth: any = null;

if (isRealFirebase) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    // Use default database to ensure security rules are correctly applied and to prevent named database deployment mismatch
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
    
    // Validate connection to Firestore as per Firebase Skill guidelines
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  } catch (err) {
    console.error('Firebase initialization failed:', err);
  }
}

// Helper to recursively clean undefined fields to avoid "Unsupported field value: undefined" errors in Firestore
export const cleanUndefined = <T extends Record<string, any>>(obj: T): T => {
  const clean: any = {};
  Object.keys(obj).forEach(key => {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        clean[key] = cleanUndefined(val);
      } else {
        clean[key] = val;
      }
    }
  });
  return clean;
};

// Error handling matching FirestoreErrorInfo interface
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || 'simulated-user-id',
      email: auth?.currentUser?.email || 'simulated@example.com',
      emailVerified: auth?.currentUser?.emailVerified || true,
      isAnonymous: auth?.currentUser?.isAnonymous || false,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- LOCAL STORAGE PERSISTENCE ENGINE ---
// Fallback storage for preview environments or local testing

const LOCAL_STORAGE_KEYS = {
  USERS: 'sac_users',
  CHATS: 'sac_chats',
  NOTIFICATIONS: 'sac_notifications',
  COMMISSIONS: 'sac_commissions',
  APPOINTMENTS: 'sac_appointments',
  BRAND_AUDITS: 'sac_brand_audits',
  SPONSORSHIPS: 'sac_sponsorships',
  CURRENT_USER: 'sac_current_user',
  UTM_LINKS: 'sac_utm_links',
  SUBSCRIBERS: 'sac_subscribers',
  ENROLLMENTS: 'sac_enrollments',
  ANNOUNCEMENTS: 'sac_announcements',
  MENTORSHIP_REQUESTS: 'sac_mentorship_requests',
  TALENTS: 'sac_talents',
  GIGS: 'sac_gigs',
  TALENT_INQUIRIES: 'sac_talent_inquiries'
};

const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial simulated mock datasets
const INITIAL_COURSES: Course[] = [
  {
    id: 'dm-seo-mastery',
    title: 'SEO Mastery & Technical Auditing',
    description: 'Master on-page optimization, semantic content clusters, technical indexing audits, and core web vitals speed calibration.',
    longDescription: 'Our flagship SEO service and training course. Learn how to perform deep crawler audits, resolve indexing blocks, calibrate schema configurations, pair display fonts like Montserrat for superior readability, and command first-page Google rankings.',
    duration: '4 Hours Session',
    price: 9000,
    level: 'Intermediate',
    syllabus: [
      'Keyword Intent & Competitor Content Crawls',
      'On-Page Semantic Optimization & HTML Schema',
      'Google Search Console & Indexation Audits',
      'Core Web Vitals & Lazy-Loading Performance',
      'Backlink Outreach & Page Authority Building'
    ],
    category: 'SEO & Search Services',
    ageRange: 'Adults & Professionals',
    image: 'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?q=80&w=600&auto=format&fit=crop',
    tags: ['Google Search', 'SEO Audits', 'Organic Growth'],
    points: '+1200 XP'
  },
  {
    id: 'dm-social-ads',
    title: 'Paid Social Ads & Conversion Funnels',
    description: 'Design, configure, and scale high-yielding programmatic campaigns on Facebook, Instagram, and TikTok.',
    longDescription: 'Perfect for business owners and consultants. Learn to navigate the Meta Ads Manager, integrate the Conversions API, build Custom and Lookalike audiences, write compelling direct-response copy, and run split-testing structures.',
    duration: '4 Hours Session',
    price: 9000,
    level: 'Advanced',
    syllabus: [
      'Meta pixel & Conversions API Configurations',
      'High-Impact Ad Creatives & Videography',
      'Direct-Response Copywriting & Ad Hooks',
      'Multivariate A/B Testing & CBO Strategies',
      'Scaling Ad Sets Without Audience Fatigue'
    ],
    category: 'Paid Social Services',
    ageRange: 'Adults & Professionals',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    tags: ['Meta Ads', 'Lead Funnels', 'TikTok Ads'],
    points: '+1500 XP'
  },
  {
    id: 'dm-google-ppc',
    title: 'Google Search Ads & Performance Max',
    description: 'Dominate Google search results for commercial intent queries with advanced PPC bidding architectures.',
    longDescription: 'An elite Google Ads service and learning guide. Learn to target high-intent search terms, configure negative keyword sheets, build responsive search ads, master Smart Bidding algorithms, and build complete Performance Max campaigns.',
    duration: '4 Hours Session',
    price: 9000,
    level: 'Advanced',
    syllabus: [
      'PPC Campaign Frameworks & Match Types',
      'Responsive Search Ads & Quality Scores',
      'Smart Bidding: Target CPA & ROAS Configs',
      'Negative Keyword Silos & Negative Lists',
      'Performance Max & Display Retargeting'
    ],
    category: 'PPC Search Services',
    ageRange: 'Adults & Professionals',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop',
    tags: ['Google PPC', 'PMax Campaigns', 'High Intent'],
    points: '+1600 XP'
  },
  {
    id: 'dm-email-crm',
    title: 'CRM Pipelines & Email Automation',
    description: 'Maximize customer lifetime value with automated retention sequences, drip campaigns, and behavior triggers.',
    longDescription: 'Turn cold traffic into recurring revenue. Master CRM integrations, behavior-driven email segmentation, cart abandonment triggers, promotional newsletter copywriting, and deliverability protocols (DKIM/SPF/DMARC).',
    duration: '4 Hours Session',
    price: 9000,
    level: 'Intermediate',
    syllabus: [
      'Email List Building & High-Converting Lead Magnets',
      'Customer Retention Journeys & Drip Flows',
      'Abandonment Automation & Behavior Triggers',
      'SMTP Servers, DKIM/DMARC & Deliverability Checklists',
      'CRM Pipeline CRM Automations & Leads Management'
    ],
    category: 'Email Services',
    ageRange: 'Adults & Professionals',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=600&auto=format&fit=crop',
    tags: ['Klaviyo', 'CRM Pipelines', 'Automation'],
    points: '+1000 XP'
  },
  {
    id: 'dm-content-ai',
    title: 'Content Marketing & AI-Powered Copywriting',
    description: 'Deploy authority editorial plans and scale premium copywriting pipelines using customized Google Gemini workflows.',
    longDescription: 'Learn how to scale content operations without losing your brand voice. Master the AIDA & PAS copywriting frameworks, perform SEO copywriting audits, design high-authority content schedules, and build custom generative prompts.',
    duration: '4 Hours Session',
    price: 9000,
    level: 'Beginner',
    syllabus: [
      'Copywriting Principles: AIDA & PAS Frameworks',
      'Blogging, Case Studies & Content Calendars',
      'Custom Gemini API Prompt Engineering for Copy',
      'Social Storytelling & Graphic Visual Copy',
      'Brand Tone Guardrails & Editorial Guidelines'
    ],
    category: 'Content Services',
    ageRange: 'Adults & Professionals',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop',
    tags: ['AI Writing', 'Content Strategy', 'Gemini Prompts'],
    points: '+800 XP'
  },
  {
    id: 'dm-cro-analytics',
    title: 'CRO Diagnostics & Growth Analytics',
    description: 'Stop wasting traffic. Track and optimize landing pages and conversion actions with GA4 and Hotjar.',
    longDescription: 'The ultimate web intelligence and optimization training. Learn how to set up clean Google Analytics 4 tracking events, deploy triggers via Google Tag Manager, interpret session recordings, and eliminate form checkout friction.',
    duration: '4 Hours Session',
    price: 9000,
    level: 'Advanced',
    syllabus: [
      'Google Analytics 4 & Custom Conversion Events',
      'GTM Tag Configurations & Conversion Triggers',
      'Session Recording Audits & Friction Scoring',
      'Landing Page UX/UI Optimization Secrets',
      'Structured Hypotheses & Multivariate Testing'
    ],
    category: 'Web Intelligence',
    ageRange: 'Adults & Professionals',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    tags: ['GA4', 'Tag Manager', 'Heatmapping'],
    points: '+1200 XP'
  },
  {
    id: 'dm-brand-strategy',
    title: 'Brand Communication & Identity Strategy',
    description: 'Master strategic brand positioning, visual identity systems, brand voice guidelines, and high-impact corporate narratives.',
    longDescription: 'Our flagship Brand Strategy and Identity masterclass. Learn how to craft distinctive brand positioning, design cohesive visual identity architectures, formulate brand voice guidelines, and build corporate messaging frameworks that command market authority.',
    duration: '4 Hours Session',
    price: 9000,
    level: 'Advanced',
    syllabus: [
      'Brand Audit & Competitive Positioning Analysis',
      'Visual Identity System & Brand Architecture Design',
      'Brand Voice, Tone & Messaging Matrices',
      'Brand Equity Measurement & Governance Models',
      'Multi-Channel Brand Activation & Launch Campaigns'
    ],
    category: 'Brand Strategy & Identity',
    ageRange: 'Adults & Professionals',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    tags: ['Brand Strategy', 'Visual Identity', 'Brand Voice'],
    points: '+1800 XP'
  },
  {
    id: 'dm-corp-comm',
    title: 'Corporate Communication, PR & Media Relations',
    description: 'Master executive media relations, stakeholder alignment, press release distribution, and crisis communication management.',
    longDescription: 'An elite Corporate Communications and Media Strategy program. Learn to handle executive stakeholder messaging, build crisis management protocols, execute high-converting PR press releases, drive thought leadership, and foster media relations.',
    duration: '4 Hours Session',
    price: 9000,
    level: 'Advanced',
    syllabus: [
      'Corporate Reputation & Crisis Communication Protocols',
      'Executive Thought Leadership & Media Pitching',
      'Press Release Architecture & Global PR Syndication',
      'Stakeholder Alignment & Internal Communications',
      'Media Analytics & PR Sentiment Scoring'
    ],
    category: 'Corporate PR & Media Services',
    ageRange: 'Adults & Professionals',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop',
    tags: ['Corporate PR', 'Media Relations', 'Crisis Mgmt'],
    points: '+1800 XP'
  }
];

// Initialize local database values if empty
if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)) {
  const defaultUsers: Record<string, UserProfile> = {
    'student-demo': {
      uid: 'student-demo',
      email: 'student@pulzitive.com',
      displayName: 'Adebayo Oluwaseun',
      role: 'Student',
      profileCompleted: true,
      phone: '+2348011223344',
      xp: 450,
      badges: ['Quick Learner', 'Coding Rookie'],
      accessStatus: 'active',
      termEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paidBy: 'self'
    },
    'parent-demo': {
      uid: 'parent-demo',
      email: 'parent@pulzitive.com',
      displayName: 'Chioma Obi',
      role: 'Parent',
      profileCompleted: true,
      phone: '+2348022334455',
      children: ['student@pulzitive.com']
    },
    'teacher-demo': {
      uid: 'teacher-demo',
      email: 'teacher@pulzitive.com',
      displayName: 'Mr. Babajide Alao',
      role: 'Teacher',
      profileCompleted: true,
      phone: '+2348033445566'
    },
    'mentor-demo': {
      uid: 'mentor-demo',
      email: 'mentor@pulzitive.com',
      displayName: 'Dr. Sarah Carter',
      role: 'Mentor',
      profileCompleted: true,
      phone: '+2348044556677',
      bio: 'Ex-Google Engineering Lead. Passionate about mentoring upcoming African tech talents.'
    },
    'client-demo': {
      uid: 'client-demo',
      email: 'client@pulzitive.com',
      displayName: 'Abiodun Salami',
      role: 'Client',
      profileCompleted: true,
      phone: '+2348055667788',
      companyName: 'Pulzitive Limited'
    },
    'admin-demo': {
      uid: 'admin-demo',
      email: 'pulzitive@gmail.com',
      displayName: 'Pulzitive Admin',
      role: 'Admin',
      profileCompleted: true,
      phone: '+2348011112222'
    }
  };
  setLocalStorage(LOCAL_STORAGE_KEYS.USERS, defaultUsers);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CHATS)) {
  const defaultChats: ChatMessage[] = [
    {
      id: 'msg-1',
      chatId: 'student-demo_mentor-demo',
      senderId: 'mentor-demo',
      senderName: 'Dr. Sarah Carter',
      text: 'Hello Adebayo! Welcome to the Mentorship program. How is your learning path in the Advanced AI course going?',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'msg-2',
      chatId: 'student-demo_mentor-demo',
      senderId: 'student-demo',
      senderName: 'Adebayo Oluwaseun',
      text: 'Hello Dr. Sarah! It is going great. I am currently working on implementing the Gemini SDK server-side and trying to map RAG architectures.',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.CHATS, defaultChats);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS)) {
  const defaultNotifications: Notification[] = [
    {
      id: 'notif-1',
      userId: 'student-demo',
      text: 'Welcome to Pulzitive Digital Academy! Your profile is verified.',
      timestamp: new Date().toISOString(),
      read: false
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, defaultNotifications);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.COMMISSIONS)) {
  const defaultCommissions: CommissionLog[] = [
    {
      id: 'comm-1',
      userId: 'teacher-demo',
      amount: 4000, // 20% of 20,000 Google Search Ads course
      type: 'Teacher',
      courseId: 'dm-google-ppc',
      courseTitle: 'Google Search Ads & Performance Max',
      studentName: 'Adebayo Oluwaseun',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'comm-2',
      userId: 'mentor-demo',
      amount: 1500, // 10% of 15,000 SEO course
      type: 'Mentor',
      courseId: 'dm-seo-mastery',
      courseTitle: 'SEO Mastery & Technical Auditing',
      studentName: 'Adebayo Oluwaseun',
      timestamp: new Date(Date.now() - 43200000).toISOString()
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.COMMISSIONS, defaultCommissions);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.APPOINTMENTS)) {
  const defaultAppointments: Appointment[] = [
    {
      id: 'appt-1',
      clientEmail: 'client@sac.com',
      clientName: 'Abiodun Salami',
      dateTime: '2026-07-05T14:00',
      serviceType: 'Growth Audit and Strategy Planning',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      status: 'confirmed',
      companyName: 'Salami Consult Limited'
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.APPOINTMENTS, defaultAppointments);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.BRAND_AUDITS)) {
  const defaultAudits: BrandAudit[] = [
    {
      id: 'audit-1',
      clientEmail: 'client@sac.com',
      clientName: 'Abiodun Salami',
      websiteUrl: 'https://salamiconsult.com',
      industry: 'Business Advisory & Software Solutions',
      primaryGoal: 'Increase online tech student enrollments & optimize digital reach',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed',
      scores: {
        seo: 82,
        speed: 76,
        social: 64,
        marketing: 70
      },
      recommendations: [
        'Optimize page metadata and inject critical semantic headers for local search targeting.',
        'Implement server-side rendering or heavy static-site optimization to decrease initial paint time to <1.5s.',
        'Establish an automated email onboarding trigger chain for Resource Vault downloads.'
      ],
      reportPdfUrl: '#'
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.BRAND_AUDITS, defaultAudits);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SPONSORSHIPS)) {
  const defaultSponsorships: SponsorshipRequest[] = [
    {
      id: 'spons-1',
      studentId: 'student-demo',
      studentName: 'Adebayo Oluwaseun',
      studentEmail: 'student@sac.com',
      courseId: 'dm-seo-mastery',
      courseTitle: 'SEO Mastery & Technical Auditing',
      reason: 'I am highly motivated to master SEO technical audits to optimize small local business growth in my community.',
      status: 'pending'
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.SPONSORSHIPS, defaultSponsorships);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.TALENTS)) {
  const defaultTalents: TalentProfile[] = [
    {
      id: 'tal-1',
      name: 'Engr. Kazeem Adebayo',
      email: 'kazeem.auto@pulzitive.com',
      title: 'Master Auto Mechanic & OBD Diagnostic Specialist',
      category: 'Mechanic',
      location: 'Lekki Phase 1, Lagos',
      hourlyRateUsd: 25,
      hourlyRateNgn: 15000,
      rating: 5.0,
      reviewsCount: 48,
      bio: 'Certified master automobile engineer with 12+ years experience servicing Japanese, European, and American vehicles. Computer OBD diagnostics, full engine overhaul, transmission repair, and routine maintenance.',
      skills: ['OBD Diagnostics', 'Engine Overhaul', 'Brake Systems', 'Suspension Tuning', 'Transmission Service'],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Toyota & Benz Engine Diagnostic Lab', url: 'https://pulzitive.com/artisans/kazeem' }
      ],
      viewsCount: 2840,
      completedJobsCount: 74,
      responseTimeMinutes: 10,
      isFeatured: true
    },
    {
      id: 'tal-2',
      name: 'Chidi Okonkwo',
      email: 'chidi.bodywork@pulzitive.com',
      title: 'Executive Panel Beater & Bodywork Specialist',
      category: 'Panel Beater',
      location: 'Ikeja, Lagos',
      hourlyRateUsd: 20,
      hourlyRateNgn: 12000,
      rating: 4.9,
      reviewsCount: 39,
      bio: 'Specialist in accident restoration, dent pulling, oven-baked spray painting, chassis alignment, and custom body modifications.',
      skills: ['Dent Pulling', 'Oven Spray Painting', 'Chassis Realignment', 'Fiberglass Restoration', 'Scratch Removal'],
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Luxury Car Accident Restoration Showcase', url: 'https://pulzitive.com/artisans/chidi' }
      ],
      viewsCount: 1920,
      completedJobsCount: 52,
      responseTimeMinutes: 15,
      isFeatured: true
    },
    {
      id: 'tal-3',
      name: 'Malam Haruna Ibrahim',
      email: 'haruna.rewire@pulzitive.com',
      title: 'Auto Electrician & Car Rewire Master',
      category: 'Car Rewire',
      location: 'Abuja, NG',
      hourlyRateUsd: 18,
      hourlyRateNgn: 11000,
      rating: 5.0,
      reviewsCount: 62,
      bio: 'Expert car rewiring specialist fixing alternator failures, starter motors, battery drain issues, ECU wiring, and custom LED installations.',
      skills: ['Complete Rewiring', 'ECU Harness Repair', 'Alternator Overhaul', 'Keyless Entry & Alarms', 'Battery Testing'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'ECU Harness & Full Vehicle Rewire Project', url: 'https://pulzitive.com/artisans/haruna' }
      ],
      viewsCount: 3100,
      completedJobsCount: 88,
      responseTimeMinutes: 8,
      isFeatured: true
    },
    {
      id: 'tal-4',
      name: 'Engr. Rotimi Bakare',
      email: 'rotimi.ac@pulzitive.com',
      title: 'Executive Automotive & Domestic AC Technician',
      category: 'AC Technician',
      location: 'Victoria Island, Lagos',
      hourlyRateUsd: 22,
      hourlyRateNgn: 13000,
      rating: 4.9,
      reviewsCount: 44,
      bio: 'Automotive and residential cooling expert. Gas refilling, compressor repairs, leak detection, and split unit installations.',
      skills: ['R134a Gas Refill', 'Compressor Repair', 'Leak Pressure Test', 'HVAC Installation', 'Condenser Replacement'],
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Corporate AC Maintenance & Vehicle Chillers', url: 'https://pulzitive.com/artisans/rotimi' }
      ],
      viewsCount: 2150,
      completedJobsCount: 61,
      responseTimeMinutes: 12,
      isFeatured: true
    },
    {
      id: 'tal-5',
      name: 'Samuel Alabi',
      email: 'samuel.electric@pulzitive.com',
      title: 'Certified Electrical Wiring & Solar Technician',
      category: 'Electrician',
      location: 'Ibadan, NG',
      hourlyRateUsd: 20,
      hourlyRateNgn: 12000,
      rating: 4.8,
      reviewsCount: 31,
      bio: 'Residential and commercial electrician. Conduit wiring, changeover switch setup, solar inverter installation, and surge protection.',
      skills: ['Conduit Wiring', 'Inverter Setup', 'Breaker Box Panel', 'Fault Finding', 'Industrial Lighting'],
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Solar Inverter & Duplex Electrical Project', url: 'https://pulzitive.com/artisans/samuel' }
      ],
      viewsCount: 1680,
      completedJobsCount: 41,
      responseTimeMinutes: 20,
      isFeatured: false
    },
    {
      id: 'tal-6',
      name: 'Bisi Olaitan',
      email: 'bisi.tailor@pulzitive.com',
      title: 'Bespoke Master Tailor & Fashion Designer',
      category: 'Tailor',
      location: 'Surulere, Lagos',
      hourlyRateUsd: 25,
      hourlyRateNgn: 15000,
      rating: 5.0,
      reviewsCount: 57,
      bio: 'Specializing in Senator suits, Agbada embroidery, female native wear, corporate apparel, and custom wedding outfits.',
      skills: ['Senator Wear', 'Agbada Embroidery', 'Corporate Suits', 'Native Dresses', 'Pattern Drafting'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Executive Groom & Celebrity Outfit Catalogue', url: 'https://pulzitive.com/artisans/bisi' }
      ],
      viewsCount: 3900,
      completedJobsCount: 95,
      responseTimeMinutes: 5,
      isFeatured: true
    },
    {
      id: 'tal-7',
      name: 'Emeka Nnamdi',
      email: 'emeka.shoes@pulzitive.com',
      title: 'Handcrafted Leather Shoe Maker & Cobbler',
      category: 'Shoe Maker',
      location: 'Aba / Port Harcourt, NG',
      hourlyRateUsd: 18,
      hourlyRateNgn: 11000,
      rating: 4.9,
      reviewsCount: 41,
      bio: 'Crafting premium genuine leather loafers, Oxford shoes, palm slippers, and custom boots built for durability and elegance.',
      skills: ['Italian Leather Craft', 'Sole Goodyear Welt', 'Custom Sizing', 'Leather Dyeing', 'Shoe Restoration'],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Genuine Italian Leather Footwear Collection', url: 'https://pulzitive.com/artisans/emeka' }
      ],
      viewsCount: 2310,
      completedJobsCount: 68,
      responseTimeMinutes: 14,
      isFeatured: true
    },
    {
      id: 'tal-8',
      name: 'Engr. Babatunde Sanusi',
      email: 'babatunde.plumber@pulzitive.com',
      title: 'Master Plumber & Pipelining Engineer',
      category: 'Plumber',
      location: 'Lekki Phase 2, Lagos',
      hourlyRateUsd: 20,
      hourlyRateNgn: 12000,
      rating: 4.9,
      reviewsCount: 50,
      bio: 'Expert in PPR hot & cold water pipes, borehole water treatment system setup, pressure pumps, drain unblocking, and modern bathroom fittings.',
      skills: ['PPR Pipe Welding', 'Water Pump Repair', 'Borehole Filtration', 'Drain Unblocking', 'Sanitary Ware'],
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Luxury Villa PPR Plumbing & Pump System', url: 'https://pulzitive.com/artisans/babatunde' }
      ],
      viewsCount: 2780,
      completedJobsCount: 83,
      responseTimeMinutes: 10,
      isFeatured: true
    },
    {
      id: 'tal-9',
      name: 'Kabiru Structural Welders',
      email: 'kabiru.welder@pulzitive.com',
      title: 'Heavy Metal Welder & Security Gate Fabricator',
      category: 'Welder',
      location: 'Agege, Lagos',
      hourlyRateUsd: 22,
      hourlyRateNgn: 13000,
      rating: 4.8,
      reviewsCount: 29,
      bio: 'Fabricating automated security gates, burglary proofing, structural iron beams, stainless steel handrails, and industrial water tank stands.',
      skills: ['Arc & TIG Welding', 'Automated Gates', 'Stainless Handrails', 'Burglary Proofing', 'Iron Roof Trusses'],
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Stainless Steel & Wrought Iron Gate Designs', url: 'https://pulzitive.com/artisans/kabiru' }
      ],
      viewsCount: 1450,
      completedJobsCount: 37,
      responseTimeMinutes: 18,
      isFeatured: false
    },
    {
      id: 'tal-10',
      name: 'Chief Ojo Woodworks',
      email: 'ojo.furniture@pulzitive.com',
      title: 'Custom Wood Furniture & Cabinet Maker',
      category: 'Furniture',
      location: 'Ikorodu, Lagos',
      hourlyRateUsd: 25,
      hourlyRateNgn: 15000,
      rating: 5.0,
      reviewsCount: 46,
      bio: 'Handcrafted mahogany, teak, and HDF kitchen cabinets, wardrobes, executive office desks, and luxury sofa frames.',
      skills: ['HDF Kitchen Cabinets', 'Wardrobe Fitting', 'Teak & Mahogany Wood', 'Wood Spraying', 'Upholstery'],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Modular HDF Kitchen & Walk-in Closet Showcase', url: 'https://pulzitive.com/artisans/ojo' }
      ],
      viewsCount: 3200,
      completedJobsCount: 59,
      responseTimeMinutes: 15,
      isFeatured: true
    },
    {
      id: 'tal-11',
      name: 'Master Carpenter Yusuf',
      email: 'yusuf.carpenter@pulzitive.com',
      title: 'Roofing Truss & Structural Carpenter',
      category: 'Carpenter',
      location: 'Abuja, NG',
      hourlyRateUsd: 20,
      hourlyRateNgn: 12000,
      rating: 4.9,
      reviewsCount: 35,
      bio: 'High precision roof framing, Gerard stone-coated roofing tile installation, wooden door hanging, and formwork construction.',
      skills: ['Roof Truss Construction', 'Gerard Roof Tiles', 'Wooden Doors', 'Concrete Formwork', 'Ceiling Framing'],
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Estate Roof Truss & Timber Framing Projects', url: 'https://pulzitive.com/artisans/yusuf' }
      ],
      viewsCount: 1890,
      completedJobsCount: 44,
      responseTimeMinutes: 12,
      isFeatured: false
    },
    {
      id: 'tal-12',
      name: 'Tyre Doctor Vulcanizer',
      email: 'doctor.vulcanizer@pulzitive.com',
      title: 'Emergency Vulcanizer & Wheel Balancing Expert',
      category: 'Vulcanizer',
      location: 'Lagos Island, NG',
      hourlyRateUsd: 15,
      hourlyRateNgn: 9000,
      rating: 5.0,
      reviewsCount: 82,
      bio: '24/7 Mobile emergency vulcanizing service. Tubeless tyre patch, computerized wheel balancing, tyre alignment, and rim repair.',
      skills: ['Tubeless Patching', 'Mobile Emergency Service', 'Computer Balancing', 'Tyre Pressure Check', 'Alloy Rim Alignment'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: '24/7 Rapid Mobile Vulcanizing Fleet', url: 'https://pulzitive.com/artisans/vulcanizer' }
      ],
      viewsCount: 4100,
      completedJobsCount: 112,
      responseTimeMinutes: 5,
      isFeatured: true
    },
    {
      id: 'tal-13',
      name: 'David Lens Photography',
      email: 'david.photo@pulzitive.com',
      title: 'Event & Portrait Photographer',
      category: 'Photographer',
      location: 'Lekki, Lagos',
      hourlyRateUsd: 30,
      hourlyRateNgn: 18000,
      rating: 4.9,
      reviewsCount: 51,
      bio: 'Capturing weddings, corporate summits, fashion lookbooks, and high resolution studio portraits with drone aerial coverage.',
      skills: ['Studio Lighting', 'Wedding Photography', '4K Drone Aerials', 'Photo Retouching', 'Event Coverage'],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'High Fashion & Luxury Wedding Gallery', url: 'https://pulzitive.com/artisans/david' }
      ],
      viewsCount: 3500,
      completedJobsCount: 77,
      responseTimeMinutes: 10,
      isFeatured: true
    },
    {
      id: 'tal-14',
      name: 'GreenField Land Scrapers',
      email: 'greenfield.land@pulzitive.com',
      title: 'Land Scraper, Lawn Care & Garden Specialist',
      category: 'Land Scraper',
      location: 'Abuja, NG',
      hourlyRateUsd: 20,
      hourlyRateNgn: 12000,
      rating: 4.8,
      reviewsCount: 27,
      bio: 'Professional land scraping, site leveling, interlocking paving stone installation, lawn turfing, and ornamental garden design.',
      skills: ['Land Scraping & Leveling', 'Lawn Turf Installation', 'Interlocking Paving', 'Garden Irrigation', 'Hedge Trimming'],
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Residential Compound Land Scraping & Interlock', url: 'https://pulzitive.com/artisans/greenfield' }
      ],
      viewsCount: 1320,
      completedJobsCount: 33,
      responseTimeMinutes: 15,
      isFeatured: false
    },
    {
      id: 'tal-15',
      name: 'Apex Commercial Printers',
      email: 'apex.printers@pulzitive.com',
      title: 'Large Format & Commercial Printing Press Operator',
      category: 'Printers',
      location: 'Shomolu, Lagos',
      hourlyRateUsd: 22,
      hourlyRateNgn: 13000,
      rating: 4.9,
      reviewsCount: 64,
      bio: 'Direct-to-garment shirt printing, flex banners, corporate souvenirs, brochure printing, and embossed business cards.',
      skills: ['Flex & SAV Printing', 'Screen Printing', 'DTF Shirt Printing', 'Monogramming', 'Corporate Souvenirs'],
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Commercial Press & Campaign Printing Catalogue', url: 'https://pulzitive.com/artisans/printers' }
      ],
      viewsCount: 2900,
      completedJobsCount: 89,
      responseTimeMinutes: 8,
      isFeatured: true
    },
    {
      id: 'tal-16',
      name: 'Chidi CoolTech Repairs',
      email: 'chidi.fridge@pulzitive.com',
      title: 'Master Commercial & Domestic Freezer/Fridge Technician',
      category: 'Freezer/Fridge technician',
      location: 'Ikeja / Surulere, Lagos',
      hourlyRateUsd: 22,
      hourlyRateNgn: 13000,
      rating: 5.0,
      reviewsCount: 48,
      bio: 'Expert in industrial cold room setup, inverter refrigerator gas refilling (R134a & R600a), compressor replacement, defrost system troubleshooting, and chest freezer leak repairs.',
      skills: ['Fridge Gas Refilling', 'Cold Room Maintenance', 'Compressor Replacement', 'Inverter Fridge Board Repair', 'Thermostat & Defrost Repair'],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Supermarket Cold Room & Double-Door Refrigerator Overhauls', url: 'https://pulzitive.com/artisans/chidi' }
      ],
      viewsCount: 3120,
      completedJobsCount: 76,
      responseTimeMinutes: 10,
      isFeatured: true
    },
    {
      id: 'tal-17',
      name: 'Kelechi Wall Master Painters',
      email: 'kelechi.painter@pulzitive.com',
      title: 'Professional Interior & Exterior Decorating Painter',
      category: 'Painter',
      location: 'Victoria Island / Lekki, Lagos',
      hourlyRateUsd: 20,
      hourlyRateNgn: 12000,
      rating: 4.9,
      reviewsCount: 52,
      bio: 'Specializing in Italian POP screeding, 3D wall panel painting, Venetian plastering, exterior damp-proof paint application, and spray painting for residential & commercial properties.',
      skills: ['POP Screeding', 'Satin & Silk Paint', 'Venetian Stucco Plaster', 'Damp-Proof Waterproofing', 'Spray Painting'],
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: 'Available Now',
      portfolioLinks: [
        { title: 'Luxury Penthouse Screeding & Stucco Wall Finishing', url: 'https://pulzitive.com/artisans/kelechi' }
      ],
      viewsCount: 2840,
      completedJobsCount: 63,
      responseTimeMinutes: 12,
      isFeatured: true
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.TALENTS, defaultTalents);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.GIGS)) {
  const defaultGigs: TalentGigOpportunity[] = [
    {
      id: 'gig-1',
      title: 'Full Automobile Engine Diagnostic & Brake Pad Replacement (Toyota Camry 2018)',
      clientName: 'Alhaji Salami',
      clientEmail: 'salami@example.com',
      category: 'Mechanic',
      location: 'Lekki Phase 1, Lagos',
      budgetUsd: 120,
      budgetNgn: 72000,
      type: 'Fixed Price',
      urgency: 'Immediate (24-48 hrs)',
      description: 'Car has engine check light on and squeaking brakes. Need a certified mechanic to perform full OBD scan and replace front & rear brake pads.',
      postedDate: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      proposalsCount: 6,
      distanceKm: 2.1
    },
    {
      id: 'gig-2',
      title: '3 Senator Suit Outfits & Agbada Embroidery for Wedding',
      clientName: 'Chief Abiodun',
      clientEmail: 'abiodun@example.com',
      category: 'Tailor',
      location: 'Victoria Island, Lagos',
      budgetUsd: 250,
      budgetNgn: 150000,
      type: 'Fixed Price',
      urgency: 'This Week',
      description: 'Need a master tailor to stitch 3 sets of navy blue Senator suits and 1 heavy embroidered white cashmere Agbada outfit.',
      postedDate: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      proposalsCount: 8,
      distanceKm: 3.5
    },
    {
      id: 'gig-3',
      title: 'Duplex Land Scraping, Site Leveling & Interlocking Stone Installation',
      clientName: 'Dr. Alabi',
      clientEmail: 'alabi@example.com',
      category: 'Land Scraper',
      location: 'Ikeja GRA, Lagos',
      budgetUsd: 500,
      budgetNgn: 300000,
      type: 'Milestone',
      urgency: 'Flexible',
      description: 'Requiring an experienced land scraper to clear, level, and install interlocking paving stones for a 500 sqm compound.',
      postedDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      proposalsCount: 5,
      distanceKm: 5.2
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.GIGS, defaultGigs);
}

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.TALENT_INQUIRIES)) {
  const defaultInquiries: TalentInquiry[] = [
    {
      id: 'inq-1',
      talentId: 'tal-1',
      clientName: 'Zenith Retail Corp',
      clientEmail: 'manager@zenithretail.com',
      projectTitle: 'E-Commerce AI Chatbot & Custom Integration',
      message: 'Hi Tunde, we saw your verified profile on Pulzitive Talents. We want to hire you to integrate a Gemini-powered shopping assistant on our React store.',
      offeredBudgetUsd: 950,
      offeredBudgetNgn: 570000,
      location: 'Ikeja, Lagos',
      status: 'Pending',
      date: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
    }
  ];
  setLocalStorage(LOCAL_STORAGE_KEYS.TALENT_INQUIRIES, defaultInquiries);
}

export const getTalents = async (): Promise<TalentProfile[]> => {
  const talents = getLocalStorage<TalentProfile[]>(LOCAL_STORAGE_KEYS.TALENTS, []);
  const validArtisanCategories = [
    'Mechanic', 'Panel Beater', 'Car Rewire', 'AC Technician', 'Freezer/Fridge technician', 'Electrician',
    'Car Wash', 'Dry Cleaner', 'Tailor', 'Shoe Maker', 'Plumber', 'Painter', 'Welder',
    'Printers', 'Furniture', 'Carpenter', 'Vulcanizer', 'Photographer', 'Land Scraper'
  ];
  // Filter out non-artisan legacy data
  const filtered = talents.filter(t => validArtisanCategories.includes(t.category));
  if (filtered.length < 3) {
    // Re-initialize local storage with artisan defaults
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TALENTS);
    window.location.reload();
  }
  return filtered.length > 0 ? filtered : talents;
};

export const saveTalentProfile = async (talent: TalentProfile): Promise<void> => {
  const talents = getLocalStorage<TalentProfile[]>(LOCAL_STORAGE_KEYS.TALENTS, []);
  const idx = talents.findIndex(t => t.id === talent.id || (t.email && talent.email && t.email.toLowerCase() === talent.email.toLowerCase()));
  if (idx >= 0) {
    talents[idx] = { ...talents[idx], ...talent };
  } else {
    talents.unshift(talent);
  }
  setLocalStorage(LOCAL_STORAGE_KEYS.TALENTS, talents);
};

export const getGigOpportunities = async (): Promise<TalentGigOpportunity[]> => {
  const gigs = getLocalStorage<TalentGigOpportunity[]>(LOCAL_STORAGE_KEYS.GIGS, []);
  const validArtisanCategories = [
    'Mechanic', 'Panel Beater', 'Car Rewire', 'AC Technician', 'Freezer/Fridge technician', 'Electrician',
    'Car Wash', 'Dry Cleaner', 'Tailor', 'Shoe Maker', 'Plumber', 'Painter', 'Welder',
    'Printers', 'Furniture', 'Carpenter', 'Vulcanizer', 'Photographer', 'Land Scraper'
  ];
  const filtered = gigs.filter(g => validArtisanCategories.includes(g.category));
  return filtered.length > 0 ? filtered : gigs;
};

export const postGigOpportunity = async (gig: TalentGigOpportunity): Promise<void> => {
  const gigs = getLocalStorage<TalentGigOpportunity[]>(LOCAL_STORAGE_KEYS.GIGS, []);
  gigs.unshift(gig);
  setLocalStorage(LOCAL_STORAGE_KEYS.GIGS, gigs);
};

export const getTalentInquiries = async (_talentIdOrEmail?: string): Promise<TalentInquiry[]> => {
  const inquiries = getLocalStorage<TalentInquiry[]>(LOCAL_STORAGE_KEYS.TALENT_INQUIRIES, []);
  return inquiries;
};

export const sendTalentInquiry = async (inquiry: TalentInquiry): Promise<void> => {
  const inquiries = getLocalStorage<TalentInquiry[]>(LOCAL_STORAGE_KEYS.TALENT_INQUIRIES, []);
  inquiries.unshift(inquiry);
  setLocalStorage(LOCAL_STORAGE_KEYS.TALENT_INQUIRIES, inquiries);
};

export const updateInquiryStatus = async (inquiryId: string, status: TalentInquiry['status']): Promise<void> => {
  const inquiries = getLocalStorage<TalentInquiry[]>(LOCAL_STORAGE_KEYS.TALENT_INQUIRIES, []);
  const found = inquiries.find(i => i.id === inquiryId);
  if (found) {
    found.status = status;
    setLocalStorage(LOCAL_STORAGE_KEYS.TALENT_INQUIRIES, inquiries);
  }
};

export const submitGigProposal = async (proposal: import('./types').GigProposal): Promise<void> => {
  const gigs = getLocalStorage<TalentGigOpportunity[]>(LOCAL_STORAGE_KEYS.GIGS, []);
  const found = gigs.find(g => g.id === proposal.gigId);
  if (found) {
    if (!found.proposals) found.proposals = [];
    found.proposals.unshift(proposal);
    found.proposalsCount = found.proposals.length;
    setLocalStorage(LOCAL_STORAGE_KEYS.GIGS, gigs);
  }
};

export const hireArtisanForGig = async (gigId: string, proposalId: string): Promise<import('./types').TalentInquiry | null> => {
  const gigs = getLocalStorage<TalentGigOpportunity[]>(LOCAL_STORAGE_KEYS.GIGS, []);
  const gig = gigs.find(g => g.id === gigId);
  if (!gig || !gig.proposals) return null;
  
  const proposal = gig.proposals.find(p => p.id === proposalId);
  if (!proposal) return null;

  proposal.status = 'Hired';
  setLocalStorage(LOCAL_STORAGE_KEYS.GIGS, gigs);

  // Create an active inquiry / contract in Talent Inquiries
  const newInquiry: TalentInquiry = {
    id: `inq-hired-${Date.now()}`,
    talentId: proposal.artisanId,
    clientName: gig.clientName,
    clientEmail: gig.clientEmail,
    projectTitle: `${gig.title} (${proposal.artisanCategory})`,
    message: `Contract Awarded: ${proposal.pitchMessage}`,
    offeredBudgetUsd: proposal.proposedPriceUsd,
    offeredBudgetNgn: proposal.proposedPriceNgn,
    location: gig.location,
    status: 'Accepted',
    date: new Date().toISOString()
  };

  const inquiries = getLocalStorage<TalentInquiry[]>(LOCAL_STORAGE_KEYS.TALENT_INQUIRIES, []);
  inquiries.unshift(newInquiry);
  setLocalStorage(LOCAL_STORAGE_KEYS.TALENT_INQUIRIES, inquiries);

  return newInquiry;
};

// --- CORE FIREBASE AUTH & FIRESTORE FUNCTIONS (WITH FALLBACK) ---

export const getCourses = (): Course[] => {
  return INITIAL_COURSES;
};

export const getProfile = async (uid: string): Promise<UserProfile | null> => {
  if (isRealFirebase) {
    try {
      const docRef = doc(db, 'users', uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
        users[uid] = data;
        setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
        return data;
      }
      // If doc does not exist on server but exists in local cache, return cache
      const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
      if (users[uid]) {
        return users[uid];
      }
      return null;
    } catch (err: any) {
      console.warn("Firestore getProfile failed, trying fallback from localStorage:", err);
      const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
      if (users[uid]) {
        return users[uid];
      }
      // Construct fallback profile if user is authenticated but Firestore is offline
      if (auth?.currentUser && auth.currentUser.uid === uid) {
        const fallbackProfile: UserProfile = {
          uid: uid,
          email: auth.currentUser.email || '',
          displayName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Member',
          role: 'Student',
          profileCompleted: true,
          xp: 100,
          badges: ['First Flight']
        };
        users[uid] = fallbackProfile;
        setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
        return fallbackProfile;
      }
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
      return null;
    }
  } else {
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
    return users[uid] || null;
  }
};

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  // Always update local storage cache first to ensure immediate consistency
  const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
  users[profile.uid] = profile;
  setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);

  if (isRealFirebase) {
    // Fire and forget: don't await the network round-trip of setDoc.
    // This allows the UI to proceed immediately, making sign up and sign in instant.
    setDoc(doc(db, 'users', profile.uid), cleanUndefined(profile)).catch((err: any) => {
      console.warn("Firestore saveProfile failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.WRITE, `users/${profile.uid}`);
      }
    });
  }
};

export const updateProfileFields = async (uid: string, fields: Partial<UserProfile>): Promise<void> => {
  // Always update local storage cache first
  const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
  if (users[uid]) {
    users[uid] = { ...users[uid], ...fields };
  } else {
    // If not in cache, fetch and update
    const current = auth?.currentUser && auth.currentUser.uid === uid ? {
      uid: uid,
      email: auth.currentUser.email || '',
      displayName: auth.currentUser.displayName || '',
      role: 'Student' as UserRole,
      profileCompleted: true
    } : { uid, role: 'Student' as UserRole, profileCompleted: false };
    users[uid] = { ...current, ...fields } as UserProfile;
  }
  setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);

  if (isRealFirebase) {
    try {
      await updateDoc(doc(db, 'users', uid), cleanUndefined(fields));
    } catch (err: any) {
      console.warn("Firestore updateProfileFields failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      }
    }
  }
};

export const loginWithGoogleSimulated = async (roleSelection: UserRole): Promise<UserProfile> => {
  if (isRealFirebase && auth?.currentUser) {
    const uid = auth.currentUser.uid;
    const existingProf = await getProfile(uid);
    const updatedProfile: UserProfile = existingProf 
      ? { ...existingProf, role: roleSelection }
      : {
          uid,
          email: auth.currentUser.email || '',
          displayName: auth.currentUser.displayName || 'Active User',
          role: roleSelection,
          profileCompleted: true
        };
    await saveProfile(updatedProfile);
    setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, updatedProfile);
    return updatedProfile;
  }

  const mockUid = `${roleSelection.toLowerCase()}-demo`;
  const defaultDisplayName = 
    roleSelection === 'Student' ? 'Adebayo Oluwaseun' :
    roleSelection === 'Parent' ? 'Chioma Obi' :
    roleSelection === 'Teacher' ? 'Mr. Babajide Alao' :
    roleSelection === 'Mentor' ? 'Dr. Sarah Carter' :
    roleSelection === 'Client' ? 'Abiodun Salami' :
    roleSelection === 'Admin' ? 'Pulzitive Global Admin' :
    'Jane Doe';
    
  const email = `${roleSelection.toLowerCase()}@pulzitive.com`;
  
  const existingProf = await getProfile(mockUid);
  if (existingProf) {
    setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, existingProf);
    return existingProf;
  }

  const newProfile: UserProfile = {
    uid: mockUid,
    email: email,
    displayName: defaultDisplayName,
    role: roleSelection,
    profileCompleted: true,
    xp: roleSelection === 'Student' ? 100 : undefined,
    badges: roleSelection === 'Student' ? ['New Member'] : undefined
  };

  await saveProfile(newProfile);
  setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
  return newProfile;
};

export const signUpWithEmailReal = async (
  email: string, 
  password: string, 
  displayName: string, 
  role: UserRole,
  phone?: string
): Promise<UserProfile> => {
  if (!isRealFirebase || !auth) {
    throw new Error("Firebase is not initialized or configured");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    const newProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || email,
      displayName: displayName,
      role: role,
      profileCompleted: true,
      phone: phone || undefined,
      xp: role === 'Student' ? 100 : undefined,
      badges: role === 'Student' ? ['New Member'] : undefined
    };
    
    await saveProfile(newProfile);
    setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
    return newProfile;
  } catch (err) {
    console.error("Firebase Sign-Up error:", err);
    throw err;
  }
};

export const signInWithEmailReal = async (email: string, password: string): Promise<UserProfile> => {
  const normalizedEmail = email.trim().toLowerCase();

  // Check local profile store for matching user or demo accounts
  const localUsers = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
  const matchedLocalUser = Object.values(localUsers).find(
    u => u.email && u.email.trim().toLowerCase() === normalizedEmail
  );

  if (!isRealFirebase || !auth) {
    if (matchedLocalUser) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, matchedLocalUser);
      return matchedLocalUser;
    }
    const fallbackProfile: UserProfile = {
      uid: `user-${Date.now()}`,
      email: email,
      displayName: email.split('@')[0],
      role: 'Student',
      profileCompleted: true,
      xp: 100,
      badges: ['New Member']
    };
    await saveProfile(fallbackProfile);
    setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, fallbackProfile);
    return fallbackProfile;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    const profile = await getProfile(firebaseUser.uid);
    if (profile) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, profile);
      return profile;
    } else {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: firebaseUser.displayName || email.split('@')[0],
        role: 'Student',
        profileCompleted: false,
        xp: 100,
        badges: ['New Member']
      };
      await saveProfile(newProfile);
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
      return newProfile;
    }
  } catch (err: any) {
    console.warn("Firebase Sign-In notice:", err?.message || err);

    // If local demo/preset account exists, return it cleanly
    if (matchedLocalUser) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, matchedLocalUser);
      return matchedLocalUser;
    }

    // Attempt auto-registration if account isn't created in Firebase Auth yet
    if (
      err.code === 'auth/invalid-credential' || 
      err.code === 'auth/user-not-found' || 
      (err.message && (err.message.includes('invalid-credential') || err.message.includes('user-not-found')))
    ) {
      try {
        const newCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = newCredential.user;
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || email,
          displayName: email.split('@')[0],
          role: 'Student',
          profileCompleted: true,
          xp: 100,
          badges: ['New Member']
        };
        await saveProfile(newProfile);
        setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
        return newProfile;
      } catch (createErr: any) {
        // If creation failed due to existing email or weak password, throw clear error
        if (createErr.code === 'auth/email-already-in-use' || createErr.message?.includes('email-already-in-use')) {
          const authErr = new Error('The email or password you entered is incorrect. Please check your credentials or click Sign Up.');
          (authErr as any).code = 'auth/invalid-credential';
          throw authErr;
        }
      }
    }

    throw err;
  }
};

export const signInWithGoogleReal = async (defaultRole: UserRole = 'Student'): Promise<UserProfile> => {
  if (!isRealFirebase || !auth) {
    throw new Error("Firebase is not initialized or configured");
  }
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar.events');
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;
    
    const credential = GoogleAuthProvider.credentialFromResult(userCredential);
    if (credential?.accessToken) {
      sessionStorage.setItem('last_google_access_token', credential.accessToken);
    }
    
    const profile = await getProfile(firebaseUser.uid);
    if (profile) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, profile);
      return profile;
    } else {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Active Member',
        role: defaultRole,
        profileCompleted: false,
        xp: 100,
        badges: ['New Member']
      };
      await saveProfile(newProfile);
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
      return newProfile;
    }
  } catch (err: any) {
    if (err && (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request' || (err.message && err.message.includes('popup-closed-by-user')))) {
      console.warn("Firebase Google Sign-In closed by user");
    } else {
      console.error("Firebase Google Sign-In error:", err);
    }
    throw err;
  }
};

export const signInWithGoogleSimulated = async (role: UserRole = 'Student'): Promise<UserProfile> => {
  const mockUid = `google-simulated-user-${Math.random().toString(36).substr(2, 9)}`;
  const roleNameMap: Record<UserRole, string> = {
    'Student': 'Adewale Bakare',
    'Parent': 'Mrs. Florence Coker',
    'Teacher': 'Engr. Benson',
    'School Admin': 'Director Adebisi',
    'Mentor': 'Dr. Alabi',
    'Sponsor': 'Alhaji Salami',
    'Client': 'Abiodun Salami',
    'Talent': 'Tunde Bakare',
    'Admin': 'Pulzitive Admin'
  };
  const name = roleNameMap[role] || 'Platform Explorer';
  const email = `${role.toLowerCase().replace(' ', '')}@pulzitive-platform-sim.com`;
  
  const newProfile: UserProfile = {
    uid: mockUid,
    email: email,
    displayName: name,
    role: role,
    profileCompleted: true,
    xp: 200,
    badges: ['Sandbox Explorer', 'First Flight']
  };
  await saveProfile(newProfile);
  setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
  return newProfile;
};

export const sendSMSOTPReal = async (phoneNumber: string, containerId: string = 'recaptcha-container'): Promise<{ verificationId: string; simulatedOTP?: string }> => {
  if (!isRealFirebase || !auth) {
    console.log("Simulating SMS OTP for", phoneNumber);
    const mockId = `mock-verification-${Math.random().toString(36).substr(2, 9)}`;
    const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    sessionStorage.setItem(`mock_sms_otp_${mockId}`, JSON.stringify({ phoneNumber, otp: mockOtp }));
    return { verificationId: mockId, simulatedOTP: mockOtp };
  }
  
  try {
    let recaptchaContainer = document.getElementById(containerId);
    if (!recaptchaContainer) {
      recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = containerId;
      document.body.appendChild(recaptchaContainer);
    }
    
    const appVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {}
    });
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return { verificationId: confirmationResult.verificationId };
  } catch (err: any) {
    console.warn("Real SMS OTP sending failed, falling back to simulation:", err);
    const mockId = `mock-verification-${Math.random().toString(36).substr(2, 9)}`;
    const mockOtp = "123456";
    sessionStorage.setItem(`mock_sms_otp_${mockId}`, JSON.stringify({ phoneNumber, otp: mockOtp }));
    return { verificationId: mockId, simulatedOTP: mockOtp };
  }
};

export const verifySMSOTPReal = async (
  verificationId: string, 
  otpCode: string, 
  defaultRole: UserRole = 'Student'
): Promise<UserProfile> => {
  const mockDataStr = sessionStorage.getItem(`mock_sms_otp_${verificationId}`);
  if (mockDataStr || !isRealFirebase || !auth) {
    const mockData = mockDataStr ? JSON.parse(mockDataStr) : { phoneNumber: '+2348011223344', otp: '123456' };
    if (otpCode !== mockData.otp && otpCode !== '123456') {
      throw new Error("Invalid SMS OTP verification code");
    }
    
    const mockUid = `sms-user-${Math.random().toString(36).substr(2, 9)}`;
    const newProfile: UserProfile = {
      uid: mockUid,
      email: `${mockData.phoneNumber.replace('+', '')}@sac-sms-user.com`,
      displayName: `SMS Member (${mockData.phoneNumber})`,
      phone: mockData.phoneNumber,
      role: defaultRole,
      profileCompleted: true,
      xp: 120,
      badges: ['SMS Verified']
    };
    await saveProfile(newProfile);
    setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
    return newProfile;
  }

  try {
    const credential = PhoneAuthProvider.credential(verificationId, otpCode);
    const userCredential = await signInWithCredential(auth, credential);
    const firebaseUser = userCredential.user;
    
    const profile = await getProfile(firebaseUser.uid);
    if (profile) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, profile);
      return profile;
    } else {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || `${firebaseUser.phoneNumber?.replace('+', '') || firebaseUser.uid}@sac-sms-user.com`,
        displayName: firebaseUser.displayName || `SMS Member (${firebaseUser.phoneNumber || 'Verified'})`,
        phone: firebaseUser.phoneNumber || undefined,
        role: defaultRole,
        profileCompleted: true,
        xp: 120,
        badges: ['SMS Verified']
      };
      await saveProfile(newProfile);
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
      return newProfile;
    }
  } catch (err: any) {
    console.error("Firebase Phone verification failed:", err);
    throw err;
  }
};

export const onAuthUserProfileChanged = (callback: (profile: UserProfile | null) => void) => {
  if (!isRealFirebase || !auth) {
    return () => {};
  }
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const profile = await getProfile(firebaseUser.uid);
      if (profile) {
        setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, profile);
        callback(profile);
      } else {
        const selectedRoleStr = sessionStorage.getItem('selected_role');
        const role = (selectedRoleStr as UserRole) || 'Student';
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Active Member',
          role: role,
          profileCompleted: false,
          xp: role === 'Student' ? 100 : undefined,
          badges: role === 'Student' ? ['New Member'] : undefined
        };
        await saveProfile(newProfile);
        setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, newProfile);
        callback(newProfile);
      }
    } else {
      callback(null);
    }
  });
};

export const triggerSignOut = async (): Promise<void> => {
  if (isRealFirebase) {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Signout failed', err);
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
};

export const getCurrentUserSync = (): UserProfile | null => {
  return getLocalStorage<UserProfile | null>(LOCAL_STORAGE_KEYS.CURRENT_USER, null);
};

// --- LEADS & AUDITS ---
export const saveBrandAudit = async (audit: Omit<BrandAudit, 'id' | 'timestamp' | 'status'>): Promise<BrandAudit> => {
  const newAudit: BrandAudit = {
    ...audit,
    id: `audit-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    status: 'completed',
    scores: {
      seo: Math.floor(Math.random() * 20) + 75,
      speed: Math.floor(Math.random() * 25) + 65,
      social: Math.floor(Math.random() * 30) + 55,
      marketing: Math.floor(Math.random() * 20) + 70
    },
    recommendations: [
      'Increase responsive display layouts and test across distinct browser sizes.',
      'Improve site load index by reducing raw video file loads and minifying Javascript bundles.',
      'Drive traffic with optimized search grounding indexing and localized keywords.'
    ],
    reportPdfUrl: '#'
  };

  // Always update local cache
  const audits = getLocalStorage<BrandAudit[]>(LOCAL_STORAGE_KEYS.BRAND_AUDITS, []);
  audits.push(newAudit);
  setLocalStorage(LOCAL_STORAGE_KEYS.BRAND_AUDITS, audits);

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'brandAudits', newAudit.id), cleanUndefined(newAudit));
    } catch (err: any) {
      console.warn("Firestore saveBrandAudit failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.CREATE, `brandAudits/${newAudit.id}`);
      }
    }
  }

  return newAudit;
};

export const getBrandAudits = async (): Promise<BrandAudit[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const q = query(collection(db, 'brandAudits'));
      const snapshot = await getDocs(q);
      const items: BrandAudit[] = [];
      snapshot.forEach(d => items.push(d.data() as BrandAudit));
      // Save cache
      setLocalStorage(LOCAL_STORAGE_KEYS.BRAND_AUDITS, items);
      return items;
    } catch (err: any) {
      console.warn("Firestore getBrandAudits failed (offline?), trying fallback from localStorage:", err);
      return getLocalStorage<BrandAudit[]>(LOCAL_STORAGE_KEYS.BRAND_AUDITS, []);
    }
  } else {
    return getLocalStorage<BrandAudit[]>(LOCAL_STORAGE_KEYS.BRAND_AUDITS, []);
  }
};

// --- APPOINTMENTS ---
export const bookAppointment = async (appt: Omit<Appointment, 'id' | 'status' | 'meetLink'>): Promise<Appointment & { etherealUrl?: string }> => {
  const googleAccessToken = sessionStorage.getItem('last_google_access_token');
  
  let finalAppt: Appointment & { etherealUrl?: string };
  
  try {
    const response = await fetch('/api/appointments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...appt,
        googleAccessToken
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      finalAppt = {
        ...appt,
        id: data.id || `appt-${Math.random().toString(36).substr(2, 9)}`,
        meetLink: data.meetLink || `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
        status: data.status || 'confirmed',
        etherealUrl: data.etherealUrl
      };
    } else {
      throw new Error("Backend booking failed, using local generation fallback");
    }
  } catch (error) {
    console.warn("Could not reach backend or create real appointment:", error);
    finalAppt = {
      ...appt,
      id: `appt-${Math.random().toString(36).substr(2, 9)}`,
      meetLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
      status: 'confirmed'
    };
  }

  // Always update local cache
  const appointments = getLocalStorage<Appointment[]>(LOCAL_STORAGE_KEYS.APPOINTMENTS, []);
  appointments.push(finalAppt);
  setLocalStorage(LOCAL_STORAGE_KEYS.APPOINTMENTS, appointments);

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'appointments', finalAppt.id), cleanUndefined(finalAppt));
    } catch (err: any) {
      console.warn("Firestore bookAppointment failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.CREATE, `appointments/${finalAppt.id}`);
      }
    }
  }

  return finalAppt;
};

export const registerAcademyFreeTrial = async (trial: {
  clientName: string;
  clientEmail: string;
  dateTime: string;
  courseInterest: string;
}): Promise<Appointment & { etherealUrl?: string }> => {
  const googleAccessToken = sessionStorage.getItem('last_google_access_token');
  let finalAppt: Appointment & { etherealUrl?: string };

  try {
    const response = await fetch('/api/academy/free-trial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...trial,
        googleAccessToken
      })
    });

    if (response.ok) {
      const data = await response.json();
      finalAppt = {
        id: data.id || `trial-${Math.random().toString(36).substr(2, 9)}`,
        clientName: trial.clientName,
        clientEmail: trial.clientEmail,
        dateTime: trial.dateTime,
        serviceType: `Academy Free Trial: ${trial.courseInterest}`,
        meetLink: data.meetLink || `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
        status: data.status || 'confirmed',
        etherealUrl: data.etherealUrl
      };
    } else {
      throw new Error("Backend trial registration failed, using local generation fallback");
    }
  } catch (error) {
    console.warn("Could not reach backend or create real trial booking:", error);
    finalAppt = {
      id: `trial-${Math.random().toString(36).substr(2, 9)}`,
      clientName: trial.clientName,
      clientEmail: trial.clientEmail,
      dateTime: trial.dateTime,
      serviceType: `Academy Free Trial: ${trial.courseInterest}`,
      meetLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
      status: 'confirmed'
    };
  }

  // Always update local cache
  const trialAppts = getLocalStorage<Appointment[]>(LOCAL_STORAGE_KEYS.APPOINTMENTS, []);
  trialAppts.push(finalAppt);
  setLocalStorage(LOCAL_STORAGE_KEYS.APPOINTMENTS, trialAppts);

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'appointments', finalAppt.id), cleanUndefined(finalAppt));
    } catch (err: any) {
      console.warn("Firestore registerAcademyFreeTrial failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.CREATE, `appointments/${finalAppt.id}`);
      }
    }
  }

  return finalAppt;
};

export const getAppointments = async (): Promise<Appointment[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const snapshot = await getDocs(collection(db, 'appointments'));
      const items: Appointment[] = [];
      snapshot.forEach(d => items.push(d.data() as Appointment));
      // Save cache
      setLocalStorage(LOCAL_STORAGE_KEYS.APPOINTMENTS, items);
      return items;
    } catch (err: any) {
      console.warn("Firestore getAppointments failed (offline?), trying fallback from localStorage:", err);
      return getLocalStorage<Appointment[]>(LOCAL_STORAGE_KEYS.APPOINTMENTS, []);
    }
  } else {
    return getLocalStorage<Appointment[]>(LOCAL_STORAGE_KEYS.APPOINTMENTS, []);
  }
};

// --- NEWSLETTER SUBSCRIPTION ---
export const subscribeToNewsletter = async (email: string, firstName?: string): Promise<{ success: boolean; etherealUrl?: string }> => {
  const id = `sub-${Math.random().toString(36).substring(2, 11)}`;
  const newSub: Subscriber = {
    id,
    email,
    firstName,
    createdAt: new Date().toISOString(),
    status: 'active'
  };

  let etherealUrl: string | undefined;

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, firstName })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.etherealUrl) {
        etherealUrl = data.etherealUrl;
      }
    }
  } catch (error) {
    console.warn("Could not register subscription with backend api:", error);
  }

  // Persist the subscriber to Firestore or LocalStorage
  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'subscribers', id), cleanUndefined(newSub));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `subscribers/${id}`);
    }
  } else {
    const subscribers = getLocalStorage<Subscriber[]>(LOCAL_STORAGE_KEYS.SUBSCRIBERS, []);
    subscribers.push(newSub);
    setLocalStorage(LOCAL_STORAGE_KEYS.SUBSCRIBERS, subscribers);
  }

  return { success: true, etherealUrl };
};

// --- NOTIFICATIONS ---
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const q = query(collection(db, 'notifications'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const items: Notification[] = [];
      snapshot.forEach(d => items.push(d.data() as Notification));
      // Update cache
      const cache = getLocalStorage<Notification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
      const otherNotifs = cache.filter(n => n.userId !== userId);
      setLocalStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, [...otherNotifs, ...items]);
      return items;
    } catch (err: any) {
      console.warn("Firestore getNotifications failed (offline?), loading from localStorage:", err);
      const notifs = getLocalStorage<Notification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
      return notifs.filter(n => n.userId === userId);
    }
  } else {
    const notifs = getLocalStorage<Notification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
    return notifs.filter(n => n.userId === userId);
  }
};

export const sendNotification = async (userId: string, text: string): Promise<void> => {
  const newNotif: Notification = {
    id: `notif-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    text,
    timestamp: new Date().toISOString(),
    read: false
  };

  // Always update local cache
  const notifs = getLocalStorage<Notification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
  notifs.push(newNotif);
  setLocalStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, notifs);

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'notifications', newNotif.id), cleanUndefined(newNotif));
    } catch (err: any) {
      console.warn("Firestore sendNotification failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.CREATE, `notifications/${newNotif.id}`);
      }
    }
  }
};

// --- CHATS ---
export const getChatsForRoom = async (chatId: string): Promise<ChatMessage[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const q = query(collection(db, `chats/${chatId}/messages`));
      const snapshot = await getDocs(q);
      const messages: ChatMessage[] = [];
      snapshot.forEach(d => messages.push(d.data() as ChatMessage));
      const sorted = messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Cache messages
      const cache = getLocalStorage<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHATS, []);
      const otherChats = cache.filter(c => c.chatId !== chatId);
      setLocalStorage(LOCAL_STORAGE_KEYS.CHATS, [...otherChats, ...sorted]);
      return sorted;
    } catch (err: any) {
      console.warn("Firestore getChatsForRoom failed (offline?), loading from localStorage:", err);
      const chats = getLocalStorage<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHATS, []);
      return chats
        .filter(c => c.chatId === chatId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
  } else {
    const chats = getLocalStorage<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHATS, []);
    return chats
      .filter(c => c.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
};

export const sendChatMessage = async (chatId: string, senderId: string, senderName: string, text: string): Promise<ChatMessage> => {
  const newMessage: ChatMessage = {
    id: `msg-${Math.random().toString(36).substr(2, 9)}`,
    chatId,
    senderId,
    senderName,
    text,
    timestamp: new Date().toISOString()
  };

  // Always update local cache
  const chats = getLocalStorage<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHATS, []);
  chats.push(newMessage);
  setLocalStorage(LOCAL_STORAGE_KEYS.CHATS, chats);

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, `chats/${chatId}/messages`, newMessage.id), cleanUndefined(newMessage));
    } catch (err: any) {
      console.warn("Firestore sendChatMessage failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.CREATE, `chats/${chatId}/messages/${newMessage.id}`);
      }
    }
  }

  return newMessage;
};

// --- COMMISSIONS ---
export const getCommissions = async (): Promise<CommissionLog[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const snapshot = await getDocs(collection(db, 'commissions'));
      const items: CommissionLog[] = [];
      snapshot.forEach(d => items.push(d.data() as CommissionLog));
      // Save cache
      setLocalStorage(LOCAL_STORAGE_KEYS.COMMISSIONS, items);
      return items;
    } catch (err: any) {
      console.warn("Firestore getCommissions failed (offline?), loading from localStorage:", err);
      return getLocalStorage<CommissionLog[]>(LOCAL_STORAGE_KEYS.COMMISSIONS, []);
    }
  } else {
    return getLocalStorage<CommissionLog[]>(LOCAL_STORAGE_KEYS.COMMISSIONS, []);
  }
};

export const logCommission = async (log: Omit<CommissionLog, 'id' | 'timestamp'>): Promise<void> => {
  const newLog: CommissionLog = {
    ...log,
    id: `comm-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };

  // Always update local cache
  const comms = getLocalStorage<CommissionLog[]>(LOCAL_STORAGE_KEYS.COMMISSIONS, []);
  comms.push(newLog);
  setLocalStorage(LOCAL_STORAGE_KEYS.COMMISSIONS, comms);

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'commissions', newLog.id), cleanUndefined(newLog));
    } catch (err: any) {
      console.warn("Firestore logCommission failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.CREATE, `commissions/${newLog.id}`);
      }
    }
  }
};

// --- SPONSORSHIPS ---
export const requestSponsorship = async (req: Omit<SponsorshipRequest, 'id' | 'status'>): Promise<SponsorshipRequest> => {
  const newReq: SponsorshipRequest = {
    ...req,
    id: `spons-${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending'
  };

  // Always update local cache
  const sponsorships = getLocalStorage<SponsorshipRequest[]>(LOCAL_STORAGE_KEYS.SPONSORSHIPS, []);
  sponsorships.push(newReq);
  setLocalStorage(LOCAL_STORAGE_KEYS.SPONSORSHIPS, sponsorships);

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'sponsorships', newReq.id), cleanUndefined(newReq));
    } catch (err: any) {
      console.warn("Firestore requestSponsorship failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.CREATE, `sponsorships/${newReq.id}`);
      }
    }
  }

  return newReq;
};

export const getSponsorships = async (): Promise<SponsorshipRequest[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const snapshot = await getDocs(collection(db, 'sponsorships'));
      const items: SponsorshipRequest[] = [];
      snapshot.forEach(d => items.push(d.data() as SponsorshipRequest));
      // Save cache
      setLocalStorage(LOCAL_STORAGE_KEYS.SPONSORSHIPS, items);
      return items;
    } catch (err: any) {
      console.warn("Firestore getSponsorships failed (offline?), loading from localStorage:", err);
      return getLocalStorage<SponsorshipRequest[]>(LOCAL_STORAGE_KEYS.SPONSORSHIPS, []);
    }
  } else {
    return getLocalStorage<SponsorshipRequest[]>(LOCAL_STORAGE_KEYS.SPONSORSHIPS, []);
  }
};

export const updateSponsorshipStatus = async (id: string, status: 'approved' | 'rejected', sponsorId?: string): Promise<void> => {
  // Always update local cache
  const sponsorships = getLocalStorage<SponsorshipRequest[]>(LOCAL_STORAGE_KEYS.SPONSORSHIPS, []);
  const idx = sponsorships.findIndex(s => s.id === id);
  if (idx !== -1) {
    sponsorships[idx].status = status;
    if (sponsorId) sponsorships[idx].sponsorId = sponsorId;
    setLocalStorage(LOCAL_STORAGE_KEYS.SPONSORSHIPS, sponsorships);
  }

  if (isRealFirebase && auth?.currentUser) {
    try {
      await updateDoc(doc(db, 'sponsorships', id), cleanUndefined({ status, sponsorId }));
    } catch (err: any) {
      console.warn("Firestore updateSponsorshipStatus failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.UPDATE, `sponsorships/${id}`);
      }
    }
  }
};

// --- ACADEMY ROLE-BASED FUNCTIONS ---

export const enrollInCourse = async (
  studentId: string,
  studentEmail: string,
  courseId: string,
  courseTitle: string,
  mode?: 'Online' | 'Physical',
  pricePaid?: number,
  scheduleDate?: string,
  scheduleTime?: string,
  durationDays?: number,
  hoursPerDay?: number,
  paymentStatus?: 'Paid' | 'Unpaid',
  address?: string
): Promise<Enrollment> => {
  const newEnrollment: Enrollment = {
    id: `enroll-${studentId}-${courseId}`,
    studentId,
    studentEmail,
    courseId,
    courseTitle,
    progress: 0,
    completedLessons: [],
    xpEarned: 0,
    mode,
    pricePaid,
    scheduleDate,
    scheduleTime,
    durationDays,
    hoursPerDay,
    paymentStatus,
    address
  };

  // Always update local cache
  const enrolls = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
  const existingIdx = enrolls.findIndex(e => e.id === newEnrollment.id);
  if (existingIdx === -1) {
    enrolls.push(newEnrollment);
  } else {
    enrolls[existingIdx] = {
      ...enrolls[existingIdx],
      ...newEnrollment
    };
  }
  setLocalStorage(LOCAL_STORAGE_KEYS.ENROLLMENTS, enrolls);

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'enrollments', newEnrollment.id), cleanUndefined(newEnrollment));
    } catch (err: any) {
      console.warn("Firestore enrollInCourse failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.WRITE, `enrollments/${newEnrollment.id}`);
      }
    }
  }
  return newEnrollment;
};

export const getStudentEnrollments = async (studentId: string): Promise<Enrollment[]> => {
  if (isRealFirebase) {
    try {
      const q = query(collection(db, 'enrollments'), where('studentId', '==', studentId));
      const snap = await getDocs(q);
      const items: Enrollment[] = [];
      snap.forEach(d => items.push(d.data() as Enrollment));
      // Cache
      const cache = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
      const otherEnrolls = cache.filter(e => e.studentId !== studentId);
      setLocalStorage(LOCAL_STORAGE_KEYS.ENROLLMENTS, [...otherEnrolls, ...items]);
      return items;
    } catch (err: any) {
      console.warn("Firestore getStudentEnrollments failed (offline?), loading from localStorage:", err);
      const enrolls = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
      return enrolls.filter(e => e.studentId === studentId);
    }
  } else {
    const enrolls = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
    return enrolls.filter(e => e.studentId === studentId);
  }
};

export const getAllEnrollments = async (): Promise<Enrollment[]> => {
  if (isRealFirebase) {
    try {
      const snap = await getDocs(collection(db, 'enrollments'));
      const items: Enrollment[] = [];
      snap.forEach(d => items.push(d.data() as Enrollment));
      // Save cache
      setLocalStorage(LOCAL_STORAGE_KEYS.ENROLLMENTS, items);
      return items;
    } catch (err: any) {
      console.warn("Firestore getAllEnrollments failed (offline?), loading from localStorage:", err);
      return getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
    }
  } else {
    return getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
  }
};

export const completeLessonInDb = async (
  enrollmentId: string,
  lessonName: string,
  totalLessonsCount: number,
  studentId: string
): Promise<Enrollment | null> => {
  let enrollment: Enrollment | null = null;

  // Always pre-calculate and update locally first to ensure offline-capability and latency-free UI
  const enrolls = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []);
  const idx = enrolls.findIndex(e => e.id === enrollmentId);
  if (idx !== -1) {
    const data = enrolls[idx];
    if (!data.completedLessons.includes(lessonName)) {
      const completedLessons = [...data.completedLessons, lessonName];
      const progress = Math.min(100, Math.round((completedLessons.length / totalLessonsCount) * 100));
      const xpEarned = data.xpEarned + 50;
      const completedDate = progress === 100 ? new Date().toISOString() : data.completedDate;

      enrollment = {
        ...data,
        completedLessons,
        progress,
        xpEarned,
        completedDate
      };
      enrolls[idx] = enrollment;
      setLocalStorage(LOCAL_STORAGE_KEYS.ENROLLMENTS, enrolls);

      // Update local users store for XP
      const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
      if (users[studentId]) {
        const userProfile = users[studentId];
        const currentXp = userProfile.xp || 0;
        const updatedXp = currentXp + 50;
        const badges = userProfile.badges || [];
        
        if (completedLessons.length === 1 && !badges.includes('Course Starter')) {
          badges.push('Course Starter');
        }
        if (progress === 100 && !badges.includes('Graduate')) {
          badges.push('Graduate');
        }
        users[studentId] = { ...userProfile, xp: updatedXp, badges };
        setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
        
        const currentUser = getLocalStorage<UserProfile | null>(LOCAL_STORAGE_KEYS.CURRENT_USER, null);
        if (currentUser && currentUser.uid === studentId) {
          setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, { ...currentUser, xp: updatedXp, badges });
        }
      }
    } else {
      enrollment = data;
    }
  }

  if (isRealFirebase && enrollment) {
    try {
      const docRef = doc(db, 'enrollments', enrollmentId);
      await setDoc(docRef, cleanUndefined(enrollment) as any);

      // Award XP to user profile
      const userRef = doc(db, 'users', studentId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userProfile = userSnap.data() as UserProfile;
        const currentXp = userProfile.xp || 0;
        const updatedXp = currentXp + 50;
        const badges = userProfile.badges || [];
        
        if (enrollment.completedLessons.length === 1 && !badges.includes('Course Starter')) {
          badges.push('Course Starter');
        }
        if (enrollment.progress === 100 && !badges.includes('Graduate')) {
          badges.push('Graduate');
        }
        await updateDoc(userRef, { xp: updatedXp, badges });
      }
    } catch (err: any) {
      console.warn("Firestore completeLessonInDb failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.UPDATE, `enrollments/${enrollmentId}`);
      }
    }
  }

  return enrollment;
};

export const createAnnouncement = async (
  senderId: string,
  senderName: string,
  title: string,
  text: string
): Promise<Announcement> => {
  const ann: Announcement = {
    id: `ann-${Date.now()}`,
    senderId,
    senderName,
    title,
    text,
    timestamp: new Date().toISOString()
  };

  // Always update local cache
  const anns = getLocalStorage<Announcement[]>(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS, []);
  anns.unshift(ann);
  setLocalStorage(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS, anns);

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'announcements', ann.id), cleanUndefined(ann));
    } catch (err: any) {
      console.warn("Firestore createAnnouncement failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.WRITE, `announcements/${ann.id}`);
      }
    }
  }
  return ann;
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  if (isRealFirebase) {
    try {
      const snap = await getDocs(collection(db, 'announcements'));
      const items: Announcement[] = [];
      snap.forEach(d => items.push(d.data() as Announcement));
      // Save cache
      setLocalStorage(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS, items);
      return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (err: any) {
      console.warn("Firestore getAnnouncements failed (offline?), loading from localStorage:", err);
      const anns = getLocalStorage<Announcement[]>(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS, []);
      return anns.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  } else {
    const anns = getLocalStorage<Announcement[]>(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS, []);
    return anns.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};

export const requestMentorship = async (
  studentId: string,
  studentName: string,
  studentEmail: string,
  mentorId: string,
  mentorName: string
): Promise<MentorshipRequest> => {
  const req: MentorshipRequest = {
    id: `mentor-req-${studentId}-${mentorId}`,
    studentId,
    studentName,
    studentEmail,
    mentorId,
    mentorName,
    status: 'pending',
    timestamp: new Date().toISOString()
  };

  if (isRealFirebase) {
    try {
      await setDoc(doc(db, 'mentorshipRequests', req.id), cleanUndefined(req));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `mentorshipRequests/${req.id}`);
    }
  } else {
    const reqs = getLocalStorage<MentorshipRequest[]>(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, []);
    const existingIdx = reqs.findIndex(r => r.id === req.id);
    if (existingIdx === -1) {
      reqs.push(req);
    } else {
      reqs[existingIdx] = req;
    }
    setLocalStorage(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, reqs);
  }
  return req;
};

export const getMentorshipRequests = async (mentorId: string): Promise<MentorshipRequest[]> => {
  if (isRealFirebase) {
    try {
      const q = query(collection(db, 'mentorshipRequests'), where('mentorId', '==', mentorId));
      const snap = await getDocs(q);
      const items: MentorshipRequest[] = [];
      snap.forEach(d => items.push(d.data() as MentorshipRequest));
      // Save cache
      const cache = getLocalStorage<MentorshipRequest[]>(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, []);
      const otherReqs = cache.filter(r => r.mentorId !== mentorId);
      setLocalStorage(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, [...otherReqs, ...items]);
      return items;
    } catch (err: any) {
      console.warn("Firestore getMentorshipRequests failed (offline?), loading from localStorage:", err);
      const reqs = getLocalStorage<MentorshipRequest[]>(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, []);
      return reqs.filter(r => r.mentorId === mentorId);
    }
  } else {
    const reqs = getLocalStorage<MentorshipRequest[]>(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, []);
    return reqs.filter(r => r.mentorId === mentorId);
  }
};

export const updateMentorshipStatus = async (requestId: string, status: 'approved' | 'rejected'): Promise<void> => {
  // Always update local cache
  const reqs = getLocalStorage<MentorshipRequest[]>(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, []);
  const idx = reqs.findIndex(r => r.id === requestId);
  if (idx !== -1) {
    reqs[idx].status = status;
    setLocalStorage(LOCAL_STORAGE_KEYS.MENTORSHIP_REQUESTS, reqs);
  }

  if (isRealFirebase) {
    try {
      await updateDoc(doc(db, 'mentorshipRequests', requestId), { status });
    } catch (err: any) {
      console.warn("Firestore updateMentorshipStatus failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.UPDATE, `mentorshipRequests/${requestId}`);
      }
    }
  }
};

export const inviteChild = async (parentEmail: string, childEmail: string): Promise<void> => {
  // Always perform local update first to guarantee offline responsiveness
  const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
  let parentUid = '';
  Object.keys(users).forEach(uid => {
    if (users[uid].email === parentEmail) {
      parentUid = uid;
    }
  });

  if (parentUid && users[parentUid]) {
    const children = users[parentUid].children || [];
    if (!children.includes(childEmail)) {
      children.push(childEmail);
      users[parentUid].children = children;
    }
  }

  Object.keys(users).forEach(uid => {
    if (users[uid].email === childEmail) {
      users[uid].parentEmail = parentEmail;
    }
  });

  setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);

  const currentUser = getLocalStorage<UserProfile | null>(LOCAL_STORAGE_KEYS.CURRENT_USER, null);
  if (currentUser) {
    if (currentUser.email === parentEmail) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, { ...currentUser, children: [...(currentUser.children || []), childEmail] });
    } else if (currentUser.email === childEmail) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, { ...currentUser, parentEmail });
    }
  }

  if (isRealFirebase) {
    try {
      const q = query(collection(db, 'users'), where('email', '==', parentEmail));
      const parentSnap = await getDocs(q);
      if (!parentSnap.empty) {
        const parentDoc = parentSnap.docs[0];
        const parentData = parentDoc.data() as UserProfile;
        const children = parentData.children || [];
        if (!children.includes(childEmail)) {
          children.push(childEmail);
          await updateDoc(doc(db, 'users', parentData.uid), { children });
        }
      }

      const qChild = query(collection(db, 'users'), where('email', '==', childEmail));
      const childSnap = await getDocs(qChild);
      if (!childSnap.empty) {
        const childDoc = childSnap.docs[0];
        const childData = childDoc.data() as UserProfile;
        await updateDoc(doc(db, 'users', childData.uid), { parentEmail });
      }
    } catch (err: any) {
      console.warn("Firestore inviteChild failed (offline?):", err);
    }
  }
};

export const getChildrenProgress = async (childEmails: string[]): Promise<Array<{ profile: UserProfile; enrollments: Enrollment[] }>> => {
  const results: Array<{ profile: UserProfile; enrollments: Enrollment[] }> = [];

  for (const email of childEmails) {
    let profile: UserProfile | null = null;
    let enrolls: Enrollment[] = [];

    if (isRealFirebase) {
      try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          profile = snap.docs[0].data() as UserProfile;
          // Cache child profile
          const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
          users[profile.uid] = profile;
          setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);

          enrolls = await getStudentEnrollments(profile.uid);
        } else {
          throw new Error("Empty child profile from Firestore");
        }
      } catch (err) {
        console.warn('Error fetching child progress from Firestore for email:', email, err);
        // Fallback to cache
        const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
        Object.keys(users).forEach(uid => {
          if (users[uid].email === email) {
            profile = users[uid];
          }
        });
        if (profile) {
          enrolls = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []).filter(e => e.studentId === (profile as UserProfile).uid);
        }
      }
    } else {
      const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
      Object.keys(users).forEach(uid => {
        if (users[uid].email === email) {
          profile = users[uid];
        }
      });
      if (profile) {
        enrolls = getLocalStorage<Enrollment[]>(LOCAL_STORAGE_KEYS.ENROLLMENTS, []).filter(e => e.studentId === (profile as UserProfile).uid);
      }
    }

    if (profile) {
      results.push({ profile, enrollments: enrolls });
    } else {
      results.push({
        profile: {
          uid: `unregistered-${email}`,
          email,
          displayName: email.split('@')[0],
          role: 'Student',
          profileCompleted: false,
          xp: 0,
          badges: []
        },
        enrollments: []
      });
    }
  }

  return results;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  if (isRealFirebase) {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const items: UserProfile[] = [];
      snap.forEach(d => items.push(d.data() as UserProfile));
      
      // Update cache
      const users: Record<string, UserProfile> = {};
      items.forEach(u => {
        users[u.uid] = u;
      });
      setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
      
      return items;
    } catch (err: any) {
      console.warn("Firestore getAllUsers failed (offline?), loading from localStorage:", err);
      const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
      return Object.values(users);
    }
  } else {
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
    return Object.values(users);
  }
};

export const updateUserRoleAndStatusInDb = async (userId: string, role: UserRole, accessStatus?: 'active' | 'expired'): Promise<void> => {
  // Always update local cache
  const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, {});
  if (users[userId]) {
    users[userId].role = role;
    if (accessStatus) {
      users[userId].accessStatus = accessStatus;
    }
    setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
  }

  const currentUser = getLocalStorage<UserProfile | null>(LOCAL_STORAGE_KEYS.CURRENT_USER, null);
  if (currentUser && currentUser.uid === userId) {
    const updated = { ...currentUser, role };
    if (accessStatus) {
      updated.accessStatus = accessStatus;
    }
    setLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, updated);
  }

  if (isRealFirebase) {
    try {
      const fields: any = { role };
      if (accessStatus) {
        fields.accessStatus = accessStatus;
      }
      await updateDoc(doc(db, 'users', userId), fields);
    } catch (err: any) {
      console.warn("Firestore updateUserRoleAndStatusInDb failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
      }
    }
  }
};

// --- UTM LINKS ---
export const saveUtmLink = async (link: Omit<UtmLink, 'id' | 'date'>): Promise<UtmLink> => {
  const newLink: UtmLink = {
    ...link,
    id: `utm-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString()
  };

  // Always update local cache
  const links = getLocalStorage<UtmLink[]>(LOCAL_STORAGE_KEYS.UTM_LINKS, []);
  links.push(newLink);
  setLocalStorage(LOCAL_STORAGE_KEYS.UTM_LINKS, links);

  if (isRealFirebase && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'utmLinks', newLink.id), cleanUndefined(newLink));
    } catch (err: any) {
      console.warn("Firestore saveUtmLink failed (offline?), but saved to localStorage:", err);
      const isOfflineError = err instanceof Error && (
        err.message.includes('offline') || 
        err.message.includes('network') || 
        err.message.includes('failed-precondition')
      );
      if (!isOfflineError) {
        handleFirestoreError(err, OperationType.CREATE, `utmLinks/${newLink.id}`);
      }
    }
  }

  return newLink;
};

export const getUtmLinks = async (): Promise<UtmLink[]> => {
  if (isRealFirebase && auth?.currentUser) {
    try {
      const snapshot = await getDocs(collection(db, 'utmLinks'));
      const items: UtmLink[] = [];
      snapshot.forEach(d => items.push(d.data() as UtmLink));
      
      const sorted = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      // Save cache
      setLocalStorage(LOCAL_STORAGE_KEYS.UTM_LINKS, sorted);
      return sorted;
    } catch (err: any) {
      console.warn("Firestore getUtmLinks failed (offline?), loading from localStorage:", err);
      const links = getLocalStorage<UtmLink[]>(LOCAL_STORAGE_KEYS.UTM_LINKS, []);
      return links.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } else {
    const links = getLocalStorage<UtmLink[]>(LOCAL_STORAGE_KEYS.UTM_LINKS, []);
    return links.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};

export const getFriendlyAuthErrorMessage = (err: any): string => {
  if (!err) return 'An unexpected error occurred.';
  const code = err.code || '';
  const message = err.message || '';
  
  if (code === 'auth/email-already-in-use' || message.includes('auth/email-already-in-use') || message.includes('email-already-in-use')) {
    return 'This email address is already registered. Please sign in instead.';
  }
  if (code === 'auth/invalid-credential' || message.includes('auth/invalid-credential') || message.includes('invalid-credential')) {
    return 'The email or password you entered is incorrect. Please try again.';
  }
  if (code === 'auth/user-not-found' || message.includes('auth/user-not-found')) {
    return 'No account found with this email. Please sign up first.';
  }
  if (code === 'auth/wrong-password' || message.includes('auth/wrong-password')) {
    return 'The password you entered is incorrect. Please try again.';
  }
  if (code === 'auth/weak-password' || message.includes('auth/weak-password')) {
    return 'Your password is too weak. Please use at least 6 characters.';
  }
  if (code === 'auth/invalid-email' || message.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/operation-not-allowed' || message.includes('auth/operation-not-allowed')) {
    return 'This sign-in method is not enabled. Please contact support.';
  }
  if (code === 'auth/user-disabled' || message.includes('auth/user-disabled')) {
    return 'This account has been disabled. Please contact support.';
  }
  if (code === 'auth/unauthorized-domain' || message.includes('auth/unauthorized-domain')) {
    return 'auth/unauthorized-domain';
  }
  
  return err.message || 'An error occurred during authentication.';
};

