/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scale, ShieldAlert, CreditCard, Award, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { AnimatedHeroTitle } from '../components/AnimatedHeroTitle';

export default function TermsPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Floating Animated Icons */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-[8%] opacity-20 animate-bounce" style={{ animationDuration: '6s' }}>
          <Scale className="w-16 h-16 text-emerald-500" />
        </div>
        <div className="absolute bottom-1/4 right-[8%] opacity-20 animate-pulse" style={{ animationDuration: '4s' }}>
          <ShieldCheck className="w-20 h-20 text-indigo-500" />
        </div>
        <div className="absolute top-1/3 right-[15%] opacity-15 animate-bounce" style={{ animationDuration: '8s' }}>
          <Award className="w-14 h-14 text-pink-500" />
        </div>
        <div className="absolute bottom-1/3 left-[15%] opacity-15 animate-pulse" style={{ animationDuration: '5s' }}>
          <Sparkles className="w-12 h-12 text-teal-500" />
        </div>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 relative z-10">
        <AnimatedHeroTitle 
          primaryText="Pulzitive Platform"
          highlightText="Terms of Use & Service Agreement."
          dark={false}
          className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
        />
        <p className="text-xs text-slate-600 max-w-xl mx-auto font-medium">
          Last Updated: July 11, 2026. Please read these Terms of Use carefully before using Pulzitive services and digital academy portals.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Core Notice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center text-center space-y-2 shadow-xs">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900">Global Governing Framework</h3>
            <p className="text-[10px] text-slate-600 leading-normal">
              Services are structured for international compliance under applicable commercial trade laws and regional frameworks.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center text-center space-y-2 shadow-xs">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900">Payment Clearances</h3>
            <p className="text-[10px] text-slate-600 leading-normal">
              All academic enrollments and premium packages are securely managed via verified channels.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center text-center space-y-2 shadow-xs">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900">Academic Integrity</h3>
            <p className="text-[10px] text-slate-600 leading-normal">
              Course certificates require authentic module completions and score approvals.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">01</span>
              Acceptance of Terms
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              By accessing Pulzitive web portals, requesting integrated SEO/brand audits, or enrolling in our digital marketing Academy learning hub, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use. If you do not agree, you are not authorized to access these materials.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">02</span>
              User Registration & Roles
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              We operate a multi-role gamified portal containing roles for Students, Clients, and Administrators:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 list-none pl-1">
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>You must secure your workspace or authenticated login credentials.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Students are required to represent their assignment work and mock exams with high academic honesty.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Clients requesting brand audits warrant that they own or represent the domains submitted for evaluation.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">03</span>
              Payments, Refunds & Access Fees
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Course fees, talent contracts, and consulting session bookings are processed in USD ($), EUR (€), GBP (£), or NGN (₦) equivalence. All transactions processed via verified international payment gateways are encrypted and secure. Pulzitive maintains a 7-day conditional refund policy on digital materials, provided less than 15% of syllabus content has been consumed.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">04</span>
              Proprietary Resource Vault Licences
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Templates, digital checklists, and SEO audit structures purchased from the Pulzitive Marketplace are licensed to you for internal, non-transferable, commercial or personal use. Re-selling, syndicating, or redistributing Pulzitive Resource Vault properties is strictly prohibited.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">05</span>
              Limitation of Liability
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Pulzitive delivers digital campaign advice, SEO audit reports, and EdTech training materials on an "as-is" and "as-available" basis. While our digital marketing audits are based on professional, standard metrics, we do not guarantee specific financial results, lead counts, or Google search ranking positions.
            </p>
          </section>

        </div>

        {/* Support Footer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center text-xs text-slate-600">
          <p>Any concerns regarding these service terms can be discussed with Pulzitive Support at <strong className="text-slate-900 font-semibold">pulzitive@gmail.com</strong>.</p>
        </div>

      </div>
    </div>
  );
}
