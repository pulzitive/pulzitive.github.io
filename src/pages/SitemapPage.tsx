/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Network, Home, BookOpen, ShoppingBag, Users, Layers, Newspaper, Shield, FileText, ArrowUpRight } from 'lucide-react';

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
    <div className="bg-slate-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3 mb-16">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
          <Network className="w-8 h-8 text-emerald-400" />
          Pulzitive Portal Sitemap
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Use our structured map to instantly navigate through digital consulting programs, premium product templates, student forums, and legal resources.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all shadow-xl space-y-4">
              <div>
                <h2 className="text-sm font-extrabold text-white tracking-wide uppercase">
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
                      className="group cursor-pointer p-3 rounded-xl border border-transparent hover:border-emerald-500/10 hover:bg-emerald-950/10 transition-all flex gap-3 items-start"
                    >
                      <div className="bg-slate-950 text-emerald-400 p-2 rounded-xl border border-slate-800 group-hover:text-emerald-300 group-hover:border-emerald-500/20 transition-all shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                          {item.name}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-emerald-400" />
                        </h3>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
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
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 text-center text-xs text-slate-400 max-w-xl mx-auto leading-relaxed space-y-1">
          <p className="font-semibold text-slate-300">🤖 Search Engine Crawler Notice (SEO & GEO)</p>
          <p className="text-[10px]">This sitemap matches our integrated structured JSON-LD Organization schema perfectly, ensuring accurate indexing for Google, Bing, and generative AI search agents.</p>
        </div>

      </div>
    </div>
  );
}
