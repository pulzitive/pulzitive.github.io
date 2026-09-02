/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Check, ShieldCheck, Sparkles, Award, Globe, Building2, 
  UserCheck, Flame, Laptop, Layers, BarChart3, Code, Share2, PenTool, CheckCircle, Video, Crown,
  CreditCard, Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedHeroTitle } from '../components/AnimatedHeroTitle';

interface PricingPageProps {
  onSelectPlan: (amount: number, planName: string) => void;
}

export default function PricingPage({ onSelectPlan }: PricingPageProps) {
  const [activeTab, setActiveTab] = useState<'academy' | 'marketing' | 'ministry'>('academy');

  const academyPlans = [
    {
      name: "Student / Parent Plan",
      price: 15000,
      physicalPrice: 30000,
      period: "course",
      desc: "Comprehensive coursework credentials for self-paced development or physical labs.",
      features: [
        "Enroll in all 3 flagship courses",
        "Track XP progress & earn Badges",
        "Direct Chat with assigned Mentors",
        "Request Sponsor Aid if needed",
        "Certified Completion Diploma"
      ],
      popular: true,
      btnLabel: "Enroll Online Class (₦15k)",
      physicalBtnLabel: "Enroll Physical Class (₦30k)",
      badge: "Flagship"
    },
    {
      name: "Facilitator Teacher Tier",
      price: 12000,
      physicalPrice: 25000,
      period: "course",
      desc: "Register and assign courses to cohorts. Earn 20% on course facilitation.",
      features: [
        "Bulk register students",
        "Cohort assignments tracking",
        "Earn 20% commission on referrals",
        "Teacher-only resource guidelines",
        "Active forum and sponsor access"
      ],
      popular: false,
      btnLabel: "Register Teacher (₦12k)",
      physicalBtnLabel: "Register Physical (₦25k)",
      badge: "Partner"
    },
    {
      name: "School / Institution Pack",
      price: 50000,
      physicalPrice: 100000,
      period: "course",
      desc: "For academies, colleges, and enterprise teams seeking bulk LMS licensing.",
      features: [
        "Uncapped student roster invites",
        "Complete school dashboard controls",
        "50% course fee discounts",
        "Google Workspace integrations",
        "Dedicated mentor-matching system"
      ],
      popular: false,
      btnLabel: "School Online (₦50k)",
      physicalBtnLabel: "School Physical (₦100k)",
      badge: "Enterprise"
    }
  ];

  const marketingPlans = [
    {
      name: "Starter Growth Suite",
      price: 150000,
      actualPrice: 150000,
      period: "month",
      desc: "Essential digital marketing setup to establish visibility and local presence.",
      features: [
        "Content Creation: 2 SEO blog articles & 5 professional graphic designs",
        "Social Media: Setup and daily scheduling across 1 primary platform",
        "Local SEO: Google Business listing and essential citations",
        "Weekly automated KPI performance dashboard updates"
      ],
      popular: false,
      btnLabel: "Subscribe Starter (₦150k)",
      badge: "Starter Launch"
    },
    {
      name: "Search & Social Dominance",
      price: 350000,
      actualPrice: 350000,
      period: "month",
      desc: "Aggressive search marketing and deep multi-platform engagement to accelerate customer inflow.",
      features: [
        "Search Engine Marketing (SEM): Google Ads & PPC setup with daily bid optimization",
        "Technical SEO: Advanced keyword audits, schema setup & Core Web Vitals tuning",
        "Content Creation: 4 articles, 12 graphic designs & 2 edited short-form videos",
        "Social Media: Daily scheduling and interaction across 2 platforms",
        "Advanced conversion pixel and pixel tracking installation"
      ],
      popular: true,
      btnLabel: "Subscribe Growth (₦350k)",
      badge: "Most Popular"
    },
    {
      name: "Enterprise Web & Omnichannel",
      price: 750000,
      actualPrice: 750000,
      period: "month",
      desc: "Full-stack software engineering integrated with custom digital campaign architecture.",
      features: [
        "Web Development: Custom React/Next.js high-performance landing portal built & deployed",
        "Content Creation: Weekly long-form articles, unlimited ad banners, 5 cinematic reels/shorts",
        "Omnichannel Ads: Active bids across Google, Meta, LinkedIn, and Bing search networks",
        "Weekly 1-on-1 strategy briefings with designated Acquisition Director",
        "Dedicated web development support and custom API integration pipelines"
      ],
      popular: false,
      btnLabel: "Subscribe Enterprise (₦750k)",
      badge: "Enterprise Scale"
    }
  ];

  const ministryPlans = [
    {
      name: "Starter Ministry",
      price: 75000,
      actualPrice: 75000,
      usdPrice: 120,
      period: "month",
      desc: "Ideal for growing local assemblies seeking consistent Sunday social media presence and edited reels.",
      features: [
        "4 Sunday Sermon Edited Reels (1 per week)",
        "Kinetic animated captions & subtitle styling",
        "Basic Sermon Series Title Graphic Pack",
        "Access to Global Intercession Wall",
        "Access to Ministers Directory",
        "72-Hour Turnaround SLA"
      ],
      popular: false,
      btnLabel: "Subscribe Starter (₦75k)",
      badge: "Local Church"
    },
    {
      name: "Growth Ministry",
      price: 175000,
      actualPrice: 175000,
      usdPrice: 280,
      period: "month",
      desc: "Designed for active ministries requiring multi-clip reels, YouTube highlights, and slide decks.",
      features: [
        "12 Sunday Sermon Reels (3 per week)",
        "1 Widescreen Sermon Highlight (10-15 min)",
        "Full Sermon Series Design Kit (Slides, Flyers, Lower Thirds)",
        "Dedicated Senior Video Specialist (Assigned Staff)",
        "Dreams & Visions Scriptural Review access",
        "48-Hour Priority Turnaround SLA"
      ],
      popular: true,
      btnLabel: "Subscribe Growth (₦175k)",
      badge: "Most Popular for Churches"
    },
    {
      name: "Apostolic Partner",
      price: 340000,
      actualPrice: 340000,
      usdPrice: 550,
      period: "month",
      desc: "Complete full-service media department for apostolic networks, conferences, and broadcast ministries.",
      features: [
        "24+ Sermon Reels & Short Clips (6 per week)",
        "Full Sunday Sermon Re-mastering & Color Grading",
        "Broadcast Lower Thirds & Custom Motion Graphics",
        "Conference & Crusade Media Coverage Support",
        "24/7 Dedicated Producer & Urgent 24-Hour SLA",
        "Multi-Campus Video Asset Distribution"
      ],
      popular: false,
      btnLabel: "Subscribe Apostolic (₦340k)",
      badge: "Full Media Department"
    }
  ];

  const currentPlans = activeTab === 'academy' 
    ? academyPlans 
    : activeTab === 'marketing' 
      ? marketingPlans 
      : ministryPlans;

  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blobs & Animated Floating Icons */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        {/* Floating Background Icons */}
        <div className="absolute top-1/4 left-[8%] opacity-20 animate-bounce" style={{ animationDuration: '6s' }}>
          <ShieldCheck className="w-16 h-16 text-emerald-500" />
        </div>
        <div className="absolute bottom-1/4 right-[8%] opacity-20 animate-pulse" style={{ animationDuration: '4s' }}>
          <Award className="w-20 h-20 text-indigo-500" />
        </div>
        <div className="absolute top-1/3 right-[15%] opacity-15 animate-bounce" style={{ animationDuration: '8s' }}>
          <Layers className="w-14 h-14 text-pink-500" />
        </div>
        <div className="absolute bottom-1/3 left-[15%] opacity-15 animate-pulse" style={{ animationDuration: '5s' }}>
          <Video className="w-12 h-12 text-teal-500" />
        </div>
        <div className="absolute top-1/2 left-[5%] opacity-15 animate-pulse" style={{ animationDuration: '7s' }}>
          <CreditCard className="w-14 h-14 text-emerald-500" />
        </div>
        <div className="absolute bottom-1/2 right-[6%] opacity-15 animate-bounce" style={{ animationDuration: '9s' }}>
          <Zap className="w-14 h-14 text-amber-500" />
        </div>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-10 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure Payment Gateway
        </div>
        <AnimatedHeroTitle 
          primaryText="Flexible Pricing built for"
          highlightText="Technical, Marketing & Ministry Excellence."
          dark={false}
          className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
        />
        <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
          Select between our TECH Academy tuition, Agency Digital Marketing growth suites, or EcclesiaHub Church Media subscription plans.
        </p>

        {/* Categories Tab Selector */}
        <div className="pt-6 flex justify-center">
          <div className="bg-slate-100 border border-slate-200 p-1.5 rounded-2xl flex flex-wrap gap-1.5 max-w-2xl w-full justify-center">
            <button
              onClick={() => setActiveTab('academy')}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'academy' 
                  ? 'bg-emerald-600 text-white font-black shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Tech Academy</span>
            </button>
            <button
              onClick={() => setActiveTab('marketing')}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'marketing' 
                  ? 'bg-emerald-600 text-white font-black shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Marketing & Web</span>
            </button>
            <button
              onClick={() => setActiveTab('ministry')}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'ministry' 
                  ? 'bg-emerald-600 text-white font-black shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Church Media (EcclesiaHub)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Matrix */}
      <div className={`max-w-6xl mx-auto grid grid-cols-1 gap-6 items-stretch relative z-10 ${
        activeTab === 'academy' ? 'md:grid-cols-3 max-w-5xl' : 'md:grid-cols-3 max-w-5xl'
      }`}>
        {currentPlans.map((plan: any, idx) => (
          <div
            key={idx}
            className={`bg-white border rounded-2xl p-6 flex flex-col justify-between shadow-xs relative transition-all hover:shadow-lg hover:border-slate-300 ${
              plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Flame className="w-3 h-3 text-white" /> Most Popular
              </span>
            )}

            <div className="space-y-5">
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <span className="text-[9px] font-mono tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase font-semibold">
                    {plan.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2.5 tracking-tight">{plan.name}</h3>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed text-left min-h-12">{plan.desc}</p>

              {/* Price Tagging */}
              <div className="py-2.5 border-y border-slate-200 text-left space-y-1">
                <p className="text-2xl font-black text-slate-900 flex items-baseline gap-1.5">
                  <span>₦{(plan.price || plan.actualPrice || 0).toLocaleString()}</span>
                  <span className="text-xs font-semibold text-emerald-600">
                    ({plan.usdPrice ? `$${plan.usdPrice} USD` : `~$${Math.round((plan.price || plan.actualPrice || 0) / 600)} USD`})
                  </span>
                  <span className="text-xs font-normal text-slate-500">/{plan.period}</span>
                </p>
                {plan.physicalPrice && (
                  <p className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
                    <span>Physical Labs: ₦{(plan.physicalPrice || 0).toLocaleString()}</span>
                    <span className="text-emerald-800 font-mono text-[10px]">(~${Math.round(plan.physicalPrice / 600)} USD)</span>
                    <span className="text-[9px] font-normal text-slate-500">/{plan.period}</span>
                  </p>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-[11px] text-slate-700 text-left">
                {plan.features.map((feature: string, fIdx: number) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-2">
              <button
                onClick={() => onSelectPlan(plan.price || plan.actualPrice, `${plan.name} (${plan.period})`)}
                className={`w-full font-black py-3 rounded-xl cursor-pointer text-xs transition-all shadow-sm active:scale-98 ${
                  plan.popular 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-black' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white font-extrabold'
                }`}
              >
                {plan.btnLabel}
              </button>
              
              {plan.physicalBtnLabel && plan.physicalPrice && (
                <button
                  onClick={() => onSelectPlan(plan.physicalPrice!, `${plan.name} (Physical)`)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 font-extrabold py-2.5 rounded-xl cursor-pointer text-xs transition-all shadow-xs active:scale-98"
                >
                  {plan.physicalBtnLabel}
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
