/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Eye, Lock, FileText, ChevronRight } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3 mb-16">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
          <Shield className="w-8 h-8 text-emerald-400" />
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Last Updated: July 11, 2026. This Privacy Policy details how Pulzitive collects, handles, protects, and respects your professional data.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Core Notice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Full Transparency</h3>
            <p className="text-[10px] text-slate-400 leading-normal">
              No hidden tracking. We clarify exactly what fields and metrics we gather.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Secure Storage</h3>
            <p className="text-[10px] text-slate-400 leading-normal">
              All personal accounts are protected with industry-standard secure hosting.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Your Ownership</h3>
            <p className="text-[10px] text-slate-400 leading-normal">
              You retain total control over your profile fields, audits, and newsletters.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-10 space-y-8">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">01</span>
              Information We Collect
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              We collect information to deliver specialized consulting, academy course enrollments, and professional newsletter insights. This includes:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400 list-none pl-1">
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Personal Identifiers:</strong> First name, email address, phone number, and physical profile pictures when voluntarily registered on our platform.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Professional Content:</strong> Company name, website URL, target marketing channels, and strategic goals supplied during Brand Audits.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Academic Progress:</strong> Course enrollments, cohort scores, project links, attendance tracker logs, and generated certificates.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">02</span>
              How Your Information Is Used
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              The collected logs are utilized strictly inside Pulzitive platform:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400 list-none pl-1">
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Executing, rating, and managing custom website SEO / digital marketing brand audits.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Delivering certified Digital Academy curricula, virtual workspace sessions, and grading.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Scheduling consulting strategy meetings using integrated calendars and video environments.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Sending regular agency updates, campaign digests, and system notices via the Pulzitive Insights Desk.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">03</span>
              Security & Storage Guardrails
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your security is paramount. Pulzitive uses Google Cloud Firestore security rules that strictly isolate personal data records. Unauthorized read or write requests to subscriber collections, student cohort logs, and proprietary brand audit records are automatically blocked by cloud configurations.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">04</span>
              Third-Party Integrations
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Certain operational parameters connect with trusted global service providers:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400 list-none pl-1">
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Paystack Gateway:</strong> Handles secure academic fees and premium plans securely. We never view or store credit card details.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Google Workspace:</strong> Integrates Google Meet and calendar schedulers to deliver consulting links directly to clients.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">05</span>
              Your Privacy Rights & Controls
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              You can query, modify, or completely delete your personal workspace profile at any point. To opt-out from the Pulzitive Insights newsletter, you can unsubscribe instantly or email our privacy representative at <a href="mailto:pulzitive@gmail.com" className="text-emerald-400 hover:underline">pulzitive@gmail.com</a>.
            </p>
          </section>

        </div>

        {/* Support Footer */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 text-center text-xs text-slate-500">
          <p>Have questions about this Privacy Policy? Reach out directly to Pulzitive via WhatsApp at <strong className="text-slate-300">+234 815 422 4426</strong>.</p>
        </div>

      </div>
    </div>
  );
}
