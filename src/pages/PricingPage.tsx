/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Check, ShieldCheck, Sparkles, Award, Globe, Building2, 
  UserCheck, Flame, Laptop, Layers, BarChart3, Code, Share2, PenTool, CheckCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

interface PricingPageProps {
  onSelectPlan: (amount: number, planName: string) => void;
}

export default function PricingPage({ onSelectPlan }: PricingPageProps) {
  const [activeTab, setActiveTab] = useState<'academy' | 'marketing'>('academy');

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
      price: 15000, // wait! The description for Starter has price of ₦150,000! Let's make sure we put the actual numbers.
      // Let's set actual numbers:
      // Starter Growth Suite: ₦150,000 / month
      // Search & Social Dominance: ₦350,000 / month
      // Enterprise Web & Omnichannel: ₦750,000 / month
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

  const currentPlans = activeTab === 'academy' ? academyPlans : marketingPlans;

  return (
    <div className="bg-slate-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-10 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono shadow-inner">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Paystack Gateway
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Flexible Pricing built for <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
            Technical & Marketing Excellence.
          </span>
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Select between our flagship STEM Academy tuition course enrollments or our premium client digital marketing agency execution packages.
        </p>

        {/* Categories Tab Selector */}
        <div className="pt-6 flex justify-center">
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex gap-1.5 max-w-md w-full">
            <button
              onClick={() => setActiveTab('academy')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                activeTab === 'academy' 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>🎓 Tech Academy Tuition</span>
            </button>
            <button
              onClick={() => setActiveTab('marketing')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                activeTab === 'marketing' 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>💼 Marketing & Web Services</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Matrix */}
      <div className={`max-w-6xl mx-auto grid grid-cols-1 gap-6 items-stretch ${
        activeTab === 'academy' ? 'md:grid-cols-4' : 'md:grid-cols-3 max-w-5xl'
      }`}>
        {currentPlans.map((plan: any, idx) => (
          <div
            key={idx}
            className={`bg-slate-900/40 border rounded-2xl p-6 flex flex-col justify-between shadow-xl relative transition-all hover:scale-[1.01] hover:border-slate-700 ${
              plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-800'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3" /> Most Popular
              </span>
            )}

            <div className="space-y-5">
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <span className="text-[9px] font-mono tracking-wider bg-slate-950 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded uppercase">
                    {plan.badge}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2.5 tracking-tight">{plan.name}</h3>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed text-left min-h-12">{plan.desc}</p>

              {/* Price Tagging */}
              <div className="py-2.5 border-y border-slate-800/60 text-left space-y-1">
                <p className="text-2xl font-black text-white flex items-baseline gap-1.5">
                  <span>₦{(plan.price || plan.actualPrice || 0).toLocaleString()}</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    (~${Math.round((plan.price || plan.actualPrice || 0) / 600)} USD)
                  </span>
                  <span className="text-xs font-normal text-slate-400">/{plan.period}</span>
                </p>
                {plan.physicalPrice && (
                  <p className="text-xs font-semibold text-emerald-400/90 mt-1 flex items-center gap-1.5">
                    <span>Physical Labs: ₦{(plan.physicalPrice || 0).toLocaleString()}</span>
                    <span className="text-emerald-300 font-mono text-[10px]">(~${Math.round(plan.physicalPrice / 600)} USD)</span>
                    <span className="text-[9px] font-normal text-slate-400">/{plan.period}</span>
                  </p>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-[11px] text-slate-300 text-left">
                {plan.features.map((feature: string, fIdx: number) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-2">
              <button
                onClick={() => onSelectPlan(plan.price || plan.actualPrice, `${plan.name} (Online / ${plan.period})`)}
                className={`w-full font-black py-3 rounded-xl cursor-pointer text-xs transition-all shadow-md active:scale-98 ${
                  plan.popular 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white font-extrabold'
                }`}
              >
                {plan.btnLabel}
              </button>
              
              {plan.physicalBtnLabel && plan.physicalPrice && (
                <button
                  onClick={() => onSelectPlan(plan.physicalPrice!, `${plan.name} (Physical)`)}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-2.5 rounded-xl cursor-pointer text-xs transition-all shadow-sm active:scale-98"
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
