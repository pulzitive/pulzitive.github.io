/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scale, ShieldAlert, CreditCard, Award, ChevronRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3 mb-16">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
          <Scale className="w-8 h-8 text-emerald-400" />
          Terms of Use
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Last Updated: July 11, 2026. Please read these Terms of Use carefully before using Pulzitive services and digital academy portals.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Core Notice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Global Governing Framework</h3>
            <p className="text-[10px] text-slate-400 leading-normal">
              Services are structured for international compliance under applicable commercial trade laws and regional frameworks.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Payment Clearances</h3>
            <p className="text-[10px] text-slate-400 leading-normal">
              All academic enrollments and premium packages are securely managed via verified Paystack channels.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Academic Integrity</h3>
            <p className="text-[10px] text-slate-400 leading-normal">
              Course certificates require authentic module completions and score approvals.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-10 space-y-8">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">01</span>
              Acceptance of Terms
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              By accessing Pulzitive web portals, requesting integrated SEO/brand audits, or enrolling in our digital marketing Academy learning hub, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use. If you do not agree, you are not authorized to access these materials.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">02</span>
              User Registration & Roles
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              We operate a multi-role gamified portal containing roles for Students, Clients, and Administrators:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400 list-none pl-1">
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>You must secure your simulated or authenticated login credentials.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Students are required to represent their assignment work and mock exams with high academic honesty.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Clients requesting brand audits warrant that they own or represent the domains submitted for evaluation.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">03</span>
              Payments, Refunds & Access Fees
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Course fees, talent contracts, and consulting session bookings are processed in USD ($), EUR (€), GBP (£), or NGN (₦) equivalence. All transactions processed via verified international payment gateways are encrypted and secure. Pulzitive maintains a 7-day conditional refund policy on digital materials, provided less than 15% of syllabus content has been consumed.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">04</span>
              Proprietary Resource Vault Licences
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Templates, digital checklists, and SEO audit structures purchased from the Pulzitive Marketplace are licensed to you for internal, non-transferable, commercial or personal use. Re-selling, syndicating, or redistributing Pulzitive Resource Vault properties is strictly prohibited.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">05</span>
              Limitation of Liability
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pulzitive delivers digital campaign advice, SEO audit reports, and EdTech training materials on an "as-is" and "as-available" basis. While our digital marketing audits are based on professional, standard metrics, we do not guarantee specific financial results, lead counts, or Google search ranking positions.
            </p>
          </section>

        </div>

        {/* Support Footer */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 text-center text-xs text-slate-500">
          <p>Any concerns regarding these service terms can be discussed with Pulzitive Support at <strong className="text-slate-300">pulzitive@gmail.com</strong>.</p>
        </div>

      </div>
    </div>
  );
}
