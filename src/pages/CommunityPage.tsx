/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, Award, Calendar, Heart, Globe, ExternalLink, 
  ChevronRight, Sparkles, Code, CheckCircle2, Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedHeroTitle } from '../components/AnimatedHeroTitle';

interface CommunityPageProps {
  onTriggerNotification?: (text: string) => void;
}

export default function CommunityPage({ onTriggerNotification }: CommunityPageProps) {
  const [appliedJobIds, setAppliedJobIds] = React.useState<string[]>([]);

  const jobs = [
    {
      id: "j1",
      title: "Senior Full-Stack React Engineer",
      company: "Pulzitive (Client Project)",
      type: "Contract",
      location: "Lagos, NG (Hybrid)",
      salary: "₦850,000 - ₦1,200,000 / month",
      description: "Develop interactive multi-step programmatic ad dashboards and integrate custom payment modules with robust test suites."
    },
    {
      id: "j2",
      title: "PPC Media Buyer & Ads Manager",
      company: "Apex Tech Agency",
      type: "Part-time",
      location: "Remote (NG)",
      salary: "₦300,000 - ₦450,000 / month",
      description: "Perform daily keyword audits, manage bid optimizations on Google Ads, and prepare monthly conversion attribution insights."
    },
    {
      id: "j3",
      title: "SEO Content Specialist & Copywriter",
      company: "Zion EdTech Solutions",
      type: "Contract",
      location: "Remote (NG)",
      salary: "₦200,000 - ₦350,000 / month",
      description: "Draft high-ranking SEO-optimized articles, audit search rankings daily, and structure local schema profiles."
    }
  ];

  const handleApplyJob = (job: typeof jobs[0]) => {
    if (appliedJobIds.includes(job.id)) {
      onTriggerNotification?.(`You have already applied for the ${job.title} role.`);
      return;
    }
    setAppliedJobIds(prev => [...prev, job.id]);
    onTriggerNotification?.(`Successfully submitted application for: ${job.title}! Our team will review your profile.`);
  };

  const cohorts = [
    {
      title: "Full-Stack Dev Virtual Cohort 12",
      type: "Virtual",
      duration: "10 Weeks",
      startDate: "July 15, 2026",
      desc: "Comprehensive remote lectures matching student and Google developer mentors.",
      capacity: "120 Seats Max"
    },
    {
      title: "SEO & Growth Physical Accelerator",
      type: "Physical",
      duration: "6 Weeks",
      startDate: "August 01, 2026",
      desc: "Lagos Headquarters face-to-face workshop including site audit live labs.",
      capacity: "35 Seats Only"
    }
  ];

  const initiatives = [
    {
      title: "Pulzitive Cares (Digital Aid)",
      desc: "Our social program. We dedicate 5% of all course revenue to provide micro-sponsorships and laptops to high-motivation digital marketing students in underfunded regions.",
      icon: Heart,
      color: "text-rose-400 bg-rose-500/10"
    },
    {
      title: "Lagos Hackathon 2026",
      desc: "A bi-annual developer competition hosted by Pulzitive. Build generative AI client wrappers with Gemini. Prize pool includes ₦1,500,000 in sponsor grants.",
      icon: Code,
      color: "text-emerald-400 bg-emerald-500/10"
    },
    {
      title: "Virtual Mentor Roundtables",
      desc: "Weekly Google Meet conferences hosting engineering leads and product strategists, guiding students on curriculum alignment, resume building, and tech startup pitches.",
      icon: Users,
      color: "text-indigo-400 bg-indigo-500/10"
    }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 relative z-10">
        <AnimatedHeroTitle 
          primaryText="Where Learning Meets"
          highlightText="Global Tech Leaders."
          className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-950"
        />
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Join our network of certified students, professional mentors, and corporate sponsors. Collaborate, solve challenges, and win digital marketing grants.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Active Cohorts (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" /> Active & Upcoming Learning Cohorts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cohorts.map((cohort, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold px-2.5 py-0.5 rounded uppercase">
                      {cohort.type}
                    </span>
                    <span className="text-emerald-700 font-bold">{cohort.startDate}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{cohort.title}</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5">{cohort.desc}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Duration: {cohort.duration}</span>
                  <span>Seats: {cohort.capacity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Free Webinars to Incentivize Premium Upsell */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-mono font-bold shadow-xs">
                🔥 Free Webinars
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Upcoming Free Webinars
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed max-w-3xl">
                Join our free live masterclasses completely free! Gain essential digital marketing insights, interact with live mentors, and start your journey. All webinars are free to incentivize enrollment in our <span className="text-indigo-600 font-bold">Premium Live 4-Hour Compact Sessions</span> for advanced, high-density practical learning and career-ready certifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'webinar-funnels',
                  title: 'Mastering Conversion Funnels & Lead Capture',
                  desc: 'Discover how to map user flows, design high-converting landing pages, and capture leads without wasting ad spend.',
                  duration: 'Free Live Streaming',
                  points: '+100 XP',
                  schedule: 'Every Wednesday • 5PM WAT'
                },
                {
                  id: 'webinar-seo',
                  title: 'Introduction to Organic Search (SEO)',
                  desc: 'Unveil Google’s modern ranking signals, conduct rapid competitor keyword audits, and set up your organic search foundation.',
                  duration: 'Free Live Streaming',
                  points: '+150 XP',
                  schedule: 'Every Friday • 4PM WAT'
                },
                {
                  id: 'webinar-email',
                  title: 'Email Deliverability & Deliverance Secrets',
                  desc: 'Learn how to keep your automated newsletters out of the promotions/spam folders and drive massive click rates.',
                  duration: 'Free Live Streaming',
                  points: '+80 XP',
                  schedule: 'Bi-Weekly Monday • 6PM WAT'
                },
                {
                  id: 'webinar-leads',
                  title: 'Local Lead Generation for Small Businesses',
                  desc: 'A complete step-by-step masterclass on getting your first 10 paying agency clients using zero-budget organic hacks.',
                  duration: 'Free Live Streaming',
                  points: '+120 XP',
                  schedule: 'Every Saturday • 12PM WAT'
                },
                {
                  id: 'webinar-social',
                  title: 'Running High-ROAS Social Campaigns',
                  desc: 'Stop burning cash. Learn the exact audience-building and bid configurations that modern brands use to scale.',
                  duration: 'Free Live Streaming',
                  points: '+110 XP',
                  schedule: 'Monthly Special • 3PM WAT'
                },
                {
                  id: 'webinar-ai-marketing',
                  title: 'Mastering AI Tools for Digital Marketing & Automation',
                  desc: 'Learn how to leverage Gemini AI and automated workflows to write high-converting copy, generate campaign assets, and scale efficiency.',
                  duration: 'Free Live Streaming',
                  points: '+140 XP',
                  schedule: 'Bi-Weekly Tuesday • 5PM WAT'
                },
                {
                  id: 'webinar-pmax',
                  title: 'Google Performance Max & Multi-Channel Scaling',
                  desc: 'Deep dive into setting up Google PMax campaigns, asset groups, target ROAS bidding, and cross-channel tracking.',
                  duration: 'Free Live Streaming',
                  points: '+160 XP',
                  schedule: 'Monthly Special • 4PM WAT'
                },
                {
                  id: 'webinar-cro',
                  title: 'E-Commerce Conversion Rate Optimization (CRO) Secrets',
                  desc: 'Optimize online shop checkouts, reduce cart abandonment by 40%, and engineer frictionless customer buying journeys.',
                  duration: 'Free Live Streaming',
                  points: '+130 XP',
                  schedule: 'Every Thursday • 6PM WAT'
                },
                {
                  id: 'webinar-b2b',
                  title: 'B2B Client Acquisition & High-Ticket Cold Email Strategy',
                  desc: 'Craft irresistible B2B value propositions, build verified prospect lists, and book strategy sessions on autopilot.',
                  duration: 'Free Live Streaming',
                  points: '+150 XP',
                  schedule: 'Bi-Weekly Friday • 5PM WAT'
                },
                {
                  id: 'webinar-tiktok',
                  title: 'TikTok & Short-Form Video Content for Viral Growth',
                  desc: 'Master hook psychology, audio trends, and organic video storytelling to generate thousands of qualified leads.',
                  duration: 'Free Live Streaming',
                  points: '+120 XP',
                  schedule: 'Every Sunday • 3PM WAT'
                },
                {
                  id: 'webinar-gigs',
                  title: 'Cross-Border Freelancing & Talent Marketplace Mastery',
                  desc: 'Position your skills for global clients, craft winning proposals, and command premium rates on talent networks.',
                  duration: 'Free Live Streaming',
                  points: '+170 XP',
                  schedule: 'Monthly Special • 2PM WAT'
                },
                {
                  id: 'webinar-analytics',
                  title: 'Building Scalable Lead Generation Pipelines with Analytics',
                  desc: 'Connect Google Analytics 4, Tag Manager, and custom dashboards to track precise ROI across all marketing channels.',
                  duration: 'Free Live Streaming',
                  points: '+180 XP',
                  schedule: 'Every Monday • 5PM WAT'
                }
              ].map((rc) => (
                <div 
                  key={rc.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 transition-all text-left shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                        WEBINAR • FREE
                      </span>
                      <span className="text-[10px] text-indigo-700 font-mono font-bold">{rc.points}</span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">{rc.title}</h4>
                      <p className="text-[10.5px] text-slate-600 leading-relaxed mt-1">{rc.desc}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[9px] font-mono font-bold text-slate-500">{rc.schedule}</span>
                    <button
                      onClick={() => onTriggerNotification?.(`Success! You have registered for the free live webinar "${rc.title}". Check your email for calendar invite & Google Meet streaming access link.`)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg text-[10px] transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-xs"
                    >
                      <span className="text-white font-extrabold">Register Free Webinar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Initiatives */}
          <div className="border-t border-slate-200 pt-8 space-y-6">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> Community Outreach & Hackathons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {initiatives.map((ini, idx) => {
                const Icon = ini.icon;
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-slate-300 hover:shadow-md transition-all shadow-xs">
                    <div className={`${ini.color} w-9 h-9 rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{ini.title}</h3>
                    <p className="text-[10px] text-slate-600 leading-relaxed">{ini.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Job Board */}
          <div className="border-t border-slate-200 pt-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2 text-slate-900">
                  <Briefcase className="w-5 h-5 text-indigo-600" /> Active Technical Job Board
                </h2>
                <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Vetted contracting opportunities for our certified graduates</p>
              </div>
            </div>
            <div className="space-y-4">
              {jobs.map(job => (
                <div 
                  key={job.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs"
                >
                  <div className="space-y-1.5 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{job.title}</h3>
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700">{job.company} • <span className="text-slate-500">{job.location}</span></p>
                    <p className="text-[10px] text-slate-600 leading-relaxed max-w-xl">{job.description}</p>
                    <p className="text-[10px] font-mono text-emerald-700 font-bold">{job.salary}</p>
                  </div>
                  <button
                    onClick={() => handleApplyJob(job)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-all shrink-0 self-stretch sm:self-auto text-center shadow-xs"
                  >
                    Apply Contract
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Mentorship & Matching Board (Right col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit space-y-5 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Mentor Directory Match
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Matched directly during student dashboard setup:</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 uppercase">
                SC
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-slate-900 truncate">Dr. Sarah Carter</p>
                <p className="text-[10px] text-indigo-600 font-mono font-bold">EX-GOOGLE STAFF ENGINE</p>
                <p className="text-[9px] text-slate-500">Curriculum Lead / Advanced LLM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 uppercase">
                BA
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-slate-900 truncate">Mr. Babajide Alao</p>
                <p className="text-[10px] text-indigo-600 font-mono font-bold">META CERTIFIED DEV</p>
                <p className="text-[9px] text-slate-500">React Specialist / Cohorts Organizer</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Professional Matching
            </h4>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              Mentees receive dedicated chat tabs. Mentors earn 10% commission on facilitated course enrollment fees. Apply to become a mentor via the settings tab.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
