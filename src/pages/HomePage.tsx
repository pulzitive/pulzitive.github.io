/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Megaphone, BookOpen, ChevronRight, Award, Users, Shield, 
  BarChart2, Zap, Layout, Play, Briefcase, Download,
  Search, Globe, TrendingUp, ChevronLeft, Calendar, Sparkles,
  Code, Share2, PenTool, Mail, Phone, Tv, Layers, FileText, 
  Inbox, Image, Clock, MessageSquare, Send, ShoppingBag, Store, 
  Box, Gift, Headphones, Mic, Video, Heart, MessageCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { clientsList } from '../data/clients';
import { MiniTools } from '../components/MiniTools';
import { HeroTypewriter } from '../components/HeroTypewriter';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenAuditModal: () => void;
  onOpenApptModal: () => void;
  onOpenMergedModal?: () => void;
  onOpenAuthModal?: () => void;
}

const marketingServices = [
  {
    title: "Brand Communication & Identity",
    description: "Strategic brand positioning, corporate visual identity systems, brand voice matrices, and messaging frameworks engineered for market leadership.",
    features: ["Visual Identity & Logo Guidelines", "Brand Voice & Positioning Matrix", "Brand Architecture & Equity Audits"],
    iconName: "PenTool",
    accent: "purple",
    badge: "STRATEGY",
    category: "Acquisition"
  },
  {
    title: "Corporate Communication & PR",
    description: "Executive media relations, stakeholder alignment, crisis response protocols, press releases, and global thought leadership syndication.",
    features: ["Executive Media Kit & PR Pitching", "Crisis Communication Protocols", "Stakeholder & Investor Relations"],
    iconName: "Megaphone",
    accent: "indigo",
    badge: "CORPORATE PR",
    category: "Acquisition"
  },
  {
    title: "Lead Generation",
    description: "Multi-channel B2B & B2C customer capture designed to fill pipelines with validated, high-intent opportunities.",
    features: ["Automated Quiz Funnels", "Verified Contact Scraping", "Instant Lead Routing"],
    iconName: "TrendingUp",
    accent: "blue",
    badge: "ACQUISITION",
    category: "Acquisition"
  },
  {
    title: "Search Engine Marketing",
    description: "High-ROI paid search campaigns targeting hot search intent to capture ready-to-buy consumers instantly.",
    features: ["Google Ads Setup & Audits", "Negative Keyword Scrubbing", "ROAS Optimization"],
    iconName: "Search",
    accent: "blue",
    badge: "SEM",
    category: "Acquisition"
  },
  {
    title: "Social Media Marketing",
    description: "Paid social campaigns on Facebook, Instagram, LinkedIn, and TikTok engineered to drive viral brand engagement.",
    features: ["Custom Audience Mining", "Meta Pixel / Conversions API", "Ad Creative Testing"],
    iconName: "Share2",
    accent: "blue",
    badge: "PAID SOCIAL",
    category: "Acquisition"
  },
  {
    title: "Content Marketing",
    description: "Strategic asset syndication that maps authority-building guides to the exact steps of your customer journey.",
    features: ["Ebooks & Whitepapers", "Inbound Funnel Mapping", "Multi-platform Syndication"],
    iconName: "BookOpen",
    accent: "red",
    badge: "CONTENT",
    category: "Acquisition"
  },
  {
    title: "Email Marketing",
    description: "Behavior-triggered automated sequences and direct broadcasts that convert subscribers into recurring buyers.",
    features: ["Welcome Journey Setups", "Cart Abandonment Recovery", "A/B Subject Line Tests"],
    iconName: "Mail",
    accent: "green",
    badge: "EMAIL",
    category: "Support"
  },
  {
    title: "Telemarketing",
    description: "Professional outbound and inbound vocal campaigns to qualify large cold databases and schedule strategy sessions.",
    features: ["Cold Outreach Scripts", "Inbound Call Routing", "Performance Analytics Logs"],
    iconName: "Phone",
    accent: "blue",
    badge: "OUTBOUND",
    category: "Acquisition"
  },
  {
    title: "Infomercials",
    description: "Captivating, high-converting video product demonstrations optimized for digital, television, and YouTube feeds.",
    features: ["Direct Response Scripting", "Product Demo Production", "Visual Hook Engineering"],
    iconName: "Tv",
    accent: "blue",
    badge: "BROADCAST",
    category: "Acquisition"
  },
  {
    title: "Affiliate Marketing",
    description: "Referral program setups that incentivize external creators and publishers to sell your software and services.",
    features: ["Affiliate Program Portals", "Commission Tiers Layout", "Conversion Tracking Audits"],
    iconName: "Award",
    accent: "blue",
    badge: "PARTNERSHIPS",
    category: "Acquisition"
  },
  {
    title: "Content Creation",
    description: "Multi-platform visual and text-based assets tailored to represent your company with premium visual consistency.",
    features: ["Social Post Copy & Gfx", "Cinematic Motion Graphics", "Product Photography Layouts"],
    iconName: "PenTool",
    accent: "red",
    badge: "CREATIVE",
    category: "Creative"
  },
  {
    title: "Funnel Management",
    description: "Continuous landing page split-testing, heatmap analysis, and checkout friction removal to elevate conversion rates.",
    features: ["A/B Conversion Testing", "Friction Dropoff Audits", "Micro-interaction Tuning"],
    iconName: "Layers",
    accent: "blue",
    badge: "FUNNELS",
    category: "Acquisition"
  },
  {
    title: "Website Development",
    description: "Stunning, high-performance web applications built on modern frameworks for speed, security, and responsive styling.",
    features: ["React & Vite Portals", "Responsive Mobile-First UI", "Secure API Integrations"],
    iconName: "Code",
    accent: "indigo",
    badge: "ENGINEERING",
    category: "Operations"
  },
  {
    title: "Blog Management",
    description: "End-to-end editorial calendar curation to position your website as the definitive voice in your vertical.",
    features: ["SEO Keyword Integration", "WordPress & CMS Uploads", "Interlinking Optimizations"],
    iconName: "FileText",
    accent: "red",
    badge: "EDITORIAL",
    category: "Creative"
  },
  {
    title: "Email Management",
    description: "Inbox organization, customer ticketing curation, and zero-inbox priority setups to keep lines moving smoothly.",
    features: ["Spam-Filter Verification", "Canned Response Setup", "Inbox Priority Queuing"],
    iconName: "Inbox",
    accent: "green",
    badge: "INBOX",
    category: "Support"
  },
  {
    title: "Calendar Management",
    description: "Meeting coordination, schedule balancing, and automated booking alignments to optimize leadership bandwidth.",
    features: ["Google Calendar Sync", "Double-Booking Prevention", "Timezone Accommodation"],
    iconName: "Calendar",
    accent: "green",
    badge: "CALENDAR",
    category: "Support"
  },
  {
    title: "Social Media Management",
    description: "Daily publishing, audience monitoring, and organic profile scaling across your business profiles.",
    features: ["Brand Voice Protection", "Follower Engagement Replies", "Growth Statistics Reports"],
    iconName: "Users",
    accent: "indigo",
    badge: "ORGANIC SOCIAL",
    category: "Operations"
  },
  {
    title: "Graphic Design",
    description: "High-end visual communication materials from sales decks and branding identity to social banners.",
    features: ["Brand Style Alignment", "High-Contrast Ad Graphics", "Vector Illustration Assets"],
    iconName: "Image",
    accent: "red",
    badge: "DESIGN",
    category: "Creative"
  },
  {
    title: "Content Scheduling",
    description: "Strategic planning and direct queuing of visual and textual resources to capture peak audience attention times.",
    features: ["Social Scheduling Tools", "Peak Performance Timing", "Multi-platform Alignment"],
    iconName: "Clock",
    accent: "indigo",
    badge: "SCHEDULING",
    category: "Operations"
  },
  {
    title: "SEO Support",
    description: "Deep technical audits, localized directory setups, and backend schema markups to drive consistent Google ranking.",
    features: ["Google Business Profile", "Geographic Schema Markup", "Alt Text & Core Web Vitals"],
    iconName: "Globe",
    accent: "green",
    badge: "SEO",
    category: "Support"
  },
  {
    title: "Copywriting",
    description: "Conversion-focused text for ads, sales pages, email sequences, and script files engineered to provoke action.",
    features: ["AIDA Formula Scripting", "Scroll-Stopping Headlines", "Clear Call-to-Actions"],
    iconName: "MessageSquare",
    accent: "red",
    badge: "COPY",
    category: "Creative"
  },
  {
    title: "Newsletter Setup",
    description: "Professional template styling and database segmentation to deliver beautiful weekly insight publications.",
    features: ["Responsive Email Style", "Subscriber Tag Segments", "Compliance Checklists"],
    iconName: "Send",
    accent: "red",
    badge: "NEWSLETTERS",
    category: "Creative"
  },
  {
    title: "E-commerce Support",
    description: "Complete checkout configurations, inventory synchronizations, and order recovery setups for online stores.",
    features: ["Checkout Friction Audits", "Secure Payment Gateway", "Stock Level Alerts"],
    iconName: "ShoppingBag",
    accent: "indigo",
    badge: "ECOMMERCE",
    category: "Operations"
  },
  {
    title: "Shopify Management",
    description: "Liquid theme adjustments, page enhancements, and app integrations to optimize your Shopify store setup.",
    features: ["Shopify App Configuration", "Product Matrix Setup", "Shopify Speed Tuning"],
    iconName: "Store",
    accent: "indigo",
    badge: "SHOPIFY",
    category: "Operations"
  },
  {
    title: "Amazon Listings",
    description: "Optimized Amazon A+ content creation, keyword research, and high-quality photography layouts to scale sales.",
    features: ["Amazon SEO Keywords", "A+ Enhanced Brand Content", "Product Review Strategy"],
    iconName: "Box",
    accent: "indigo",
    badge: "AMAZON",
    category: "Operations"
  },
  {
    title: "Etsy Management",
    description: "Bespoke listing layouts, tag optimization, and storefront designs customized for handmade/boutique brands.",
    features: ["Etsy Tag Optimization", "Storefront Aesthetic Style", "Listing Descriptions Copy"],
    iconName: "Gift",
    accent: "indigo",
    badge: "ETSY",
    category: "Operations"
  },
  {
    title: "Customer Support",
    description: "Empathetic and professional customer relations managed via ticketing tools, live chats, and email channels.",
    features: ["SLA Response Deadlines", "Knowledgebase Development", "Escalation Workflows"],
    iconName: "Headphones",
    accent: "green",
    badge: "SUPPORT",
    category: "Support"
  },
  {
    title: "Podcast Editing",
    description: "Crisp and balanced audio engineering, noise reductions, track mixes, and distribution setups.",
    features: ["Background Noise Cleanup", "ID3 Tag Curation", "Show Notes Production"],
    iconName: "Mic",
    accent: "red",
    badge: "PODCASTS",
    category: "Creative"
  },
  {
    title: "Video Editing",
    description: "Engaging and high-energy pacing adjustments, dynamic captions, and sound layouts for short-form feeds.",
    features: ["Captivating Hook Timing", "Dynamic Caption Subtitles", "Color Grading Curation"],
    iconName: "Video",
    accent: "red",
    badge: "VIDEO",
    category: "Creative"
  },
  {
    title: "Customers Relationship Management",
    description: "Bespoke Hubspot, Salesforce, or Zoho setup to capture pipeline pipelines, log meetings, and drive retention.",
    features: ["Lead Deal Stage Pipelines", "Automated Contact Logs", "Analytics Custom Charts"],
    iconName: "Heart",
    accent: "indigo",
    badge: "CRM",
    category: "Operations"
  },
  {
    title: "Chatbots",
    description: "Dynamic conversational flows and autoresponders integrated into WhatsApp, Instagram, and web pages.",
    features: ["Intelligent FAQ Branching", "WhatsApp API Integration", "Live Agent Handoff Flows"],
    iconName: "MessageCircle",
    accent: "indigo",
    badge: "AI CHAT",
    category: "Operations"
  },
  {
    title: "Marketing Automation",
    description: "Cross-platform Zapier, Make, and webhook connections to unify lead transfers, alerts, and customer paths.",
    features: ["Zapier Custom Workflows", "Webhook Synchronizations", "Lead Segment Tagging"],
    iconName: "Zap",
    accent: "blue",
    badge: "AUTOMATION",
    category: "Acquisition"
  }
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Megaphone,
  Layout,
  Globe,
  TrendingUp,
  Award,
  Code,
  Share2,
  PenTool,
  BarChart2,
  Mail,
  Phone,
  Tv,
  Layers,
  FileText,
  Inbox,
  Calendar,
  Users,
  Image,
  Clock,
  MessageSquare,
  Send,
  ShoppingBag,
  Store,
  Box,
  Gift,
  Headphones,
  Mic,
  Video,
  Heart,
  MessageCircle,
  Zap,
};

export default function HomePage({ onNavigate, onOpenAuditModal, onOpenApptModal, onOpenMergedModal, onOpenAuthModal }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [activePricingIndex, setActivePricingIndex] = React.useState(1); // Default to Recommended plan (index 1)
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [showMiniTools, setShowMiniTools] = React.useState(false);

  const filteredServices = selectedCategory === 'All'
    ? marketingServices
    : marketingServices.filter(s => s.category === selectedCategory);

  const activeSlide = currentSlide >= filteredServices.length ? 0 : currentSlide;

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredServices.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, filteredServices.length]);

  React.useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(testimonialInterval);
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      
      {/* 1. HERO HERO SECTION - PRISTINE WHITE BACKGROUND */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          
          {/* Floating Background Icons */}
          <div className="absolute top-1/4 left-[8%] opacity-[0.05] animate-bounce" style={{ animationDuration: '6s' }}>
            <TrendingUp className="w-16 h-16 text-emerald-600" />
          </div>
          <div className="absolute bottom-1/4 right-[8%] opacity-[0.05] animate-pulse" style={{ animationDuration: '4s' }}>
            <Megaphone className="w-20 h-20 text-indigo-600" />
          </div>
          <div className="absolute top-1/3 right-[15%] opacity-[0.04] animate-bounce" style={{ animationDuration: '8s' }}>
            <BarChart2 className="w-14 h-14 text-pink-600" />
          </div>
          <div className="absolute bottom-1/3 left-[15%] opacity-[0.04] animate-pulse" style={{ animationDuration: '5s' }}>
            <Share2 className="w-12 h-12 text-teal-600" />
          </div>
        </div>
 
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeroTypewriter />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            We merge high-impact programmatic digital marketing and advertising campaigns with marketing training, providing businesses and brands with robust leads, client conversion funnels and students with certified Marketing path.
          </motion.p>
 
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onOpenMergedModal || onOpenAuditModal}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl cursor-pointer text-xs transition-all flex items-center gap-2 shadow-md hover:scale-[1.01]"
            >
              Get Free Audit & Strategy Session <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 1.5 DIGITAL MARKETING SERVICES AUTO-SLIDE CAROUSEL SECTION */}
      <section className="py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              Our Digital Marketing Services
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Accelerate your business scale with precision-engineered organic and paid customer acquisition channels. Use the auto-sliding showcase below to explore.
            </p>
          </div>

          {/* Category Tabs Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-3xl mx-auto">
            {[
              { id: 'All', label: 'All Services (30)' },
              { id: 'Acquisition', label: 'Acquisition & Ads' },
              { id: 'Creative', label: 'Content & Creative' },
              { id: 'Operations', label: 'Digital Operations' },
              { id: 'Support', label: 'Business Support' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentSlide(0);
                }}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Carousel Outer frame with pause on hover */}
          <div 
            className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden transition-all duration-300 hover:border-slate-300"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Auto-Slide Indicator Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
              <div 
                key={`${selectedCategory}-${activeSlide}`}
                className="h-full bg-slate-900 transition-all duration-4500 ease-linear"
                style={{ width: isPaused ? '100%' : '100%', transition: isPaused ? 'none' : 'width 4500ms linear' }}
              />
            </div>

            {/* Carousel Active Content */}
            <div className="min-h-[300px] flex flex-col justify-between space-y-8">
              
              <div className="space-y-6">
                
                {/* Badge and Title Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
                    {filteredServices[activeSlide]?.badge}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>AUTO-SLIDING ACTIVE</span>
                  </div>
                </div>

                {/* Main description section */}
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Service Icon */}
                  <div className="bg-indigo-50 text-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100 shrink-0">
                    {(() => {
                      const iconName = filteredServices[activeSlide]?.iconName;
                      const IconComponent = iconName ? iconMap[iconName] : null;
                      return IconComponent ? <IconComponent className="w-7 h-7" /> : null;
                    })()}
                  </div>

                  {/* Title & description text */}
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {filteredServices[activeSlide]?.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      {filteredServices[activeSlide]?.description}
                    </p>
                  </div>
                </div>

                {/* Features list using standard Check icon */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-3">Key Deliverables</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {filteredServices[activeSlide]?.features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium"
                      >
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Call-to-Action to Book & Controls Row */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                
                {/* Clear CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={onOpenMergedModal || onOpenApptModal}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl cursor-pointer text-xs transition-all flex items-center gap-2 shadow-md"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Get Free Audit & Strategy Session</span>
                  </button>
                </div>

                {/* Navigation Chevrons and Dots */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Chevrons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentSlide((prev) => (prev - 1 + filteredServices.length) % filteredServices.length);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-colors cursor-pointer"
                      title="Previous Service"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentSlide((prev) => (prev + 1) % filteredServices.length);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-colors cursor-pointer"
                      title="Next Service"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {filteredServices.length <= 10 ? (
              filteredServices.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                    activeSlide === idx ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Go to service ${idx + 1}`}
                />
              ))
            ) : (
              <span className="text-xs font-mono text-slate-500 font-bold">
                Service {activeSlide + 1} of {filteredServices.length}
              </span>
            )}
          </div>

        </motion.div>
      </section>

      {/* 2. SHOWCASE: 3 BEST MINI-TOOLS */}
      <section className="py-20 bg-white border-b border-slate-200">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center space-y-3 mb-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              Test Your Marketing Trajectory
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Try our three premier performance marketing tools directly. Ready to audit your outbound channels and map growth vectors?
            </p>
            
            {!showMiniTools && (
              <div className="pt-4">
                <button
                  onClick={() => setShowMiniTools(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-8 py-3.5 rounded-xl cursor-pointer text-xs transition-all shadow-md active:scale-95 hover:scale-[1.01]"
                >
                  Test Tools
                </button>
              </div>
            )}
          </div>
          
          {showMiniTools && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4 }}
            >
              <MiniTools 
                currentUser={null} 
                showcaseOnly={true} 
                onBookAppointment={onOpenApptModal} 
                onNavigate={onNavigate}
                onOpenAuthModal={onOpenAuthModal}
              />
              <div className="text-center pt-6">
                <button
                  onClick={() => setShowMiniTools(false)}
                  className="text-slate-500 hover:text-slate-800 font-bold px-4 py-2 text-xs transition-all underline cursor-pointer"
                >
                  Collapse Tools
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* 3. TRUSTED BRANDS & PORTFOLIO SHOWCASE - INFINITE SLIDING MARQUEE */}
      <section className="bg-white py-16 border-t border-slate-200 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="text-left">
            <h4 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Trusted Portfolios</h4>
            <h2 className="text-2xl font-black text-slate-900 mt-1.5">Clients We Have Accelerated</h2>
            <p className="text-xs text-slate-500 mt-1">Pulzitive guides elite brands across Fintech, Insurtech, Luxury Real Estate, FMCG, and AI platforms.</p>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="self-start md:self-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <span>Explore Case Studies</span>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Sliding Marquee Component */}
        <div className="animate-marquee-container relative py-4 bg-slate-50/50 border-y border-slate-100">
          {/* Gradient Overlays for smooth fading on sides */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee-content gap-6 flex items-center">
            {/* Render the clients twice to achieve endless infinite scrolling effect */}
            {[...clientsList, ...clientsList].map((client, idx) => (
              <div
                key={`${client.id}-${idx}`}
                onClick={() => onNavigate('portfolio')}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex items-center gap-3.5 min-w-[280px] cursor-pointer shadow-sm hover:shadow-md transition-all shrink-0 select-none group"
              >
                {/* Logo emblem */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-inner shrink-0 ${client.logoBg} ${client.logoTextColor}`}>
                  {client.logoEmblem}
                </div>
                
                {/* Text specs */}
                <div className="text-left">
                  <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {client.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                      {client.category}
                    </span>
                    <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
                      {client.website}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hover on marquee to pause exploration • Click any brand card to view verified performance records</span>
          </p>
        </div>
        </motion.div>
      </section>

      {/* 4. KEY METRICS STATS - DIGITAL MARKETING SERVICES STATISTICS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h4 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Performance Metrics</h4>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">Pulzitive Digital Marketing Services Statistics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
              <p className="text-3xl font-black text-emerald-600">92%</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">SEO Ranking Growth Index</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
              <p className="text-3xl font-black text-indigo-600">4.8x</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Average Paid Campaign ROAS</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
              <p className="text-3xl font-black text-emerald-600">₦15M+</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Client Revenue Accelerated</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
              <p className="text-3xl font-black text-indigo-600">25,000+</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Qualified Leads Generated</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. TESTIMONIAL CAROUSEL ZONE */}
      <section className="bg-slate-50 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="mb-8">
            <h4 className="text-[10px] font-mono tracking-widest text-emerald-600 uppercase">Impact Stories</h4>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">Client Reviews</h2>
          </div>

          <div className="relative">
            {/* Carousel Viewport */}
            <div className="overflow-hidden px-4 py-2">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`
                }}
              >
                {[
                  {
                    quote: "We consulted Pulzitive for our search engine marketing and SEO. After implementing their structural keyword audit and PPC structure, our organic inquiries spiked by 80%, driving consistent conversions.",
                    author: "Abiodun Salami",
                    role: "Managing Director, Pulzitive Ltd",
                    initials: "AS"
                  },
                  {
                    quote: "Pulzitive rebuilt our entire company portal and optimized our conversion funnels. The site is incredibly fast, and their targeted Google campaigns delivered over 40% growth in leads.",
                    author: "Funmi Awosika",
                    role: "Head of Growth, LeadWay Tech Solutions",
                    initials: "FA"
                  },
                  {
                    quote: "Their content creation team is exceptional. From SEO articles to cinematic short-form video assets, Pulzitive helped us dominate our social media presence and establish genuine brand authority.",
                    author: "Tunde Johnson",
                    role: "Marketing Director, Apex Commerce Group",
                    initials: "TJ"
                  }
                ].map((testi, idx) => (
                  <div key={idx} className="w-full shrink-0 px-2 sm:px-6">
                    <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-3xl space-y-6 max-w-2xl mx-auto text-left relative">
                      <div className="absolute -top-4 -left-2 text-6xl text-slate-100 font-serif select-none pointer-events-none">
                        “
                      </div>
                      <p className="text-sm text-slate-700 italic leading-relaxed relative z-10">
                        "{testi.quote}"
                      </p>
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                          {testi.initials}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{testi.author}</h4>
                          <p className="text-[10px] text-slate-500 font-mono">{testi.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual navigation arrows */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + 3) % 3)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-90"
              title="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % 3)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-90"
              title="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentTestimonial 
                    ? 'bg-emerald-500 w-5' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* 6. PERSUASIVE AGENCY ADVERTISEMENT */}
      <section className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Floating Background Icons */}
        <div className="absolute top-12 left-12 opacity-[0.05] animate-pulse">
          <TrendingUp className="w-16 h-16 text-emerald-400" />
        </div>
        <div className="absolute bottom-12 right-12 opacity-[0.05] animate-bounce" style={{ animationDuration: '6s' }}>
          <Megaphone className="w-20 h-20 text-indigo-400" />
        </div>
        <div className="absolute top-1/3 right-[15%] opacity-[0.04] animate-pulse">
          <Share2 className="w-14 h-14 text-pink-400" />
        </div>
        <div className="absolute bottom-1/3 left-[15%] opacity-[0.04] animate-bounce" style={{ animationDuration: '8s' }}>
          <Code className="w-12 h-12 text-teal-400" />
        </div>

        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center relative z-10 space-y-8"
        >
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Scale Your Company with Pulzitive
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We are a premier digital marketing agency platform offering battle-tested growth marketing suite for companies. Partner with Pulzitive to run targeted high-converting campaigns, build custom software platforms, optimize technical SEO structures, and publish authority-building visual content that consistently brings in high-value customers.
            </p>
          </div>

          {/* Key Agency Offerings Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left pt-4">
            <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-2.5 shadow-md">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xs font-extrabold text-slate-900">Paid Ads Dominance</h3>
              <p className="text-[10px] text-slate-600 leading-relaxed">High-ROAS campaigns on Google, Meta, and LinkedIn targeting direct conversion moments.</p>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-2.5 shadow-md">
              <Code className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-extrabold text-slate-900">Bespoke Web Dev</h3>
              <p className="text-[10px] text-slate-600 leading-relaxed">High-performance React & Next.js landing portals engineered to capture corporate leads.</p>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-2.5 shadow-md">
              <Award className="w-5 h-5 text-purple-600" />
              <h3 className="text-xs font-extrabold text-slate-900">Organic Keyword SEO</h3>
              <p className="text-[10px] text-slate-600 leading-relaxed">In-depth technical SEO, schema syndication, and keyword audits to win search rankings.</p>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-2.5 shadow-md">
              <Share2 className="w-5 h-5 text-sky-600" />
              <h3 className="text-xs font-extrabold text-slate-900">Content Authority</h3>
              <p className="text-[10px] text-slate-600 leading-relaxed">Custom blog articles, graphic banners, and cinematic short-form video editing.</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onOpenMergedModal || onOpenApptModal}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-8 py-3.5 rounded-xl cursor-pointer text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 animate-pulse"
            >
              Get Free Audit & Strategy Session
            </button>
            <button
              onClick={() => onNavigate('academy')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl cursor-pointer text-xs transition-all active:scale-95 shadow-md"
            >
              Learn
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
