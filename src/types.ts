/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'Student'
  | 'Parent'
  | 'Teacher'
  | 'School Admin'
  | 'Mentor'
  | 'Sponsor'
  | 'Client'
  | 'Talent'
  | 'Admin';

export interface TalentProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  category: string;
  location: string;
  hourlyRateUsd: number;
  hourlyRateNgn: number;
  rating: number;
  reviewsCount: number;
  bio: string;
  skills: string[];
  avatarUrl: string;
  verifiedBadge: boolean;
  availability: 'Available Now' | 'Part-Time' | 'Contract Only' | 'Busy';
  portfolioLinks: { title: string; url: string }[];
  videoPitchUrl?: string;
  viewsCount: number;
  completedJobsCount: number;
  responseTimeMinutes: number;
  isFeatured?: boolean;
}

export interface GigProposal {
  id: string;
  gigId: string;
  artisanId: string;
  artisanName: string;
  artisanEmail: string;
  artisanTitle: string;
  artisanCategory: string;
  proposedPriceUsd: number;
  proposedPriceNgn: number;
  pitchMessage: string;
  status: 'Pending' | 'Hired' | 'Declined';
  date: string;
}

export interface TalentGigOpportunity {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  category: string;
  location: string;
  budgetUsd: number;
  budgetNgn: number;
  type: 'Hourly' | 'Fixed Price' | 'Milestone';
  urgency: 'Immediate (24-48 hrs)' | 'This Week' | 'Flexible';
  description: string;
  postedDate: string;
  proposalsCount: number;
  distanceKm?: number;
  proposals?: GigProposal[];
}

export interface TalentInquiry {
  id: string;
  talentId: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  message: string;
  offeredBudgetUsd: number;
  offeredBudgetNgn: number;
  location: string;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed' | 'Declined';
  date: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  profileCompleted: boolean;
  phone?: string;
  xp?: number;
  badges?: string[];
  accessStatus?: 'active' | 'expired';
  termEnd?: string; // ISO date string
  paidBy?: 'client' | 'self' | 'teacher' | 'parent' | 'sponsor';
  children?: string[]; // email array or UID array for Parent
  parentEmail?: string; // for Student
  schoolId?: string; // for Teacher / Student
  bio?: string;
  companyName?: string;
  websiteUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  price: number; // in NGN
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Reception';
  syllabus: string[];
  mentorId?: string;
  url?: string;
  ageRange?: string;
  category?: string;
  image?: string;
  tags?: string[];
  points?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // in NGN
  category: 'Gadgets' | 'E-Books' | 'Templates';
  rating: number;
  imageUrl?: string;
  downloads?: number;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Part-time' | 'Remote';
  salary: string;
  description: string;
}

export interface Appointment {
  id: string;
  clientEmail: string;
  clientName: string;
  dateTime: string;
  serviceType: string;
  meetLink: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  companyName?: string;
}

export interface BrandAudit {
  id: string;
  clientEmail: string;
  clientName: string;
  websiteUrl: string;
  industry: string;
  primaryGoal: string;
  timestamp: string;
  reportPdfUrl?: string; // Mock PDF download
  status: 'pending' | 'completed';
  scores?: {
    seo: number;
    speed: number;
    social: number;
    marketing: number;
  };
  recommendations?: string[];
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface CommissionLog {
  id: string;
  userId: string;
  amount: number;
  type: 'Teacher' | 'Mentor' | 'Platform' | 'Sponsor';
  courseId: string;
  courseTitle: string;
  studentName: string;
  timestamp: string;
}

export interface SponsorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  sponsorId?: string;
  fundingNeeded?: number;
}

export interface UtmLink {
  id: string;
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  taggedUrl: string;
  whoMadeIt: string;
  date: string;
}

export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  createdAt: string;
  status: 'active' | 'unsubscribed';
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  progress: number;
  completedLessons: string[];
  completedDate?: string;
  xpEarned: number;
  mode?: 'Online' | 'Physical';
  pricePaid?: number;
  scheduleDate?: string;
  scheduleTime?: string;
  durationDays?: number;
  hoursPerDay?: number;
  paymentStatus?: 'Paid' | 'Unpaid';
  address?: string;
}

export interface Announcement {
  id: string;
  senderId: string;
  senderName: string;
  title: string;
  text: string;
  timestamp: string;
}

export interface MentorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  mentorId: string;
  mentorName: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}


