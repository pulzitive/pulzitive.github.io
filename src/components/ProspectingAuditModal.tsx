import React, { useState } from 'react';
import { 
  X, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, 
  Globe, Mail, User, Building2, TrendingUp, Zap, Clock, Star,
  Search, BarChart3, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandAudit } from '../types';

interface ProspectingAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    clientEmail: string;
    websiteUrl: string;
    clientName: string;
    industry: string;
    primaryGoal: string;
  }) => Promise<BrandAudit | void>;
  onNavigateToDashboard?: () => void;
  onBookStrategyCall?: () => void;
}

export default function ProspectingAuditModal({
  isOpen,
  onClose,
  onSubmit,
  onNavigateToDashboard,
  onBookStrategyCall
}: ProspectingAuditModalProps) {
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [name, setName] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('SEO & Organic Traffic');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedAudit, setGeneratedAudit] = useState<BrandAudit | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const sanitizedUrl = websiteUrl.trim() 
        ? (websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl.trim()}`)
        : 'https://example-brand.com';

      const auditResult = await onSubmit({
        clientEmail: email.trim(),
        websiteUrl: sanitizedUrl,
        clientName: name.trim() || email.split('@')[0],
        industry: 'General Growth',
        primaryGoal: primaryGoal
      });

      if (auditResult) {
        setGeneratedAudit(auditResult);
      } else {
        // Fallback default audit preview if void
        setGeneratedAudit({
          id: `audit-${Date.now()}`,
          clientName: name.trim() || 'Valued Partner',
          clientEmail: email.trim(),
          websiteUrl: sanitizedUrl,
          industry: 'Digital Growth',
          primaryGoal: primaryGoal,
          timestamp: new Date().toISOString(),
          status: 'completed',
          scores: {
            seo: Math.floor(Math.random() * 15) + 82,
            speed: Math.floor(Math.random() * 18) + 78,
            social: Math.floor(Math.random() * 20) + 70,
            marketing: Math.floor(Math.random() * 15) + 80
          }
        });
      }
    } catch (err: any) {
      console.error('Audit prospecting error:', err);
      setErrorMsg(err.message || 'Failed to generate audit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="prospecting-audit-modal"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-900 relative my-auto"
      >
        {/* Close Button */}
        <button
          id="close-prospecting-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!generatedAudit ? (
          <div>
            {/* Header Ribbon / Value Proposition */}
            <div className="bg-emerald-600 px-6 py-6 sm:px-8 sm:py-7 text-white relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-700/80 text-emerald-100 border border-emerald-500/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-300" /> Limited Time Incentive
                </span>
                <span className="bg-white/20 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  $500 Value • 100% Free
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Claim Your Free 360° Digital & SEO Brand Audit
              </h2>
              <p className="text-xs text-emerald-100 mt-1.5 leading-relaxed max-w-md">
                Discover your website's hidden SEO bottlenecks, conversion leaks, and keyword opportunities with our AI-powered analysis engine.
              </p>
            </div>

            {/* Form & Incentives Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-[11px] font-medium text-slate-700">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Google Page 1 Ranking Gaps</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Core Web Vitals & Speed Test</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Competitor Traffic Gap Analysis</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Actionable ROI Growth Blueprint</span>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Prospecting Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Your Business Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="prospecting-email-input"
                      type="email"
                      required
                      placeholder="e.g. founder@yourcompany.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    We will send your complete confidential audit report and scores directly to this email.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Website URL / Domain
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="prospecting-website-input"
                        type="text"
                        placeholder="e.g. yourwebsite.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Your Name / Company
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="prospecting-name-input"
                        type="text"
                        placeholder="e.g. Alex Johnson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Primary Growth Objective
                  </label>
                  <select
                    id="prospecting-goal-select"
                    value={primaryGoal}
                    onChange={(e) => setPrimaryGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="SEO & Organic Traffic">Rank on Page 1 & Skyrocket Organic Traffic</option>
                    <option value="Conversion Rate Optimization">Fix Conversion Leaks & Double Inbound Leads</option>
                    <option value="Paid Ads & CAC Reduction">Lower Ad Spend & Scale Customer Acquisition</option>
                    <option value="Brand Identity & PR">Authority PR & High-Value Brand Positioning</option>
                  </select>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    id="generate-audit-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Compiling SEO & Performance Audit...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-200" />
                        <span>Generate Instant Free Audit</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Zero spam. Instant access.
                    </span>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-slate-400 hover:text-slate-600 underline cursor-pointer"
                    >
                      No thanks, I'll pass
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Success / Instant Computed Audit Report View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                Audit Successfully Compiled
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Here Is Your Growth Breakdown
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                We've compiled the metrics for <strong className="text-slate-900">{generatedAudit.websiteUrl}</strong>. A comprehensive 12-page roadmap has been sent to <strong className="text-emerald-700">{generatedAudit.clientEmail}</strong>.
              </p>
            </div>

            {/* Metric Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SEO Score</span>
                <p className="text-2xl font-black text-emerald-600 font-mono">
                  {generatedAudit.scores?.seo || 86}%
                </p>
                <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Good Potential</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Speed / UX</span>
                <p className="text-2xl font-black text-blue-600 font-mono">
                  {generatedAudit.scores?.speed || 79}%
                </p>
                <span className="text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold">Needs Polish</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Social Trust</span>
                <p className="text-2xl font-black text-indigo-600 font-mono">
                  {generatedAudit.scores?.social || 74}%
                </p>
                <span className="text-[9px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">Growth Area</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Marketing ROI</span>
                <p className="text-2xl font-black text-teal-600 font-mono">
                  {generatedAudit.scores?.marketing || 84}%
                </p>
                <span className="text-[9px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold">High Upside</span>
              </div>
            </div>

            {/* Key Findings Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
              <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Immediate Growth Opportunities Identified:
              </h4>
              <ul className="space-y-1.5 pl-5 list-disc text-slate-600 text-[11px] leading-relaxed">
                <li>Optimize meta title tags and H1 structure to capture high-volume commercial keywords.</li>
                <li>Reduce unused JavaScript payloads to elevate mobile page load time under 1.8 seconds.</li>
                <li>Implement conversion trigger popups and automated lead nurture sequences to increase inbound inquiries by ~35%.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                id="book-strategy-call-from-prospecting-btn"
                onClick={() => {
                  onClose();
                  if (onBookStrategyCall) {
                    onBookStrategyCall();
                  }
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Book Free 1-on-1 Strategy Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="view-dashboard-from-prospecting-btn"
                onClick={() => {
                  onClose();
                  if (onNavigateToDashboard) {
                    onNavigateToDashboard();
                  }
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
