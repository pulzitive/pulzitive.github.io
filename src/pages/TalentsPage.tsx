/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Sparkles, Star, ShieldCheck, CheckCircle2, Briefcase, Clock, 
  DollarSign, Filter, Plus, Send, Eye, Award, TrendingUp, ChevronRight, User, 
  ExternalLink, SlidersHorizontal, Zap, X, MessageSquare, Globe, 
  RefreshCw, FileText, Check, AlertCircle, ThumbsUp, Lock, Share2, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, TalentProfile, TalentGigOpportunity, TalentInquiry, GigProposal } from '../types';
import { 
  getTalents, saveTalentProfile, getGigOpportunities, postGigOpportunity, 
  getTalentInquiries, sendTalentInquiry, updateInquiryStatus,
  submitGigProposal, hireArtisanForGig
} from '../firebase';

interface TalentsPageProps {
  currentUser: UserProfile | null;
  onNavigate: (page: string) => void;
  onCheckout: (amount: number, name: string) => void;
  onOpenAuthModal?: () => void;
}

const TALENT_CATEGORIES = [
  'All Categories',
  'Mechanic',
  'Panel Beater',
  'Car Rewire',
  'AC Technician',
  'Freezer/Fridge technician',
  'Electrician',
  'Car Wash',
  'Dry Cleaner',
  'Tailor',
  'Shoe Maker',
  'Plumber',
  'Painter',
  'Welder',
  'Printers',
  'Furniture',
  'Carpenter',
  'Vulcanizer',
  'Photographer',
  'Land Scraper'
];

const ARTISAN_TRADES = [
  'Mechanic',
  'Panel Beater',
  'Car Rewire',
  'AC Technician',
  'Freezer/Fridge technician',
  'Electrician',
  'Car Wash',
  'Dry Cleaner',
  'Tailor',
  'Shoe Maker',
  'Plumber',
  'Painter',
  'Welder',
  'Printers',
  'Furniture',
  'Carpenter',
  'Vulcanizer',
  'Photographer',
  'Land Scraper'
];

const LOCATIONS_LIST = [
  'All Locations',
  'Lagos, NG',
  'Abuja, NG',
  'Port Harcourt, NG',
  'Ibadan, NG',
  'Kano, NG',
  'Enugu, NG',
  'Benin City, NG',
  'Asaba, NG'
];

export default function TalentsPage({ currentUser, onNavigate, onCheckout, onOpenAuthModal }: TalentsPageProps) {
  // Page mode: 'browse' (Public Directory) vs 'dashboard' (Talent Dashboard Workspace)
  const [activeTab, setActiveTab] = useState<'browse' | 'dashboard' | 'gigs'>('browse');

  // Typewriter effect state for hero section title
  const [tradeIndex, setTradeIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTrade = ARTISAN_TRADES[tradeIndex];
    const typingSpeed = isDeleting ? 40 : 90;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setTypewriterText(currentTrade.substring(0, typewriterText.length + 1));
        if (typewriterText.length + 1 === currentTrade.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setTypewriterText(currentTrade.substring(0, typewriterText.length - 1));
        if (typewriterText.length - 1 === 0) {
          setIsDeleting(false);
          setTradeIndex((prev) => (prev + 1) % ARTISAN_TRADES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, tradeIndex]);

  // Dashboard Workspace Sub-view: 'artisan' vs 'customer'
  const [dashboardWorkspace, setDashboardWorkspace] = useState<'artisan' | 'customer'>(
    currentUser?.role === 'Client' ? 'customer' : 'artisan'
  );

  // Proposal Pitch Modal state for Gigs
  const [pitchModalGig, setPitchModalGig] = useState<TalentGigOpportunity | null>(null);
  const [pitchPriceUsd, setPitchPriceUsd] = useState(150);
  const [pitchMessage, setPitchMessage] = useState('');
  const [isSubmittingPitch, setIsSubmittingPitch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');

  // Loaded database state
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [gigs, setGigs] = useState<TalentGigOpportunity[]>([]);
  const [inquiries, setInquiries] = useState<TalentInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal controls
  const [selectedTalentModal, setSelectedTalentModal] = useState<TalentProfile | null>(null);
  const [hireModalTalent, setHireModalTalent] = useState<TalentProfile | null>(null);
  const [isPostGigModalOpen, setIsPostGigModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Hire Inquiry Form state
  const [inquiryProjectTitle, setInquiryProjectTitle] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryBudgetUsd, setInquiryBudgetUsd] = useState(150);
  const [inquiryClientName, setInquiryClientName] = useState(currentUser?.displayName || '');
  const [inquiryClientEmail, setInquiryClientEmail] = useState(currentUser?.email || '');
  const [inquiryLocation, setInquiryLocation] = useState('Lagos, NG');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  // Post Gig Form state
  const [gigTitle, setGigTitle] = useState('');
  const [gigCategory, setGigCategory] = useState('Mechanic');
  const [gigLocation, setGigLocation] = useState('Lagos, NG');
  const [gigBudgetUsd, setGigBudgetUsd] = useState(200);
  const [gigType, setGigType] = useState<'Fixed Price' | 'Hourly' | 'Milestone'>('Fixed Price');
  const [gigUrgency, setGigUrgency] = useState<'Immediate (24-48 hrs)' | 'This Week' | 'Flexible'>('Immediate (24-48 hrs)');
  const [gigDescription, setGigDescription] = useState('');
  const [isSubmittingGig, setIsSubmittingGig] = useState(false);

  // Talent Dashboard - Edit Profile Form state
  const [myTalentProfile, setMyTalentProfile] = useState<Partial<TalentProfile>>({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    title: 'Master Auto Mechanic & Diagnostic Expert',
    category: 'Mechanic',
    location: 'Lagos, NG',
    hourlyRateUsd: 25,
    hourlyRateNgn: 15000,
    bio: '',
    skills: ['OBD Diagnostics', 'Engine Overhaul', 'Brake Systems'],
    availability: 'Available Now'
  });
  const [skillInput, setSkillInput] = useState('');

  // AI Generator Tool state for Dashboard
  const [aiPitchTopic, setAiPitchTopic] = useState('');
  const [aiGeneratedResult, setAiGeneratedResult] = useState('');
  const [isGeneratingAiPitch, setIsGeneratingAiPitch] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load database items on mount
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const fetchedTalents = await getTalents();
        setTalents(fetchedTalents);

        const fetchedGigs = await getGigOpportunities();
        setGigs(fetchedGigs);

        const fetchedInquiries = await getTalentInquiries(currentUser?.email);
        setInquiries(fetchedInquiries);

        // Check if current user has a talent profile
        if (currentUser) {
          const foundMyProfile = fetchedTalents.find(t => t.email.toLowerCase() === currentUser.email.toLowerCase());
          if (foundMyProfile) {
            setMyTalentProfile(foundMyProfile);
          } else {
            setMyTalentProfile({
              id: `tal-${Date.now()}`,
              name: currentUser.displayName || 'Pulzitive Talent',
              email: currentUser.email,
              title: 'Digital Professional & Specialist',
              category: 'Software & AI Development',
              location: 'Lagos, NG',
              hourlyRateUsd: 40,
              hourlyRateNgn: 24000,
              rating: 5.0,
              reviewsCount: 1,
              bio: currentUser.bio || 'Passionate digital specialist bridging local opportunities with verified expertise.',
              skills: ['Digital Strategy', 'Brand Governance', 'UI/UX'],
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
              verifiedBadge: true,
              availability: 'Available Now',
              portfolioLinks: [{ title: 'Pulzitive Profile', url: 'https://pulzitive.com' }],
              viewsCount: 120,
              completedJobsCount: 3,
              responseTimeMinutes: 15,
              isFeatured: true
            });
          }
        }
      } catch (err) {
        console.error('Error loading talents data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [currentUser]);

  // Filtered Talents list
  const filteredTalents = talents.filter(talent => {
    const matchesSearch = 
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All Categories' || talent.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Locations' || talent.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesVerified = !verifiedOnly || talent.verifiedBadge;
    const matchesAvailability = availabilityFilter === 'All' || talent.availability === availabilityFilter;

    return matchesSearch && matchesCategory && matchesLocation && matchesVerified && matchesAvailability;
  });

  // Handle Send Direct Inquiry / Hire Offer
  const handleSendInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hireModalTalent) return;
    if (!inquiryProjectTitle || !inquiryMessage) {
      triggerToast('Please complete all project details before submitting.');
      return;
    }

    setIsSubmittingInquiry(true);
    try {
      const newInquiry: TalentInquiry = {
        id: `inq-${Date.now()}`,
        talentId: hireModalTalent.id,
        clientName: inquiryClientName || 'Client',
        clientEmail: inquiryClientEmail || 'client@example.com',
        projectTitle: inquiryProjectTitle,
        message: inquiryMessage,
        offeredBudgetUsd: inquiryBudgetUsd,
        offeredBudgetNgn: inquiryBudgetUsd * 600,
        location: inquiryLocation,
        status: 'Pending',
        date: new Date().toISOString()
      };

      await sendTalentInquiry(newInquiry);
      setInquiries(prev => [newInquiry, ...prev]);
      setIsSubmittingInquiry(false);
      setHireModalTalent(null);
      setInquiryProjectTitle('');
      setInquiryMessage('');
      triggerToast(`Inquiry sent directly to ${hireModalTalent.name}! They will respond within ~${hireModalTalent.responseTimeMinutes} mins.`);
    } catch (err) {
      console.error(err);
      setIsSubmittingInquiry(false);
      triggerToast('Failed to send inquiry. Please try again.');
    }
  };

  // Handle Post New Gig Opportunity
  const handlePostGigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle || !gigDescription) {
      triggerToast('Please provide a title and description for the gig.');
      return;
    }

    setIsSubmittingGig(true);
    try {
      const newGig: TalentGigOpportunity = {
        id: `gig-${Date.now()}`,
        title: gigTitle,
        clientName: currentUser?.displayName || 'Verified Employer',
        clientEmail: currentUser?.email || 'employer@pulzitive.com',
        category: gigCategory,
        location: gigLocation,
        budgetUsd: gigBudgetUsd,
        budgetNgn: gigBudgetUsd * 600,
        type: gigType,
        urgency: gigUrgency,
        description: gigDescription,
        postedDate: new Date().toISOString(),
        proposalsCount: 0,
        distanceKm: 1.8
      };

      await postGigOpportunity(newGig);
      setGigs(prev => [newGig, ...prev]);
      setIsSubmittingGig(false);
      setIsPostGigModalOpen(false);
      setGigTitle('');
      setGigDescription('');
      triggerToast('Gig opportunity published! Local talents in your area have been notified.');
    } catch (err) {
      console.error(err);
      setIsSubmittingGig(false);
      triggerToast('Failed to post gig opportunity.');
    }
  };

  // Handle Save Talent Profile in Dashboard
  const handleSaveProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myTalentProfile.name || !myTalentProfile.title) {
      triggerToast('Please fill out your name and primary title.');
      return;
    }

    const fullProfile: TalentProfile = {
      id: myTalentProfile.id || `tal-${Date.now()}`,
      name: myTalentProfile.name || currentUser?.displayName || 'Talent Profile',
      email: myTalentProfile.email || currentUser?.email || 'talent@pulzitive.com',
      title: myTalentProfile.title || 'Specialist',
      category: myTalentProfile.category || 'Software & AI Development',
      location: myTalentProfile.location || 'Lagos, NG',
      hourlyRateUsd: Number(myTalentProfile.hourlyRateUsd) || 30,
      hourlyRateNgn: (Number(myTalentProfile.hourlyRateUsd) || 30) * 600,
      rating: myTalentProfile.rating || 5.0,
      reviewsCount: myTalentProfile.reviewsCount || 1,
      bio: myTalentProfile.bio || '',
      skills: myTalentProfile.skills || ['Digital Specialist'],
      avatarUrl: myTalentProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      verifiedBadge: true,
      availability: (myTalentProfile.availability as any) || 'Available Now',
      portfolioLinks: myTalentProfile.portfolioLinks || [{ title: 'Main Portfolio', url: 'https://pulzitive.com' }],
      viewsCount: (myTalentProfile.viewsCount || 0) + 12,
      completedJobsCount: myTalentProfile.completedJobsCount || 1,
      responseTimeMinutes: myTalentProfile.responseTimeMinutes || 10,
      isFeatured: true
    };

    await saveTalentProfile(fullProfile);
    setMyTalentProfile(fullProfile);
    setTalents(prev => {
      const idx = prev.findIndex(t => t.id === fullProfile.id || t.email === fullProfile.email);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = fullProfile;
        return copy;
      }
      return [fullProfile, ...prev];
    });
    setIsEditProfileModalOpen(false);
    triggerToast('Talent digital profile updated and promoted on local search!');
  };

  // Generate AI Pitch
  const handleGenerateAiPitch = () => {
    if (!aiPitchTopic) {
      triggerToast('Please enter a target role or client requirement.');
      return;
    }
    setIsGeneratingAiPitch(true);
    setTimeout(() => {
      const generated = `🚀 Hi there! As a verified Pulzitive ${aiPitchTopic} specialist based in ${myTalentProfile.location || 'Lagos'}, I bridge strategic execution with high-conversion outcomes. I specialize in delivering turnkey solutions with instant turnaround, mathematical precision, and full post-launch support. Let's connect and build your vision today!`;
      setAiGeneratedResult(generated);
      setIsGeneratingAiPitch(false);
      triggerToast('AI Pitch & Elevator Bio generated!');
    }, 1200);
  };

  // Update Inquiry Status
  const handleStatusUpdate = async (inqId: string, status: TalentInquiry['status']) => {
    await updateInquiryStatus(inqId, status);
    setInquiries(prev => prev.map(i => i.id === inqId ? { ...i, status } : i));
    triggerToast(`Inquiry status updated to ${status}.`);
  };

  // Submit Bid Proposal to Gig
  const handlePitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchModalGig) return;
    if (!pitchMessage) {
      triggerToast('Please write a short proposal pitch.');
      return;
    }
    setIsSubmittingPitch(true);
    try {
      const proposal: GigProposal = {
        id: `prop-${Date.now()}`,
        gigId: pitchModalGig.id,
        artisanId: myTalentProfile.id || `tal-${Date.now()}`,
        artisanName: myTalentProfile.name || currentUser?.displayName || 'Verified Artisan',
        artisanEmail: myTalentProfile.email || currentUser?.email || 'artisan@pulzitive.com',
        artisanTitle: myTalentProfile.title || 'Master Artisan',
        artisanCategory: myTalentProfile.category || pitchModalGig.category,
        proposedPriceUsd: pitchPriceUsd,
        proposedPriceNgn: pitchPriceUsd * 600,
        pitchMessage: pitchMessage,
        status: 'Pending',
        date: new Date().toISOString()
      };

      await submitGigProposal(proposal);

      setGigs(prev => prev.map(g => {
        if (g.id === pitchModalGig.id) {
          const existingProps = g.proposals || [];
          return {
            ...g,
            proposalsCount: (g.proposalsCount || 0) + 1,
            proposals: [proposal, ...existingProps]
          };
        }
        return g;
      }));

      setIsSubmittingPitch(false);
      setPitchModalGig(null);
      setPitchMessage('');
      triggerToast(`Pitch proposal submitted to ${pitchModalGig.clientName}! Check your Artisan Dashboard to track responses.`);
    } catch (err) {
      console.error(err);
      setIsSubmittingPitch(false);
      triggerToast('Failed to submit proposal pitch.');
    }
  };

  // Hire Artisan from Proposal (Customer View)
  const handleHireArtisanFromProposal = async (gigId: string, proposalId: string) => {
    try {
      const newInquiry = await hireArtisanForGig(gigId, proposalId);
      if (newInquiry) {
        setInquiries(prev => [newInquiry, ...prev]);
        setGigs(prev => prev.map(g => {
          if (g.id === gigId && g.proposals) {
            return {
              ...g,
              proposals: g.proposals.map(p => p.id === proposalId ? { ...p, status: 'Hired' } : p)
            };
          }
          return g;
        }));
        triggerToast(`Artisan hired successfully! Contract added to your active orders.`);
        onCheckout(newInquiry.offeredBudgetNgn, `Artisan Hire Deposit: ${newInquiry.projectTitle}`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to complete hiring action.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-emerald-400"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 text-slate-900 pt-10 pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_var(--tw-gradient-stops))] from-emerald-50/80 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center justify-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pulzitive Local Artisan & Trade Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight max-w-3xl">
            Hire & Connect with Verified
            <div className="mt-2 text-emerald-600 font-black min-h-[3.2rem] flex items-center justify-center gap-1.5 text-2xl sm:text-4xl lg:text-5xl">
              <span>{typewriterText}</span>
              <span className="animate-pulse text-emerald-500 font-light">|</span>
            </div>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Empowering verified local mechanics, panel beaters, electricians, plumbers, tailors, photographers, and artisans with digital visibility and location-matched opportunities.
          </p>

          {/* Quick Action Controls - Pulzitive Brand Blue Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (!currentUser && onOpenAuthModal) {
                  onOpenAuthModal();
                } else {
                  setIsPostGigModalOpen(true);
                }
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Post a Service Request / Opportunity</span>
            </button>
            
            {!currentUser ? (
              <button
                onClick={onOpenAuthModal}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <User className="w-4 h-4 text-white" />
                <span>List Your Artisan Profile</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!currentUser && onOpenAuthModal) {
                    onOpenAuthModal();
                  } else {
                    setActiveTab('dashboard');
                    setIsEditProfileModalOpen(true);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Edit My Artisan Profile</span>
              </button>
            )}
          </div>

          {/* MAIN PAGE TABS (BROWSE vs TALENTS DASHBOARD vs GIG FEED) */}
          <div className="flex items-center justify-center gap-2 mt-8 border-b border-slate-200 pb-0 overflow-x-auto w-full">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-5 py-3 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'browse'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/80 rounded-t-xl font-black'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Explore Artisans Directory</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{filteredTalents.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('gigs')}
              className={`px-5 py-3 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'gigs'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/80 rounded-t-xl font-black'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Service Opportunities Feed</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{gigs.length} active</span>
            </button>

            <button
              onClick={() => {
                if (!currentUser && onOpenAuthModal) {
                  onOpenAuthModal();
                  triggerToast('Please sign up or sign in to access your Talents & Client Dashboard.');
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className={`px-5 py-3 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/80 rounded-t-xl font-black'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Talents Dashboard</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-mono">Workspace & Tools</span>
            </button>
          </div>
        </div>
      </section>

      {/* BODY CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ========================================================================= */}
        {/* VIEW 1: BROWSE TALENTS DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            
            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-md space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, skill, trade..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer shadow-sm"
                  >
                    {TALENT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Location Dropdown */}
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3 pointer-events-none" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer shadow-sm"
                  >
                    {LOCATIONS_LIST.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Availability Dropdown */}
                <div className="relative">
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="All">All Availability States</option>
                    <option value="Available Now">Available Now</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract Only">Contract Only</option>
                  </select>
                </div>
              </div>

              {/* Toggles & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded border-slate-800 text-emerald-500 focus:ring-0 bg-slate-950 w-4 h-4 cursor-pointer"
                  />
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Only show Pulzitive Verified Digital Profiles</span>
                </label>

                <p className="text-slate-400 text-[11px] font-mono">
                  Showing <span className="text-emerald-400 font-bold">{filteredTalents.length}</span> verified talents in location radius
                </p>
              </div>
            </div>

            {/* Talents Directory Cards Grid */}
            {isLoading ? (
              <div className="text-center py-20 space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Syncing location directory & digital profiles...</p>
              </div>
            ) : filteredTalents.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
                <User className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No talents matched your current location or skill filter</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try clearing search keywords or switching location to "All Locations" to view talents across Nigeria and worldwide.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                    setSelectedLocation('All Locations');
                    setVerifiedOnly(false);
                    setAvailabilityFilter('All');
                  }}
                  className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTalents.map((talent) => (
                  <motion.div
                    key={talent.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-2xl group relative overflow-hidden"
                  >
                    {/* Top featured status */}
                    {talent.isFeatured && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Spotlight Talent
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Avatar & Header */}
                      <div className="flex items-start gap-3.5">
                        <div className="relative shrink-0">
                          <img
                            src={talent.avatarUrl}
                            alt={talent.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-800 group-hover:border-emerald-500/50 transition-colors"
                          />
                          {talent.verifiedBadge && (
                            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5" title="Verified Pulzitive Talent">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-black text-white truncate group-hover:text-emerald-400 transition-colors">
                              {talent.name}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-400 font-medium truncate">{talent.title}</p>
                          
                          {/* Location & Availability Badge */}
                          <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                            <span className="bg-white border border-slate-300 text-slate-900 font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs">
                              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{talent.location}</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                              talent.availability === 'Available Now'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {talent.availability}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bio Teaser */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {talent.bio}
                      </p>

                      {/* Rating & Rate Stats */}
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-white">{talent.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-500">({talent.reviewsCount} reviews)</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-emerald-400 text-xs">${talent.hourlyRateUsd}/hr</span>
                          <span className="text-[9px] text-slate-500 block">~₦{talent.hourlyRateNgn.toLocaleString()}/hr</span>
                        </div>
                      </div>

                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {talent.skills.slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="bg-white text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-lg border border-slate-300 shadow-xs">
                            {skill}
                          </span>
                        ))}
                        {talent.skills.length > 4 && (
                          <span className="bg-white text-slate-700 text-[10px] font-black font-mono px-2 py-1 rounded-lg border border-slate-300 shadow-xs">
                            +{talent.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTalentModal(talent)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-white" />
                        <span>Digital Kit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!currentUser && onOpenAuthModal) {
                            onOpenAuthModal();
                          } else {
                            setHireModalTalent(talent);
                          }
                        }}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Hire / Offer</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: LOCATION OPPORTUNITIES FEED (GIGS) */}
        {/* ========================================================================= */}
        {activeTab === 'gigs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <span>Live Client Gig Feed in Your Location</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Clients in Lagos, Abuja, and globally looking for verified creators, developers, and consultants.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!currentUser && onOpenAuthModal) {
                    onOpenAuthModal();
                  } else {
                    setIsPostGigModalOpen(true);
                  }
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Post a Opportunity</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gigs.map((gig) => (
                <div key={gig.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {gig.category}
                      </span>
                      <h3 className="text-sm font-bold text-white">{gig.title}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Posted by <span className="text-slate-200 font-semibold">{gig.clientName}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-emerald-400 block">${gig.budgetUsd}</span>
                      <span className="text-[9px] text-slate-500 block">~₦{gig.budgetNgn.toLocaleString()} NGN</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {gig.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 border-t border-slate-800 pt-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{gig.location}</span>
                        {gig.distanceKm && <span className="text-emerald-400 font-mono">({gig.distanceKm}km away)</span>}
                      </span>
                      <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold">
                        {gig.urgency}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (!currentUser && onOpenAuthModal) {
                          onOpenAuthModal();
                        } else {
                          setPitchModalGig(gig);
                          setPitchPriceUsd(gig.budgetUsd);
                        }
                      }}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md"
                    >
                      <Send className="w-3 h-3" />
                      <span>Submit Proposal Pitch</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: DEDICATED TALENTS & CUSTOMERS DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Workspace Selector Segmented Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-2 sm:p-2.5 rounded-2xl">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setDashboardWorkspace('artisan')}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    dashboardWorkspace === 'artisan'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>🛠️ Artisan / Talent Workspace</span>
                </button>
                <button
                  onClick={() => setDashboardWorkspace('customer')}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    dashboardWorkspace === 'customer'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>👤 Customer / Employer Workspace</span>
                </button>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-emerald-400 font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Firestore In-Sync</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SUB-WORKSPACE 1: ARTISAN / TALENT WORKSPACE */}
            {/* ========================================================================= */}
            {dashboardWorkspace === 'artisan' && (
              <div className="space-y-8">
                {/* Dashboard Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Artisan Talent Workspace</span>
                      </div>
                      <h2 className="text-2xl font-black text-white">
                        {myTalentProfile.name || currentUser?.displayName || 'Master Artisan Profile'}
                      </h2>
                      <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                        Category: <span className="text-slate-200 font-semibold">{myTalentProfile.category || 'Mechanic'}</span> • Rate: <span className="text-emerald-400 font-bold">${myTalentProfile.hourlyRateUsd || 25}/hr (~₦{(myTalentProfile.hourlyRateNgn || 15000).toLocaleString()} NGN)</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setIsEditProfileModalOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Edit Digital Profile</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Performance Stats Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-mono uppercase">Profile Visibility Score</span>
                      <Award className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">92%</span>
                      <span className="text-[10px] text-emerald-400 font-bold">+14% this week</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-emerald-400 h-full w-[92%] rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-mono uppercase">Location Search Views</span>
                      <Eye className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">{(myTalentProfile.viewsCount || 240).toLocaleString()}</span>
                      <span className="text-[10px] text-indigo-400 font-bold">Lagos & Regional</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Top keywords: {myTalentProfile.category}</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-mono uppercase">Client Inquiries</span>
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">{inquiries.length}</span>
                      <span className="text-[10px] text-amber-400 font-bold">~{myTalentProfile.responseTimeMinutes || 10}m response</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Avg conversion rate: 85%</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-mono uppercase">Direct Payout Rate</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">${myTalentProfile.hourlyRateUsd || 25} <span className="text-xs font-normal text-slate-400">/hr</span></span>
                    </div>
                    <p className="text-[10px] text-emerald-400 font-semibold">~₦{(myTalentProfile.hourlyRateNgn || 15000).toLocaleString()} NGN/hr</p>
                  </div>
                </div>

                {/* Dashboard Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Direct Client Inquiries Management (2 cols) */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          <span>Direct Customer Hiring Inquiries & Service Requests</span>
                        </h3>
                        <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
                          {inquiries.length} Records
                        </span>
                      </div>

                      {inquiries.length === 0 ? (
                        <div className="text-center py-10 space-y-2">
                          <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="text-xs text-slate-400">No customer inquiries received yet.</p>
                          <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                            Your profile is live in the Talent Directory. Customers seeking your trade specialty will send hire requests here.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {inquiries.map((inq) => (
                            <div key={inq.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <h4 className="text-xs font-bold text-white">{inq.projectTitle}</h4>
                                  <p className="text-[10px] text-slate-400">
                                    Customer: <span className="text-slate-200 font-semibold">{inq.clientName}</span> ({inq.clientEmail}) • {inq.location}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-black text-emerald-400">${inq.offeredBudgetUsd}</span>
                                  <span className="text-[9px] text-slate-500 block">~₦{inq.offeredBudgetNgn.toLocaleString()} NGN</span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
                                "{inq.message}"
                              </p>

                              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  inq.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                                  inq.status === 'In Progress' ? 'bg-indigo-500/20 text-indigo-400' :
                                  inq.status === 'Completed' ? 'bg-amber-500/20 text-amber-300' :
                                  'bg-slate-800 text-slate-400'
                                }`}>
                                  Status: {inq.status}
                                </span>

                                <div className="flex items-center gap-2">
                                  {inq.status === 'Pending' && (
                                    <button
                                      onClick={() => handleStatusUpdate(inq.id, 'Accepted')}
                                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] px-3 py-1 rounded-lg cursor-pointer"
                                    >
                                      Accept & Connect
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => {
                                      onCheckout(inq.offeredBudgetNgn, `Talent Contract Deposit: ${inq.projectTitle}`);
                                    }}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1"
                                  >
                                    <DollarSign className="w-3 h-3" />
                                    <span>Pay Deposit ($ & ₦)</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* My Submitted Proposals & Bids Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Send className="w-4 h-4 text-emerald-400" />
                          <span>My Submitted Proposals & Bids</span>
                        </h3>
                      </div>

                      {gigs.flatMap(g => (g.proposals || []).filter(p => p.artisanEmail === currentUser?.email || p.artisanName === myTalentProfile.name)).length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-4">You have not submitted proposal bids on customer gig opportunities yet. Visit the "Gig Feed" tab to pitch your services!</p>
                      ) : (
                        <div className="space-y-3">
                          {gigs.flatMap(g => (g.proposals || []).filter(p => p.artisanEmail === currentUser?.email || p.artisanName === myTalentProfile.name)).map(prop => (
                            <div key={prop.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs">
                              <div>
                                <span className="text-[10px] font-mono text-emerald-400 block font-bold">Proposed Rate: ${prop.proposedPriceUsd} (~₦{prop.proposedPriceNgn.toLocaleString()} NGN)</span>
                                <p className="text-slate-200 font-medium mt-0.5">"{prop.pitchMessage}"</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                prop.status === 'Hired' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {prop.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Promotional Spotlight & Visibility Boost Engine */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span>Promotional Boost & Verified Badge</span>
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Amplify your visibility by up to +350% across local search radius in Lagos, Abuja & Regional areas.
                          </p>
                        </div>

                        <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2.5 py-1 rounded-lg font-bold border border-amber-500/30">
                          Active Spotlight
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between text-xs font-bold text-white">
                            <span>Regional Search Index</span>
                            <span className="text-emerald-400">Active</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Ranked top in local directory search when customers filter by {myTalentProfile.category || 'Mechanic'}.
                          </p>
                          <button
                            onClick={() => triggerToast('Promotional boost refreshed! Ranked top in local search.')}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-xs font-bold py-1.5 rounded-lg text-white cursor-pointer shadow-sm"
                          >
                            Refresh Search Index
                          </button>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between text-xs font-bold text-white">
                            <span>Verified Badge Certification</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Pulzitive Trust Seal displayed on your profile, guaranteeing client satisfaction and quality control.
                          </p>
                          <span className="inline-block text-[10px] text-emerald-400 font-bold font-mono">
                            ✓ Pulzitive Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI Pitch & Bio Assistant Toolkit */}
                  <div className="space-y-6">
                    {/* AI Elevator Pitch Generator */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 text-white">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm font-bold">AI Elevator Pitch & Bio Writer</h3>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Instantly craft compelling elevator proposals and customer pitches tailored to specific job requirements.
                      </p>

                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Project / Service Requirement</label>
                        <input
                          type="text"
                          value={aiPitchTopic}
                          onChange={(e) => setAiPitchTopic(e.target.value)}
                          placeholder="e.g. Master Auto Mechanic for Engine & OBD Overhaul"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                        />
                      </div>

                      <button
                        onClick={handleGenerateAiPitch}
                        disabled={isGeneratingAiPitch}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isGeneratingAiPitch ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Synthesizing Pitch...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Generate AI Proposal Pitch</span>
                          </>
                        )}
                      </button>

                      {aiGeneratedResult && (
                        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span className="font-bold text-emerald-400">Generated Pitch:</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(aiGeneratedResult);
                                triggerToast('Pitch copied to clipboard!');
                              }}
                              className="text-slate-300 hover:text-white underline cursor-pointer"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed italic">
                            {aiGeneratedResult}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Portfolio Showcase Quick Links */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-400" />
                        <span>My Work & Trade Showcase</span>
                      </h3>

                      <div className="space-y-2">
                        {(myTalentProfile.portfolioLinks || []).map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-200 hover:border-indigo-500/50 transition-colors"
                          >
                            <span className="font-medium truncate">{link.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          </a>
                        ))}
                      </div>

                      <button
                        onClick={() => setIsEditProfileModalOpen(true)}
                        className="w-full text-center text-xs font-bold text-emerald-400 hover:underline pt-1 cursor-pointer"
                      >
                        + Add Trade Portfolio Sample
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SUB-WORKSPACE 2: CUSTOMER / EMPLOYER WORKSPACE */}
            {/* ========================================================================= */}
            {dashboardWorkspace === 'customer' && (
              <div className="space-y-8">
                {/* Customer Banner Header */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Customer / Employer Portal</span>
                      </div>
                      <h2 className="text-2xl font-black text-white">
                        {currentUser?.displayName || 'Customer Service Hub'}
                      </h2>
                      <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                        Track your posted service opportunities, review incoming artisan proposal pitches, hire verified local professionals, and process payments with dual USD ($) & NGN (₦) pricing.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => {
                          if (!currentUser && onOpenAuthModal) {
                            onOpenAuthModal();
                          } else {
                            setIsPostGigModalOpen(true);
                          }
                        }}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Post New Service Opportunity</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Metrics Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-mono uppercase">Posted Opportunities</span>
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-2xl font-black text-white">{gigs.length}</span>
                    <p className="text-[10px] text-emerald-400 font-semibold">Active in local feed</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-mono uppercase">Artisan Bids Received</span>
                      <Send className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-2xl font-black text-white">
                      {gigs.reduce((acc, g) => acc + (g.proposalsCount || (g.proposals ? g.proposals.length : 0)), 0)}
                    </span>
                    <p className="text-[10px] text-indigo-400 font-semibold">Ready for review & hiring</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-mono uppercase">Direct Orders Sent</span>
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-2xl font-black text-white">{inquiries.length}</span>
                    <p className="text-[10px] text-amber-400 font-semibold">Direct artisan hires</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-mono uppercase">Total Service Budget</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-2xl font-black text-white">
                      ${inquiries.reduce((s, i) => s + i.offeredBudgetUsd, 0) || 350}
                    </span>
                    <p className="text-[10px] text-emerald-400 font-semibold">
                      ~₦{((inquiries.reduce((s, i) => s + i.offeredBudgetNgn, 0) || 210000)).toLocaleString()} NGN
                    </p>
                  </div>
                </div>

                {/* Customer Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left 2 Cols: Posted Opportunities & Bids Received */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-emerald-400" />
                          <span>My Posted Service Opportunities & Incoming Artisan Bids</span>
                        </h3>
                        <button
                          onClick={() => {
                            if (!currentUser && onOpenAuthModal) {
                              onOpenAuthModal();
                            } else {
                              setIsPostGigModalOpen(true);
                            }
                          }}
                          className="text-xs text-emerald-400 hover:underline font-bold"
                        >
                          + Post Opportunity
                        </button>
                      </div>

                      {gigs.length === 0 ? (
                        <div className="text-center py-10 space-y-2">
                          <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="text-xs text-slate-400">You have not posted any service opportunities yet.</p>
                          <button
                            onClick={() => {
                              if (!currentUser && onOpenAuthModal) {
                                onOpenAuthModal();
                              } else {
                                setIsPostGigModalOpen(true);
                              }
                            }}
                            className="bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                          >
                            Post Your First Service Request
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {gigs.map(gig => (
                            <div key={gig.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                                    {gig.category}
                                  </span>
                                  <h4 className="text-sm font-bold text-white mt-1">{gig.title}</h4>
                                  <p className="text-[11px] text-slate-400 mt-0.5">{gig.location} • Urgency: {gig.urgency}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-black text-white">${gig.budgetUsd}</span>
                                  <span className="text-[9px] text-emerald-400 block font-mono">~₦{gig.budgetNgn.toLocaleString()} NGN</span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800/60">
                                {gig.description}
                              </p>

                              {/* Proposal pitches received on this gig */}
                              <div className="border-t border-slate-800/80 pt-3 space-y-3">
                                <div className="flex items-center justify-between text-xs font-bold text-white">
                                  <span>Artisan Proposal Pitches Received ({(gig.proposals || []).length})</span>
                                  <span className="text-[10px] text-slate-400 font-normal">Review pitches and click Hire to initiate job contract</span>
                                </div>

                                {(!gig.proposals || gig.proposals.length === 0) ? (
                                  <p className="text-xs text-slate-500 italic">No artisan pitches submitted on this request yet. Local artisans are reviewing the feed.</p>
                                ) : (
                                  <div className="space-y-2.5">
                                    {gig.proposals.map(prop => (
                                      <div key={prop.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">{prop.artisanName}</span>
                                            <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase">{prop.artisanCategory}</span>
                                          </div>
                                          <p className="text-slate-300 italic text-[11px]">"{prop.pitchMessage}"</p>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                          <div className="text-right">
                                            <span className="text-xs font-black text-emerald-400">${prop.proposedPriceUsd}</span>
                                            <span className="text-[9px] text-slate-400 block">~₦{prop.proposedPriceNgn.toLocaleString()} NGN</span>
                                          </div>

                                          {prop.status === 'Hired' ? (
                                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-lg border border-emerald-500/30">
                                              ✓ Hired
                                            </span>
                                          ) : (
                                            <button
                                              onClick={() => handleHireArtisanFromProposal(gig.id, prop.id)}
                                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] px-3.5 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-md"
                                            >
                                              <CheckCircle2 className="w-3.5 h-3.5" />
                                              <span>Hire & Pay Deposit</span>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Direct Hire Requests Sent */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-indigo-400" />
                          <span>Direct Hire Contracts & Active Artisan Orders</span>
                        </h3>
                        <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
                          {inquiries.length} Active
                        </span>
                      </div>

                      {inquiries.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No direct hire requests initiated yet. Browse the Talent Directory to message artisans directly!</p>
                      ) : (
                        <div className="space-y-3">
                          {inquiries.map(inq => (
                            <div key={inq.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <div>
                                  <h4 className="font-bold text-white">{inq.projectTitle}</h4>
                                  <p className="text-[10px] text-slate-400">Artisan Assigned: <span className="text-emerald-400 font-semibold">{inq.talentName}</span></p>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-emerald-400 text-xs">${inq.offeredBudgetUsd}</span>
                                  <span className="text-[9px] text-slate-400 block">~₦{inq.offeredBudgetNgn.toLocaleString()} NGN</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[10px]">
                                <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold">
                                  Status: {inq.status}
                                </span>

                                <button
                                  onClick={() => onCheckout(inq.offeredBudgetNgn, `Artisan Contract Deposit: ${inq.projectTitle}`)}
                                  className="bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-lg cursor-pointer"
                                >
                                  Pay Deposit ($ & ₦)
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Milestone Tracker & Billing */}
                  <div className="space-y-6">
                    {/* Live Progress Pipeline */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>Artisan Service Progress Pipeline</span>
                      </h3>

                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <p className="font-bold text-white">1. Requirement & Scope Posted</p>
                            <p className="text-[10px] text-slate-400">Budget defined in USD & NGN</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-indigo-500/30">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                          <div>
                            <p className="font-bold text-white">2. Proposal Bids & Verification</p>
                            <p className="text-[10px] text-slate-400">Artisan credential review</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <p className="font-bold text-white">3. Job Execution & Field Service</p>
                            <p className="text-[10px] text-slate-400">On-site work or diagnostic repair</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                          <div>
                            <p className="font-bold text-white">4. Signoff & Final Payment Release</p>
                            <p className="text-[10px] text-slate-400">Escrow funds released to artisan</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spend & Invoice Summary */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span>Customer Billing & Invoices</span>
                      </h3>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex justify-between text-slate-300 font-bold">
                          <span>Total Invoiced</span>
                          <span className="text-emerald-400">${inquiries.reduce((s, i) => s + i.offeredBudgetUsd, 0) || 350}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Equivalent: ~₦{((inquiries.reduce((s, i) => s + i.offeredBudgetNgn, 0) || 210000)).toLocaleString()} NGN</p>
                      </div>

                      <button
                        onClick={() => triggerToast('Official PDF Invoice generated and ready for download.')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 rounded-xl cursor-pointer shadow-sm"
                      >
                        Download PDF Statement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: TALENT DIGITAL KIT VIEW */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedTalentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedTalentModal(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 border-b border-slate-800 pb-6">
                <img
                  src={selectedTalentModal.avatarUrl}
                  alt={selectedTalentModal.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/50 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{selectedTalentModal.name}</h2>
                    {selectedTalentModal.verifiedBadge && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Pulzitive Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 font-semibold">{selectedTalentModal.title}</p>
                  <p className="text-xs font-bold text-slate-800 bg-white border border-slate-300 px-3 py-1 rounded-xl inline-flex items-center gap-1.5 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {selectedTalentModal.location}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Professional Overview</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  {selectedTalentModal.bio}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Verified Skill Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTalentModal.skills.map((s, i) => (
                    <span key={i} className="bg-white text-slate-900 text-xs px-3 py-1.5 rounded-xl font-bold border border-slate-300 shadow-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Portfolio & Case Studies</h4>
                <div className="space-y-2">
                  {selectedTalentModal.portfolioLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-emerald-400 hover:border-emerald-500/50"
                    >
                      <span className="font-bold">{link.title}</span>
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xl font-black text-emerald-400">${selectedTalentModal.hourlyRateUsd}/hr</span>
                  <span className="text-xs text-slate-400 block">~₦{selectedTalentModal.hourlyRateNgn.toLocaleString()} NGN</span>
                </div>

                <button
                  onClick={() => {
                    setHireModalTalent(selectedTalentModal);
                    setSelectedTalentModal(null);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl cursor-pointer"
                >
                  Send Hire Offer / Request Quote
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: DIRECT HIRE OFFER / INQUIRY FORM */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {hireModalTalent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setHireModalTalent(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Direct Talent Connection</span>
                <h3 className="text-lg font-black text-white">Hire Offer for {hireModalTalent.name}</h3>
                <p className="text-xs text-slate-400">{hireModalTalent.title} • {hireModalTalent.location}</p>
              </div>

              <form onSubmit={handleSendInquirySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Project / Service Request Title</label>
                  <input
                    type="text"
                    value={inquiryProjectTitle}
                    onChange={(e) => setInquiryProjectTitle(e.target.value)}
                    placeholder="e.g. Engine OBD Diagnostics & Overhaul Request"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Offered Budget ($ USD)</label>
                    <input
                      type="number"
                      value={inquiryBudgetUsd}
                      onChange={(e) => setInquiryBudgetUsd(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono shadow-sm"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">~₦{(inquiryBudgetUsd * 600).toLocaleString()} NGN</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Your Location</label>
                    <input
                      type="text"
                      value={inquiryLocation}
                      onChange={(e) => setInquiryLocation(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Project Details & Expectations</label>
                  <textarea
                    rows={4}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Describe scope, required deliverables, and timeline..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Contact Email</label>
                  <input
                    type="email"
                    value={inquiryClientEmail}
                    onChange={(e) => setInquiryClientEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingInquiry}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmittingInquiry ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Offer to {hireModalTalent.name}...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Direct Hire Offer</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: POST A GIG OPPORTUNITY FORM */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPostGigModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setIsPostGigModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Employer Portal</span>
                <h3 className="text-lg font-black text-white">Post an Opportunity for Local Talents</h3>
                <p className="text-xs text-slate-400">Broadcast your project brief directly to verified talents in your area.</p>
              </div>

              <form onSubmit={handlePostGigSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Opportunity / Service Request Title</label>
                  <input
                    type="text"
                    value={gigTitle}
                    onChange={(e) => setGigTitle(e.target.value)}
                    placeholder="e.g. Urgent Hydraulic Brake & Suspension Repair for SUV"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category / Trade</label>
                    <select
                      value={gigCategory}
                      onChange={(e) => setGigCategory(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    >
                      {TALENT_CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Location / Target Area</label>
                    <input
                      type="text"
                      value={gigLocation}
                      onChange={(e) => setGigLocation(e.target.value)}
                      placeholder="e.g. Ikeja, Lagos"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Budget ($ USD)</label>
                    <input
                      type="number"
                      value={gigBudgetUsd}
                      onChange={(e) => setGigBudgetUsd(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono shadow-sm"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">~₦{(gigBudgetUsd * 600).toLocaleString()} NGN</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Urgency</label>
                    <select
                      value={gigUrgency}
                      onChange={(e) => setGigUrgency(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    >
                      <option value="Immediate (24-48 hrs)">Immediate (24-48 hrs)</option>
                      <option value="This Week">This Week</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Description & Deliverables</label>
                  <textarea
                    rows={4}
                    value={gigDescription}
                    onChange={(e) => setGigDescription(e.target.value)}
                    placeholder="Provide details about scope, deliverables, and location expectations..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingGig}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmittingGig ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Broadcasting Opportunity...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Publish Opportunity to Local Talent Network</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 4: EDIT MY TALENT DIGITAL PROFILE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEditProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Artisan Presence Editor</span>
                <h3 className="text-lg font-black text-white">Update Artisan Profile</h3>
                <p className="text-xs text-slate-400">Optimize how local customers find and hire your trade services in your area.</p>
              </div>

              <form onSubmit={handleSaveProfileSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Name / Brand Name</label>
                  <input
                    type="text"
                    value={myTalentProfile.name || ''}
                    onChange={(e) => setMyTalentProfile({ ...myTalentProfile, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Primary Trade Headline / Specialty</label>
                  <input
                    type="text"
                    value={myTalentProfile.title || ''}
                    onChange={(e) => setMyTalentProfile({ ...myTalentProfile, title: e.target.value })}
                    placeholder="e.g. Master Automobile Diagnostic Mechanic & Engine Rebuilder"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category / Trade</label>
                    <select
                      value={myTalentProfile.category || 'Mechanic'}
                      onChange={(e) => setMyTalentProfile({ ...myTalentProfile, category: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    >
                      {TALENT_CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Location</label>
                    <input
                      type="text"
                      value={myTalentProfile.location || ''}
                      onChange={(e) => setMyTalentProfile({ ...myTalentProfile, location: e.target.value })}
                      placeholder="e.g. Ikeja, Lagos"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Hourly Rate ($ USD)</label>
                    <input
                      type="number"
                      value={myTalentProfile.hourlyRateUsd || 25}
                      onChange={(e) => setMyTalentProfile({ ...myTalentProfile, hourlyRateUsd: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono shadow-sm"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">~₦{((myTalentProfile.hourlyRateUsd || 25) * 600).toLocaleString()} NGN/hr</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Availability Status</label>
                    <select
                      value={myTalentProfile.availability || 'Available Now'}
                      onChange={(e) => setMyTalentProfile({ ...myTalentProfile, availability: e.target.value as any })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    >
                      <option value="Available Now">Available Now</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract Only">Contract Only</option>
                      <option value="Busy">Busy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Trade Overview & Services</label>
                  <textarea
                    rows={4}
                    value={myTalentProfile.bio || ''}
                    onChange={(e) => setMyTalentProfile({ ...myTalentProfile, bio: e.target.value })}
                    placeholder="Describe your artisan expertise, workshop tools, and guarantee..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save & Promote Artisan Profile</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 5: SUBMIT PROPOSAL PITCH TO CUSTOMER GIG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {pitchModalGig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setPitchModalGig(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded">
                  Pitch Proposal to Customer
                </span>
                <h3 className="text-lg font-black text-white">{pitchModalGig.title}</h3>
                <p className="text-xs text-slate-400">
                  Client: <span className="text-slate-200 font-semibold">{pitchModalGig.clientName}</span> • Offered Budget: <span className="text-emerald-400 font-bold">${pitchModalGig.budgetUsd} (~₦{pitchModalGig.budgetNgn.toLocaleString()} NGN)</span>
                </p>
              </div>

              <form onSubmit={handlePitchSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Proposed Service Budget ($ USD)</label>
                  <input
                    type="number"
                    value={pitchPriceUsd}
                    onChange={(e) => setPitchPriceUsd(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Equivalent Rate: ~₦{(pitchPriceUsd * 600).toLocaleString()} NGN
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Proposal Pitch & Execution Guarantee</label>
                  <textarea
                    rows={4}
                    value={pitchMessage}
                    onChange={(e) => setPitchMessage(e.target.value)}
                    placeholder="Briefly explain your experience, diagnostic approach, and how quickly you can complete this service..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPitch}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isSubmittingPitch ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transmitting Proposal...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Proposal to {pitchModalGig.clientName}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
