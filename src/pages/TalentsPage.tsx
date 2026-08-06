/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Sparkles, Star, ShieldCheck, CheckCircle2, Briefcase, Clock, 
  DollarSign, Filter, Plus, Send, Eye, Award, TrendingUp, ChevronRight, User, 
  ExternalLink, SlidersHorizontal, Zap, X, MessageSquare, Globe, 
  RefreshCw, FileText, Check, AlertCircle, ThumbsUp, Lock, Share2, Layers,
  Wrench, Laptop, ArrowLeft, Download, CheckCircle, GraduationCap, BookOpen, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAvatarIcon } from '../components/UserAvatarIcon';
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

export const ARTISAN_CATEGORIES = [
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

export const DIGITAL_SERVICE_CATEGORIES = [
  'Software Engineer & Full-Stack Developer',
  'UI/UX & Product Designer',
  'SEO & Technical Search Specialist',
  'Digital Marketing & PPC Strategist',
  'Graphic Designer & Brand Specialist',
  'Content Writer & Copywriter',
  'Social Media Manager & Growth Lead',
  'Video Editor & Motion Specialist',
  'Data Analyst & BI Specialist',
  'AI & Automation Engineer'
];

export const ALL_TALENT_TRADES = [
  ...ARTISAN_CATEGORIES,
  ...DIGITAL_SERVICE_CATEGORIES
];

export function getTalentSector(category: string): 'Artisans / Technicians' | 'Digital Services Providers' {
  if (
    DIGITAL_SERVICE_CATEGORIES.includes(category) || 
    category.toLowerCase().includes('software') || 
    category.toLowerCase().includes('digital') || 
    category.toLowerCase().includes('designer') || 
    category.toLowerCase().includes('seo') || 
    category.toLowerCase().includes('writer') || 
    category.toLowerCase().includes('data') || 
    category.toLowerCase().includes('ai') ||
    (category.toLowerCase().includes('engineer') && !category.toLowerCase().includes('pipelining'))
  ) {
    return 'Digital Services Providers';
  }
  return 'Artisans / Technicians';
}

export function getTalentShowcaseContent(talent: TalentProfile) {
  const isDigital = getTalentSector(talent.category) === 'Digital Services Providers';
  
  // Custom case studies tailored to their category and skills
  let caseStudies = [
    {
      id: 'cs-1',
      title: isDigital 
        ? `Enterprise ${talent.category} Architecture & Implementation`
        : `High-Precision Commercial ${talent.category} & Safety Overhaul`,
      clientType: 'Commercial Corporate Client',
      location: talent.location,
      duration: '4 Days Completed',
      scope: 'Full Scope Service Delivery',
      challenge: isDigital
        ? 'Legacy digital system with high latency, poor conversion paths, unoptimized mobile performance, and outdated design components.'
        : 'Severe equipment downtime, safety compliance issues, aging infrastructure, and non-compliance with regional standards.',
      solution: isDigital
        ? `Built scalable modern solution using ${talent.skills.slice(0, 3).join(', ')}, integrated automated workflows, and optimized latency.`
        : `Deployed specialized tools, replaced worn components with OEM parts, executed certified PPR/conduit wiring, and calibrated safety controls.`,
      result: isDigital
        ? '3.8x ROAS increase, +280% user engagement growth, and 100% cloud reliability.'
        : 'Zero downtime recorded, 100% safety compliance certification issued, and 40% reduction in maintenance costs.',
      image: talent.avatarUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      verified: true,
      url: undefined as string | undefined
    },
    {
      id: 'cs-2',
      title: isDigital
        ? `Direct-Response Growth & ${talent.skills[1] || 'Optimization'}`
        : `Emergency Rapid-Response ${talent.skills[1] || 'Repair & Tune-Up'} Project`,
      clientType: 'High-Growth Business',
      location: 'Victoria Island, Lagos',
      duration: '48 Hours Turnaround',
      scope: 'Urgent On-Site / Remote Delivery',
      challenge: 'High-urgency request requiring zero downtime, rapid execution, and rigorous quality assurance.',
      solution: `Mobilized expert team and specialized tools, executed multi-stage testing, and applied ${talent.skills.slice(0, 2).join(' & ')} best practices.`,
      result: 'Delivered 12 hours ahead of schedule with 5-Star customer rating and zero defect logs.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
      verified: true,
      url: undefined as string | undefined
    },
    {
      id: 'cs-3',
      title: `Custom ${talent.title} Bespoke Execution`,
      clientType: 'Private VIP Client',
      location: 'Ikeja, Lagos',
      duration: '1 Week Execution',
      scope: 'Turnkey Contract Delivery',
      challenge: 'Complex custom specifications with strict tolerance limits and premium finishing requirements.',
      solution: `Custom designed and hand-crafted execution utilizing premium materials and calibrated diagnostic testing.`,
      result: 'Passed all client inspection milestones with distinction and long-term service agreement.',
      image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop',
      verified: true,
      url: undefined as string | undefined
    }
  ];

  // Also include talent's custom portfolioLinks if available
  if (talent.portfolioLinks && talent.portfolioLinks.length > 0) {
    const extraLinks = talent.portfolioLinks.map((p, idx) => ({
      id: `cs-link-${idx}`,
      title: p.title,
      clientType: 'Verified Live Portfolio Project',
      location: talent.location,
      duration: 'Live Project Link',
      scope: 'Live Showcase Case Study',
      challenge: `Specialized ${talent.category} deliverable showcasing ${talent.skills.join(', ')}.`,
      solution: `Executed end-to-end with verified standards and customer satisfaction.`,
      result: 'Verified live link on platform.',
      image: idx % 2 === 0 
        ? 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=600&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
      verified: true,
      url: p.url
    }));
    caseStudies = [...extraLinks, ...caseStudies];
  }

  const serviceOfferings = [
    {
      name: `Full ${talent.category} Diagnostic & Audit`,
      time: 'Same Day Delivery',
      guarantee: '100% Quality Inspected',
      description: `Comprehensive inspection, fault identification, and initial technical report for ${talent.category} scope.`
    },
    {
      name: `Turnkey ${talent.skills[0] || 'Implementation'} Service`,
      time: '1 - 3 Business Days',
      guarantee: 'Verified Pulzitive Warranty',
      description: `End-to-end service execution with high-grade components/tools and post-installation support.`
    },
    {
      name: `Emergency On-Demand ${talent.skills[1] || 'Maintenance'}`,
      time: '2 Hour Response Guarantee',
      guarantee: '24/7 Availability',
      description: `Rapid dispatch and immediate technical intervention for high-priority service requests.`
    }
  ];

  const reviews = [
    {
      id: 'rev-1',
      clientName: 'Adebayo O.',
      company: 'Lagos Enterprise Group',
      rating: 5.0,
      date: '2 weeks ago',
      comment: `${talent.name} is an absolute master at ${talent.category}! The work was executed cleanly, on time, and exceeded our expectations. Highly recommended!`
    },
    {
      id: 'rev-2',
      clientName: 'Dr. Chinedu E.',
      company: 'Private Facility',
      rating: 5.0,
      date: '1 month ago',
      comment: `Extremely professional and knowledgeable. Solved our ${talent.skills[0] || 'technical'} issue in record time with clear communication throughout.`
    },
    {
      id: 'rev-3',
      clientName: 'Fatima B.',
      company: 'Abuja Residential Hub',
      rating: 5.0,
      date: '2 months ago',
      comment: `Punctual, polite, and top-tier quality. The Pulzitive verification gives complete peace of mind.`
    }
  ];

  return { isDigital, caseStudies, serviceOfferings, reviews };
}

const FEATURED_TITLES = [
  'Software Engineers & Full-Stack Developers',
  'Master Auto Mechanics & Diagnostic Experts',
  'UI/UX & Product Designers',
  'SEO & Technical Search Specialists',
  'Certified Electricians & Solar Installers',
  'Digital Marketing & PPC Strategists',
  'Master Plumbers & Pipelining Engineers',
  'Graphic Designers & Brand Specialists',
  'Bespoke Tailors & Fashion Designers',
  'Content Writers & Conversion Copywriters',
  'Event Photographers & Drone Pilots',
  'AI & Automation Engineers'
];

const LOCATIONS_LIST = [
  'All Locations',
  'Global / Remote',
  'North America (US & Canada)',
  'United Kingdom & Europe',
  'Asia Pacific & Middle East',
  'Lagos, NG',
  'Abuja, NG',
  'London, UK',
  'New York, USA',
  'Toronto, CA',
  'Dubai, UAE',
  'Nairobi, KE',
  'Johannesburg, ZA'
];

export default function TalentsPage({ currentUser, onNavigate, onCheckout, onOpenAuthModal }: TalentsPageProps) {
  // Page mode: 'browse' (Public Directory) vs 'dashboard' (Talent Dashboard Workspace)
  const [activeTab, setActiveTab] = useState<'browse' | 'dashboard' | 'gigs'>('browse');

  // Typewriter effect state for hero section title
  const [tradeIndex, setTradeIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTrade = FEATURED_TITLES[tradeIndex];
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
          setTradeIndex((prev) => (prev + 1) % FEATURED_TITLES.length);
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
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<'All Sectors' | 'Artisans / Technicians' | 'Digital Services Providers'>('All Sectors');
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
  const [showcaseTalent, setShowcaseTalent] = useState<TalentProfile | null>(null);
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
              avatarUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=400&auto=format&fit=crop',
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

    const talentSector = getTalentSector(talent.category);
    const matchesSector = selectedSector === 'All Sectors' || talentSector === selectedSector;
    const matchesCategory = selectedCategory === 'All Categories' || talent.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Locations' || talent.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesVerified = !verifiedOnly || talent.verifiedBadge;
    const matchesAvailability = availabilityFilter === 'All' || talent.availability === availabilityFilter;

    return matchesSearch && matchesSector && matchesCategory && matchesLocation && matchesVerified && matchesAvailability;
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
      avatarUrl: myTalentProfile.avatarUrl || 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=400&auto=format&fit=crop',
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight max-w-3xl">
            Hire & Connect with Verified
            <div className="mt-2 text-emerald-600 font-black min-h-[3.2rem] flex items-center justify-center gap-1.5 text-2xl sm:text-4xl lg:text-5xl">
              <span>{typewriterText}</span>
              <span className="animate-pulse text-emerald-500 font-light">|</span>
            </div>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Empowering verified local artisans, skilled technicians, and digital service providers with location-matched opportunities and global visibility.
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
              <span>Post Service</span>
            </button>
            
            {!currentUser ? (
              <button
                onClick={onOpenAuthModal}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <User className="w-4 h-4 text-white" />
                <span>List Your Expertise</span>
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
                <span>Edit My Talent Profile</span>
              </button>
            )}
          </div>

          {/* MAIN PAGE TABS (BROWSE vs TALENTS DASHBOARD vs GIG FEED) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 mt-6 border-b border-slate-200 pb-0 overflow-x-auto w-full max-w-full px-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'browse'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/80 rounded-t-xl font-black'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Talents & Opportunities Feed</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{filteredTalents.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('gigs')}
              className={`px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
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
              className={`px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
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
              
              {/* Primary Sector Tabs */}
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 overflow-x-auto">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Sector:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSector('All Sectors');
                      setSelectedCategory('All Categories');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      selectedSector === 'All Sectors'
                        ? 'bg-slate-900 text-white font-black shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Sectors
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSector('Artisans / Technicians');
                      setSelectedCategory('All Categories');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                      selectedSector === 'Artisans / Technicians'
                        ? 'bg-amber-600 text-white font-black shadow-sm'
                        : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    <span>Artisans & Technicians</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSector('Digital Services Providers');
                      setSelectedCategory('All Categories');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                      selectedSector === 'Digital Services Providers'
                        ? 'bg-blue-600 text-white font-black shadow-sm'
                        : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-blue-500" />
                    <span>Digital Services Providers</span>
                  </button>
                </div>
              </div>

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
                    <option value="All Categories">All Sub-Categories</option>
                    {(selectedSector === 'All Sectors' || selectedSector === 'Artisans / Technicians') && (
                      <optgroup label="Artisans & Technicians">
                        {ARTISAN_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </optgroup>
                    )}
                    {(selectedSector === 'All Sectors' || selectedSector === 'Digital Services Providers') && (
                      <optgroup label="Digital Services Providers">
                        {DIGITAL_SERVICE_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </optgroup>
                    )}
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
                  Try clearing search keywords or switching location filter to "All Locations" or "Global / Remote" to view talents worldwide.
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
                      {/* Sector Badge */}
                      <div>
                        {getTalentSector(talent.category) === 'Digital Services Providers' ? (
                          <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                            <Laptop className="w-3 h-3 text-blue-400 shrink-0" />
                            <span>Digital Services Provider</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                            <Wrench className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>Artisan & Technician</span>
                          </span>
                        )}
                      </div>

                      {/* Avatar & Header */}
                      <div className="flex items-start gap-3.5">
                        <UserAvatarIcon
                          name={talent.name}
                          category={talent.category}
                          size="md"
                          verified={talent.verifiedBadge}
                          className="border-2 border-slate-800 group-hover:border-emerald-500/50 transition-colors"
                        />

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

                      {/* Rating & Verified Status */}
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-white">{talent.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-500">({talent.reviewsCount} reviews)</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase">
                            Verified Talent
                          </span>
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
                    <div className="pt-4 mt-4 border-t border-slate-200 flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedTalentModal(talent)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] py-2 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                        title="View Digital Kit"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>Digital Kit</span>
                      </button>

                      <button
                        onClick={() => setShowcaseTalent(talent)}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-[11px] py-2 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                        title="View Showcase & Portfolio Single Page"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        <span>Portfolio</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!currentUser && onOpenAuthModal) {
                            onOpenAuthModal();
                          } else {
                            setHireModalTalent(talent);
                          }
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md active:scale-95"
                        title="Send Hire/Quote Request"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>Hire/Quote</span>
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
                  Global employers & local clients looking for verified creators, software engineers, AI specialists, and master trade experts worldwide.
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
                      <span className="text-[10px] text-indigo-400 font-bold">Global & Regional</span>
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
                            Amplify your visibility by up to +350% across global talent directory and regional hubs worldwide.
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

        {/* PULZITIVE ACADEMY & SKILL LABS FEATURED CARD ABOVE FOOTER (CLEAN WHITE BACKGROUND WITH BRAND GREEN & BLUE) */}
        <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-slate-900 my-10">
          {/* Subtle ambient radial light */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Banner Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-extrabold px-3 py-1 rounded-full">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>PULZITIVE ACADEMY & SKILL LABS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                  Master High-Demand Skills. Get Certified & Listed as a Verified Talent!
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  Elevate your income and professional standing on Pulzitive. Learn future-proof <strong className="text-blue-600 font-bold">Digital & AI Skills</strong> or hands-on <strong className="text-emerald-700 font-bold">Artisan & Technical Trades</strong> with industry accreditation, expert mentorship, and direct client placement upon completion.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => onNavigate('academy')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <BookOpen className="w-4 h-4 text-white" />
                  <span>Explore Academy Page</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-[11px] text-center text-slate-500 font-semibold">
                  ✓ Over 12,000+ Active Graduates Listed
                </span>
              </div>
            </div>

            {/* Two Distinct Skill Pathway Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Digital & Tech Pathway */}
              <div className="bg-slate-50 border border-blue-200 hover:border-blue-400 p-5 rounded-2xl space-y-3 relative transition-all shadow-xs group">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5 text-blue-600" /> Digital & Tech Track
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">Online & Self-Paced</span>
                </div>

                <h3 className="text-base font-black text-slate-900">
                  Learn Digital & AI Services
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Software Development, AI Prompting & Engineering, UI/UX Product Design, Growth Marketing, and Conversion Copywriting.
                </p>

                <ul className="text-xs text-slate-700 space-y-1.5 pt-1 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Real-world project portfolio building
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Verified badge on Pulzitive Directory
                  </li>
                </ul>

                <button
                  onClick={() => onNavigate('academy')}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Learn Digital Skills</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Artisan & Technical Trade Pathway */}
              <div className="bg-slate-50 border border-emerald-200 hover:border-emerald-400 p-5 rounded-2xl space-y-3 relative transition-all shadow-xs group">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-emerald-600" /> Technical & Trade Track
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">Practical & On-Site Labs</span>
                </div>

                <h3 className="text-base font-black text-slate-900">
                  Learn Artisan & Technical Trades
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Advanced Auto OBD Diagnostics, Solar & Inverter Installation, Certified Electrical Wiring, PPR Piping, and CCTV Security.
                </p>

                <ul className="text-xs text-slate-700 space-y-1.5 pt-1 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Practical workshop & equipment training
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Immediate client job dispatch & escrow protection
                  </li>
                </ul>

                <button
                  onClick={() => onNavigate('academy')}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Learn Artisan & Technical Trades</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* SINGLE-PAGE PORTFOLIO & CASE STUDIES SHOWCASE TEMPLATE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showcaseTalent && (() => {
          const { isDigital, caseStudies, serviceOfferings, reviews } = getTalentShowcaseContent(showcaseTalent);
          const sectorLabel = getTalentSector(showcaseTalent.category) === 'Digital Services Providers' 
            ? 'Digital Service Provider' 
            : 'Skilled Artisan / Master Technician';

          return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-xl flex flex-col justify-start">
              {/* Sticky Header Nav Bar */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
                <button
                  onClick={() => setShowcaseTalent(null)}
                  className="flex items-center gap-2 text-xs font-black text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Directory</span>
                </button>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs font-mono uppercase font-bold text-slate-500">Talent Portfolio Showcase</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Pulzitive Verified
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      triggerToast(`Copied ${showcaseTalent.name}'s portfolio link!`);
                    }}
                    className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    title="Share Portfolio"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setHireModalTalent(showcaseTalent);
                      setShowcaseTalent(null);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>Hire/Quote</span>
                  </button>
                </div>
              </div>

              {/* Main Single Page Content Canvas */}
              <div className="max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8 my-6">
                {/* Hero Banner Header Card */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl relative">
                  <div className={`h-40 sm:h-52 w-full ${isDigital ? 'bg-gradient-to-r from-blue-900 via-indigo-800 to-slate-900' : 'bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950'} relative p-6 flex items-end justify-between`}>
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-black px-3 py-1 rounded-full border border-white/50 shadow-sm uppercase font-mono tracking-wider">
                        {sectorLabel}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 sm:px-8 pb-8 pt-0 relative -mt-16 sm:-mt-20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
                      <div className="flex items-end gap-4">
                        <div className="relative">
                          <UserAvatarIcon
                            name={showcaseTalent.name}
                            category={showcaseTalent.category}
                            size="xl"
                            verified={showcaseTalent.verifiedBadge}
                            className="border-4 border-white shadow-2xl"
                          />
                          <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full z-30" title="Available Now" />
                        </div>
                        <div className="space-y-1 pb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{showcaseTalent.name}</h1>
                            {showcaseTalent.verifiedBadge && (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Pro
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-extrabold text-blue-600">{showcaseTalent.title}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold pt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {showcaseTalent.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-blue-600" /> Responds in {showcaseTalent.responseTimeMinutes || 15}m
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            triggerToast(`Downloading verified credential PDF for ${showcaseTalent.name}...`);
                          }}
                          className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
                        >
                          <Download className="w-4 h-4 text-slate-600" />
                          <span>Credentials PDF</span>
                        </button>
                        <button
                          onClick={() => {
                            setHireModalTalent(showcaseTalent);
                            setShowcaseTalent(null);
                          }}
                          className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-2xl cursor-pointer shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>Hire/Quote</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Key Metrics Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
                      <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Verified Rating</span>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-base font-black text-slate-900">{showcaseTalent.rating.toFixed(1)}</span>
                          <span className="text-xs text-slate-500 font-semibold">({showcaseTalent.reviewsCount} reviews)</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Jobs Completed</span>
                        <div className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span className="text-base font-black text-slate-900">{showcaseTalent.completedJobsCount || 12}+ Jobs</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Availability</span>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">{showcaseTalent.availability}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Pulzitive Shield</span>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-black text-blue-700">100% Guaranteed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Overview & Bio */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                  <h3 className="text-base font-black text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" /> Professional Overview & Credentials
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    {showcaseTalent.bio}
                  </p>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2.5">Verified Skill Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {showcaseTalent.skills.map((skill, i) => (
                        <span key={i} className="bg-slate-100 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section: Project Case Studies Showcase */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-emerald-600" /> Portfolio & Case Studies Showcase
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Verified project history, client specifications, and technical outcomes.</p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full">
                      {caseStudies.length} Case Studies
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {caseStudies.map((cs) => (
                      <div key={cs.id} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-400 transition-all shadow-xs flex flex-col">
                        <div className="h-44 w-full relative overflow-hidden bg-slate-200">
                          <img src={cs.image} alt={cs.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-white" /> Verified Project
                          </div>
                        </div>
                        <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-semibold">
                              <span>{cs.clientType}</span>
                              <span>{cs.duration}</span>
                            </div>
                            <h4 className="text-base font-black text-slate-900 leading-snug">{cs.title}</h4>
                            
                            <div className="space-y-2 pt-2 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                                <span className="font-bold text-slate-900 block mb-0.5">Challenge & Requirement:</span>
                                <p className="text-slate-600">{cs.challenge}</p>
                              </div>
                              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                                <span className="font-bold text-emerald-900 block mb-0.5">Executed Solution & Result:</span>
                                <p className="text-emerald-800 font-semibold">{cs.solution}</p>
                                <span className="text-[11px] font-bold text-emerald-700 block mt-1.5 pt-1 border-t border-emerald-200/50">
                                  ✓ Outcome: {cs.result}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {cs.location}
                            </span>
                            {cs.url ? (
                              <a
                                href={cs.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                <span>Live Link</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <button
                                onClick={() => {
                                  setHireModalTalent(showcaseTalent);
                                  setShowcaseTalent(null);
                                }}
                                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                              >
                                <span>Request Similar Project</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Service Deliverables & Guarantees */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> Standard Service Scope & Guarantees
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {serviceOfferings.map((serv, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block">
                            {serv.time}
                          </span>
                          <h4 className="text-sm font-black text-slate-900">{serv.name}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{serv.description}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-200/80 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>{serv.guarantee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Verified Customer Testimonials */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Verified Customer Reviews ({reviews.length})
                  </h3>

                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                              {rev.clientName.charAt(0)}
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-900 block">{rev.clientName}</span>
                              <span className="text-[10px] text-slate-500">{rev.company}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black text-slate-900">{rev.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Bottom Hire Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                      Ready to Hire {showcaseTalent.name}?
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">Get a Direct Quote & Schedule Delivery</h3>
                    <p className="text-xs text-slate-300 max-w-xl">
                      Send your service scope or project requirements directly. Pulzitive escrow protection guarantees payment safety.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setHireModalTalent(showcaseTalent);
                      setShowcaseTalent(null);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm px-8 py-4 rounded-2xl cursor-pointer transition-all shadow-xl active:scale-95 shrink-0 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Hire/Quote</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </AnimatePresence>

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
              className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900"
            >
              <button
                onClick={() => setSelectedTalentModal(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 border-b border-slate-200 pb-6">
                <UserAvatarIcon
                  name={selectedTalentModal.name}
                  category={selectedTalentModal.category}
                  size="lg"
                  verified={selectedTalentModal.verifiedBadge}
                  className="border-2 border-emerald-500 shrink-0 shadow-sm"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{selectedTalentModal.name}</h2>
                    {selectedTalentModal.verifiedBadge && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Pulzitive Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 font-semibold">{selectedTalentModal.title}</p>
                  <p className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl inline-flex items-center gap-1.5 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {selectedTalentModal.location}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Professional Overview</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedTalentModal.bio}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Verified Skill Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTalentModal.skills.map((s, i) => (
                    <span key={i} className="bg-slate-100 text-slate-900 text-xs px-3 py-1.5 rounded-xl font-bold border border-slate-200 shadow-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Portfolio & Case Studies</h4>
                  <button
                    onClick={() => {
                      setShowcaseTalent(selectedTalentModal);
                      setSelectedTalentModal(null);
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Showcase Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowcaseTalent(selectedTalentModal);
                      setSelectedTalentModal(null);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs p-3.5 rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-sm group"
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      <span>View Full Single-Page Portfolio Showcase</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {selectedTalentModal.portfolioLinks.map((link, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setShowcaseTalent(selectedTalentModal);
                        setSelectedTalentModal(null);
                      }}
                      className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-emerald-700 font-bold hover:bg-slate-100 hover:border-emerald-400 transition-colors shadow-2xs text-left cursor-pointer group"
                    >
                      <span className="font-bold flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-emerald-600" />
                        <span>{link.title} Showcase</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Pulzitive Member</span>
                </div>

                <button
                  onClick={() => {
                    setHireModalTalent(selectedTalentModal);
                    setSelectedTalentModal(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-2xl cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Hire/Quote</span>
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
                <h3 className="text-lg font-black text-white">Hire/Quote for {hireModalTalent.name}</h3>
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
                      <span>Submit Hire/Quote Request</span>
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
                      <optgroup label="Artisans & Technicians">
                        {ARTISAN_CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Digital Services Providers">
                        {DIGITAL_SERVICE_CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Location / Target Area</label>
                    <input
                      type="text"
                      value={gigLocation}
                      onChange={(e) => setGigLocation(e.target.value)}
                      placeholder="e.g. Remote / Global, London, UK, or Lagos, NG"
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
                      <optgroup label="Artisans & Technicians">
                        {ARTISAN_CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Digital Services Providers">
                        {DIGITAL_SERVICE_CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Location</label>
                    <input
                      type="text"
                      value={myTalentProfile.location || ''}
                      onChange={(e) => setMyTalentProfile({ ...myTalentProfile, location: e.target.value })}
                      placeholder="e.g. Remote / Global, New York, USA, or Lagos, NG"
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
