/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Award, BookOpen, Calendar, HelpCircle, Users, Shield, Globe, 
  DollarSign, Sparkles, User, Brain, AlertCircle, ChevronRight, 
  Check, FileText, Send, Zap, Plus, LogIn, ExternalLink, RefreshCw,
  Megaphone, Briefcase, MapPin, Star, SlidersHorizontal, ShieldCheck, CheckCircle2, Clock, Eye, MessageSquare
} from 'lucide-react';
import { UserProfile, UserRole, Course, Appointment, BrandAudit, ChatMessage, Enrollment, Announcement, MentorshipRequest, TalentInquiry, TalentGigOpportunity } from '../types';
import { 
  getCourses, bookAppointment, getAppointments, saveBrandAudit, 
  getBrandAudits, requestSponsorship, getSponsorships, 
  updateSponsorshipStatus, triggerSignOut,
  enrollInCourse, getStudentEnrollments, getAllEnrollments,
  completeLessonInDb, createAnnouncement, getAnnouncements,
  requestMentorship, getMentorshipRequests, updateMentorshipStatus,
  inviteChild, getChildrenProgress, getAllUsers, updateUserRoleAndStatusInDb,
  getTalentInquiries, getGigOpportunities, updateInquiryStatus
} from '../firebase';
import { motion } from 'motion/react';
import { MiniTools } from '../components/MiniTools';
import { AdminGrowthAutomationHub } from '../components/AdminGrowthAutomationHub';

interface DashboardPageProps {
  currentUser: UserProfile;
  onNavigate: (page: string) => void;
  onOpenAuditModal: () => void;
  onOpenApptModal: () => void;
  onOpenManageStudentModal: (mode: 'Add' | 'Enroll' | 'Assign') => void;
  onTriggerNotification: (text: string) => void;
  onOpenCertificateModal: (studentName: string, courseTitle: string) => void;
  onEnrollViaPaystack: (amount: number, planName: string) => void;
  appointments: Appointment[];
  audits: BrandAudit[];
}

export default function DashboardPage({
  currentUser,
  onNavigate,
  onOpenAuditModal,
  onOpenApptModal,
  onOpenManageStudentModal,
  onTriggerNotification,
  onOpenCertificateModal,
  onEnrollViaPaystack,
  appointments: initialAppointments,
  audits: initialAudits
}: DashboardPageProps) {
  
  // Local state for interactive features
  const courses = getCourses();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [audits, setAudits] = useState<BrandAudit[]>(initialAudits);
  const [sponsorships, setSponsorships] = useState<any[]>([]);

  // Student specific states
  const [studentXP, setStudentXP] = useState(150);
  const [completedCourse, setCompletedCourse] = useState(false);
  const [sponsorSubmitted, setSponsorSubmitted] = useState(false);
  const [studentChatInput, setStudentChatInput] = useState('');
  const [studentChat, setStudentChat] = useState<ChatMessage[]>([
    {
      id: 'c-1',
      chatId: 'general',
      senderId: 'mentor',
      senderName: 'Dr. Sarah Carter',
      text: "Hello! I am your assigned Pulzitive Mentor. How can I guide you in your digital marketing concepts today?",
      timestamp: new Date().toISOString()
    }
  ]);

  // Parent specific states
  const [parentTips, setParentTips] = useState<string | null>(null);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [childProgress, setChildProgress] = useState(85);

  // Teacher states
  const [roster, setRoster] = useState([
    { name: 'Adebayo Oluwaseun', email: 'adebayo@student.com', xp: 240, status: 'Active' },
    { name: 'Kemi Adeola', email: 'kemi@student.com', xp: 180, status: 'Active' },
    { name: 'Chidi Benson', email: 'chidi@student.com', xp: 90, status: 'Pending Verification' }
  ]);

  // Additional States for Firebase Backend
  const [studentEnrollments, setStudentEnrollments] = useState<Enrollment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [childrenProgressList, setChildrenProgressList] = useState<Array<{ profile: UserProfile; enrollments: Enrollment[] }>>([]);
  const [allUsersList, setAllUsersList] = useState<UserProfile[]>([]);
  const [allEnrollmentsList, setAllEnrollmentsList] = useState<Enrollment[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  // Digital Marketing Interactive Tool States
  const [adSpend, setAdSpend] = useState<number>(50000);
  const [ctr, setCtr] = useState<number>(2.5);
  const [convRate, setConvRate] = useState<number>(3.0);
  const [aov, setAov] = useState<number>(15000);

  const [marketingIndustry, setMarketingIndustry] = useState<string>('E-commerce');
  const [marketingProposition, setMarketingProposition] = useState<string>('Fast delivery of premium handcrafted leather shoes');
  const [marketingTone, setMarketingTone] = useState<string>('Persuasive');
  const [generatedHeadlines, setGeneratedHeadlines] = useState<string[]>([
    'Handcrafted Leather Shoes',
    'Premium Comfort Shoes | Shop Now',
    'Elegant Handcrafted Fit'
  ]);
  const [generatedDescription, setGeneratedDescription] = useState<string>(
    'Discover premium handcrafted leather footwear engineered for superior comfort and bespoke elegance. Shop our collections today with secure nationwide shipping.'
  );

  const [seoTitle, setSeoTitle] = useState<string>('Premium Handcrafted Leather Shoes - Pulzitive Brand');
  const [seoDesc, setSeoDesc] = useState<string>('Shop the finest handcrafted leather shoes online. Pulzitive offers fast shipping, elegant fits, and custom styling for every occasion. Check our catalog today!');

  const [utmUrl, setUtmUrl] = useState<string>('https://pulzitive.com');
  const [utmSource, setUtmSource] = useState<string>('facebook');
  const [utmMedium, setUtmMedium] = useState<string>('cpc');
  const [utmCampaign, setUtmCampaign] = useState<string>('black_friday_2026');
  const [isCopiedUtm, setIsCopiedUtm] = useState<boolean>(false);

  // Parent email invite input
  const [parentChildEmailInput, setParentChildEmailInput] = useState('');
  const [selectedChildEmail, setSelectedChildEmail] = useState('');
  const [selectedParentEnrollCourse, setSelectedParentEnrollCourse] = useState('course-1');

  // Teacher announcement inputs
  const [annTitleInput, setAnnTitleInput] = useState('');
  const [annTextInput, setAnnTextInput] = useState('');

  // Talent and Artisan Dashboard States
  const [talentInquiries, setTalentInquiries] = useState<TalentInquiry[]>([]);
  const [gigOpportunities, setGigOpportunities] = useState<TalentGigOpportunity[]>([]);
  const [talentWorkspaceTab, setTalentWorkspaceTab] = useState<'artisan' | 'customer'>('artisan');

  // School Admin/Teacher user search and role/status edit inputs
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<UserRole>('Student');
  const [editingUserStatus, setEditingUserStatus] = useState<'active' | 'expired'>('active');

  const loadDashboardData = async () => {
    try {
      const appts = await getAppointments();
      const auds = await getBrandAudits();
      const spons = await getSponsorships();
      setAppointments(appts || []);
      setAudits(auds || []);
      setSponsorships(spons || []);

      const anns = await getAnnouncements();
      setAnnouncements(anns || []);

      const inqs = await getTalentInquiries();
      const gigs = await getGigOpportunities();
      setTalentInquiries(inqs || []);
      setGigOpportunities(gigs || []);

      if (currentUser) {
        if (currentUser.role === 'Student') {
          const enrolls = await getStudentEnrollments(currentUser.uid);
          setStudentEnrollments(enrolls || []);
          if (currentUser.xp !== undefined) {
            setStudentXP(currentUser.xp);
          } else {
            setStudentXP(150);
          }
          if (enrolls.length > 0) {
            setSelectedEnrollment(prev => prev ? (enrolls.find(e => e.id === prev.id) || enrolls[0]) : enrolls[0]);
          }
        } else if (currentUser.role === 'Parent') {
          const progress = await getChildrenProgress(currentUser.children || []);
          setChildrenProgressList(progress || []);
          if (currentUser.children && currentUser.children.length > 0 && !selectedChildEmail) {
            setSelectedChildEmail(currentUser.children[0]);
          }
        } else if (currentUser.role === 'Teacher') {
          const enrolls = await getAllEnrollments();
          const users = await getAllUsers();
          setAllEnrollmentsList(enrolls || []);
          setAllUsersList(users || []);
        } else if (currentUser.role === 'School Admin') {
          const users = await getAllUsers();
          const enrolls = await getAllEnrollments();
          setAllUsersList(users || []);
          setAllEnrollmentsList(enrolls || []);
        } else if (currentUser.role === 'Mentor') {
          const reqs = await getMentorshipRequests(currentUser.uid);
          setMentorshipRequests(reqs || []);
        }
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser, initialAppointments, initialAudits]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'Client' && localStorage.getItem('shouldAutoDownloadAudit') === 'true') {
      const targetAudit = audits[0] || {
        websiteUrl: currentUser.websiteUrl || localStorage.getItem('last_website_url') || 'https://example.com',
        overallScore: 85,
        seoScore: '85/100',
        speedScore: '78/100',
        socialScore: '90/100'
      };
      
      const content = `
=========================================================
      PULZITIVE DIGITAL MARKETING INTELLIGENCE
              AI WEBSITE AUDIT REPORT
=========================================================

Website URL: ${targetAudit.websiteUrl}
Audit Date: ${new Date().toLocaleDateString()}
Overall Score: ${targetAudit.overallScore || 85}%
Status: ACTION REQUIRED

---------------------------------------------------------
1. METRIC PERFORMANCE BREAKDOWN
---------------------------------------------------------
* SEO SCORE: ${targetAudit.seoScore || "85/100"} (Good)
  - Title & Meta Tags: Configured, but missing keyword optimization for high-intent SEM terms.
  - Heading Structures (H1-H6): Verified. Montserrat headings recommended to enhance layout geometry.
  - Schema Markup: Lacks structured geographic/organization schema listings.

* MOBILE SPEED SCORE: ${targetAudit.speedScore || "78/100"} (Needs Improvement)
  - Time to Interactive (TTI): 3.8 seconds.
  - Image Optimization: Large raw assets blocking core rendering path.
  - Code Bundling: Unused JS blocking initial paint.

* SOCIAL & PIXEL SCORE: ${targetAudit.socialScore || "90/100"} (Excellent)
  - Meta Pixel: Detected and active.
  - Google Tag Manager: Configured properly.
  - Social Graph OpenGraph Tags: Missing description descriptors.

---------------------------------------------------------
2. ARTIFICIAL INTELLIGENCE STRATEGIC RECOMMENDATIONS
---------------------------------------------------------
[HIGH PRIORITY] Implement Funnel Optimization:
Refine your landing page flow to remove user friction and integrate active WhatsApp chat conversion hooks.

[MEDIUM PRIORITY] Technical SEO Calibration:
Synthesize automated structured schema files to command Page 1 visibility for high-value localized query terms.

[CREATIVE PRIORITY] Video Content Scheduling:
Publish cinematic, high-impact short-form videos optimized to build rapid brand authority on Instagram and TikTok.

---------------------------------------------------------
Generated automatically by Pulzitive AI Engine.
Pulse on Data. Impact on Brand.
=========================================================
`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Pulzitive_AI_Audit_${targetAudit.websiteUrl.replace(/https?:\/\//, '').replace(/\//g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      localStorage.removeItem('shouldAutoDownloadAudit');
      onTriggerNotification("Success! Your Pulzitive AI Website Audit was downloaded automatically.");
    }
  }, [currentUser, audits]);

  const refreshDashboardData = async () => {
    await loadDashboardData();
    onTriggerNotification('Dashboard statistics refreshed.');
  };

  // --- REAL FIREBASE INTERACTION HANDLERS ---

  // 1. Student Enroll directly
  const handleEnrollStudentDirectly = async (courseId: string, courseTitle: string) => {
    try {
      await enrollInCourse(currentUser.uid, currentUser.email, courseId, courseTitle);
      await loadDashboardData();
      onTriggerNotification(`Successfully enrolled in ${courseTitle}!`);
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to enroll in course.');
    }
  };

  // 2. Student Complete lesson
  const handleToggleLessonComplete = async (enrollmentId: string, lessonName: string, syllabusLength: number) => {
    try {
      await completeLessonInDb(enrollmentId, lessonName, syllabusLength, currentUser.uid);
      await loadDashboardData();
      onTriggerNotification(`Completed lesson "${lessonName}"! +50 XP Awarded.`);
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to update lesson completion.');
    }
  };

  // 3. Parent Invite Child via email
  const handleParentInviteChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentChildEmailInput.trim()) return;
    try {
      await inviteChild(currentUser.email, parentChildEmailInput.trim());
      setParentChildEmailInput('');
      await loadDashboardData();
      onTriggerNotification(`Invite sent. Student ${parentChildEmailInput} linked successfully.`);
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to invite child.');
    }
  };

  // 4. Parent enroll child in course
  const handleParentEnrollChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildEmail) {
      onTriggerNotification('Please link or select a child account first.');
      return;
    }
    const courseObj = courses.find(c => c.id === selectedParentEnrollCourse);
    if (!courseObj) return;

    try {
      const progressRecord = childrenProgressList.find(c => c.profile.email === selectedChildEmail);
      if (progressRecord) {
        await enrollInCourse(progressRecord.profile.uid, selectedChildEmail, courseObj.id, courseObj.title);
        await loadDashboardData();
        onTriggerNotification(`Successfully enrolled ${selectedChildEmail} in ${courseObj.title}!`);
      } else {
        onTriggerNotification('Child account must sign up or be linked first.');
      }
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to enroll student.');
    }
  };

  // 5. Teacher Post Announcement
  const handleTeacherPostAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitleInput.trim() || !annTextInput.trim()) {
      onTriggerNotification('Please enter both title and body text.');
      return;
    }
    try {
      await createAnnouncement(currentUser.uid, currentUser.displayName || 'Instructor', annTitleInput.trim(), annTextInput.trim());
      setAnnTitleInput('');
      setAnnTextInput('');
      await loadDashboardData();
      onTriggerNotification('Announcement published to student portals!');
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to post announcement.');
    }
  };

  // 6. School Admin / Teacher update user role and access status
  const handleAdminUpdateUserSubmit = async (userId: string, role: UserRole, status?: 'active' | 'expired') => {
    try {
      await updateUserRoleAndStatusInDb(userId, role, status);
      await loadDashboardData();
      setEditingUserId(null);
      onTriggerNotification('User role and permissions updated successfully.');
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to update user parameters.');
    }
  };

  // 7. Mentor Approve Mentorship request
  const handleApproveMentorshipRequest = async (requestId: string) => {
    try {
      await updateMentorshipStatus(requestId, 'approved');
      await loadDashboardData();
      onTriggerNotification('Mentorship request approved! You are now matched with this student.');
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to approve request.');
    }
  };

  // Student request sponsorship handler
  const handleRequestSponsorship = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockReq = await requestSponsorship({
      studentId: currentUser.uid,
      studentName: currentUser.displayName || 'Adebayo Oluwaseun',
      studentEmail: currentUser.email || 'adebayo@student.com',
      courseId: 'course-1',
      courseTitle: 'Advanced AI & Large Language Models',
      reason: "Need a laptop and internet stipend to join the physical Lagos React Hackathon.",
      fundingNeeded: 25000,
    });
    setSponsorships(prev => [mockReq, ...prev]);
    setSponsorSubmitted(true);
    onTriggerNotification("Sponsorship request submitted to corporate sponsors.");
  };

  // Student chat with mentor
  const handleStudentSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentChatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      chatId: 'general',
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Student',
      text: studentChatInput,
      timestamp: new Date().toISOString()
    };

    setStudentChat(prev => [...prev, userMsg]);
    const inputMsg = studentChatInput.toLowerCase();
    setStudentChatInput('');

    // Simulated mentor responsive feedback!
    setTimeout(() => {
      let reply = "That is a great query. ";
      if (inputMsg.includes('react') || inputMsg.includes('code')) {
        reply += "In React, make sure your components are pure. Keep logic modular to avoid hitting chunk limits.";
      } else if (inputMsg.includes('seo') || inputMsg.includes('audit')) {
        reply += "For client audits, check search console schemas. Organic backlinks must be clean and consistent.";
      } else {
        reply += "I suggest reviewing the Week 3 curriculum slides. Let's schedule a 5-minute review call on Friday!";
      }

      const mentorMsg: ChatMessage = {
        id: `chat-mentor-${Date.now()}`,
        chatId: 'general',
        senderId: 'mentor',
        senderName: 'Dr. Sarah Carter',
        text: reply,
        timestamp: new Date().toISOString()
      };
      setStudentChat(prev => [...prev, mentorMsg]);
    }, 1000);
  };

  // Fetch AI parenting advice tips via Gemini
  const fetchParentingTips = async () => {
    setIsLoadingTips(true);
    setParentTips(null);
    try {
      const response = await fetch('/api/ai/parenting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'coding and graphic design' })
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setParentTips(data.advice);
    } catch {
      // Offline fallback parenting advice
      setParentTips(
        "**1. Encourage Screen-Time Creation**:\nHave your child build small mock websites or graphics instead of only playing video streams.\n\n" +
        "**2. Gamify Algorithmic Exercises**:\nHelp them decompose daily schedules or recipes into algorithmic sequences.\n\n" +
        "**3. Treat bugs as data**:\nEncourage diagnostic patience when their code loops fail."
      );
    } finally {
      setIsLoadingTips(false);
    }
  };

  // Approve sponsorship disbursement by Admin or Sponsor
  const handleApproveSponsorship = async (id: string) => {
    await updateSponsorshipStatus(id, 'approved');
    const spons = await getSponsorships();
    setSponsorships(spons);
    onTriggerNotification("Sponsorship authorized. Funds queued for transfer.");
  };

  // Render Functions for the 8 PRD Workspaces
  
  // 1. STUDENT
  const renderStudentWorkspace = () => {
    const progressPercent = Math.min(100, Math.round(((studentXP % 500) / 500) * 100));
    
    const getRank = (xp: number) => {
      if (xp >= 1500) return 'Chief Growth Officer';
      if (xp >= 1000) return 'Acquisition Director';
      if (xp >= 500) return 'Senior SEM Specialist';
      return 'Digital Marketing Associate';
    };

    const getNextRank = (xp: number) => {
      if (xp >= 1500) return 'Marketing Architect';
      if (xp >= 1000) return 'Chief Growth Officer';
      if (xp >= 500) return 'Acquisition Director';
      return 'Senior SEM Specialist';
    };

    return (
      <div className="space-y-6">
        
        {/* Top Ranks & XP Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-gray-500 font-mono uppercase">Your Learning XP Meter</span>
              <p className="text-3xl font-black text-emerald-400 mt-1">{studentXP} XP</p>
              <p className="text-[10px] text-slate-400 mt-1.5">Earn 50 XP per completed syllabus task</p>
            </div>
            <Award className="w-12 h-12 text-emerald-400" />
          </div>

          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
            <span className="block text-[10px] text-gray-500 font-mono uppercase">Level Progress</span>
            <div className="w-full bg-slate-950 h-2.5 rounded-full mt-3.5 relative overflow-hidden border border-slate-800">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2.5">
              <span>Rank: {getRank(studentXP)}</span>
              <span>{progressPercent}% to {getNextRank(studentXP)}</span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-gray-500 font-mono uppercase">Earned Badges</span>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {(currentUser.badges && currentUser.badges.length > 0) ? (
                  currentUser.badges.map((b, i) => (
                    <span key={i} className="bg-emerald-500/15 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/25">
                      {b}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/25">SEO Specialist</span>
                    <span className="bg-indigo-600/15 text-indigo-400 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500/25">PPC Campaigner</span>
                  </>
                )}
              </div>
            </div>
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
        </div>

        {/* Enroll for Courses (Academy Catalog) */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-sm font-bold text-white">Enroll in Academy Courses</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Explore our full premium catalog of flagship tech courses, select your preferred learning mode, and enroll directly from the Academy.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('academy')}
              className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md hover:scale-[1.01]"
            >
              Browse Courses & Enroll
            </button>
          </div>
        </div>

        {/* My Courses, Quests, Leaderboard and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* My Enrolled Coursework */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-indigo-400" /> My Active Courses & Syllabus
            </h3>
            
            {studentEnrollments.length === 0 ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center text-xs text-slate-500">
                You are not enrolled in any full courses yet. Enroll from the catalog above!
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-1.5">
                  {studentEnrollments.map(e => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEnrollment(e)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                        selectedEnrollment?.id === e.id
                          ? 'bg-white text-slate-950 border border-slate-200 shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {e.courseTitle.split(' & ')[0]}
                    </button>
                  ))}
                </div>

                {selectedEnrollment && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white">{selectedEnrollment.courseTitle}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Overall Progress: {selectedEnrollment.progress}%</p>
                      </div>
                      {selectedEnrollment.progress === 100 ? (
                        <button
                          onClick={() => onOpenCertificateModal(currentUser.displayName || currentUser.email, selectedEnrollment.courseTitle)}
                          className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold px-2.5 py-1 rounded-lg text-[9px] transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Award className="w-3.5 h-3.5" /> Certificate
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                          In Progress
                        </span>
                      )}
                    </div>

                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${selectedEnrollment.progress}%` }}></div>
                    </div>

                    {/* Enrollment metadata */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/50 p-2.5 rounded-lg border border-slate-850/40">
                      <div>
                        <span className="text-slate-500 block uppercase font-mono text-[8px]">Learning Mode</span>
                        <span className="text-slate-300 font-semibold">{selectedEnrollment.mode || 'Online'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase font-mono text-[8px]">Tuition Price</span>
                        <span className="text-emerald-400 font-semibold">₦{(selectedEnrollment.pricePaid || 25000).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase font-mono text-[8px]">Schedule Time</span>
                        <span className="text-slate-300 font-semibold">{selectedEnrollment.scheduleDate || 'Jul 18, 2026'} @ {selectedEnrollment.scheduleTime || '11:00 AM'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase font-mono text-[8px]">Duration Details</span>
                        <span className="text-slate-300 font-semibold">
                          {selectedEnrollment.durationDays || 3} Days ({selectedEnrollment.hoursPerDay || 3}h/day)
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold font-mono uppercase">Syllabus Checkmarks (Earn 50 XP per lesson)</p>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {courses.find(c => c.id === selectedEnrollment.courseId)?.syllabus.map((lesson, idx) => {
                          const isCompleted = selectedEnrollment.completedLessons.includes(lesson);
                          const syllabusLength = courses.find(c => c.id === selectedEnrollment.courseId)?.syllabus.length || 1;
                          return (
                            <label
                              key={idx}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                isCompleted
                                  ? 'bg-slate-900/40 border-slate-850/30 opacity-70'
                                  : 'bg-slate-900 hover:bg-slate-850 border-slate-850'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isCompleted}
                                disabled={isCompleted}
                                onChange={() => handleToggleLessonComplete(selectedEnrollment.id, lesson, syllabusLength)}
                                className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-400/20 bg-white cursor-pointer disabled:cursor-not-allowed"
                              />
                              <span className={`text-[10px] select-none ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                {lesson}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quests (Daily/Weekly targets) */}
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Zap className="w-4.5 h-4.5 text-yellow-400" /> Quests & Daily Targets
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">First Steps Quest</p>
                  <p className="text-[10px] text-slate-400">Complete your very first course syllabus lesson</p>
                </div>
                {studentEnrollments.some(e => e.completedLessons.length >= 1) ? (
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20">Completed</span>
                ) : (
                  <span className="bg-slate-900 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-800">50 XP</span>
                )}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">Diploma Achievement Quest</p>
                  <p className="text-[10px] text-slate-400">Complete 100% of any Academy Coursework</p>
                </div>
                {studentEnrollments.some(e => e.progress === 100) ? (
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20">Completed</span>
                ) : (
                  <span className="bg-slate-900 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-800">500 XP</span>
                )}
              </div>
            </div>

            {/* Seek Sponsor Funding */}
            <div className="pt-4 border-t border-slate-850/60 space-y-3">
              <h4 className="text-xs font-bold text-slate-200">Need regional aid support?</h4>
              {sponsorSubmitted ? (
                <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-xl text-[11px] space-y-2">
                  <p className="font-semibold text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> Application Submitted</p>
                  <p className="text-slate-400">Corporate sponsors have been notified of your need. Check active approvals tab regularly!</p>
                </div>
              ) : (
                <form onSubmit={handleRequestSponsorship} className="space-y-3 text-xs">
                  <p className="text-[10px] text-slate-400 leading-relaxed">Need sponsorship for physical classes, local laptops, or internet stipends?</p>
                  <button
                    type="submit"
                    className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold py-2 rounded-xl cursor-pointer shadow-sm text-xs"
                  >
                    Apply for Regional Student Aid (₦25,000 value)
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-emerald-400" /> Academy Leaderboard
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {allUsersList
                .filter(u => u.role === 'Student')
                .sort((a, b) => (b.xp || 0) - (a.xp || 0))
                .map((st, index) => (
                  <div key={st.uid} className="bg-slate-950 p-3 rounded-xl border border-slate-850/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 font-bold w-4">#{index + 1}</span>
                      <div>
                        <p className="font-bold text-slate-200">{st.displayName || st.email}</p>
                        <p className="text-[9px] text-slate-500">{st.email}</p>
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{st.xp || 0} XP</span>
                  </div>
                ))}
              {allUsersList.filter(u => u.role === 'Student').length === 0 && (
                <div className="text-center text-xs text-slate-500 py-4">No other students on leaderboard yet. Your XP is {studentXP}.</div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Zap className="w-4.5 h-4.5 text-indigo-400" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <button
                onClick={onOpenApptModal}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-950 rounded-xl py-4 text-[11px] font-semibold cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-4.5 h-4.5 text-emerald-400" />
                Book Session
              </button>
              <button
                onClick={async () => {
                  const teachers = allUsersList.filter(u => u.role === 'Teacher' || u.role === 'Mentor');
                  if (teachers.length > 0) {
                    const t = teachers[0];
                    try {
                      await requestMentorship(currentUser.uid, currentUser.displayName || currentUser.email, currentUser.email, t.uid, t.displayName || t.email);
                      onTriggerNotification(`Mentorship request sent to ${t.displayName || t.email}!`);
                      await loadDashboardData();
                    } catch (err) {
                      console.error(err);
                    }
                  } else {
                    onTriggerNotification('No mentors available at this moment.');
                  }
                }}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-950 rounded-xl py-4 text-[11px] font-semibold cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
              >
                <Users className="w-4.5 h-4.5 text-indigo-400" />
                Request Mentor
              </button>
            </div>

            {/* My Projects */}
            <div className="pt-3 border-t border-slate-850/60 text-xs">
              <p className="font-bold text-slate-200">My Projects & Playgrounds</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Use the Marketing Tools on the main Academy catalog to practice your campaign setup skills live!</p>
            </div>
          </div>
        </div>

        {/* Real-time mentor chat widget */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Brain className="w-4.5 h-4.5 text-emerald-400" /> Mentor Support Desk</h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 h-48 overflow-y-auto space-y-3 flex flex-col justify-end">
            {studentChat.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.senderId === 'mentor' ? 'items-start' : 'items-end'}`}>
                <div className={`p-2.5 rounded-xl text-[11px] max-w-md ${msg.senderId === 'mentor' ? 'bg-slate-900 text-white rounded-bl-none' : 'bg-emerald-500 text-slate-950 rounded-br-none font-medium'}`}>
                  <p className="font-mono text-[8px] opacity-75 mb-0.5">{msg.senderName}</p>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleStudentSendMessage} className="flex gap-2">
            <input
              type="text"
              value={studentChatInput}
              onChange={(e) => setStudentChatInput(e.target.value)}
              placeholder="Type code inquiry to Sarah Carter..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
            />
            <button
              type="submit"
              className="bg-white text-slate-850 border border-slate-200 font-bold px-4 rounded-xl text-xs cursor-pointer hover:bg-slate-50 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* DIGITAL MARKETING LEARNER SIMULATORS GRID */}
        {renderDigitalMarketingSimulators()}

      </div>
    );
  };

  // 2. PARENT
  const renderParentWorkspace = () => (
    <div className="space-y-6">
      
      {/* Invite child via email invite & Enroll student form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Children & Invite */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Users className="w-4.5 h-4.5 text-emerald-400" /> Manage Children Accounts</h3>
          <p className="text-[10px] text-slate-400">Add or link your children's learning profiles to track progress and sponsor terms.</p>
          
          <form onSubmit={handleParentInviteChild} className="flex gap-2">
            <input
              type="email"
              required
              value={parentChildEmailInput}
              onChange={(e) => setParentChildEmailInput(e.target.value)}
              placeholder="Child student email..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold px-4 rounded-xl text-xs cursor-pointer shadow-sm transition-all"
            >
              Link Account
            </button>
          </form>

          {/* Child Progress Cards */}
          <div className="space-y-3 pt-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Linked Children Progress</p>
            {childrenProgressList.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No linked children found. Invite them above!</p>
            ) : (
              childrenProgressList.map(({ profile, enrollments }) => (
                <div key={profile.uid} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-200 text-xs">{profile.displayName || profile.email}</p>
                      <p className="text-[9px] text-slate-500">{profile.email} • {profile.xp || 0} Total XP</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Linked Student
                    </span>
                  </div>

                  {enrollments.length === 0 ? (
                    <p className="text-[10px] text-slate-500 italic">Not enrolled in any flagship courses yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {enrollments.map(e => (
                        <div key={e.id} className="text-[10px] space-y-1">
                          <div className="flex justify-between text-slate-400">
                            <span className="truncate max-w-[180px]">{e.courseTitle}</span>
                            <span className="font-mono text-emerald-400">{e.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${e.progress}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enroll student for courses */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><BookOpen className="w-4.5 h-4.5 text-indigo-400" /> Enroll Child for Course</h3>
          <p className="text-[10px] text-slate-400">Select an active linked child account to enroll them directly in high-tier technical course modules.</p>

          <form onSubmit={handleParentEnrollChildSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Select Child</label>
              <select
                value={selectedChildEmail}
                onChange={(e) => setSelectedChildEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
              >
                <option value="">-- Choose child --</option>
                {childrenProgressList.map(({ profile }) => (
                  <option key={profile.email} value={profile.email}>{profile.displayName || profile.email}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Select Course</label>
              <select
                value={selectedParentEnrollCourse}
                onChange={(e) => setSelectedParentEnrollCourse(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold py-2.5 rounded-xl cursor-pointer"
            >
              Enroll Student Profile (Free)
            </button>
          </form>

          <div className="pt-2">
            <button
              onClick={() => onEnrollViaPaystack(15000, "Student/Parent Online Term Fee")}
              className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold py-2.5 rounded-xl cursor-pointer text-xs"
            >
              Pay Course Term Dues (₦15,000 NGN)
            </button>
          </div>
        </div>
      </div>

      {/* AI PARENTING TIPS VIA GEMINI */}
      <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5"><Brain className="w-4.5 h-4.5 text-indigo-400" /> Gemini AI Parenting Advisor</h3>
        <p className="text-[10px] text-slate-400">Query the Gemini model for short, actionable technical learning tips for kids.</p>
        
        <button
          onClick={fetchParentingTips}
          disabled={isLoadingTips}
          className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold py-2 rounded-xl cursor-pointer text-xs w-full flex items-center justify-center gap-2"
        >
          {isLoadingTips ? 'Connecting Gemini...' : 'Generate New Parenting Tips'}
        </button>

        {parentTips && (
          <div className="bg-slate-950/80 border border-indigo-500/10 p-4 rounded-xl text-[11px] leading-relaxed space-y-2 max-h-48 overflow-y-auto">
            {parentTips.split('\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        )}
      </div>

    </div>
  );

  // 3. TEACHER
  const renderTeacherWorkspace = () => {
    const students = allUsersList.filter(u => u.role === 'Student');
    
    return (
      <div className="space-y-6">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
            <span className="block text-[10px] text-gray-500 font-mono uppercase">20% Referrals Commission</span>
            <p className="text-3xl font-black text-emerald-400 mt-1">₦35,000</p>
            <p className="text-[10px] text-slate-400 mt-1.5">Earned from 3 facilitated student payments</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
            <span className="block text-[10px] text-gray-500 font-mono uppercase">Active Students Enrolled</span>
            <p className="text-3xl font-black text-indigo-400 mt-1">{students.length} Pupils</p>
            <p className="text-[10px] text-slate-400 mt-1.5">Managed under your school cohort</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
            <span className="block text-[10px] text-gray-500 font-mono uppercase">Pending Class Submissions</span>
            <p className="text-3xl font-black text-slate-400 mt-1">0 tasks</p>
            <p className="text-[10px] text-slate-400 mt-1.5">Syllabus checkmarks are auto-verified</p>
          </div>
        </div>

        {/* Assign Courses & Post Announcements Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Post Class Announcements */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Megaphone className="w-4.5 h-4.5 text-emerald-400" /> Post Announcements to Student Hub
            </h3>
            <p className="text-[10px] text-slate-400">Your bulletin is published immediately to student portals.</p>

            <form onSubmit={handleTeacherPostAnnouncementSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <input
                  type="text"
                  required
                  value={annTitleInput}
                  onChange={(e) => setAnnTitleInput(e.target.value)}
                  placeholder="Announcement Title (e.g. Week 4 React Quiz)"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <textarea
                  required
                  rows={3}
                  value={annTextInput}
                  onChange={(e) => setAnnTextInput(e.target.value)}
                  placeholder="Write the announcement message body here..."
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Publish Announcement
              </button>
            </form>

            <div className="space-y-2 pt-2 border-t border-slate-850/60">
              <p className="text-[10px] text-slate-500 font-bold font-mono uppercase">Previous Bulletins ({announcements.length})</p>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {announcements.map(ann => (
                  <div key={ann.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/40 text-[11px]">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-slate-200">{ann.title}</p>
                      <p className="text-[8px] text-slate-500 font-mono">{new Date(ann.timestamp).toLocaleDateString()}</p>
                    </div>
                    <p className="text-slate-400 mt-1 leading-relaxed text-[10px]">{ann.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assign Course to Student */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-indigo-400" /> Assign Course & Enroll Students
            </h3>
            <p className="text-[10px] text-slate-400">Directly link any active student to any of our free-trial course syllabuses.</p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const studentEmail = (e.currentTarget.elements.namedItem('assignStudentEmail') as HTMLInputElement).value;
                const courseId = (e.currentTarget.elements.namedItem('assignCourseId') as HTMLSelectElement).value;
                const targetStudent = allUsersList.find(u => u.email.toLowerCase() === studentEmail.trim().toLowerCase());
                const courseObj = courses.find(c => c.id === courseId);
                
                if (!courseObj) return;

                try {
                  if (targetStudent) {
                    await enrollInCourse(targetStudent.uid, targetStudent.email, courseObj.id, courseObj.title);
                    onTriggerNotification(`Successfully assigned ${courseObj.title} to ${targetStudent.displayName || targetStudent.email}!`);
                    await loadDashboardData();
                    e.currentTarget.reset();
                  } else {
                    onTriggerNotification(`No student account found with email "${studentEmail}". Please ask them to sign up first.`);
                  }
                } catch (err) {
                  console.error(err);
                  onTriggerNotification('Failed to assign course.');
                }
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Student Email</label>
                <input
                  name="assignStudentEmail"
                  type="email"
                  required
                  placeholder="Enter student email (e.g. adebayo@student.com)"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Select Coursework</label>
                <select
                  name="assignCourseId"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Assign & Enroll Profile
              </button>
            </form>
          </div>
        </div>

        {/* Class Progress Tracking & Student Roster */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <Users className="w-4.5 h-4.5 text-emerald-400" /> Class Progress Tracker & Student Roster
          </h3>
          <p className="text-[10px] text-slate-400">Real-time learning progress and overall XP totals computed via Firestore database.</p>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {students.map(st => {
              const studentEnrollments = allEnrollmentsList.filter(e => e.studentId === st.uid);
              return (
                <div key={st.uid} className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-white text-xs">{st.displayName || st.email}</p>
                      <p className="text-[9px] text-slate-500">{st.email} • {st.xp || 0} Total XP • Status: <strong className="text-indigo-400 uppercase font-mono text-[8px]">{st.status || 'active'}</strong></p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAdminUpdateUserSubmit(st.uid, 'Student', st.status === 'expired' ? 'active' : 'expired')}
                        className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 text-[9px] font-bold px-2 py-1 rounded cursor-pointer"
                      >
                        Toggle Status ({st.status || 'active'})
                      </button>
                    </div>
                  </div>

                  {studentEnrollments.length === 0 ? (
                    <p className="text-[10px] text-slate-500 italic">No courses currently assigned to this student.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {studentEnrollments.map(e => (
                        <div key={e.id} className="bg-slate-900/50 border border-slate-850 p-2.5 rounded-lg text-[10px] space-y-1.5">
                          <div className="flex justify-between font-semibold text-slate-300">
                            <span className="truncate max-w-[150px]">{e.courseTitle}</span>
                            <span className="text-emerald-400 font-mono">{e.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${e.progress}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {students.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-xs italic">
                No students registered in the system yet. Ask your pupils to sign up as students!
              </div>
            )}
          </div>
        </div>

      </div>
    );
  };

  // 4. SCHOOL ADMIN
  const renderSchoolAdminWorkspace = () => {
    const students = allUsersList.filter(u => u.role === 'Student');
    const teachers = allUsersList.filter(u => u.role === 'Teacher');
    const mentors = allUsersList.filter(u => u.role === 'Mentor');
    const parents = allUsersList.filter(u => u.role === 'Parent');

    const filteredUsers = allUsersList.filter(u => 
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
      (u.displayName && u.displayName.toLowerCase().includes(userSearchQuery.toLowerCase()))
    );

    return (
      <div className="space-y-6">
        {/* School Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl">
            <span className="block text-[9px] text-gray-500 font-mono uppercase">Total Students</span>
            <p className="text-xl font-bold text-white mt-1">{students.length}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl">
            <span className="block text-[9px] text-gray-500 font-mono uppercase">Instructors</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">{teachers.length}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl">
            <span className="block text-[9px] text-gray-500 font-mono uppercase">Mentors Listed</span>
            <p className="text-xl font-bold text-indigo-400 mt-1">{mentors.length}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl">
            <span className="block text-[9px] text-gray-500 font-mono uppercase">Linked Parents</span>
            <p className="text-xl font-bold text-yellow-500 mt-1">{parents.length}</p>
          </div>
        </div>

        {/* User Search & Administration Controls */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5"><Shield className="w-4.5 h-4.5 text-emerald-400" /> Administrative User Management</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Edit roles, verify credentials, and manage system status for teachers, students, and parents.</p>
            </div>
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search user email or name..."
              className="bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-xl px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {filteredUsers.map(usr => (
              <div key={usr.uid} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-200">{usr.displayName || 'No Name Set'}</p>
                  <p className="text-[10px] text-slate-400">{usr.email}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[9px] uppercase font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                      Role: {usr.role}
                    </span>
                    <span className={`text-[9px] uppercase font-bold font-mono px-1.5 py-0.5 rounded border ${
                      usr.status === 'expired'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      Status: {usr.status || 'active'}
                    </span>
                  </div>
                </div>

                {editingUserId === usr.uid ? (
                  <div className="flex flex-col sm:flex-row gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-400 uppercase">Edit Role</label>
                      <select
                        value={editingUserRole}
                        onChange={(e) => setEditingUserRole(e.target.value as UserRole)}
                        className="bg-white border border-slate-200 rounded p-1 text-[10px] text-slate-900 w-full focus:outline-none font-medium"
                      >
                        <option value="Student">Student</option>
                        <option value="Parent">Parent</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Mentor">Mentor</option>
                        <option value="School Admin">School Admin</option>
                        <option value="Sponsor">Sponsor</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-400 uppercase">Edit Status</label>
                      <select
                        value={editingUserStatus}
                        onChange={(e) => setEditingUserStatus(e.target.value as 'active' | 'expired')}
                        className="bg-white border border-slate-200 rounded p-1 text-[10px] text-slate-900 w-full focus:outline-none font-medium"
                      >
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>

                    <div className="flex items-end gap-1 pt-2 sm:pt-0">
                      <button
                        onClick={() => handleAdminUpdateUserSubmit(usr.uid, editingUserRole, editingUserStatus)}
                        className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold px-2 py-1 rounded text-[9px] cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 px-2 py-1 rounded text-[9px] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingUserId(usr.uid);
                        setEditingUserRole(usr.role);
                        setEditingUserStatus(usr.status || 'active');
                      }}
                      className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-950 rounded font-bold px-3 py-1.5 text-[10px] cursor-pointer transition-all shadow-sm"
                    >
                      Change Role/Status
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <p className="text-center text-slate-500 text-xs italic py-4">No matching accounts found.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 5. MENTOR
  const renderMentorWorkspace = () => {
    const activeMentees = mentorshipRequests.filter(r => r.status === 'approved');
    const pendingMentees = mentorshipRequests.filter(r => r.status === 'pending');

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Mentor revenue tracker */}
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5"><DollarSign className="w-4.5 h-4.5 text-emerald-400" /> Mentor Payout shares</h3>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Your 10% Mentor Commission</span>
              <p className="text-3xl font-black text-emerald-400 mt-2">₦{(activeMentees.length * 2500).toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 mt-1.5">Matching {activeMentees.length} active mentees subscriptions</p>
            </div>
          </div>

          {/* Assigned mentees */}
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5"><Users className="w-4.5 h-4.5 text-indigo-400" /> Your Assigned Mentees ({activeMentees.length})</h3>
            <p className="text-[10px] text-slate-400">These students have active direct-line slack and chat linkages with you.</p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {activeMentees.map(m => (
                <div key={m.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{m.studentName}</p>
                    <p className="text-[9px] text-slate-400">{m.studentEmail}</p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                    Connected
                  </span>
                </div>
              ))}

              {activeMentees.length === 0 && (
                <p className="text-center text-slate-500 italic text-xs py-4">No matched mentees yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* View/Approve Mentorship Requests */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Sparkles className="w-4.5 h-4.5 text-emerald-400" /> Pending Mentorship Requests</h3>
          <p className="text-[10px] text-slate-400">Review incoming academic guides proposals from registered students.</p>

          <div className="space-y-3">
            {pendingMentees.map(req => (
              <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-200">{req.studentName}</p>
                  <p className="text-[9px] text-slate-500">{req.studentEmail}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Requested mentorship link in Academy coursework.</p>
                </div>
                <button
                  onClick={() => handleApproveMentorshipRequest(req.id)}
                  className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Approve Mentorship
                </button>
              </div>
            ))}

            {pendingMentees.length === 0 && (
              <p className="text-center text-slate-500 italic text-xs py-2">No pending mentorship requests at this time.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 6. SPONSOR
  const renderSponsorWorkspace = () => (
    <div className="space-y-6">
      
      {/* Sponsor Brandexposure */}
      <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-1.5"><Globe className="w-4.5 h-4.5 text-indigo-400" /> Your Brand Exposure banner</h3>
        <p className="text-xs text-slate-400">Customize the support banner text shown in student cohorts:</p>
        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs">
          <p className="font-semibold text-emerald-400">"Sponsored with Pride by Pulzitive Ltd"</p>
          <p className="text-[10px] text-slate-500 mt-1">Impression count: 1,420 views</p>
        </div>
      </div>

      {/* Review pending requests */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5"><DollarSign className="w-4.5 h-4.5 text-emerald-400" /> Review Student Sponsorship Appeals</h3>
        
        {sponsorships.length === 0 ? (
          <p className="text-xs text-slate-500">No active student sponsorship requests logged yet.</p>
        ) : (
          <div className="space-y-3 text-xs">
            {sponsorships.map(req => (
              <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <p className="font-bold">{req.studentName} <span className="text-[9px] font-normal text-slate-400">({req.studentEmail})</span></p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Reason: {req.reason}</p>
                  <p className="text-[10px] font-mono font-bold text-indigo-400">Funding Requested: ₦{(req.fundingNeeded || 25000).toLocaleString()}</p>
                </div>
                {req.status === 'Pending' ? (
                  <button
                    onClick={() => handleApproveSponsorship(req.id)}
                    className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold px-3.5 py-1.5 rounded-lg text-[10px]"
                  >
                    Fund Sponsorship
                  </button>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-3.5 py-1.5 rounded-lg font-bold">Approved</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );

  // REUSABLE DIGITAL MARKETING SIMULATORS
  const renderDigitalMarketingSimulators = () => (
    <div className="space-y-6 pt-6 border-t border-slate-800">
      <div className="space-y-1 text-left">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-emerald-400" /> Digital Marketing Interactive Practice Hub
        </h3>
        <p className="text-xs text-slate-400">
          Interactive performance tools and playground dashboards. Test live funnels, content schemas, SEO title tags, and UTM tracking setups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. CAMPAIGN ROI & ROAS CALCULATOR */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Funnel & ROAS Calculator
            </h4>
            <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
              Live Calculator
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-left">
            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Monthly Ad Budget</span>
                <span className="text-emerald-400 font-bold">₦{adSpend.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={2000000}
                step={10000}
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Click-Through-Rate (CTR)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={ctr}
                    onChange={(e) => setCtr(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono font-bold focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-2.5 text-slate-500">%</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Conv. Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="50"
                    value={convRate}
                    onChange={(e) => setConvRate(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono font-bold focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-2.5 text-slate-500">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Average Order Value (AOV)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-emerald-400 font-bold">₦</span>
                <input
                  type="number"
                  value={aov}
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 pl-6 text-slate-900 font-mono font-bold focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* CALCULATED RESULTS DASHBOARD */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 grid grid-cols-2 gap-3.5 mt-2">
              <div>
                <span className="text-slate-500 block uppercase font-mono text-[8px]">Projected Clicks</span>
                <span className="text-white font-black text-sm">
                  {Math.round(adSpend / 150).toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">(@ ₦150 CPC)</span>
                </span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-mono text-[8px]">Conversions</span>
                <span className="text-white font-black text-sm">
                  {Math.round((adSpend / 150) * (convRate / 100)).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-mono text-[8px]">CPA (Cost per Sale)</span>
                <span className="text-indigo-400 font-black text-sm">
                  ₦{Math.round(adSpend / Math.max(1, (adSpend / 150) * (convRate / 100))).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-mono text-[8px]">Projected ROAS</span>
                <span className={`font-black text-sm ${((((adSpend / 150) * (convRate / 100)) * aov) / adSpend) >= 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {((((adSpend / 150) * (convRate / 100)) * aov) / adSpend).toFixed(2)}x
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AI AD COPY GENERATOR */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-400" /> AI Ad Copy Architect
              </h4>
              <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                Generator
              </span>
            </div>

            <div className="space-y-3 text-xs text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Industry</label>
                  <select
                    value={marketingIndustry}
                    onChange={(e) => setMarketingIndustry(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  >
                    <option value="E-commerce">E-commerce / Retail</option>
                    <option value="B2B SaaS">B2B Software / SaaS</option>
                    <option value="Local Business">Local Service Agency</option>
                    <option value="Real Estate">Real Estate</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Ad Copy Tone</label>
                  <select
                    value={marketingTone}
                    onChange={(e) => setMarketingTone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  >
                    <option value="Persuasive">Persuasive / Direct</option>
                    <option value="Curious">Curious / Open-loop</option>
                    <option value="Urgent">FOMO / High Urgency</option>
                    <option value="Professional">Professional / Benefit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Value Proposition / Main Offer</label>
                <input
                  type="text"
                  value={marketingProposition}
                  onChange={(e) => setMarketingProposition(e.target.value)}
                  placeholder="e.g. Handmade corporate luxury leather shoes with fast delivery"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium placeholder-slate-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  let hl1 = '';
                  let hl2 = '';
                  let hl3 = '';
                  let desc = '';

                  if (marketingIndustry === 'E-commerce') {
                    hl1 = `${marketingProposition.slice(0, 25)}`;
                    hl2 = 'Premium Custom Fit | Shop Now';
                    hl3 = 'Free Shipping Nationwide';
                    desc = `Get your high-quality ${marketingProposition.toLowerCase()} delivered fast. Browse our collections today and claim a 15% discount on checkout.`;
                  } else if (marketingIndustry === 'B2B SaaS') {
                    hl1 = 'Optimize Business Workflows';
                    hl2 = 'Enterprise Cloud Analytics';
                    hl3 = 'Request Free Live Demo';
                    desc = `Empower your distributed teams with advanced analytics. Secure, fast, and scalable integration designed to accelerate brand growth and intelligence.`;
                  } else if (marketingIndustry === 'Local Business') {
                    hl1 = 'Premium Local Services';
                    hl2 = 'Trusted Expert Craft';
                    hl3 = 'Call For Free Booking';
                    desc = `Looking for trusted experts nearby? We provide high-quality services tailored to your budget. Contact us today for reliable and certified specialists!`;
                  } else {
                    hl1 = 'Exclusive Premium Estates';
                    hl2 = 'Luxurious Modern Living';
                    hl3 = 'Schedule Elite Private Tour';
                    desc = `Invest in prime locations with high resale value. Discover beautiful contemporary designs, secure neighborhoods, and modern premium smart features.`;
                  }

                  setGeneratedHeadlines([hl1 || 'Premium Selection', hl2, hl3]);
                  setGeneratedDescription(desc);
                  onTriggerNotification('High-converting ad copy generated successfully.');
                }}
                className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 py-2 rounded-xl font-bold transition-all hover:scale-[1.01]"
              >
                Assemble Optimized Copy Structure
              </button>
            </div>
          </div>

          {/* GENERATED PREVIEW CONTAINER */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 mt-3 text-left">
            <span className="text-[8px] font-mono text-slate-500 uppercase block">Meta Ads Manager Preview Studio</span>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wider flex justify-between">
                <span>Generated Headlines</span>
                <span className="text-[8px] text-indigo-400 font-normal">Max 30 Chars</span>
              </div>
              {generatedHeadlines.map((h, i) => (
                <div key={i} className="bg-slate-900 border border-slate-850 p-1.5 rounded text-[10px] font-mono text-white flex justify-between">
                  <span>{h}</span>
                  <span className={`text-[8px] font-mono ${h.length <= 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {h.length}/30
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wider flex justify-between">
                <span>Primary Description Copy</span>
                <span className="text-[8px] text-indigo-400 font-normal">Targeting 90 Chars</span>
              </div>
              <p className="text-[11px] font-sans text-slate-300 leading-relaxed bg-slate-900 border border-slate-850 p-2 rounded">
                {generatedDescription}
              </p>
            </div>
          </div>
        </div>

        {/* 3. SEO TITLE & META DESCRIPTION AUDITOR */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <Globe className="w-4 h-4 text-teal-400" /> SEO Content Auditor
            </h4>
            <span className="text-[9px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded">
              Index Check
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-left">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">SEO Page Title Tag</label>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  seoTitle.length >= 50 && seoTitle.length <= 60 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                }`}>
                  {seoTitle.length} Chars ({seoTitle.length >= 50 && seoTitle.length <= 60 ? 'Optimal' : 'Needs Adjusting'})
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none font-bold"
              />
              <p className="text-[9px] text-slate-500">Google recommendation: keep titles between 50 and 60 characters to avoid truncation.</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Meta Description Tag</label>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  seoDesc.length >= 145 && seoDesc.length <= 160 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                }`}>
                  {seoDesc.length} Chars ({seoDesc.length >= 145 && seoDesc.length <= 160 ? 'Optimal' : 'Needs Adjusting'})
                </span>
              </div>
              <textarea
                rows={2}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none font-medium"
              />
              <p className="text-[9px] text-slate-500">Keep description tags between 145 and 160 characters for maximum search engine CTR.</p>
            </div>

            {/* VISUAL SEARCH ENGINE SERP PREVIEW */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
              <span className="text-[8px] font-mono text-slate-500 uppercase block">Google Desktop Search Snippet Preview</span>
              <p className="text-xs text-[#1a0dab] font-sans hover:underline cursor-pointer truncate">
                {seoTitle || 'Insert Page Title'}
              </p>
              <p className="text-[10px] text-[#006621] font-sans flex items-center gap-1">
                https://pulzitive.com <span className="text-[8px] text-[#006621]">▼</span>
              </p>
              <p className="text-[11px] text-[#545454] font-sans leading-relaxed">
                {seoDesc.slice(0, 160) || 'Insert Meta description...'}
                {seoDesc.length > 160 && '...'}
              </p>
            </div>
          </div>
        </div>

        {/* 4. UTM CAMPAIGN LINK BUILDER */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <FileText className="w-4 h-4 text-emerald-400" /> UTM Link Builder
              </h4>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                Analytics
              </span>
            </div>

            <div className="space-y-3 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Destination website URL</label>
                <input
                  type="text"
                  value={utmUrl}
                  onChange={(e) => setUtmUrl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase font-mono font-bold">Source</label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-900 font-mono text-[11px] focus:ring-1 focus:ring-emerald-400 focus:outline-none font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase font-mono font-bold">Medium</label>
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-900 font-mono text-[11px] focus:ring-1 focus:ring-emerald-400 focus:outline-none font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase font-mono font-bold">Campaign Name</label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-900 font-mono text-[11px] focus:ring-1 focus:ring-emerald-400 focus:outline-none font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* UTM BUILD OUTPUT */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 mt-4 text-left">
            <span className="text-[8px] font-mono text-slate-500 uppercase block">Compiled Tracking URL Link</span>
            <div className="bg-slate-900 border border-slate-850 p-2 rounded text-[10px] font-mono text-slate-300 select-all break-all leading-normal">
              {utmUrl}?utm_source={utmSource}&utm_medium={utmMedium}&utm_campaign={utmCampaign}
            </div>
            <button
              onClick={() => {
                const fullUtm = `${utmUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
                navigator.clipboard.writeText(fullUtm);
                setIsCopiedUtm(true);
                onTriggerNotification('UTM campaign tracking link copied to clipboard!');
                setTimeout(() => setIsCopiedUtm(false), 2000);
              }}
              className="w-full bg-white hover:bg-slate-50 text-slate-950 py-1.5 rounded-lg font-bold text-xs cursor-pointer shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <FileText className="w-3.5 h-3.5" />
              {isCopiedUtm ? 'Copied to Clipboard!' : 'Copy Tracking Link'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  // TALENT / ARTISAN WORKSPACE
  const renderTalentWorkspace = () => (
    <div className="space-y-8">
      
      {/* Workspace Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setTalentWorkspaceTab('artisan')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-2 ${
              talentWorkspaceTab === 'artisan'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>🛠️ Artisan / Talent Workspace</span>
          </button>
          <button
            onClick={() => setTalentWorkspaceTab('customer')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-2 ${
              talentWorkspaceTab === 'customer'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>👤 Customer / Employer Workspace</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-[10px] text-emerald-700 font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Firestore Live Data In-Sync</span>
        </div>
      </div>

      {talentWorkspaceTab === 'artisan' ? (
        <div className="space-y-8">
          {/* Artisan Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Artisan & Trade Talent Portal</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  {currentUser.displayName || 'Master Artisan Profile'}
                </h2>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Verified Local Trade Expert • Email: <span className="text-emerald-300 font-semibold">{currentUser.email}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => onNavigate('talents')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Briefcase className="w-4 h-4 text-white" />
                  <span>Open Artisan Directory & Gigs</span>
                </button>
              </div>
            </div>
          </div>

          {/* Performance Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-mono uppercase font-bold">Profile Visibility Score</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">95%</span>
                <span className="text-[10px] text-emerald-600 font-bold">+18% top rank</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-emerald-500 h-full w-[95%] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-mono uppercase font-bold">Local Search Views</span>
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">340+</span>
                <span className="text-[10px] text-blue-600 font-bold">Lagos & Nigeria</span>
              </div>
              <p className="text-[10px] text-slate-500">Verified Badge: Active</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-mono uppercase font-bold">Client Inquiries</span>
                <MessageSquare className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{talentInquiries.length}</span>
                <span className="text-[10px] text-amber-600 font-bold">Live Synced</span>
              </div>
              <p className="text-[10px] text-slate-500">Avg Response: &lt; 15 mins</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-mono uppercase font-bold">Active Opportunities</span>
                <Briefcase className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{gigOpportunities.length}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Local Gigs Feed</span>
              </div>
              <p className="text-[10px] text-slate-500">Local Trade Marketplace</p>
            </div>
          </div>

          {/* Client Inquiries & Hires Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  Client Inquiries & Direct Job Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time incoming job offers and inquiries sent by local employers and clients.
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                {talentInquiries.length} Inquiries Received
              </span>
            </div>

            {talentInquiries.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-3">
                <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">No direct inquiries received yet.</p>
                <p className="text-[11px] text-slate-400">
                  Make sure your profile is listed in the Artisan Directory to start receiving direct job offers!
                </p>
                <button
                  onClick={() => onNavigate('talents')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-white" /> Browse & Pitch on Opportunities
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {talentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs hover:border-blue-300 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                          {inquiry.status || 'Pending'}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 mt-1">{inquiry.projectTitle}</h4>
                        <p className="text-xs text-slate-500 font-medium">From: {inquiry.clientName} ({inquiry.clientEmail})</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-emerald-600 block">${inquiry.offeredBudgetUsd}</span>
                        <span className="text-[10px] text-slate-400 block">~₦{inquiry.offeredBudgetNgn?.toLocaleString()} NGN</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                      "{inquiry.message}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      {/* Location Badge with WHITE background */}
                      <span className="bg-white border border-slate-300 text-slate-900 font-bold px-2.5 py-1 rounded-md flex items-center gap-1 text-[10px] shadow-xs">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {inquiry.location}
                      </span>

                      <div className="flex items-center gap-2">
                        {inquiry.status !== 'Accepted' && (
                          <button
                            onClick={async () => {
                              await updateInquiryStatus(inquiry.id, 'Accepted');
                              const updated = await getTalentInquiries();
                              setTalentInquiries(updated);
                              onTriggerNotification('Inquiry accepted! Project contract activated.');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-xs"
                          >
                            Accept Job
                          </button>
                        )}
                        <button
                          onClick={() => onTriggerNotification(`Direct message thread opened with ${inquiry.clientName}.`)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-xs"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Local Service Opportunities Feed */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Live Local Service Opportunities
                </h3>
                <p className="text-xs text-slate-500">
                  Jobs posted by customers seeking verified mechanics, panel beaters, electricians, and artisans.
                </p>
              </div>
              <button
                onClick={() => onNavigate('talents')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>View All Marketplace Gigs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gigOpportunities.slice(0, 4).map((gig) => (
                <div key={gig.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs hover:border-blue-300 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                        {gig.category}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{gig.title}</h4>
                      <p className="text-xs text-slate-500">Posted by {gig.clientName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-emerald-600 block">${gig.budgetUsd}</span>
                      <span className="text-[10px] text-slate-400 block">~₦{gig.budgetNgn.toLocaleString()} NGN</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {gig.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    {/* Location Badge with WHITE background */}
                    <span className="bg-white border border-slate-300 text-slate-900 font-bold px-2.5 py-1 rounded-md flex items-center gap-1 text-[10px] shadow-xs">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{gig.location}</span>
                    </span>

                    <button
                      onClick={() => onNavigate('talents')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer transition-all shadow-xs flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Pitch Proposal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statements & Earnings Download */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Artisan Financial Statements & Invoices
            </h3>
            <p className="text-xs text-slate-500">
              Generate official PDF statements for completed trade contracts, verified client payments, and tax records.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                  onTriggerNotification('PDF Financial Statement generated for your record.');
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>Print / Download PDF Financial Statement</span>
              </button>
            </div>
          </div>

          {/* Mini Tools Integration */}
          <div className="pt-4 border-t border-slate-200">
            <MiniTools currentUser={currentUser} onBookAppointment={onOpenApptModal} />
          </div>
        </div>
      ) : (
        renderClientWorkspace()
      )}
    </div>
  );

  // 7. CLIENT
  const renderClientWorkspace = () => (
    <div className="space-y-6">
      
      {/* Brand Audit & Book Appointments CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Globe className="w-4.5 h-4.5 text-indigo-400" /> Brand SEO & Performance Audits</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Submit your business domains! Our platform computes custom site speed, SEO rankings, and localized metadata metrics instantly.
          </p>
          <button
            onClick={onOpenAuditModal}
            className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold py-2.5 rounded-xl cursor-pointer text-xs"
          >
            Request Site Brand Audit
          </button>
        </div>

        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Calendar className="w-4.5 h-4.5 text-emerald-400" /> Book Consultations</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Schedule a 1-on-1 growth planning strategy meeting with a Pulzitive Executive Consultant. Auto-generates instant Google Meet coordinates.
          </p>
          <button
            onClick={onOpenApptModal}
            className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold py-2.5 rounded-xl cursor-pointer text-xs"
          >
            Schedule Meet Session
          </button>
        </div>
      </div>

      {/* active Audits display results */}
      {audits.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Completed Audit Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audits.map(audit => (
              <div key={audit.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs space-y-3">
                <div className="flex justify-between font-bold border-b border-slate-850 pb-2">
                  <span className="truncate max-w-xs">{audit.websiteUrl}</span>
                  <span className="text-emerald-400 font-mono font-black">{audit.overallScore}% Score</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono">
                  <div className="bg-slate-900 p-1.5 rounded">
                    <p className="text-slate-500 uppercase">SEO</p>
                    <p className="font-bold text-white">{audit.seoScore}</p>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <p className="text-slate-500 uppercase">SPEED</p>
                    <p className="font-bold text-white">{audit.speedScore}</p>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <p className="text-slate-500 uppercase">SOCIAL</p>
                    <p className="font-bold text-white">{audit.socialScore}</p>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-semibold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> Download PDF Report
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointments List */}
      {appointments.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Scheduled Meetings</h3>
          <div className="space-y-2">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-3">
                <div>
                  <p className="font-bold text-white">{appt.serviceType}</p>
                  <p className="text-[10px] text-slate-400">Date: {appt.dateTime ? new Date(appt.dateTime).toLocaleString() : 'N/A'}</p>
                </div>
                {appt.googleMeetLink && (
                  <a
                    href={appt.googleMeetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white px-3.5 py-1.5 rounded-lg text-[10px] border border-indigo-500/20 font-bold flex items-center gap-1 shrink-0 self-stretch sm:self-auto text-center justify-center"
                  >
                    Join Google Meet <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Digital Marketing Simulators for Client Workspace */}
      {renderDigitalMarketingSimulators()}

      {/* Mini-Tools Workspace Section */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <MiniTools currentUser={currentUser} onBookAppointment={onOpenApptModal} />
      </div>

    </div>
  );

  // 8. ADMIN
  const renderAdminWorkspace = () => (
    <div className="space-y-8">
      
      {/* Platform Global statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
          <span className="block text-[9px] text-slate-500 font-mono uppercase">Platform Revenue</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">₦350,000</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
          <span className="block text-[9px] text-slate-500 font-mono uppercase">Total Commissions</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">₦47,500</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
          <span className="block text-[9px] text-slate-500 font-mono uppercase">Active Bookings</span>
          <p className="text-2xl font-black text-white mt-1">{appointments.length} Meetings</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
          <span className="block text-[9px] text-slate-500 font-mono uppercase">Audit Leads</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{audits.length} Sites</p>
        </div>
      </div>

      {/* Salami Abiodun Consult B2B Growth Automation Platform Hub */}
      <AdminGrowthAutomationHub onTriggerNotification={onTriggerNotification} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Manage Appointments */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Calendar className="w-4.5 h-4.5 text-emerald-400" /> Administrative Booking Logs</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {appointments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No active client bookings registered.</p>
            ) : (
              appointments.map(appt => (
                <div key={appt.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs">
                  <p className="font-bold text-white">{appt.clientName}</p>
                  <p className="text-[10px] text-slate-400">{appt.clientEmail}</p>
                  <p className="text-[10px] font-semibold text-emerald-400 mt-1">{appt.serviceType}</p>
                  <p className="text-[10px] text-slate-500">Date: {appt.dateTime ? new Date(appt.dateTime).toLocaleString() : 'N/A'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Manage Sponsorship grants */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><DollarSign className="w-4.5 h-4.5 text-indigo-400" /> Authorize Student Sponsorship Grants</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sponsorships.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No active sponsorship requests.</p>
            ) : (
              sponsorships.map(req => (
                <div key={req.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <p className="font-bold text-white">{req.studentName}</p>
                    <p className="text-[10px] text-slate-400">Needs: ₦{(req.fundingNeeded || 25000).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 italic mt-0.5">"{req.reason}"</p>
                  </div>
                  {req.status === 'Pending' ? (
                    <button
                      onClick={() => handleApproveSponsorship(req.id)}
                      className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-bold px-3 py-1 rounded text-[10px]"
                    >
                      Disburse
                    </button>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono uppercase">Granted</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Workspace Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 bg-slate-900 border border-emerald-500/10 px-2.5 py-1 rounded">
              PULZITIVE SECURE PORTAL • {currentUser.role} ROLE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-3 flex items-center gap-2">
              Welcome, {currentUser.displayName || 'Distinguished Guest'}
            </h1>
            <p className="text-xs text-slate-400">Logged in as {currentUser.email}</p>
          </div>
          
          <button
            onClick={refreshDashboardData}
            className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 px-4 py-2 rounded-xl text-xs cursor-pointer transition-all flex items-center justify-center gap-2 self-start"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" /> Refresh Workspace Data
          </button>
        </div>

        {/* Dynamic Branch Render based on user roles */}
        <div className="min-h-[400px]">
          {/* All Academy-related roles are consolidated into a single Academy Learner Dashboard */}
          {(currentUser.role === 'Student' || 
            currentUser.role === 'Parent' || 
            currentUser.role === 'Teacher' || 
            currentUser.role === 'School Admin' || 
            currentUser.role === 'Mentor' || 
            currentUser.role === 'Sponsor') && renderStudentWorkspace()}
          {currentUser.role === 'Talent' && renderTalentWorkspace()}
          {currentUser.role === 'Client' && renderClientWorkspace()}
          {currentUser.role === 'Admin' && renderAdminWorkspace()}
          {/* Fallback for unlisted roles */}
          {currentUser.role !== 'Student' &&
           currentUser.role !== 'Parent' &&
           currentUser.role !== 'Teacher' &&
           currentUser.role !== 'School Admin' &&
           currentUser.role !== 'Mentor' &&
           currentUser.role !== 'Sponsor' &&
           currentUser.role !== 'Talent' &&
           currentUser.role !== 'Client' &&
           currentUser.role !== 'Admin' &&
           renderTalentWorkspace()}
        </div>

      </div>
    </div>
  );
}
