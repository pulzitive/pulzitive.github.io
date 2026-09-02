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
  | 'Minister'
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

export interface B2BProspect {
  id: string;
  placeId: string;
  companyName: string;
  industry: string;
  location: {
    address: string;
    city: string;
    state?: string;
    country: string;
    lat: number;
    lng: number;
  };
  rating: number;
  reviewsCount?: number;
  contact: {
    email: string;
    whatsappPhone: string;
    website: string;
    contactPerson?: string;
  };
  leadScore: number; // 0-100
  status: 'lead' | 'queued' | 'contacted' | 'engaged' | 'closed';
  campaignId?: string;
  notes?: string;
  syncedToGoogleSheets?: boolean;
  createdAt: string;
}

export interface WebinarFunnel {
  id: string;
  number: number; // 1 to 24 annual webinars
  title: string;
  description: string;
  scheduleDateTime: string; // ISO date
  googleMeetLink: string;
  googleCalendarEventId?: string;
  totalRegistrants: number;
  attendanceCount: number;
  featuredUpsellId?: string; // Product / Course / Retainer ID pitched during webinar
  status: 'Upcoming' | 'Live Now' | 'Completed';
  registrants?: {
    id: string;
    name: string;
    email: string;
    whatsapp: string;
    attended: boolean;
    converted: boolean;
    registeredAt: string;
  }[];
}

export interface ProductOrService {
  id: string;
  type: 'digital_product' | 'course' | 'talent_spotlight' | 'marketing_service';
  title: string;
  description: string;
  priceNgn: number;
  priceUsd: number;
  category: string;
  features: string[];
  salesCount: number;
  isActive: boolean;
  downloadUrl?: string;
  recurringPeriod?: 'one_time' | 'annual' | 'monthly';
}

export interface PlatformOrder {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  itemId: string;
  itemTitle: string;
  itemType: 'digital_product' | 'course' | 'talent_spotlight' | 'marketing_service';
  pricePaid: number;
  currency: 'NGN' | 'USD';
  paymentGateway: 'Paystack' | 'Stripe';
  transactionReference: string;
  status: 'successful' | 'pending' | 'failed';
  createdAt: string;
}

export interface OutreachLog {
  id: string;
  prospectId: string;
  companyName: string;
  channel: 'gmail' | 'whatsapp';
  stepNumber: number;
  templateName: string;
  recipientContact: string; // Email or WhatsApp phone
  status: 'sent' | 'opened' | 'clicked' | 'replied' | 'converted';
  sentAt: string;
  responsePreview?: string;
}

export interface GoogleSheetsSyncState {
  lastSyncedAt: string;
  totalProspectsSynced: number;
  totalTalentsSynced: number;
  totalWebinarsSynced: number;
  status: 'idle' | 'syncing' | 'success' | 'error';
}

// ==========================================
// KINGDOMMEDIA & MINISTERS NETWORK (ECCLESIAHUB) TYPES
// ==========================================

export type MinisterRole = 'MINISTER' | 'MEDIA_STAFF' | 'ADMIN';
export type MinisterVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type MinistrySubscriptionTier = 'FREE' | 'STARTER' | 'GROWTH_MINISTRY' | 'ENTERPRISE';

export interface MinisterProfile {
  uid: string;
  email: string;
  displayName: string;
  churchName: string;
  title?: 'Pastor' | 'Apostle' | 'Bishop' | 'Prophet' | 'Evangelist' | 'Reverend' | 'Minister';
  denomination?: string;
  country: string;
  city: string;
  ministryFocus: 'Pastoral' | 'Worship' | 'Youth' | 'Evangelism' | 'Prophetic' | 'Media' | 'Church Planting';
  verificationStatus: MinisterVerificationStatus;
  role: MinisterRole;
  subscriptionTier: MinistrySubscriptionTier;
  googleDriveFolderId?: string;
  googleDriveFolderName?: string;
  websiteUrl?: string;
  socialProofUrl?: string;
  ordinationProofUrl?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  createdAt: string;
}

export type MediaRequestType = 'SERMON_SHORTS' | 'GRAPHIC_SERIES' | 'BANNER' | 'SERMON_SLIDES' | 'EVENT_PROMO';
export type MediaRequestStatus = 'SUBMITTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export interface MediaDeliverableFile {
  fileName: string;
  driveFileId: string;
  webViewLink: string;
  webContentLink: string;
  fileSize?: string;
  duration?: string;
  thumbnailUrl?: string;
  uploadedAt?: string;
}

export interface MediaRequestTask {
  requestId: string;
  userId: string;
  ministerName: string;
  churchName: string;
  title: string;
  rawVideoUrl: string;
  requestType: MediaRequestType;
  status: MediaRequestStatus;
  assignedEditorId?: string;
  assignedEditorName?: string;
  outputFolderId?: string;
  timestampNotes?: string;
  primaryTopic?: string;
  targetPlatforms?: string[];
  graphicStyleChoice?: string;
  completedFiles?: MediaDeliverableFile[];
  createdAt: string;
  completedAt?: string;
}

export type PrayerCategory = 
  | 'CHURCH_GROWTH' 
  | 'PERSONAL_PROPHETIC' 
  | 'HEALING_DELIVERANCE' 
  | 'REGIONAL_REVIVAL' 
  | 'FAMILY_MINISTRY' 
  | 'FINANCIAL_BREAKTHROUGH';

export interface PrayerRequestPost {
  postId: string;
  authorId: string;
  authorName: string;
  authorTitle?: string;
  authorChurch?: string;
  authorAvatar?: string;
  title: string;
  content: string;
  category: PrayerCategory;
  intercessionCount: number;
  isPrivate: boolean; // false = All Verified Ministers, true = Private Circle
  prayingMinisterIds?: string[];
  createdAt: string;
}

export type DreamTag = 
  | 'End-Times' 
  | 'Church Guidance' 
  | 'Personal Prophetic' 
  | 'Ministry Direction' 
  | 'Harvest' 
  | 'Evangelism' 
  | 'Spiritual Warfare';

export interface DreamComment {
  id: string;
  authorId: string;
  authorName: string;
  authorTitle?: string;
  authorChurch?: string;
  comment: string;
  scripturesCited?: string[];
  timestamp: string;
}

export interface DreamVisionInterpretation {
  postId: string;
  authorId: string;
  authorName: string;
  authorChurch?: string;
  authorAvatar?: string;
  title: string;
  description: string;
  tags: DreamTag[];
  commentsCount: number;
  comments?: DreamComment[];
  createdAt: string;
}

export interface MinistryAssetResource {
  id: string;
  title: string;
  category: 'Sermon Graphic Kits' | 'Social Banner Vectors' | 'Lower Thirds & Overlays' | 'Slide Deck Templates' | 'Motion Backgrounds';
  format: 'PSD' | 'Canva' | 'PPTX' | 'MP4' | 'AI / Vector';
  downloadUrl: string;
  previewUrl: string;
  downloadsCount: number;
  fileSize: string;
  isPremiumOnly: boolean;
  tags: string[];
}

export interface MinisterDirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderChurch?: string;
  recipientId: string;
  recipientName: string;
  text: string;
  hasVoiceNote?: boolean;
  voiceDurationSec?: number;
  attachedDocUrl?: string;
  attachedDocName?: string;
  timestamp: string;
}




