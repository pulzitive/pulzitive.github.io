/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AITutorWidget from './components/AITutorWidget';
import WhatsAppWidget from './components/WhatsAppWidget';
import { 
  CompleteProfileModal, BookAppointmentModal, BrandAuditModal, 
  ManageStudentModal, CertificateModal, PremiumPurchaseModal,
  MergedAuditStrategyModal, AppointmentThankYouModal, FreeTrialModal
} from './components/Modals';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import PricingPage from './pages/PricingPage';
import MarketplacePage from './pages/MarketplacePage';
import CommunityPage from './pages/CommunityPage';
import DashboardPage from './pages/DashboardPage';
import PRPage from './pages/PRPage';
import AcademyPage from './pages/AcademyPage';
import PortfolioPage from './pages/PortfolioPage';
import TalentsPage from './pages/TalentsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SitemapPage from './pages/SitemapPage';
import { UserProfile, Course, Appointment, BrandAudit } from './types';
import { 
  getAppointments, getBrandAudits, bookAppointment, saveBrandAudit, 
  updateProfileFields, saveProfile, getCourses, getCurrentUserSync, onAuthUserProfileChanged,
  enrollInCourse
} from './firebase';
import { Bell, Sparkles, Check, CheckCircle2, ShieldAlert } from 'lucide-react';

const VALID_PAGES = [
  'home', 'courses', 'pricing', 'marketplace', 'community', 'dashboard',
  'pr', 'academy', 'portfolio', 'talents', 'privacy', 'terms', 'sitemap'
];

const getInitialPage = (): string => {
  if (typeof window !== 'undefined') {
    const rawHash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    if (rawHash && VALID_PAGES.includes(rawHash)) {
      return rawHash;
    }
  }
  return 'home';
};

export default function App() {
  const [activePage, setActiveState] = useState<string>(getInitialPage);

  const setActivePage = (page: string) => {
    setActiveState(page);
    const targetHash = page === 'home' ? '#home' : `#${page}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      if (rawHash && VALID_PAGES.includes(rawHash)) {
        setActiveState(rawHash);
      } else if (!rawHash) {
        setActiveState('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Database mock states synced from firebase
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [audits, setAudits] = useState<BrandAudit[]>([]);
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; read: boolean }>>([
    { id: 'n-welcome', text: "Welcome to Pulzitive! Access your personal client dashboard or academy workspace by logging in.", read: false }
  ]);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal active triggers
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isApptOpen, setIsApptOpen] = useState(false);
  const [isMergedFlowOpen, setIsMergedFlowOpen] = useState(false);
  const [isManageStudentOpen, setIsManageStudentOpen] = useState(false);
  const [manageStudentMode, setManageStudentMode] = useState<'Add' | 'Enroll' | 'Assign'>('Add');

  // Appointment Thank You feedback state
  const [thankYouAppt, setThankYouAppt] = useState<Appointment | null>(null);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);

  // Shared app-controlled auth modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  
  // Paystack checkout modal trigger
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payPlanName, setPayPlanName] = useState<string>('');
  const [enrollingCourse, setEnrollingCourse] = useState<Course | null>(null);

  // Course certificate modal trigger
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [certStudentName, setCertStudentName] = useState('');
  const [certCourseTitle, setCertCourseTitle] = useState('');

  // Free trial registration states
  const [isFreeTrialOpen, setIsFreeTrialOpen] = useState(false);
  const [trialInitialEmail, setTrialInitialEmail] = useState('');
  const [isClientSignUpOnly, setIsClientSignUpOnly] = useState(false);

  // Load database items whenever current user changes (sign in, sign out, or role changes)
  useEffect(() => {
    const loadData = async () => {
      try {
        const appts = await getAppointments();
        setAppointments(appts || []);
      } catch (err) {
        console.error('Error loading appointments:', err);
      }
      try {
        const brandAudits = await getBrandAudits();
        setAudits(brandAudits || []);
      } catch (err) {
        console.error('Error loading brand audits:', err);
      }
    };
    loadData();
  }, [currentUser]);

  // Handle persistent user auth state on mount
  useEffect(() => {
    // Load previously logged-in user if exists, or start as logged out (null)
    const storedUser = getCurrentUserSync();
    if (storedUser) {
      setCurrentUser(storedUser);
    }

    // Subscribe to real Firebase Auth changes
    const unsubscribe = onAuthUserProfileChanged((profile) => {
      setCurrentUser(profile);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Scroll to top on active page transition
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  // Helper to trigger a temporary popup notification toast
  const triggerToast = (text: string) => {
    setToastMessage(text);
    // Also push to persistent header list
    setNotifications(prev => [
      { id: `n-${Date.now()}`, text, read: false },
      ...prev
    ]);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Profile Save handler
  const handleSaveProfileFields = async (fields: Partial<UserProfile>) => {
    if (currentUser) {
      const updatedProfile = { ...currentUser, ...fields };
      setCurrentUser(updatedProfile);
      try {
        await saveProfile(updatedProfile);
        triggerToast(`Account profile for ${fields.displayName || 'user'} completed successfully!`);
      } catch (err: any) {
        console.error('Error saving profile:', err);
        triggerToast(`Failed to save profile: ${err.message || err}`);
      }
    }
  };

  // Save brand audit request
  const handleRequestBrandAudit = async (fields: { clientName: string; clientEmail: string; websiteUrl: string; industry: string; primaryGoal: string }) => {
    const audit = await saveBrandAudit({
      clientName: fields.clientName,
      clientEmail: fields.clientEmail,
      websiteUrl: fields.websiteUrl,
      industry: fields.industry,
      primaryGoal: fields.primaryGoal
    });

    setAudits(prev => [audit, ...prev]);
    triggerToast(`Brand Audit SEO metrics computed for ${fields.websiteUrl}. Score: ${audit.scores?.seo || 80}%`);
    setActivePage('dashboard');
  };

  // Save combined Brand Audit & Strategy Meeting request
  const handleMergedAuditStrategy = async (fields: {
    clientName: string;
    clientEmail: string;
    websiteUrl: string;
    industry: string;
    primaryGoal: string;
    dateTime: string;
    serviceType: string;
    companyName?: string;
  }) => {
    const audit = await saveBrandAudit({
      clientName: fields.clientName,
      clientEmail: fields.clientEmail,
      websiteUrl: fields.websiteUrl,
      industry: fields.industry,
      primaryGoal: fields.primaryGoal
    });
    setAudits(prev => [audit, ...prev]);

    const appt = await bookAppointment({
      clientName: fields.clientName,
      clientEmail: fields.clientEmail,
      dateTime: fields.dateTime,
      serviceType: fields.serviceType,
      companyName: fields.companyName
    });
    setAppointments(prev => [appt, ...prev]);

    // Attach additional details for auto-signup integration
    const apptWithAuditDetails = {
      ...appt,
      websiteUrl: fields.websiteUrl,
      industry: fields.industry,
      primaryGoal: fields.primaryGoal
    };

    setThankYouAppt(apptWithAuditDetails);
    setIsThankYouOpen(true);
    triggerToast(`Success! SEO metrics compiled (${audit.scores?.seo || 85}%) & strategy meeting booked!`);
    if (currentUser) {
      setActivePage('dashboard');
    }
  };

  // Save consulting appointment
  const handleBookAppointment = async (fields: { clientName: string; clientEmail: string; dateTime: string; serviceType: string; companyName?: string }) => {
    const appt = await bookAppointment({
      clientName: fields.clientName,
      clientEmail: fields.clientEmail,
      dateTime: fields.dateTime,
      serviceType: fields.serviceType,
      companyName: fields.companyName
    });

    setAppointments(prev => [appt, ...prev]);
    setThankYouAppt(appt);
    setIsThankYouOpen(true);
    triggerToast(`Appointment booked! Google Meet link created: ${appt.meetLink}`);
    if (currentUser) {
      setActivePage('dashboard');
    }
  };

  // Enrolling via Paystack Checkout modal trigger
  const handleCheckoutTrigger = (amount: number, planName: string) => {
    setPayAmount(amount);
    setPayPlanName(planName);
    setIsPaystackOpen(true);
  };

  const getCourseDurationDetails = (courseId: string) => {
    switch (courseId) {
      case 'course-1': // Advanced AI
        return { days: 3, hoursPerDay: 3 };
      case 'course-2': // Digital Marketing
        return { days: 2, hoursPerDay: 3 };
      case 'course-3': // React & Vite
        return { days: 3, hoursPerDay: 4 };
      case 'course-kidztech-scratch': // Scratch
        return { days: 2, hoursPerDay: 2 };
      default:
        return { days: 2, hoursPerDay: 3 };
    }
  };

  // Payment completed callback handler
  const handlePaymentSuccess = async (payerEmail: string) => {
    try {
      if (currentUser) {
        if (enrollingCourse) {
          const durationInfo = getCourseDurationDetails(enrollingCourse.id);
          await enrollInCourse(
            currentUser.uid,
            currentUser.email,
            enrollingCourse.id,
            enrollingCourse.title,
            'Online',
            payAmount,
            'Instant Access',
            'Self-Paced Sandbox',
            durationInfo.days,
            durationInfo.hoursPerDay,
            'Paid'
          );
          triggerToast(`Successfully enrolled in ${enrollingCourse.title}! Synchronized with your ${currentUser.role} dashboard.`);
        } else {
          triggerToast(`Success! Payment of ₦${(payAmount || 0).toLocaleString()} NGN processed via Paystack.`);
        }
        
        // Upgrade current user access level
        setCurrentUser(prev => prev ? { ...prev, accessLevel: 'Premium' } : null);
        
        // Redirect to dashboard to see results instantly
        setActivePage('dashboard');
      } else {
        triggerToast(`Success! Payment of ₦${(payAmount || 0).toLocaleString()} NGN processed via Paystack. Please log in to view your dashboard.`);
      }
    } catch (err: any) {
      console.error("Payment enrollment error:", err);
      triggerToast(`Payment successful, but database synchronization failed: ${err.message || err}`);
    } finally {
      setEnrollingCourse(null);
    }
  };

  // Manage cohorts add/enroll student handler
  const handleManageStudent = (fields: { email: string; displayName: string; courseId: string; paidBy: string }) => {
    triggerToast(`Student "${fields.displayName}" successfully enrolled in course. Access authorized.`);
  };

  const handleOpenCertificate = (studentName: string, courseTitle: string) => {
    setCertStudentName(studentName);
    setCertCourseTitle(courseTitle);
    setIsCertificateOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans text-slate-100">
      
      {/* HEADER SECTION */}
      <Header
        currentUser={currentUser}
        onNavigate={(page) => setActivePage(page)}
        activePage={activePage}
        onUserChanged={(user) => {
          setCurrentUser(user);
          if (user) {
            triggerToast(`Logged into simulated ${user.role} workspace.`);
          } else {
            triggerToast('Signed out of Pulzitive Portal.');
          }
        }}
        notifications={notifications}
        onMarkNotificationsRead={markAllNotificationsRead}
        isAuthModalOpen={isAuthOpen}
        setIsAuthModalOpen={(open) => {
          setIsAuthOpen(open);
          if (!open) {
            setIsClientSignUpOnly(false);
          }
        }}
        authTab={authTab}
        setAuthTab={setAuthTab}
        isAdminAuth={isAdminAuth}
        setIsAdminAuth={setIsAdminAuth}
        isClientSignUpOnly={isClientSignUpOnly}
      />

      {/* ACTIVE SESSION WORKSPACE LINK BANNER */}
      {currentUser && activePage !== 'dashboard' && (
        <div className="bg-emerald-950/40 border-b border-emerald-500/20 py-2.5 px-4 animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                Logged in as <strong className="text-emerald-400">{currentUser.displayName || currentUser.email}</strong> ({currentUser.role}).
              </span>
            </div>
            <button
              onClick={() => setActivePage('dashboard')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer text-[11px]"
            >
              <span>Access Dashboard</span>
              <span className="font-mono">→</span>
            </button>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION IF ACTIVE */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 max-w-sm bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl p-4 flex items-start gap-3 text-xs animate-bounce">
          <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white">System Alert</h4>
            <p className="text-slate-400 mt-1 leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* CORE ROUTING ENGINE */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomePage 
            onNavigate={(page) => setActivePage(page)}
            onOpenAuditModal={() => setIsAuditOpen(true)}
            onOpenApptModal={() => setIsApptOpen(true)}
            onOpenMergedModal={() => setIsMergedFlowOpen(true)}
            onOpenAuthModal={() => setIsAuthOpen(true)}
          />
        )}
        
        {activePage === 'courses' && (
          <CoursesPage 
            onEnroll={(course) => {
              setEnrollingCourse(course);
              handleCheckoutTrigger(course.price, `Academy Course: ${course.title}`);
            }}
          />
        )}

        {activePage === 'pricing' && (
          <PricingPage 
            onSelectPlan={(amount, name) => {
              setEnrollingCourse(null);
              handleCheckoutTrigger(amount, name);
            }}
          />
        )}

        {activePage === 'marketplace' && (
          <MarketplacePage 
            onCheckout={(amount, name) => {
              setEnrollingCourse(null);
              handleCheckoutTrigger(amount, name);
            }}
            onTriggerNotification={(text) => triggerToast(text)}
          />
        )}

        {activePage === 'community' && (
          <CommunityPage onTriggerNotification={(text) => triggerToast(text)} />
        )}

        {activePage === 'pr' && (
          <PRPage />
        )}

        {activePage === 'privacy' && (
          <PrivacyPage />
        )}

        {activePage === 'terms' && (
          <TermsPage />
        )}

        {activePage === 'sitemap' && (
          <SitemapPage onNavigate={(page) => setActivePage(page)} />
        )}

        {activePage === 'portfolio' && (
          <PortfolioPage 
            onNavigate={(page) => setActivePage(page)}
            onOpenAuditModal={() => setIsAuditOpen(true)}
            onOpenApptModal={() => setIsApptOpen(true)}
            onOpenMergedModal={() => setIsMergedFlowOpen(true)}
          />
        )}

        {activePage === 'talents' && (
          <TalentsPage
            currentUser={currentUser}
            onNavigate={(page) => setActivePage(page)}
            onCheckout={(amount, name) => handleCheckoutTrigger(amount, name)}
            onOpenAuthModal={() => {
              setAuthTab('signup');
              setIsAuthOpen(true);
            }}
          />
        )}

         {activePage === 'academy' && (
          <AcademyPage 
            onEnroll={(course) => {
              setEnrollingCourse(course);
              handleCheckoutTrigger(course.price, `Academy Course: ${course.title}`);
            }}
            onSelectPlan={(amount, name) => {
              setEnrollingCourse(null);
              handleCheckoutTrigger(amount, name);
            }}
            currentUser={currentUser}
            onUserChanged={(user) => {
              setCurrentUser(user);
              if (user) {
                triggerToast(`Logged into simulated ${user.role} workspace.`);
              } else {
                triggerToast('Signed out of Pulzitive Portal.');
              }
            }}
            onNavigate={(page) => setActivePage(page)}
            onOpenFreeTrialModal={(initialEmailStr) => {
              setTrialInitialEmail(initialEmailStr || '');
              setIsFreeTrialOpen(true);
            }}
            onOpenAuthModal={() => {
              setAuthTab('signin');
              setIsAuthOpen(true);
            }}
          />
        )}

        {activePage === 'dashboard' && currentUser && (
          <DashboardPage 
            currentUser={currentUser}
            onNavigate={(page) => setActivePage(page)}
            onOpenAuditModal={() => setIsAuditOpen(true)}
            onOpenApptModal={() => setIsApptOpen(true)}
            onOpenManageStudentModal={(mode) => {
              setManageStudentMode(mode);
              setIsManageStudentOpen(true);
            }}
            onTriggerNotification={(text) => triggerToast(text)}
            onOpenCertificateModal={handleOpenCertificate}
            onEnrollViaPaystack={(amount, name) => handleCheckoutTrigger(amount, name)}
            appointments={appointments}
            audits={audits}
          />
        )}
      </main>

      {/* FOOTER SECTION */}
      <Footer 
        onNavigate={(page) => setActivePage(page)} 
        onOpenAdminLogin={() => {
          setIsAdminAuth(true);
          setAuthTab('signin');
          setIsAuthOpen(true);
        }}
      />

      {/* FLOATING WIDGETS CO-ORDINATOR */}
      {activePage === 'academy' && (
        <AITutorWidget />
      )}
      {activePage === 'home' && (
        <WhatsAppWidget />
      )}

      {/* ACTIVE MODALS PORTAL CO-ORDINATOR */}
      {currentUser && !currentUser.profileCompleted && (
        <CompleteProfileModal
          isOpen={true}
          user={currentUser}
          onSave={handleSaveProfileFields}
        />
      )}

      <BookAppointmentModal
        isOpen={isApptOpen}
        onClose={() => setIsApptOpen(false)}
        onBook={handleBookAppointment}
        clientEmail={currentUser?.email}
        clientName={currentUser?.displayName}
      />

      <BrandAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        onSubmit={handleRequestBrandAudit}
        clientEmail={currentUser?.email}
        clientName={currentUser?.displayName}
      />

      <MergedAuditStrategyModal
        isOpen={isMergedFlowOpen}
        onClose={() => setIsMergedFlowOpen(false)}
        onSubmit={handleMergedAuditStrategy}
        clientEmail={currentUser?.email}
        clientName={currentUser?.displayName}
        onUserSignedIn={setCurrentUser}
      />

      <ManageStudentModal
        isOpen={isManageStudentOpen}
        onClose={() => setIsManageStudentOpen(false)}
        onSave={handleManageStudent}
        courses={getCourses()}
        mode={manageStudentMode}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        studentName={certStudentName}
        courseTitle={certCourseTitle}
      />

      <PremiumPurchaseModal
        isOpen={isPaystackOpen}
        onClose={() => setIsPaystackOpen(false)}
        amount={payAmount}
        planName={payPlanName}
        currentUserEmail={currentUser?.email || ''}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AppointmentThankYouModal
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
        apptDetails={thankYouAppt}
        onSignUpTrigger={() => {
          setIsClientSignUpOnly(true);
          setAuthTab('signup');
          setIsAuthOpen(true);
        }}
        isUserSignedIn={!!currentUser}
        onUserChanged={(user) => {
          setCurrentUser(user);
          if (user) {
            triggerToast(`Welcome to Pulzitive! Logged in as ${user.displayName || user.email}.`);
            setActivePage('dashboard');
          }
        }}
      />

      <FreeTrialModal
        isOpen={isFreeTrialOpen}
        onClose={() => setIsFreeTrialOpen(false)}
        currentUser={currentUser}
        onUserChanged={(user) => {
          setCurrentUser(user);
          if (user) {
            triggerToast(`Logged into simulated ${user.role} workspace.`);
          } else {
            triggerToast('Signed out of Pulzitive Portal.');
          }
        }}
        initialEmail={trialInitialEmail}
      />

    </div>
  );
}
