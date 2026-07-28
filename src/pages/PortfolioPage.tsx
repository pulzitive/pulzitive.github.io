import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, ExternalLink, ShieldCheck, TrendingUp, Sparkles, 
  Search, Filter, ArrowRight, Award, Zap, Building, LayoutGrid
} from 'lucide-react';
import { clientsList, ClientPortfolio } from '../data/clients';

interface PortfolioPageProps {
  onNavigate: (page: string) => void;
  onOpenAuditModal?: () => void;
  onOpenApptModal?: () => void;
  onOpenMergedModal?: () => void;
}

export default function PortfolioPage({ 
  onNavigate, 
  onOpenAuditModal, 
  onOpenApptModal,
  onOpenMergedModal
}: PortfolioPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<ClientPortfolio | null>(null);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(clientsList.map(c => {
    if (c.category.includes('/')) {
      return c.category.split('/')[0].trim();
    }
    return c.category;
  })))];

  // Filter clients
  const filteredClients = clientsList.filter(client => {
    const matchesCategory = selectedCategory === 'All' || 
      client.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.achieved.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs px-4 py-1.5 rounded-full uppercase tracking-wider font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Success Showcases</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Our Elite Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">Portfolio</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Discover how Pulzitive drives exponential growth, ranks industry-leading brands on Page 1 of Google, and designs conversion-engineered lead pipelines.
          </p>
          
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={onOpenMergedModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs cursor-pointer shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <span>Get Free Audit & Strategy Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Filters & Interactive Search Section */}
      <section className="py-8 bg-white/80 border-b border-slate-200 sticky top-16 z-30 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Categories Horizontal Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients or solutions..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Grid Portfolio Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredClients.map((client, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={client.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-300 transition-all group flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 relative"
              >
                {/* Visual Top Bar */}
                <div className="flex items-start justify-between mb-6">
                  {/* Stylized Logo Emblem */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-transform group-hover:scale-105 shadow-inner ${client.logoBg} ${client.logoTextColor}`}>
                    {client.logoEmblem}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider font-semibold">
                    {client.duration} Engagement
                  </span>
                </div>

                {/* Info Block */}
                <div className="space-y-3 mb-6 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                      {client.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {client.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {client.achieved}
                  </p>

                  <div className="pt-2">
                    <p className="text-[10px] text-slate-400 font-mono italic">
                      Logo Design: {client.logoDesc}
                    </p>
                  </div>
                </div>

                {/* Achievements Preview Metrics */}
                <div className="pt-4 border-t border-slate-100 space-y-3 text-left">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Key Achievements</p>
                  <div className="space-y-1.5">
                    {client.detailedMetrics.slice(0, 2).map((metric, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Award className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Interactive Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <a
                    href={`https://${client.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <button
                    onClick={() => setSelectedClient(client)}
                    className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all"
                  >
                    View Case Study
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No clients match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your search query or selecting another industry category.</p>
          </div>
        )}
      </section>

      {/* Trust & Agency Call To Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to Accelerate Your <span className="text-emerald-600">Business Revenue</span>?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Our SEO strategies, digital asset development, and multi-channel campaign architectures consistently deliver world-class client acquisitions. Join our network of elite accelerated portfolios.
          </p>

          <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 text-left shadow-inner">
            <div className="space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm">Pulzitive Guarantee</h4>
              <p className="text-xs text-slate-500 leading-relaxed">We focus strictly on ROI, clear KPIs, and custom reporting—no ungrounded metrics.</p>
            </div>
            <div className="space-y-2">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              <h4 className="font-bold text-slate-900 text-sm">Full Growth Pipeline</h4>
              <p className="text-xs text-slate-500 leading-relaxed">From comprehensive SEO audit and technical optimization to paid advertising campaigns.</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onOpenMergedModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs cursor-pointer transition-all shadow-md flex items-center gap-2"
            >
              <span>Get Free Audit & Strategy Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-xs text-slate-600"
            >
              {/* Header block with Logo */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner shrink-0 ${selectedClient.logoBg} ${selectedClient.logoTextColor}`}>
                    {selectedClient.logoEmblem}
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest">{selectedClient.category}</span>
                    <h3 className="text-lg font-bold text-slate-900">{selectedClient.name}</h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClient(null)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shrink-0 self-start sm:self-center shadow-sm"
                >
                  Close Case Study
                </button>
              </div>

              {/* Case Study Content body */}
              <div className="p-6 space-y-6 text-left">
                
                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <p className="text-[9px] font-mono text-slate-400 uppercase">Website Portal</p>
                    <a 
                      href={`https://${selectedClient.website}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <span>{selectedClient.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-slate-400 uppercase">Pulzitive Term</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedClient.duration}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[9px] font-mono text-slate-400 uppercase">Logo Aesthetic</p>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{selectedClient.logoDesc}</p>
                  </div>
                </div>

                {/* Section 1: Online Presence */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Online Presence & Brand Profile</span>
                  </h4>
                  <p className="leading-relaxed text-slate-600">
                    {selectedClient.onlinePresence}
                  </p>
                </div>

                {/* Section 2: What Pulzitive Achieved */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Growth Audits & Strategic Impact achieved by Pulzitive</span>
                  </h4>
                  <p className="leading-relaxed text-slate-600">
                    {selectedClient.achieved}
                  </p>
                </div>

                {/* Section 3: Hard Metrics */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Verified Growth & Traction Metrics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedClient.detailedMetrics.map((metric, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center space-y-1">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-600">
                          <Award className="w-3 h-3" />
                        </div>
                        <p className="font-extrabold text-slate-900 text-xs leading-tight">{metric}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom CTAs */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-4">
                <p className="text-[10px] text-slate-400 italic">Want similar SEO/SEM traction?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedClient(null);
                      if (onOpenMergedModal) onOpenMergedModal();
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer transition-all shadow-sm"
                  >
                    Get Free Audit & Strategy Session
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
