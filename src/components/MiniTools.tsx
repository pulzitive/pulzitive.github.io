import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Copy, 
  Trash2, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Play, 
  RotateCcw, 
  ArrowRight, 
  Calculator, 
  Award, 
  Sparkles, 
  Link2, 
  RefreshCw, 
  Mail, 
  Monitor, 
  Smartphone,
  Download,
  Edit2,
  Lock,
  Search,
  ExternalLink,
  DollarSign,
  Globe,
  Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveUtmLink, getUtmLinks } from '../firebase';
import { UtmLink, UserProfile } from '../types';

interface MiniToolsProps {
  currentUser: UserProfile | null;
  onBookAppointment?: () => void;
  showcaseOnly?: boolean; // If true, only show the 3 best tools for the homepage showcase
  defaultToolId?: string;
  onNavigate?: (page: string) => void;
  onOpenAuthModal?: () => void;
}

export function MiniTools({ currentUser, onBookAppointment, showcaseOnly = false, defaultToolId, onNavigate, onOpenAuthModal }: MiniToolsProps) {
  const [activeTool, setActiveTool] = useState<string>(defaultToolId || (showcaseOnly ? 'roas' : 'roas'));

  const toolsList = [
    {
      id: 'roas',
      name: 'Funnel & ROAS Calculator',
      desc: 'Analyze ad spend, CTR, conversion rate, and average order value to project campaign ROAS and CPA.',
      icon: DollarSign,
      isBest: true,
      category: 'Paid Ads'
    },
    {
      id: 'adcopy',
      name: 'AI Ad Copy Architect',
      desc: 'Assemble high-converting Meta and Google ad headlines and copy structures tailored to your industry.',
      icon: Sparkles,
      isBest: true,
      category: 'Copywriting'
    },
    {
      id: 'seo',
      name: 'SEO Content Auditor',
      desc: 'Audit page title tags and meta descriptions against search engine truncation rules in real-time.',
      icon: Globe,
      isBest: true,
      category: 'SEO'
    },
    {
      id: 'grader',
      name: 'Cold Email Grader',
      desc: 'Get an instant 0-100 score and brutal, line-by-line feedback on your cold outreach.',
      icon: Award,
      isBest: false,
      category: 'Outreach'
    },
    {
      id: 'calculator',
      name: 'Problem Cost Calculator',
      desc: 'Calculate the alarming annual financial impact of your operational bottlenecks.',
      icon: Calculator,
      isBest: false,
      category: 'Strategy'
    },
    {
      id: 'generator',
      name: 'Startup Tagline Generator',
      desc: 'Generate 10 dynamic taglines including bold, luxury, minimalist, and "cursed" styles.',
      icon: Sparkles,
      isBest: false,
      category: 'Branding'
    },
    {
      id: 'game',
      name: '"Real or AI?" Brand Game',
      desc: 'Can you distinguish between legendary human taglines and AI-generated ones?',
      icon: Play,
      isBest: false,
      category: 'Branding'
    },
    {
      id: 'quiz',
      name: 'Marketing Superpower Quiz',
      desc: 'Find your archetype and unlock personalized strategy pathways in 5 quick questions.',
      icon: CheckCircle,
      isBest: false,
      category: 'Strategy'
    },
    {
      id: 'utm',
      name: 'Internal UTM Link Builder',
      desc: 'Build, audit, and share trackable marketing links in a unified team database.',
      icon: Link2,
      isBest: false,
      category: 'Analytics'
    },
    {
      id: 'repurposer',
      name: 'Content Repurposer',
      desc: 'Convert high-performing long content into X posts, LinkedIn hooks, and plain text emails.',
      icon: RefreshCw,
      isBest: false,
      category: 'Social'
    },
    {
      id: 'subject_line',
      name: 'Subject Line Previewer',
      desc: 'Test your subject line against mobile/desktop inboxes and check for active spam traps.',
      icon: Mail,
      isBest: false,
      category: 'Outreach'
    },
    {
      id: 'brief',
      name: 'Campaign Brief Generator',
      desc: 'Expand 5 quick strategy answers into a print-ready, one-page strategic brief.',
      icon: FileText,
      isBest: false,
      category: 'Strategy'
    }
  ];

  // If we're on the homepage, only showcase the 3 best tools
  const displayedTools = showcaseOnly 
    ? toolsList.filter(t => t.isBest) 
    : toolsList;

  if (showcaseOnly) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4" id="mini-tools-showcase-section">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:border-slate-300/80">
          
          {/* Top Segmented Tabs bar */}
          <div className="bg-slate-50/80 border-b border-slate-100 p-4 sm:p-6">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3 text-center sm:text-left">
              Featured Mini-Tools
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {displayedTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl transition-all border text-left cursor-pointer ${
                      isActive 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                    id={`btn-select-tool-${tool.id}`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs truncate">{tool.name}</span>
                      </div>
                      <p className={`text-[9px] truncate font-medium ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        {tool.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Tool descriptive summary */}
            <div className="mt-4 bg-white/60 rounded-xl p-3 border border-slate-100 text-center sm:text-left">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                <span className="inline-block bg-slate-100 text-slate-700 font-bold text-[9px] px-1.5 py-0.5 rounded mr-2">
                  Best Tool
                </span>
                {displayedTools.find(t => t.id === activeTool)?.desc}
              </p>
            </div>
          </div>

          {/* Core Interactive tool workspace */}
          <div className="p-6 sm:p-8 flex-grow min-h-[480px] bg-white flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-grow flex flex-col"
              >
                {activeTool === 'roas' && <RoasSimulatorTool onBook={onBookAppointment} />}
                {activeTool === 'adcopy' && <AdCopyArchitectTool />}
                {activeTool === 'seo' && <SeoContentAuditorTool />}
                {activeTool === 'grader' && <EmailGraderTool onBook={onBookAppointment} />}
                {activeTool === 'calculator' && <ProblemCostCalculatorTool onBook={onBookAppointment} />}
                {activeTool === 'generator' && <StartupTaglineGeneratorTool />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Elegant integrated footer with full suite promotion */}
          <div className="bg-indigo-50 border-t border-indigo-100/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1 max-w-lg">
              <p className="text-xs text-indigo-950 font-semibold leading-relaxed">
                Want to unlock all 9 growth-focused mini-tools, save campaigns, and share tracking parameters with your teammates?
              </p>
            </div>
            <button 
              type="button"
              onClick={() => {
                if (currentUser) {
                  onNavigate?.('dashboard');
                } else if (onOpenAuthModal) {
                  onOpenAuthModal();
                } else {
                  onNavigate?.('dashboard');
                }
              }}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer text-center shrink-0"
            >
              Start to Unlock Full Suite
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8" id="mini-tools-section">
      {!showcaseOnly && (
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Vibe-Coding Grow-Tools
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">
            A powerful suite of offline-first and AI-assisted performance tools to scale your brand and workflow.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation panel */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
            Select a Mini-Tool
          </h3>
          <div className="flex flex-col gap-2">
            {displayedTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`flex items-start text-left p-4 rounded-xl transition-all border ${
                    isActive 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                  id={`btn-select-tool-${tool.id}`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${isActive ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{tool.name}</span>
                      {tool.isBest && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'}`}>
                          Best Tool
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                      {tool.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-grow flex flex-col"
            >
              {activeTool === 'roas' && <RoasSimulatorTool onBook={onBookAppointment} />}
              {activeTool === 'adcopy' && <AdCopyArchitectTool />}
              {activeTool === 'seo' && <SeoContentAuditorTool />}
              {activeTool === 'grader' && <EmailGraderTool onBook={onBookAppointment} />}
              {activeTool === 'calculator' && <ProblemCostCalculatorTool onBook={onBookAppointment} />}
              {activeTool === 'generator' && <StartupTaglineGeneratorTool />}
              {activeTool === 'game' && <BrandTaglineGameTool />}
              {activeTool === 'quiz' && <MarketingSuperpowerQuizTool onBook={onBookAppointment} />}
              {activeTool === 'utm' && <UtmLinkBuilderTool currentUser={currentUser} />}
              {activeTool === 'repurposer' && <ContentRepurposerTool />}
              {activeTool === 'subject_line' && <SubjectLinePreviewerTool />}
              {activeTool === 'brief' && <CampaignBriefGeneratorTool />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   0A. FUNNEL & ROAS SIMULATOR
   ========================================================================== */
function RoasSimulatorTool({ onBook }: { onBook?: () => void }) {
  const [adSpend, setAdSpend] = useState<number>(150000);
  const [ctr, setCtr] = useState<number>(2.5);
  const [convRate, setConvRate] = useState<number>(3.0);
  const [aov, setAov] = useState<number>(15000);

  const clicks = Math.round(adSpend / 150);
  const conversions = Math.round(clicks * (convRate / 100));
  const cpa = Math.round(adSpend / Math.max(1, conversions));
  const roas = (((conversions * aov) / adSpend)).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" /> Funnel & ROAS Calculator
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Adjust ad spend, CTR, conversion rate, and average order value to model real-time campaign performance and return on ad spend.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 text-xs text-slate-700">
          <div className="space-y-1">
            <div className="flex justify-between font-bold">
              <span className="text-slate-600">Monthly Ad Budget</span>
              <span className="text-emerald-600 font-extrabold">₦{adSpend.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={2000000}
              step={10000}
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-100 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Click-Through Rate (CTR)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="20"
                  value={ctr}
                  onChange={(e) => setCtr(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
                <span className="absolute right-2.5 top-2 text-slate-400 font-bold">%</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Conversion Rate</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="50"
                  value={convRate}
                  onChange={(e) => setConvRate(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
                <span className="absolute right-2.5 top-2 text-slate-400 font-bold">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Average Order Value (AOV)</label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-emerald-600 font-bold">₦</span>
              <input
                type="number"
                value={aov}
                onChange={(e) => setAov(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 pl-6 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Projected Metrics Card */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-3">
              Projected Performance Output
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-mono">Estimated Clicks</span>
                <span className="text-xl font-black">{clicks.toLocaleString()}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">@ ₦150 Avg. CPC</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-mono">Estimated Sales</span>
                <span className="text-xl font-black">{conversions.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-mono">Cost per Sale (CPA)</span>
                <span className="text-xl font-black text-indigo-300">₦{cpa.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-mono">Projected ROAS</span>
                <span className={`text-xl font-black ${Number(roas) >= 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {roas}x
                </span>
              </div>
            </div>
          </div>

          {onBook && (
            <button
              onClick={onBook}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Book Strategy Meeting To Scale ROAS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   0B. AI AD COPY ARCHITECT
   ========================================================================== */
function AdCopyArchitectTool() {
  const [industry, setIndustry] = useState('E-commerce');
  const [tone, setTone] = useState('Persuasive');
  const [proposition, setProposition] = useState('Handcrafted corporate luxury leather shoes with fast delivery');
  const [headlines, setHeadlines] = useState<string[]>([
    'Handcrafted Corporate Leather',
    'Premium Custom Fit | Shop Now',
    'Free Shipping Nationwide'
  ]);
  const [description, setDescription] = useState(
    'Get your high-quality handcrafted corporate luxury leather shoes delivered fast. Browse our collections today and claim a 15% discount on checkout.'
  );

  const handleGenerate = () => {
    let hl1 = '';
    let hl2 = '';
    let hl3 = '';
    let desc = '';

    if (industry === 'E-commerce') {
      hl1 = `${proposition.slice(0, 25)}`;
      hl2 = 'Premium Custom Fit | Shop Now';
      hl3 = 'Free Shipping Nationwide';
      desc = `Get your high-quality ${proposition.toLowerCase()} delivered fast. Browse our collections today and claim a 15% discount on checkout.`;
    } else if (industry === 'B2B SaaS') {
      hl1 = 'Optimize Business Workflows';
      hl2 = 'Enterprise Cloud Analytics';
      hl3 = 'Request Free Live Demo';
      desc = `Empower your distributed teams with advanced analytics. Secure, fast, and scalable integration designed to accelerate brand growth and intelligence.`;
    } else if (industry === 'Local Business') {
      hl1 = 'Premium Local Services';
      hl2 = 'Trusted Expert Craft';
      hl3 = 'Call For Free Booking';
      desc = `Looking for trusted experts nearby? We provide high-quality services tailored to your budget. Contact us today for reliable and certified specialists!`;
    } else {
      hl1 = 'Exclusive Premium Estates';
      hl2 = 'Luxurious Modern Living';
      hl3 = 'Schedule Elite Private Tour';
      desc = `Invest in prime locations with high resale value. Discover beautiful contemporary designs, secure neighborhoods, and modern premium smart features.`;
    }

    setHeadlines([hl1 || 'Premium Selection', hl2, hl3]);
    setDescription(desc);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" /> AI Ad Copy Architect
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Generate optimized headlines and primary ad copy structure for Meta Ads, Google Ads, and promotional campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="E-commerce">E-commerce / Retail</option>
                <option value="B2B SaaS">B2B Software / SaaS</option>
                <option value="Local Business">Local Service Agency</option>
                <option value="Real Estate">Real Estate</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Ad Copy Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="Persuasive">Persuasive / Direct</option>
                <option value="Curious">Curious / Open-loop</option>
                <option value="Urgent">FOMO / High Urgency</option>
                <option value="Professional">Professional / Benefit</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Value Proposition / Main Offer</label>
            <input
              type="text"
              value={proposition}
              onChange={(e) => setProposition(e.target.value)}
              placeholder="e.g. Handmade corporate luxury leather shoes with fast delivery"
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Assemble Optimized Copy Structure
          </button>
        </div>

        {/* Output simulator */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3.5 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 block">
              Meta Ads Manager Preview Studio
            </span>

            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">
                Generated Headlines (Max 30 Chars)
              </span>
              {headlines.map((hl, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700/60 p-2 rounded-lg text-xs font-mono flex justify-between items-center">
                  <span className="truncate max-w-[200px]">{hl}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${hl.length <= 30 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {hl.length}/30
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">
                Primary Description Copy
              </span>
              <p className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-lg text-xs leading-relaxed text-slate-200">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   0C. SEO CONTENT AUDITOR
   ========================================================================== */
function SeoContentAuditorTool() {
  const [seoTitle, setSeoTitle] = useState('Pulzitive Executive Growth & Performance Marketing Academy');
  const [seoDesc, setSeoDesc] = useState('Master digital growth, campaign optimization, paid ads performance, and search engine optimization with accredited certifications and live sandbox playgrounds.');

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-teal-600" /> SEO Content Auditor
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Audit page titles and meta description tags against Google Search Engine Results Page (SERP) truncation rules in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 text-xs text-slate-700">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">SEO Page Title Tag</label>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                seoTitle.length >= 50 && seoTitle.length <= 60 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}>
                {seoTitle.length} Chars ({seoTitle.length >= 50 && seoTitle.length <= 60 ? 'Optimal' : 'Needs Adjusting'})
              </span>
            </div>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold"
            />
            <p className="text-[9px] text-slate-400">Recommended title length: 50–60 characters to avoid truncation on desktop search.</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Meta Description Tag</label>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                seoDesc.length >= 145 && seoDesc.length <= 160 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}>
                {seoDesc.length} Chars ({seoDesc.length >= 145 && seoDesc.length <= 160 ? 'Optimal' : 'Needs Adjusting'})
              </span>
            </div>
            <textarea
              rows={3}
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-medium"
            />
            <p className="text-[9px] text-slate-400">Recommended description length: 145–160 characters for maximum search click-through rate.</p>
          </div>
        </div>

        {/* Google SERP Snippet Preview */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 block">
              Google Search Snippet Preview
            </span>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 text-left">
              <p className="text-xs text-[#1a0dab] font-sans font-medium hover:underline cursor-pointer truncate">
                {seoTitle || 'Insert Page Title'}
              </p>
              <p className="text-[10px] text-[#006621] font-sans flex items-center gap-1 font-mono">
                https://pulzitive.com <span className="text-[8px] text-[#006621]">▼</span>
              </p>
              <p className="text-[11px] text-[#545454] font-sans leading-relaxed">
                {seoDesc.slice(0, 160) || 'Insert Meta description...'}
                {seoDesc.length > 160 && '...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   1. COLD EMAIL GRADER
   ========================================================================== */
function EmailGraderTool({ onBook }: { onBook?: () => void }) {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    totalScore: number;
    criteria: Array<{ name: string; score: number; tip: string }>;
  } | null>(null);

  const handleGrade = async () => {
    if (!emailText.trim()) {
      setError('Please paste your cold email text to grade.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/grade-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailText })
      });
      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to grade email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center">
          <Award className="h-5 w-5 mr-2 text-slate-900" /> Cold Email Grader
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Paste your pitch or outbound email. Our system grades it against 5 distinct conversion benchmarks and flags flaws quoting exact phrases.
        </p>
      </div>

      {!result ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Paste Cold Email Content
            </label>
            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder={`Subject: Quick Question\n\nDear executive,\n\nI hope this email finds you well. I am reaching out from ABC Solutions to empower your sales workflow with our state-of-the-art AI-driven engine. Let me know when you can call...`}
              className="w-full h-64 p-4 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all leading-relaxed bg-white text-slate-900 placeholder-slate-400"
              id="textarea-email-grader"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGrade}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            id="btn-grade-email"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Analyzing Outbound Strategy...</span>
              </>
            ) : (
              <>
                <span>Grade My Email Pitch</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-2xl gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Overall Deliverability Grade</h4>
              <p className="text-xs text-slate-400 mt-0.5">Based on 5 standard outbound friction variables</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                  <circle cx="40" cy="40" r="34" stroke={result.totalScore >= 75 ? "#10b981" : result.totalScore >= 50 ? "#f59e0b" : "#f43f5e"} strokeWidth="6" fill="transparent"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - result.totalScore / 100)}
                    strokeLinecap="round" />
                </svg>
                <span className="absolute text-xl font-bold text-slate-900">{result.totalScore}</span>
              </div>
              <div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  result.totalScore >= 75 ? 'bg-emerald-100 text-emerald-800' :
                  result.totalScore >= 50 ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {result.totalScore >= 75 ? 'Strong Outbound' : result.totalScore >= 50 ? 'Needs Refining' : 'Critical Failure'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Line-by-Line Critique</h4>
            {result.criteria.map((crit, idx) => (
              <div key={idx} className="border border-slate-150 rounded-xl p-4 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800">{crit.name}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    crit.score >= 15 ? 'bg-emerald-50 text-emerald-700' :
                    crit.score >= 10 ? 'bg-amber-50 text-amber-700' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                    {crit.score} / 20
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                  <div className={`h-full rounded-full ${
                    crit.score >= 15 ? 'bg-emerald-500' :
                    crit.score >= 10 ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`} style={{ width: `${(crit.score / 20) * 100}%` }} />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span>{crit.tip}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setResult(null)}
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-1"
            >
              <RotateCcw className="h-4 w-4" /> Grade Another Email
            </button>
            {onBook && (
              <button
                onClick={onBook}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-1 shadow-md shadow-blue-600/10"
              >
                Let Pulzitive Rewrite It <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   2. PROBLEM COST CALCULATOR
   ========================================================================== */
interface ProblemCostCalculatorProps {
  onBook?: () => void;
}

function ProblemCostCalculatorTool({ onBook }: ProblemCostCalculatorProps) {
  const [hoursWasted, setHoursWasted] = useState(5);
  const [affectedEmployees, setAffectedEmployees] = useState(10);
  const [hourlyWage, setHourlyWage] = useState(5000);
  const [lostOpportunities, setLostOpportunities] = useState(3);
  const [dealValue, setDealValue] = useState(150000);

  // Calculations
  const weeklyLaborWasted = hoursWasted * affectedEmployees * hourlyWage;
  const annualLaborWasted = weeklyLaborWasted * 52;
  
  const monthlyOpportunityCost = lostOpportunities * dealValue;
  const annualOpportunityCost = monthlyOpportunityCost * 12;

  const totalAnnualCost = annualLaborWasted + annualOpportunityCost;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-slate-900" /> Problem Cost Calculator
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Operational bottlenecks have a tangible annual financial drain. Estimate how much wasted staff hours and lost sales cost your company.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Friction Variables</h4>
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">Hours wasted per employee / week</label>
            <input
              type="number"
              min="0"
              value={hoursWasted}
              onChange={(e) => setHoursWasted(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">Number of affected employees</label>
            <input
              type="number"
              min="0"
              value={affectedEmployees}
              onChange={(e) => setAffectedEmployees(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">Average staff hourly rate (₦)</label>
            <input
              type="number"
              min="0"
              step="500"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">Lost opportunities / deals per month</label>
            <input
              type="number"
              min="0"
              value={lostOpportunities}
              onChange={(e) => setLostOpportunities(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">Average deal/project value (₦)</label>
            <input
              type="number"
              min="0"
              step="10000"
              value={dealValue}
              onChange={(e) => setDealValue(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Calculations Display */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Annual Cost Breakdown</h4>
            
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Annual Labor Cost Wasted:</span>
                <span className="font-semibold text-slate-700">₦{annualLaborWasted.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Annual Opportunity Loss:</span>
                <span className="font-semibold text-slate-700">₦{annualOpportunityCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-rose-100 my-2 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-800">Total Hidden Drain:</span>
                <span className="text-2xl font-extrabold text-rose-600">
                  ₦{totalAnnualCost.toLocaleString()} <span className="text-xs font-medium text-slate-400">/yr</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-rose-100 rounded-xl p-4 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Your Action Plan:</strong> By automating manual marketing triggers, refining outbound campaigns, and optimizing landing page architectures, we target to cut this operational loss by <strong>75%</strong>.
            </p>
            {onBook && (
              <button
                onClick={onBook}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Let's Fix This Bottleneck <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. STARTUP TAGLINE GENERATOR
   ========================================================================== */
function StartupTaglineGeneratorTool() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [taglines, setTaglines] = useState<Array<{ text: string; style: string }> | null>(null);

  const handleGenerate = async () => {
    if (!name.trim() || !description.trim()) {
      setError('Please fill in both product name and description.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/generate-taglines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();
      setTaglines(data.taglines || []);
    } catch (err) {
      console.error(err);
      setError('Failed to generate taglines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-slate-900" /> Startup Tagline Generator
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Type your company name and one-sentence offering. Our generator crafts 10 taglines under 8 words in diverse styles—excluding cliché ban words.
        </p>
      </div>

      {!taglines ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase">Product / Brand Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Slothly"
                className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase">What does it do? (One sentence)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Interactive tasks manager for lazy developers"
                className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
            <p className="text-[11px] text-slate-500 leading-relaxed flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-slate-400" />
              <span>Constraint: Ban-words actively enforced: <strong>"unlock"</strong>, <strong>"empower"</strong>, <strong>"supercharge"</strong>, <strong>"elevate"</strong>.</span>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Orchestrating Brand Voice...</span>
              </>
            ) : (
              <>
                <span>Generate Taglines</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Taglines Generated</h4>
            <button
              onClick={() => setTaglines(null)}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Start Over
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {taglines.map((item, idx) => (
              <div 
                key={idx} 
                className={`border rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all relative group bg-white ${
                  item.style === 'the cursed one' 
                    ? 'border-lime-300 bg-lime-50/20 font-mono' 
                    : item.style === 'luxury' 
                    ? 'border-amber-200 bg-amber-50/10 font-serif' 
                    : 'border-slate-150'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      item.style === 'the cursed one' ? 'bg-lime-200 text-lime-950' :
                      item.style === 'luxury' ? 'bg-amber-150 text-amber-900' :
                      item.style === 'bold' ? 'bg-slate-900 text-white' :
                      item.style === 'funny' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.style}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.text, idx)}
                      className="text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all p-1"
                      title="Copy to clipboard"
                    >
                      {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <p className={`text-sm font-bold mt-2 leading-relaxed ${item.style === 'the cursed one' ? 'text-lime-900' : 'text-slate-800'}`}>
                    "{item.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. BRAND TAGLINE TRIVIA GAME ("REAL OR AI?")
   ========================================================================== */
function BrandTaglineGameTool() {
  const gameData = [
    { text: "Think different.", isAi: false, desc: "Written by human. Apple's legendary 1997 advertising slogan." },
    { text: "Just do it.", isAi: false, desc: "Written by human. Nike's iconic slogan penned in 1988 by Dan Wieden." },
    { text: "Tasking: Elevating task intelligence.", isAi: true, desc: "Generated by AI. Classic over-engineered jargon." },
    { text: "Because you're worth it.", isAi: false, desc: "Written by human. L'Oreal's empowering slogan created in 1971." },
    { text: "Pure structures, smart solutions.", isAi: true, desc: "Generated by AI. Standard generic corporate filler." },
    { text: "The ultimate driving machine.", isAi: false, desc: "Written by human. BMW's trademark branding used since 1973." },
    { text: "Unlocking growth, empowering dreams.", isAi: true, desc: "Generated by AI. Contains forbidden cliché phrases." },
    { text: "Melts in your mouth, not in your hand.", isAi: false, desc: "Written by human. M&M's memorable slogan registered in 1954." },
    { text: "Supercharging your operational vectors.", isAi: true, desc: "Generated by AI. Composed of low-value marketing fluff." },
    { text: "Got milk?", isAi: false, desc: "Written by human. California Milk Processor Board's tagline created in 1993." }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'ended'>('playing');

  const handleAnswer = (choice: boolean) => {
    setUserAnswer(choice);
    const correct = choice === gameData[currentIdx].isAi;
    if (correct) {
      setScore(s => s + 1);
    }
    setGameState('feedback');
  };

  const handleNext = () => {
    if (currentIdx + 1 < gameData.length) {
      setCurrentIdx(i => i + 1);
      setUserAnswer(null);
      setGameState('playing');
    } else {
      setGameState('ended');
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setUserAnswer(null);
    setGameState('playing');
  };

  const currentItem = gameData[currentIdx];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center">
          <Play className="h-5 w-5 mr-2 text-slate-900" /> "Real or AI?" Slogan Trivia
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Test your branding intuition! Can you tell if these 10 taglines were penned by master advertising copywriters or generated by AI models?
        </p>
      </div>

      {gameState === 'playing' && (
        <div className="space-y-6 text-center py-6">
          <div className="inline-block bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-500">
            Tagline {currentIdx + 1} of {gameData.length}
          </div>
          
          <div className="bg-slate-50 border border-slate-150 p-8 rounded-2xl">
            <blockquote className="text-2xl font-serif italic font-semibold text-slate-800">
              "{currentItem.text}"
            </blockquote>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={() => handleAnswer(false)}
              className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all shadow-sm"
            >
              👩‍💻 Human Made
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm"
            >
              🤖 Generated by AI
            </button>
          </div>
        </div>
      )}

      {gameState === 'feedback' && (
        <div className="space-y-6 text-center py-6">
          <div className="inline-block bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-500">
            Reviewing Answer
          </div>

          {userAnswer === currentItem.isAi ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl space-y-3">
              <span className="text-4xl">🎉</span>
              <h4 className="text-xl font-bold text-emerald-800">Correct! Good Eye.</h4>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">{currentItem.desc}</p>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl space-y-3">
              <span className="text-4xl">❌</span>
              <h4 className="text-xl font-bold text-rose-800">Incorrect! Fooled You.</h4>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">{currentItem.desc}</p>
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all inline-flex items-center justify-center gap-1.5"
          >
            <span>{currentIdx + 1 === gameData.length ? 'See Final Score' : 'Next Tagline'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="space-y-6 text-center py-6">
          <div className="bg-slate-900 text-white p-8 rounded-2xl space-y-4">
            <span className="text-4xl">🏆</span>
            <h4 className="text-2xl font-extrabold">Quiz Completed!</h4>
            <p className="text-lg font-medium text-slate-300">
              Your Slogan Radar score: <span className="text-amber-400 font-bold">{score} / {gameData.length}</span>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              {score >= 8 
                ? 'Absolute Brand Maestro! You know premium, authentic copy when you see it.' 
                : score >= 5 
                ? 'Fairly Intuitive. AI marketing phrases are getting smarter—be careful out there!' 
                : 'Fooled by the bots! Your outbound copy needs that human, authentic edge from Pulzitive.'}
            </p>
          </div>

          <button
            onClick={resetGame}
            className="w-full max-w-xs border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all"
          >
            Play Slogan Game Again
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   5. ARCHETYPE PERSONALITY QUIZ
   ========================================================================== */
interface QuizProps {
  onBook?: () => void;
}

function MarketingSuperpowerQuizTool({ onBook }: QuizProps) {
  const quizData = [
    {
      q: "Your business launches a brand new premium product. What is your first instinct?",
      options: [
        { text: "Write an authentic, highly compelling founder letter.", score: "wordsmith" },
        { text: "Analyze competitor page structures and index key search fields.", score: "architect" },
        { text: "Launch immediate paid search bids targeting warm high-intent terms.", score: "hacker" },
        { text: "Design a sleek visual narrative and aesthetic mood palette.", score: "visionary" }
      ]
    },
    {
      q: "Which metric matters most to your team's success?",
      options: [
        { text: "Email open/click-through rates and high reader engagement.", score: "wordsmith" },
        { text: "Inbound organic traffic search rank and authority scores.", score: "architect" },
        { text: "Conversion rates, ad-spend yield, and immediate ROI.", score: "hacker" },
        { text: "Brand awareness, aesthetic sentiment, and emotional alignment.", score: "visionary" }
      ]
    },
    {
      q: "How do you view landing page navigation headers?",
      options: [
        { text: "Secondary to premium storytelling, but they must be simple.", score: "wordsmith" },
        { text: "Crucial vectors for search indexing crawlers.", score: "architect" },
        { text: "A dangerous funnel leak—they must be stripped entirely.", score: "hacker" },
        { text: "An elegant structural accent defining the brand hierarchy.", score: "visionary" }
      ]
    },
    {
      q: "What is your biggest pet peeve in modern campaigns?",
      options: [
        { text: "Cliché ban-words like 'unlock', 'empower' or generic fluff.", score: "wordsmith" },
        { text: "Slow initial page-loads due to bloated scripts.", score: "architect" },
        { text: "High ad-spend budgets that yield zero actual leads.", score: "hacker" },
        { text: "Messy layouts, unbalanced fonts, and cheap stock icons.", score: "visionary" }
      ]
    },
    {
      q: "What is your ultimate marketing dream tool?",
      options: [
        { text: "A flawless grader that pinpoints weak sentences.", score: "wordsmith" },
        { text: "A real-time speed auditor that strips page weight.", score: "architect" },
        { text: "A single conversion dashboard managing 10 active channels.", score: "hacker" },
        { text: "An immersive digital canvas adapting layout themes dynamically.", score: "visionary" }
      ]
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleSelect = (score: string) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);

    if (currentQ + 1 < quizData.length) {
      setCurrentQ(c => c + 1);
    } else {
      // Tally result
      const counts: Record<string, number> = { wordsmith: 0, architect: 0, hacker: 0, visionary: 0 };
      nextAnswers.forEach(ans => { counts[ans] = (counts[ans] || 0) + 1; });
      
      let highest = 'wordsmith';
      let maxCount = 0;
      Object.entries(counts).forEach(([k, v]) => {
        if (v > maxCount) {
          maxCount = v;
          highest = k;
        }
      });
      setResult(highest);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  const currentItem = quizData[currentQ];

  const archetypes: Record<string, { title: string; desc: string; course: string; courseId: string }> = {
    wordsmith: {
      title: "✍️ The Copywriting Wordsmith",
      desc: "You prioritize authentic messaging, pristine typography, and deep emotional connection. You detest corporate buzzwords and care deeply about founder narrative. Your outreach copy has real heart.",
      course: "Digital Marketing & Growth Ads Accelerator",
      courseId: "course-2"
    },
    architect: {
      title: "🏗️ The SEO Architect",
      desc: "You thrive on structures, technical optimization, clean code, and search engine parameters. You know that beautiful design is nothing if search engines can't index its core content. Page speed is your obsession.",
      course: "Advanced AI & Large Language Models",
      courseId: "course-1"
    },
    hacker: {
      title: "🚀 The Conversion Growth Hacker",
      desc: "You are hyper-focused on immediate ROI, conversion statistics, and scaling lead pipelines. You strip down distracting headers and don't care about flowery visuals—if it doesn't convert, it's garbage.",
      course: "Digital Marketing & Growth Ads Accelerator",
      courseId: "course-2"
    },
    visionary: {
      title: "🎨 The Brand Visionary",
      desc: "You live and breathe visual rhythm, typography pairings, balanced padding, and beautiful typography. You understand that visual brand consistency is the ultimate trust vector in premium pricing models.",
      course: "Full-Stack React & Vite Development",
      courseId: "course-3"
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center">
          <Award className="h-5 w-5 mr-2 text-slate-900" /> Archetype Personality Quiz
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Find your core marketing superpower archetype in 5 quick questions. Receive structured training paths and personalized guidance.
        </p>
      </div>

      {!result ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Question {currentQ + 1} of {quizData.length}</span>
            <div className="flex gap-1">
              {quizData.map((_, idx) => (
                <div key={idx} className={`h-1 w-6 rounded-full transition-all ${idx <= currentQ ? 'bg-slate-900' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>

          <h4 className="text-lg font-bold text-slate-800 leading-snug">
            {currentItem.q}
          </h4>

          <div className="flex flex-col gap-3">
            {currentItem.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt.score)}
                className="w-full text-left p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 font-medium text-sm text-slate-700 transition-all flex items-center justify-between"
              >
                <span>{opt.text}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Archetype</h4>
            <h3 className="text-2xl font-extrabold text-slate-900">{archetypes[result].title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{archetypes[result].desc}</p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended Course</span>
                <h5 className="font-bold text-slate-800 mt-1">{archetypes[result].course}</h5>
                <p className="text-xs text-slate-500 mt-0.5">Scale your superpower at Pulzitive Digital Academy.</p>
              </div>
              <a
                href="#courses-section"
                className="p-2 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 rounded-xl transition-all shrink-0"
                title="Go to courses"
              >
                <ExternalLink className="h-4 w-4 text-slate-600 hover:text-indigo-600" />
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
            >
              Retake Personality Quiz
            </button>
            {onBook && (
              <button
                onClick={onBook}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-blue-600/10"
              >
                Book Campaign Review
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   6. INTERNAL UTM LINK BUILDER (SHARED DATABASE)
   ========================================================================== */
interface UtmProps {
  currentUser: UserProfile | null;
}

function UtmLinkBuilderTool({ currentUser }: UtmProps) {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [links, setLinks] = useState<UtmLink[]>([]);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'warning', text: string } | null>(null);

  const fetchLinks = async () => {
    try {
      const data = await getUtmLinks();
      setLinks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Compute live URL
  const generateUrl = () => {
    if (!url.trim()) return '';
    try {
      const parsed = new URL(url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`);
      if (source) parsed.searchParams.set('utm_source', source.trim().toLowerCase());
      if (medium) parsed.searchParams.set('utm_medium', medium.trim().toLowerCase());
      if (campaign) parsed.searchParams.set('utm_campaign', campaign.trim().toLowerCase());
      if (term) parsed.searchParams.set('utm_term', term.trim().toLowerCase());
      if (content) parsed.searchParams.set('utm_content', content.trim().toLowerCase());
      return parsed.toString();
    } catch {
      return '';
    }
  };

  const liveTaggedUrl = generateUrl();

  const handleSave = async () => {
    if (!url || !source || !medium || !campaign) {
      setToastMsg({ type: 'warning', text: 'URL, Source, Medium, and Campaign are required to save.' });
      return;
    }

    const currentTagged = liveTaggedUrl;

    // Check duplicate rule
    const existing = links.find(l => l.taggedUrl.toLowerCase() === currentTagged.toLowerCase());
    if (existing) {
      setToastMsg({ type: 'warning', text: 'This specific UTM combination already exists!' });
      setHighlightedRow(existing.id);
      // Scroll to row
      const el = document.getElementById(`utm-row-${existing.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setHighlightedRow(null), 3500);
      return;
    }

    try {
      const who = currentUser?.displayName || currentUser?.email || 'Anonymous Team Member';
      await saveUtmLink({
        url: url.trim(),
        source: source.trim(),
        medium: medium.trim(),
        campaign: campaign.trim(),
        term: term.trim() || undefined,
        content: content.trim() || undefined,
        taggedUrl: currentTagged,
        whoMadeIt: who
      });
      setToastMsg({ type: 'success', text: 'Link built and saved to shared team database!' });
      // Reset builder inputs
      setUrl('');
      setSource('');
      setMedium('');
      setCampaign('');
      setTerm('');
      setContent('');
      fetchLinks();
    } catch (err) {
      console.error(err);
      setToastMsg({ type: 'warning', text: 'Failed to write link to shared Firestore database.' });
    }
  };

  const handleDuplicate = (row: UtmLink) => {
    setUrl(row.url);
    setSource(row.source);
    setMedium(row.medium);
    setCampaign(row.campaign);
    setTerm(row.term || '');
    setContent(row.content || '');
    setToastMsg({ type: 'success', text: 'Combination cloned! Builder populated.' });
  };

  const filteredLinks = links.filter(l => 
    l.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.whoMadeIt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center">
          <Link2 className="h-5 w-5 mr-2 text-slate-900" /> Campaign UTM Link Builder
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Build tracked parameters to measure campaign source vectors. Saved links are synchronized instantly inside a shared team database.
        </p>
      </div>

      {toastMsg && (
        <div className={`p-3 rounded-lg border text-sm flex items-center justify-between ${
          toastMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{toastMsg.text}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-xs underline font-semibold">Dismiss</button>
        </div>
      )}

      {/* Builder Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">Destination URL *</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="pulzitive.com/academy"
            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">Campaign Source *</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="google, newsletter, facebook"
            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">Campaign Medium *</label>
          <input
            type="text"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            placeholder="cpc, email, banner"
            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">Campaign Name *</label>
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="july_promo, launch_ads"
            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">Campaign Term (optional)</label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="react_lessons"
            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">Campaign Content (optional)</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="sidebar_banner"
            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Live Tagged output */}
      {liveTaggedUrl && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-500 uppercase">Live Generated Target URL</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              readOnly
              value={liveTaggedUrl}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-600 focus:outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(liveTaggedUrl);
                setToastMsg({ type: 'success', text: 'Copied live URL to clipboard!' });
              }}
              className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg"
              title="Copy link"
            >
              <Copy className="h-4 w-4 text-slate-600" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="h-4 w-4" /> Save Link to Shared Database
          </button>
        </div>
      )}

      {/* Searchable Shared Table */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shared Campaign Database</h4>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search source, campaign, author..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[250px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3">Campaign</th>
                <th className="p-3">Source/Medium</th>
                <th className="p-3">Who</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.length > 0 ? (
                filteredLinks.map((row) => (
                  <tr 
                    key={row.id} 
                    id={`utm-row-${row.id}`}
                    className={`border-b border-slate-100 hover:bg-slate-50/50 transition-all ${
                      highlightedRow === row.id ? 'bg-amber-50 border-l-2 border-l-amber-500' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{row.campaign}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{row.taggedUrl}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">{row.source}</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">{row.medium}</span>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-600 font-medium">{row.whoMadeIt}</div>
                      <div className="text-[9px] text-slate-400">{new Date(row.date).toLocaleDateString()}</div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDuplicate(row)}
                        className="bg-white border border-slate-200 hover:border-slate-300 px-2 py-1 rounded text-[10px] font-semibold text-slate-600 flex items-center gap-1 ml-auto"
                      >
                        <Copy className="h-3 w-3" /> Duplicate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400 italic">No links built yet. Be the first to build a tracked campaign link!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. CONTENT REPURPOSER ("REPURPOSE THIS")
   ========================================================================== */
function ContentRepurposerTool() {
  const [sourceText, setSourceText] = useState('');
  const [originalLink, setOriginalLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'x' | 'linkedin' | 'email' | 'hooks'>('x');
  const [result, setResult] = useState<{
    xPosts: string[];
    linkedInPost: string;
    plainTextEmail: string;
    openingHooks: string[];
  } | null>(null);

  const handleRepurpose = async () => {
    if (!sourceText.trim()) {
      setError('Please paste your long content first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/repurpose-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText, originalLink })
      });
      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to repurpose content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center">
          <RefreshCw className="h-5 w-5 mr-2 text-slate-900" /> Content Repurposer
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Paste long-form text (blog post, newsletter, PDF) up to 10k words. AI converts it into 5 X posts, a short-line LinkedIn post, an email, and 3 alternative hooks.
        </p>
      </div>

      {!result ? (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase">Original Article / Backlink URL (optional)</label>
              <input
                type="text"
                value={originalLink}
                onChange={(e) => setOriginalLink(e.target.value)}
                placeholder="pulzitive.com/case-studies/digital-lead-growth"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase">Paste Long-Form Text Content</label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Paste blog post, transcript, raw notes, or campaign pitch up to 10,000 words..."
                className="w-full h-60 p-4 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all leading-relaxed bg-white text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
            <p className="text-[11px] text-slate-500 leading-relaxed flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Constraint: Ban-words enforced: <strong>"game-changer"</strong>, <strong>"dive in"</strong>, <strong>"unlock"</strong>. Short-sentence LinkedIn style with zero emojis is configured.</span>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleRepurpose}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Extracting Value Sentences...</span>
              </>
            ) : (
              <>
                <span>Repurpose This Content</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('x')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'x' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                X Posts (5)
              </button>
              <button
                onClick={() => setActiveTab('linkedin')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'linkedin' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                LinkedIn Post
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'email' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Short Email
              </button>
              <button
                onClick={() => setActiveTab('hooks')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'hooks' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Alternative Hooks
              </button>
            </div>
            <button
              onClick={() => setResult(null)}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 min-h-[250px]">
            {activeTab === 'x' && (
              <div className="space-y-3">
                {result.xPosts.map((post, idx) => (
                  <div key={idx} className="bg-white border border-slate-150 rounded-lg p-3 relative group">
                    <button
                      onClick={() => handleCopy(post)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="Copy post"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase">Post {idx + 1}</span>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1 pr-6">{post}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'linkedin' && (
              <div className="space-y-2 relative group bg-white border border-slate-150 rounded-lg p-4">
                <button
                  onClick={() => handleCopy(result.linkedInPost)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all p-1"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <div className="text-[10px] font-bold text-indigo-500 uppercase">LinkedIn Short-Line Copy</div>
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed mt-1">{result.linkedInPost}</p>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-2 relative group bg-white border border-slate-150 rounded-lg p-4">
                <button
                  onClick={() => handleCopy(result.plainTextEmail)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all p-1"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <div className="text-[10px] font-bold text-indigo-500 uppercase">100-Word Plain Text Email</div>
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed mt-1">{result.plainTextEmail}</p>
              </div>
            )}

            {activeTab === 'hooks' && (
              <div className="space-y-3">
                {result.openingHooks.map((hook, idx) => (
                  <div key={idx} className="bg-white border border-slate-150 rounded-lg p-3 relative group">
                    <button
                      onClick={() => handleCopy(hook)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all p-1"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase">Alternative Hook {idx + 1}</span>
                    <p className="text-xs text-slate-700 font-semibold mt-1 leading-relaxed pr-6">"{hook}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   8. EMAIL SUBJECT-LINE PREVIEWER
   ========================================================================== */
function SubjectLinePreviewerTool() {
  const [subjectLine, setSubjectLine] = useState('');
  const [senderName, setSenderName] = useState('Pulzitive Agency');
  const [preheader, setPreheader] = useState('');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  // Spam Word Checker
  const spamWords = [
    "free", "guaranteed", "earn money", "act now", "cash", "million", "100%", "make money", "winner", "prize",
    "risk-free", "investment", "income", "be your own boss", "debt", "click here", "amazing", "secret"
  ];

  const checkSpam = () => {
    const found: string[] = [];
    const lower = subjectLine.toLowerCase();
    spamWords.forEach(w => {
      if (lower.includes(w)) found.push(w);
    });
    return found;
  };

  const detectedSpamWords = checkSpam();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-slate-900" /> Subject Line Previewer
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Type your subject line, sender name, and preview snippet. Review real-time pixel-perfect mobile and desktop inbox mockups and trigger warnings if spam-words are flagged.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Parameters</h4>
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">Sender Name</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Pulzitive"
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">Subject Line</label>
            <input
              type="text"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
              placeholder="Your website has a leaky conversion point"
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">Preheader Text / Snippet</label>
            <input
              type="text"
              value={preheader}
              onChange={(e) => setPreheader(e.target.value)}
              placeholder="We analyzed 50 high-growth software funnels and spotted a simple structural..."
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          {/* Spam warnings block */}
          {detectedSpamWords.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <span>Spam Filter Warning</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Your subject line contains high-risk words: {detectedSpamWords.map(w => <strong key={w} className="bg-amber-150 px-1 py-0.5 rounded text-amber-950 font-mono text-[10px] mx-0.5">"{w}"</strong>)}. This may lower deliverability rates.
              </p>
            </div>
          )}
        </div>

        {/* Live Mockups */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inbox Live Mockup</h4>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1 px-2.5 text-xs font-semibold rounded-md flex items-center gap-1 transition-all ${
                  viewMode === 'mobile' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" /> Mobile
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1 px-2.5 text-xs font-semibold rounded-md flex items-center gap-1 transition-all ${
                  viewMode === 'desktop' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" /> Desktop
              </button>
            </div>
          </div>

          {viewMode === 'mobile' ? (
            /* Gmail iOS/Android Style */
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-4 min-h-[160px] flex items-center justify-center">
              <div className="w-full bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm shrink-0">
                  {senderName ? senderName[0].toUpperCase() : 'M'}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-950 truncate pr-2">{senderName || 'Sender'}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">9:41 AM</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 truncate mt-0.5">{subjectLine || '(No Subject)'}</h5>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5 leading-tight">{preheader || 'Empty snippet text'}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Apple Mail Desktop Style */
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-4 min-h-[160px] flex items-center justify-center">
              <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="bg-slate-50 border-b border-slate-200 p-2 text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono">Inbox — Apple Mail</span>
                </div>
                <div className="p-3.5 border-b border-slate-100 hover:bg-slate-50/50 transition-all flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">{senderName || 'Sender'}</div>
                    <div className="text-[11px] font-semibold text-slate-800 truncate mt-0.5">{subjectLine || '(No Subject)'}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5 leading-snug">{preheader || 'No preheader snippet provided.'}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 shrink-0 pt-0.5">Today</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   9. CAMPAIGN BRIEF GENERATOR
   ========================================================================== */
function CampaignBriefGeneratorTool() {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5, setQ5] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [brief, setBrief] = useState<Record<string, string> | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q1, q2, q3, q4, q5 })
      });
      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();
      setBrief(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate brief. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadBrief = () => {
    if (!brief) return;
    const contentText = `CAMPAIGN BRIEF REPORT\n====================\n\n` +
      `OBJECTIVE:\n${brief.objective}\n\n` +
      `AUDIENCE:\n${brief.audience}\n\n` +
      `KEY MESSAGE:\n${brief.keyMessage}\n\n` +
      `CHANNELS:\n${brief.channels}\n\n` +
      `BUDGET:\n${brief.budget}\n\n` +
      `TIMELINE:\n${brief.timeline}\n\n` +
      `SUCCESS METRICS:\n${brief.successMetrics}\n\n` +
      `OUT OF SCOPE:\n${brief.outOfScope}\n`;

    const blob = new Blob([contentText], { type: 'text/plain;charset=utf-8' });
    const el = document.createElement('a');
    el.href = URL.createObjectURL(blob);
    el.download = 'Strategic_Campaign_Brief.txt';
    el.click();
  };

  const handleFieldChange = (key: string, val: string) => {
    if (brief) {
      setBrief({ ...brief, [key]: val });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-slate-900" /> Campaign Brief Generator
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Provide answers to 5 key strategic indicators. AI compiles a dense, beautifully structured single-page brief ready for export, highlighting gaps.
        </p>
      </div>

      {!brief ? (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600">1. What is the core campaign goal and target numbers? *</label>
              <input
                type="text"
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                placeholder="e.g. Gather 200 high-tier student enrolments in 30 days"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600">2. Who exactly is the ideal audience profile? *</label>
              <input
                type="text"
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                placeholder="e.g. Undergrad CS students in Lagos, Nigeria"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600">3. What are the primary outreach channels? *</label>
              <input
                type="text"
                value={q3}
                onChange={(e) => setQ3(e.target.value)}
                placeholder="e.g. LinkedIn targeted post, email newsletters, search ads"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600">4. What is the total budget? *</label>
              <input
                type="text"
                value={q4}
                onChange={(e) => setQ4(e.target.value)}
                placeholder="e.g. 500,000 NGN total for ad placements"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600">5. What is the deadline and core constraints? *</label>
              <input
                type="text"
                value={q5}
                onChange={(e) => setQ5(e.target.value)}
                placeholder="e.g. Campaign must conclude before August 1st"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Extending Campaign Variables...</span>
              </>
            ) : (
              <>
                <span>Generate Campaign Brief</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900">Your Strategic Campaign Brief</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`p-1.5 px-3 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  isEditMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Edit2 className="h-3.5 w-3.5" /> {isEditMode ? 'Finish Editing' : 'Edit Mode'}
              </button>
              <button
                onClick={downloadBrief}
                className="p-1.5 px-3 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 text-slate-700 transition-all"
              >
                <Download className="h-3.5 w-3.5" /> Export TXT
              </button>
              <button
                onClick={() => setBrief(null)}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 px-2"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Structured single-page brief layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-150 p-6 rounded-2xl font-sans text-xs text-slate-700 leading-relaxed max-h-[450px] overflow-y-auto">
            {Object.entries(brief).map(([key, value]) => {
              const valStr = value as string;
              const label = key.replace(/([A-Z])/g, ' $1').toUpperCase();
              const isVague = valStr.includes('NEEDS AN ANSWER');
              return (
                <div key={key} className={`p-4 rounded-xl border ${isVague ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-150'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold ${isVague ? 'text-rose-600' : 'text-slate-400'} uppercase tracking-wider`}>
                      {label}
                    </span>
                    {isVague && (
                      <span className="bg-rose-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full uppercase">
                        Needs Answer
                      </span>
                    )}
                  </div>
                  
                  {isEditMode ? (
                    <textarea
                      value={valStr}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className="w-full h-24 p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-sans text-xs text-slate-700 leading-relaxed bg-white"
                    />
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {valStr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
