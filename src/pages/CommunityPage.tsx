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
    <div className="bg-slate-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Where Learning Meets <br />
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
            Global Tech Leaders.
          </span>
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Join our network of certified students, professional mentors, and corporate sponsors. Collaborate, solve challenges, and win digital marketing grants.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Cohorts (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" /> Active & Upcoming Learning Cohorts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cohorts.map((cohort, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="bg-slate-950 text-indigo-400 border border-indigo-500/15 px-2.5 py-0.5 rounded uppercase">
                      {cohort.type}
                    </span>
                    <span className="text-emerald-400 font-bold">{cohort.startDate}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{cohort.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">{cohort.desc}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Duration: {cohort.duration}</span>
                  <span>Seats: {cohort.capacity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Free Webinars to Incentivize Premium Upsell */}
          <div className="bg-gradient-to-br from-indigo-950/25 via-slate-900/40 to-emerald-950/15 border border-slate-900 rounded-3xl p-6 space-y-6">
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-mono font-bold">
                🔥 Free Webinars
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Upcoming Free Webinars
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Join our free live masterclasses completely free! Gain essential digital marketing insights, interact with live mentors, and start your journey. All webinars are free to incentivize enrollment in our <span className="text-indigo-400 font-bold">Premium Live 4-Hour Compact Sessions</span> for advanced, high-density practical learning and career-ready certifications.
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
                  className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-850 transition-all text-left shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                        WEBINAR • FREE
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">{rc.points}</span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{rc.title}</h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-1">{rc.desc}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-900/60 flex items-center justify-between gap-2">
                    <span className="text-[9px] font-mono text-slate-500">{rc.schedule}</span>
                    <button
                      onClick={() => onTriggerNotification?.(`Success! You have registered for the free live webinar "${rc.title}". Check your email for calendar invite & Google Meet streaming access link.`)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-lg text-[10px] transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-md"
                    >
                      Register Free Webinar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Initiatives */}
          <div className="border-t border-slate-900 pt-8 space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Community Outreach & Hackathons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {initiatives.map((ini, idx) => {
                const Icon = ini.icon;
                return (
                  <div key={idx} className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-3 hover:border-slate-850 transition-all">
                    <div className={`${ini.color} w-9 h-9 rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-bold text-white">{ini.title}</h3>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{ini.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Job Board */}
          <div className="border-t border-slate-900 pt-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2 text-white">
                  <Briefcase className="w-5 h-5 text-indigo-400" /> Active Technical Job Board
                </h2>
                <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Vetted contracting opportunities for our certified graduates</p>
              </div>
            </div>
            <div className="space-y-4">
              {jobs.map(job => (
                <div 
                  key={job.id} 
                  className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 hover:border-slate-850 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1.5 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-white leading-tight">{job.title}</h3>
                      <span className="bg-slate-950 text-indigo-400 border border-indigo-400/20 text-[9px] font-mono px-2 py-0.2 rounded uppercase">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-gray-300">{job.company} • <span className="text-slate-400">{job.location}</span></p>
                    <p className="text-[10px] text-slate-400 leading-relaxed max-w-xl">{job.description}</p>
                    <p className="text-[10px] font-mono text-emerald-400 font-bold">{job.salary}</p>
                  </div>
                  <button
                    onClick={() => handleApplyJob(job)}
                    className="bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-all shrink-0 self-stretch sm:self-auto text-center"
                  >
                    Apply Contract
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Mentorship & Matching Board (Right col) */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 h-fit space-y-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Mentor Directory Match
            </h3>
            <p className="text-[10px] text-gray-500 mt-1">Matched directly during student dashboard setup:</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white uppercase">
                SC
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-white truncate">Dr. Sarah Carter</p>
                <p className="text-[10px] text-indigo-400 font-mono">EX-GOOGLE STAFF ENGINE</p>
                <p className="text-[9px] text-slate-500">Curriculum Lead / Advanced LLM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white uppercase">
                BA
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-white truncate">Mr. Babajide Alao</p>
                <p className="text-[10px] text-indigo-400 font-mono">META CERTIFIED DEV</p>
                <p className="text-[9px] text-slate-500">React Specialist / Cohorts Organizer</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Professional Matching
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Mentees receive dedicated chat tabs. Mentors earn 10% commission on facilitated course enrollment fees. Apply to become a mentor via the settings tab.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
