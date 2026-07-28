/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Newspaper, Calendar, ArrowRight, Award, Megaphone } from 'lucide-react';

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
    <div className="bg-slate-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3 mb-16">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
          <Newspaper className="w-8 h-8 text-emerald-400" />
          Pulzitive News & Press releases
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Read official updates from our executive consultancy, public education initiatives, and technology launches in Nigeria.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-12">
        {articles.map(article => (
          <article 
            key={article.id} 
            className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 sm:p-8 hover:border-slate-800 transition-all shadow-xl space-y-4"
          >
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="bg-slate-950 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded uppercase font-bold">
                {article.badge}
              </span>
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {article.date}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              {article.title}
            </h2>

            <p className="text-xs font-semibold text-slate-300 leading-relaxed">
              {article.summary}
            </p>

            <div className="text-xs text-slate-400 leading-relaxed space-y-2 border-l-2 border-slate-800 pl-4">
              {article.content}
            </div>

            <div className="pt-4 border-t border-slate-800/40 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Pulzitive Press Relations</span>
              <a href="mailto:pulzitive@gmail.com" className="hover:text-white transition-colors flex items-center gap-1">
                Contact Media <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
