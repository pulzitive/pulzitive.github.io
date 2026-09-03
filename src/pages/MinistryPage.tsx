import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Video, 
  HeartHandshake, 
  Sparkles, 
  Users, 
  Download, 
  ShieldCheck, 
  Layers, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Pause,
  Clock, 
  Globe, 
  Zap, 
  MessageSquare, 
  Lock, 
  FolderSync, 
  FileText, 
  ChevronRight,
  ChevronLeft,
  UserPlus,
  LogIn,
  LayoutDashboard
} from 'lucide-react';
import { UserProfile } from '../types';
import { MinistryHero } from '../components/ministry/MinistryHero';
import { MinisterAuthModal } from '../components/ministry/MinisterAuthModal';

interface MinistryPageProps {
  currentUser?: UserProfile | null;
  onUserChanged?: (user: UserProfile | null) => void;
  onNavigatePage?: (page: string) => void;
  activeTabProp?: string;
  onTabChangeProp?: (tab: string) => void;
  onTriggerNotification?: (text: string) => void;
}

export const MinistryPage: React.FC<MinistryPageProps> = ({ 
  currentUser = null,
  onUserChanged = (_user: UserProfile | null) => {},
  onNavigatePage = (_page: string) => {},
  activeTabProp,
  onTabChangeProp,
  onTriggerNotification = (_text: string) => {}
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [selectedFeatureTab, setSelectedFeatureTab] = useState<string>('media');

  // Carousel 1: Feature Showcase Carousel State
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isFeatureAutoPlay, setIsFeatureAutoPlay] = useState(true);

  // Carousel 2: 3-Step Media Workflow Carousel State
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState(0);
  const [isWorkflowAutoPlay, setIsWorkflowAutoPlay] = useState(true);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signup', tab: string = 'media') => {
    setSelectedFeatureTab(tab);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    onUserChanged(user);
    setIsAuthModalOpen(false);
  };

  const handleLaunchDashboard = () => {
    onNavigatePage('dashboard');
  };

  const showcaseFeatures = [
    {
      id: 'media',
      title: 'Done-For-You Media Engine',
      badge: '48h SLA Human Video Editors',
      tagline: 'Delegate Sunday Video Post-Production with Zero Hassle',
      description: 'Upload your raw Sunday sermon recordings via our Google Drive auto-sync vault. Our dedicated kingdom video specialists extract viral high-impact hooks, apply kinetic kinetic typography, sound effects, and deliver 9:16 vertical reels & 16:9 widescreen masters.',
      icon: Video,
      highlights: [
        '3 to 7 High-Converting Sermon Reels per Sunday',
        'Kinetic animated subtitles with scripture overlay',
        'Direct Google Drive Cloud Vault integration',
        'Strict 48-Hour delivery before Wednesday Bible study'
      ],
      stats: '45,000+ Sermon Reels Rendered',
      ctaText: 'Access Done-For-You Media Engine'
    },
    {
      id: 'prayer',
      title: 'Global Intercession Wall',
      badge: 'Live 24/7 Apostolic Prayer',
      tagline: 'Unite with Gospel Ministers Around the World in Faith',
      description: 'Post confidential ministerial prayer burdens, revival petitions, and church outreach needs. Verified pastors across 30+ nations stand in agreement, lifting up your ministry with real-time intercession counters.',
      icon: HeartHandshake,
      highlights: [
        'Confidential & pastoral prayer categories',
        'Real-time "Stand in Agreement" faith counter',
        'Global prayer notification broadcasts',
        'Denominational unity in the Spirit'
      ],
      stats: '1,200+ Daily Prayers Answered',
      ctaText: 'Enter Global Intercession Wall'
    },
    {
      id: 'dreams',
      title: 'Dreams & Visions Sanctuary',
      badge: 'Joel 2:28 Biblical Discernment',
      tagline: 'Prophetic Encounters & Theological Scripture Council',
      description: 'Document spiritual dreams, night visions, and divine promptings in a reverent, secure environment. Receive scriptural commentary, cross-referenced Bible verses, and theological insights from seasoned ministers.',
      icon: Sparkles,
      highlights: [
        'Full scripture citation cross-referencing (KJV, NKJV, ESV)',
        'Theological commentary & dream symbol index',
        'Peer-reviewed spiritual discernment',
        'Archived personal revelation journal'
      ],
      stats: '850+ Scriptural Interpretations',
      ctaText: 'Explore Dreams & Visions Sanctuary'
    },
    {
      id: 'directory',
      title: 'Ministers Network Directory',
      badge: 'Verified Apostolic Network',
      tagline: 'Direct 1-on-1 Fellowship & Pastoral Exchange',
      description: 'Discover and connect with verified pastors, evangelists, and bishops across denominations. Engage in private ministerial messaging, exchange pulpit ministry invitations, and build kingdom alliances.',
      icon: Users,
      highlights: [
        'Ordination verification badge checks',
        'Filter by city, country, and ministry focus',
        'Encrypted direct pastoral messaging',
        'Global minister collaboration hub'
      ],
      stats: '1,240+ Active Verified Ministers',
      ctaText: 'Join Ministers Directory'
    },
    {
      id: 'resources',
      title: 'Sermon Graphics & Slide Vault',
      badge: 'Production-Ready Assets',
      tagline: 'Weekly High-Resolution Slide Decks & Social Media Kits',
      description: 'Download professionally crafted sermon title slides, editable PSD series graphic kits, worship lower thirds, and presentation templates designed for ProPresenter, PowerPoint, and Canva.',
      icon: Download,
      highlights: [
        '100% editable Photoshop (PSD) & Canva templates',
        '4K & 1080p widescreen presentation slide decks',
        'Social media quote cards & carousel templates',
        'Weekly fresh sermon series themes'
      ],
      stats: '250+ Sermon Design Kits',
      ctaText: 'Open Sermon Slide Vault'
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      tag: 'Cloud Vault Ingestion',
      title: 'Upload Sunday Recording',
      description: 'Drop your raw Sunday sermon link or video file into your dedicated church Google Drive vault right from your dashboard.',
      icon: FolderSync,
      badgeColor: 'bg-emerald-600 text-white',
      accentBorder: 'border-emerald-500',
      perks: [
        'Google Drive Auto-Sync Vault',
        'Support for 4K & 1080p Raw Footage',
        'Zero file conversion required on your end'
      ]
    },
    {
      step: 2,
      tag: 'Kingdom Media Crafting',
      title: 'Human Editors Craft Viral Clips',
      description: 'Our vetted kingdom video specialists identify the most anointed moments, apply kinetic typography subtitles, audio enhancement, and color grading.',
      icon: Video,
      badgeColor: 'bg-teal-600 text-white',
      accentBorder: 'border-teal-500',
      perks: [
        'Kinetic animated word-by-word captions',
        'B-roll overlays & sound effects mixing',
        'Custom church branding & scripture citations'
      ]
    },
    {
      step: 3,
      tag: 'Gospel Distribution',
      title: 'Download & Broadcast',
      description: 'Receive completed 9:16 Instagram/TikTok reels, YouTube shorts, and sermon series graphic slides within 48 hours for immediate publishing.',
      icon: Download,
      badgeColor: 'bg-blue-600 text-white',
      accentBorder: 'border-blue-500',
      perks: [
        'Strict 48-Hour Delivery SLA',
        'Ready for Instagram, TikTok, YouTube & Facebook',
        'Includes editable presentation slide decks'
      ]
    }
  ];

  // Auto-play timer for Feature Carousel
  useEffect(() => {
    if (!isFeatureAutoPlay) return;
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % showcaseFeatures.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isFeatureAutoPlay, showcaseFeatures.length]);

  // Auto-play timer for Workflow Carousel
  useEffect(() => {
    if (!isWorkflowAutoPlay) return;
    const interval = setInterval(() => {
      setActiveWorkflowIndex((prev) => (prev + 1) % workflowSteps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isWorkflowAutoPlay, workflowSteps.length]);

  const handlePrevFeature = () => {
    setActiveFeatureIndex((prev) => (prev - 1 + showcaseFeatures.length) % showcaseFeatures.length);
  };

  const handleNextFeature = () => {
    setActiveFeatureIndex((prev) => (prev + 1) % showcaseFeatures.length);
  };

  const handlePrevWorkflow = () => {
    setActiveWorkflowIndex((prev) => (prev - 1 + workflowSteps.length) % workflowSteps.length);
  };

  const handleNextWorkflow = () => {
    setActiveWorkflowIndex((prev) => (prev + 1) % workflowSteps.length);
  };

  const currentFeature = showcaseFeatures[activeFeatureIndex];
  const FeatureIcon = currentFeature.icon;

  const currentWorkflow = workflowSteps[activeWorkflowIndex];
  const WorkflowIcon = currentWorkflow.icon;

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 w-full">
      {/* Full width edge-to-edge view */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 pt-4 sm:pt-6">
        
        {/* Centered Hero Section */}
        <MinistryHero
          onOpenAuthModal={(mode, tab) => handleOpenAuth(mode, tab)}
          isUserSignedIn={!!currentUser}
          currentUser={currentUser}
          onGoToDashboard={handleLaunchDashboard}
        />

        {/* Feature Highlights Section - Controllable Auto Slide Carousel */}
        <div className="w-full max-w-6xl mx-auto my-16 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Designed Exclusively for Pastors & Gospel Ministers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Every tool and service on EcclesiaHub is engineered to lift the burden of technical media production so you can focus entirely on prayer and the ministry of the Word (Acts 6:4).
            </p>
          </div>

          {/* Carousel Category Pill Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {showcaseFeatures.map((f, idx) => {
              const Icon = f.icon;
              const isActive = idx === activeFeatureIndex;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFeatureIndex(idx);
                    setIsFeatureAutoPlay(false);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{f.title}</span>
                </button>
              );
            })}
          </div>

          {/* Main Controllable Carousel Card */}
          <div 
            className="relative bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-md overflow-hidden transition-all"
            onMouseEnter={() => setIsFeatureAutoPlay(false)}
            onMouseLeave={() => setIsFeatureAutoPlay(true)}
          >
            {/* Header controls: Progress & Buttons */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/80">
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold uppercase font-mono px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Feature {activeFeatureIndex + 1} of {showcaseFeatures.length}
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  {isFeatureAutoPlay ? '• Auto-sliding' : '• Paused'}
                </span>
              </div>

              {/* Navigation Arrows & Play/Pause */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFeatureAutoPlay(!isFeatureAutoPlay)}
                  title={isFeatureAutoPlay ? 'Pause auto-slide' : 'Resume auto-slide'}
                  className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs cursor-pointer transition-all"
                >
                  {isFeatureAutoPlay ? <Pause className="w-4 h-4 text-emerald-600" /> : <Play className="w-4 h-4 text-slate-600" />}
                </button>
                <button
                  onClick={handlePrevFeature}
                  className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                  title="Previous Feature"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextFeature}
                  className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                  title="Next Feature"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Feature Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-600/20">
                    <FeatureIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block mb-1">
                      {currentFeature.badge}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {currentFeature.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm font-semibold text-emerald-700">
                  {currentFeature.tagline}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentFeature.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentFeature.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-tight font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Impact Metric</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Verified</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    {currentFeature.stats}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Designed specifically for church operations and gospel expansion without requiring internal AV staff overhead.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (currentUser && currentUser.role === 'Minister') {
                        handleLaunchDashboard();
                      } else {
                        handleOpenAuth('signup', currentFeature.id);
                      }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-3.5 rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    {currentUser && currentUser.role === 'Minister' ? (
                      <>
                        <LayoutDashboard className="w-4 h-4 text-white" />
                        <span>Launch {currentFeature.title}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-white" />
                        <span>Register to {currentFeature.ctaText}</span>
                      </>
                    )}
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-slate-200/60">
              {showcaseFeatures.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => {
                    setActiveFeatureIndex(dotIdx);
                    setIsFeatureAutoPlay(false);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    dotIdx === activeFeatureIndex ? 'w-8 bg-emerald-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to feature slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section - Controllable Auto Slide Carousel with White Background */}
        <div 
          className="w-full max-w-6xl mx-auto my-20 bg-white border border-slate-200 text-slate-900 rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden"
          onMouseEnter={() => setIsWorkflowAutoPlay(false)}
          onMouseLeave={() => setIsWorkflowAutoPlay(true)}
        >
          {/* Section Heading */}
          <div className="text-center space-y-3 mb-10 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              How the Sunday Sermon Engine Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              No technical editing skills required on your end. Simply drop your raw video file and receive ready-to-publish reels in 48 hours.
            </p>
          </div>

          {/* Step Selector Tabs & Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 relative z-10">
            {/* Step Selection Buttons */}
            <div className="flex flex-wrap gap-2">
              {workflowSteps.map((stepItem, sIdx) => {
                const isCurrent = sIdx === activeWorkflowIndex;
                return (
                  <button
                    key={stepItem.step}
                    onClick={() => {
                      setActiveWorkflowIndex(sIdx);
                      setIsWorkflowAutoPlay(false);
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-white text-emerald-800 border-2 border-emerald-600 shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                      isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {stepItem.step}
                    </span>
                    <span>Step {stepItem.step}: {stepItem.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWorkflowAutoPlay(!isWorkflowAutoPlay)}
                title={isWorkflowAutoPlay ? 'Pause auto-slide' : 'Resume auto-slide'}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs cursor-pointer transition-all"
              >
                {isWorkflowAutoPlay ? <Pause className="w-4 h-4 text-emerald-600" /> : <Play className="w-4 h-4 text-slate-600" />}
              </button>
              <button
                onClick={handlePrevWorkflow}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                title="Previous Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextWorkflow}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                title="Next Step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Step Showcase Card */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${currentWorkflow.badgeColor} font-black text-xl flex items-center justify-center shadow-md`}>
                    {currentWorkflow.step}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {currentWorkflow.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                      {currentWorkflow.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentWorkflow.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Key Step Highlights:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentWorkflow.perks.map((p, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 bg-white border border-slate-200 rounded-xl p-5 text-center space-y-4 flex flex-col justify-center items-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <WorkflowIcon className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Step {currentWorkflow.step} in Action</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Fully managed by our kingdom media specialists</p>
                </div>
                <button
                  onClick={() => {
                    if (currentUser && currentUser.role === 'Minister') {
                      handleLaunchDashboard();
                    } else {
                      handleOpenAuth('signup', 'media');
                    }
                  }}
                  className="w-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Start Step {currentWorkflow.step}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              </div>
            </div>

            {/* Step Progress Dots */}
            <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-slate-200">
              {workflowSteps.map((_, wIdx) => (
                <button
                  key={wIdx}
                  onClick={() => {
                    setActiveWorkflowIndex(wIdx);
                    setIsWorkflowAutoPlay(false);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    wIdx === activeWorkflowIndex ? 'w-8 bg-emerald-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to workflow step ${wIdx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom CTA Button */}
          <div className="mt-10 text-center relative z-10">
            <button
              onClick={() => {
                if (currentUser && currentUser.role === 'Minister') {
                  handleLaunchDashboard();
                } else {
                  handleOpenAuth('signup', 'media');
                }
              }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-emerald-500 font-black text-sm shadow-xl shadow-slate-200/50 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Video className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-900 font-bold">Get Started with Sunday Sermon Editing</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Ministerial Sign Up / Sign In Callout Bar */}
        <div className="w-full max-w-6xl mx-auto my-16 bg-white border-2 border-emerald-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
            <Flame className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ready to Amplify Your Ministry's Gospel Reach?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Create your free pastoral account today. Experience our done-for-you media editing, unite on the intercession wall, and access our apostolic resources vault.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleOpenAuth('signup', 'media')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span className="text-white font-bold">Register Church & Minister Account</span>
            </button>

            <button
              onClick={() => handleOpenAuth('signin', 'media')}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-emerald-600" />
              <span>Sign In as Pastor</span>
            </button>
          </div>
        </div>

      </div>

      {/* Dedicated Pastor & Minister Auth Modal */}
      <MinisterAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        defaultTabInterest={selectedFeatureTab}
      />
    </div>
  );
};
