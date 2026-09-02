/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Newspaper, Calendar, ArrowRight, Award, Megaphone, Sparkles, Globe } from 'lucide-react';
import { AnimatedHeroTitle } from '../components/AnimatedHeroTitle';

export default function PRPage() {
  const articles = [
    {
      id: 'pr-1',
      title: 'Pulzitive Launches Integrated Full-Stack EdTech Hub & Agency Model',
      date: 'June 25, 2026',
      badge: 'Launch',
      summary: 'Today, Pulzitive formally launched a platform bridging corporate growth advisory with specialized marketing learning paths.',
      content: 'Under this new strategy, clients seeking high-performance search engine rankings and targeted Google/Meta campaigns can partner with certified students from the Pulzitive Academy, cultivating a sustainable recruitment funnel. "This unified approach allows us to deliver optimized business audits while empowering underrepresented talents with industry-grade certifications," noted Executive Consultant Salami Abiodun.'
    },
    {
      id: 'pr-2',
      title: 'Nigeria Developer Hackathon Announced with ₦1.5M Prize Pool',
      date: 'June 18, 2026',
      badge: 'Hackathon',
      summary: 'Pulzitive, in collaboration with Babajide Co-Op, is hosting a week-long virtual and physical sprint centered on building server-side AI applications.',
      content: 'The hackathon challenges student cohorts to develop functional web integrations with Google Gemini models. Best prototypes pass through client audits, and winners receive financial support, cloud hosting credits, and professional mentorship placement.'
    }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Floating Animated Icons */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-[8%] opacity-20 animate-bounce" style={{ animationDuration: '6s' }}>
          <Megaphone className="w-16 h-16 text-emerald-500" />
        </div>
        <div className="absolute bottom-1/4 right-[8%] opacity-20 animate-pulse" style={{ animationDuration: '4s' }}>
          <Newspaper className="w-20 h-20 text-indigo-500" />
        </div>
        <div className="absolute top-1/3 right-[15%] opacity-15 animate-bounce" style={{ animationDuration: '8s' }}>
          <Award className="w-14 h-14 text-pink-500" />
        </div>
        <div className="absolute bottom-1/3 left-[15%] opacity-15 animate-pulse" style={{ animationDuration: '5s' }}>
          <Sparkles className="w-12 h-12 text-teal-500" />
        </div>
        <div className="absolute top-1/2 left-[5%] opacity-15 animate-pulse" style={{ animationDuration: '7s' }}>
          <Globe className="w-14 h-14 text-emerald-500" />
        </div>
      </div>
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 relative z-10">
        <AnimatedHeroTitle 
          primaryText="Pulzitive News &"
          highlightText="Official Press Releases."
          dark={false}
          className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
        />
        <p className="text-xs text-slate-600 max-w-xl mx-auto font-medium">
          Read official updates from our executive consultancy, public education initiatives, and technology launches in Nigeria.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-12 relative z-10">
        {articles.map(article => (
          <article 
            key={article.id} 
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-slate-300 transition-all shadow-xs hover:shadow-lg space-y-4"
          >
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded uppercase font-bold">
                {article.badge}
              </span>
              <span className="text-slate-500 flex items-center gap-1.5 font-sans">
                <Calendar className="w-3.5 h-3.5" /> {article.date}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {article.title}
            </h2>

            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              {article.summary}
            </p>

            <div className="text-xs text-slate-600 leading-relaxed space-y-2 border-l-2 border-slate-200 pl-4">
              {article.content}
            </div>

            <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Pulzitive Press Relations</span>
              <a href="mailto:pulzitive@gmail.com" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors flex items-center gap-1">
                Contact Media <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
