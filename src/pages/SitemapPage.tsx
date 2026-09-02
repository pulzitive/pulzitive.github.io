/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Network, Home, BookOpen, ShoppingBag, Users, Layers, Newspaper, Shield, FileText, ArrowUpRight, Sparkles, Globe } from 'lucide-react';
import { AnimatedHeroTitle } from '../components/AnimatedHeroTitle';

interface SitemapPageProps {
  onNavigate: (page: string) => void;
}

export default function SitemapPage({ onNavigate }: SitemapPageProps) {
  const sections = [
    {
      title: 'Primary Entry points',
      description: 'The main gateways to the Pulzitive consulting and agency network.',
      items: [
        { name: 'Pulzitive Marketing Agency', page: 'home', icon: Home, desc: 'Digital marketing consultations, custom SEO audits, and agency growth strategic services.' },
        { name: 'Digital Academy Hub', page: 'academy', icon: Layers, desc: 'Interactive multi-role educational platform containing learning workspaces and tools.' },
      ]
    },
    {
      title: 'Academics & Curriculums',
      description: 'Our high-performance training courses and mentorship resources.',
      items: [
        { name: 'Course Catalog & Syllabus', page: 'courses', icon: BookOpen, desc: 'Professional certification courses spanning SEO, digital marketing campaigns, and analytics.' },
        { name: 'Mentorship Programs', page: 'community', icon: Users, desc: 'Cohort discussions, leaderboard tracks, and interactive collaborative workspaces.' },
      ]
    },
    {
      title: 'Storefronts & Memberships',
      description: 'Access templates and exclusive premium consulting subscriptions.',
      items: [
        { name: 'Resource Vault (Products)', page: 'marketplace', icon: ShoppingBag, desc: 'Purchase specialized growth templates, campaign blueprints, and SEO checklists.' },
        { name: 'Membership Plans & Pricing', page: 'pricing', icon: Layers, desc: 'Browse executive advisory packages, corporate memberships, and academic pricing tiers.' },
      ]
    },
    {
      title: 'Media & Legal Compliance',
      description: 'Public news reports and platform regulatory frameworks.',
      items: [
        { name: 'Press Releases & News', page: 'pr', icon: Newspaper, desc: 'Read official updates from our executive consultancy and tech community events.' },
        { name: 'Privacy Policy', page: 'privacy', icon: Shield, desc: 'Understand your personal data storage guidelines and Firestore safety rules.' },
        { name: 'Terms of Use', page: 'terms', icon: FileText, desc: 'The legal framework, licensing permissions, and refund rules of the Pulzitive Portal.' },
      ]
    }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Floating Animated Icons */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-[8%] opacity-20 animate-bounce" style={{ animationDuration: '6s' }}>
          <Network className="w-16 h-16 text-emerald-500" />
        </div>
        <div className="absolute bottom-1/4 right-[8%] opacity-20 animate-pulse" style={{ animationDuration: '4s' }}>
          <Globe className="w-20 h-20 text-indigo-500" />
        </div>
        <div className="absolute top-1/3 right-[15%] opacity-15 animate-bounce" style={{ animationDuration: '8s' }}>
          <Layers className="w-14 h-14 text-pink-500" />
        </div>
        <div className="absolute bottom-1/3 left-[15%] opacity-15 animate-pulse" style={{ animationDuration: '5s' }}>
          <Sparkles className="w-12 h-12 text-teal-500" />
        </div>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 relative z-10">
        <AnimatedHeroTitle 
          primaryText="Pulzitive Platform"
          highlightText="Directory & Sitemap Architecture."
          dark={false}
          className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
        />
        <p className="text-xs text-slate-600 max-w-xl mx-auto font-medium">
          Use our structured map to instantly navigate through digital consulting programs, premium product templates, student forums, and legal resources.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all shadow-xs space-y-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 tracking-wide uppercase">
                  {section.title}
                </h2>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {section.description}
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={itemIdx} 
                      onClick={() => onNavigate(item.page)}
                      className="group cursor-pointer p-3 rounded-xl border border-transparent hover:border-emerald-200 hover:bg-emerald-50/50 transition-all flex gap-3 items-start"
                    >
                      <div className="bg-slate-50 text-emerald-600 p-2 rounded-xl border border-slate-200 group-hover:text-emerald-700 group-hover:border-emerald-300 transition-all shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                          {item.name}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-emerald-600" />
                        </h3>
                        <p className="text-[10px] text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Schema Search notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-600 max-w-xl mx-auto leading-relaxed space-y-1">
          <p className="font-semibold text-slate-900">🤖 Search Engine Crawler Notice (SEO & GEO)</p>
          <p className="text-[10px]">This sitemap matches our integrated structured JSON-LD Organization schema perfectly, ensuring accurate indexing for Google, Bing, and generative AI search agents.</p>
        </div>

      </div>
    </div>
  );
}
