/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Eye, Lock, FileText, ChevronRight, Sparkles, Award } from 'lucide-react';
import { AnimatedHeroTitle } from '../components/AnimatedHeroTitle';

export default function PrivacyPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 relative z-10">
        <AnimatedHeroTitle 
          primaryText="Pulzitive Privacy Policy &"
          highlightText="Data Protection Standards."
          dark={false}
          className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
        />
        <p className="text-xs text-slate-600 max-w-xl mx-auto font-medium">
          Last Updated: July 11, 2026. This Privacy Policy details how Pulzitive collects, handles, protects, and respects your professional data.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Core Notice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center text-center space-y-2 shadow-xs">
            <Eye className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900">Full Transparency</h3>
            <p className="text-[10px] text-slate-600 leading-normal">
              No hidden tracking. We clarify exactly what fields and metrics we gather.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center text-center space-y-2 shadow-xs">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900">Secure Storage</h3>
            <p className="text-[10px] text-slate-600 leading-normal">
              All personal accounts are protected with industry-standard secure hosting.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center text-center space-y-2 shadow-xs">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900">Your Ownership</h3>
            <p className="text-[10px] text-slate-600 leading-normal">
              You retain total control over your profile fields, audits, and newsletters.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">01</span>
              Information We Collect
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              We collect information to deliver specialized consulting, academy course enrollments, and professional newsletter insights. This includes:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 list-none pl-1">
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Personal Identifiers:</strong> First name, email address, phone number, and physical profile pictures when voluntarily registered on our platform.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Professional Content:</strong> Company name, website URL, target marketing channels, and strategic goals supplied during Brand Audits.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Academic Progress:</strong> Course enrollments, cohort scores, project links, attendance tracker logs, and generated certificates.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">02</span>
              How Your Information Is Used
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              The collected logs are utilized strictly inside Pulzitive platform:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 list-none pl-1">
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Executing, rating, and managing custom website SEO / digital marketing brand audits.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Delivering certified Digital Academy curricula, virtual workspace sessions, and grading.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Scheduling consulting strategy meetings using integrated calendars and video environments.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Sending regular agency updates, campaign digests, and system notices via the Pulzitive Insights Desk.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">03</span>
              Security & Storage Guardrails
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Your security is paramount. Pulzitive uses Google Cloud Firestore security rules that strictly isolate personal data records. Unauthorized read or write requests to subscriber collections, student cohort logs, and proprietary brand audit records are automatically blocked by cloud configurations.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">04</span>
              Third-Party Integrations
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Certain operational parameters connect with trusted global service providers:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 list-none pl-1">
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Paystack Gateway:</strong> Handles secure academic fees and premium plans securely. We never view or store credit card details.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Google Workspace:</strong> Integrates Google Meet and calendar schedulers to deliver consulting links directly to clients.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">05</span>
              Your Privacy Rights & Controls
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              You can query, modify, or completely delete your personal workspace profile at any point. To opt-out from the Pulzitive Insights newsletter, you can unsubscribe instantly or email our privacy representative at <a href="mailto:pulzitive@gmail.com" className="text-emerald-600 font-semibold hover:underline">pulzitive@gmail.com</a>.
            </p>
          </section>

        </div>

        {/* Support Footer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center text-xs text-slate-600">
          <p>Have questions about this Privacy Policy? Reach out directly to Pulzitive via WhatsApp at <strong className="text-slate-900 font-semibold">+234 815 422 4426</strong>.</p>
        </div>

      </div>
    </div>
  );
}
