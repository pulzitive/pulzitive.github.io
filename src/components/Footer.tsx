/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  HelpCircle, 
  Linkedin, 
  Twitter, 
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  Youtube,
  Store,
  Video,
  ArrowRight
} from 'lucide-react';
import Logo from './Logo';
import { subscribeToNewsletter } from '../firebase';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenAdminLogin?: () => void;
}

export default function Footer({ onNavigate, onOpenAdminLogin }: FooterProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [etherealUrl, setEtherealUrl] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (email.trim() && email.includes('@')) {
        setStep(2);
      }
      return;
    }

    if (!email.trim() || !firstName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setEtherealUrl(null);
    try {
      const res = await subscribeToNewsletter(email.trim(), firstName.trim());
      if (res.success) {
        setSubscribed(true);
        if (res.etherealUrl) {
          setEtherealUrl(res.etherealUrl);
        }
        setEmail('');
        setFirstName('');
        setStep(1);
        setTimeout(() => {
          setSubscribed(false);
        }, 5000);
      }
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" showText={false} />
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">Pulzitive</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 font-medium">
            A premier brand communication, Digital Marketing Intelligence, Advertising Agency with integrated learning paths, talents pool and ministers hub.
          </p>
          <div className="flex flex-wrap gap-3 text-slate-400 text-xs">
            <a href="https://instagram.com/pulzitive" target="_blank" rel="noopener noreferrer" title="Instagram" className="hover:text-emerald-600 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com/pulzitive" target="_blank" rel="noopener noreferrer" title="Facebook" className="hover:text-emerald-600 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://wa.me/2348154224426" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="hover:text-emerald-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="https://tiktok.com/@pulzitive" target="_blank" rel="noopener noreferrer" title="TikTok" className="hover:text-emerald-600 transition-colors">
              <Video className="w-4 h-4" />
            </a>
            <a href="https://twitter.com/pulzitive" target="_blank" rel="noopener noreferrer" title="Twitter / X" className="hover:text-emerald-600 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com/company/pulzitive" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="hover:text-emerald-600 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://g.page/pulzitive" target="_blank" rel="noopener noreferrer" title="Google Business Profile" className="hover:text-emerald-600 transition-colors">
              <Store className="w-4 h-4" />
            </a>
            <a href="https://youtube.com/@pulzitive" target="_blank" rel="noopener noreferrer" title="YouTube" className="hover:text-emerald-600 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contact column */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase">Get In Touch</h4>
          <div className="space-y-3 text-xs text-slate-600">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <a href="mailto:pulzitive@gmail.com" className="hover:text-slate-900 transition-colors truncate">
                pulzitive@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <a href="tel:+2348154224426" className="hover:text-slate-900 transition-colors">
                +234 815 422 4426
              </a>
            </p>
          </div>
        </div>

        {/* Newsletter column */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase">Marketing Growth</h4>
          <form onSubmit={handleSubscribe} className="space-y-3">
            {step === 1 ? (
              <>
                <p className="text-[11px] text-slate-600 font-medium">Ready to Start Your Marketing Journey? (Step 1 of 2):</p>
                <p className="text-[10px] text-slate-500 leading-normal">Enter your email to receive free marketing checklists, specialized curriculum updates, and custom learning roadmaps!</p>
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1 min-w-0 disabled:opacity-60 shadow-xs"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 shadow-xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-[11px] text-slate-600 flex justify-between items-center font-medium">
                  <span>Ready to Start Your Technical Adventure? (Step 2 of 2):</span>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="text-emerald-600 hover:underline text-[9px] cursor-pointer font-semibold"
                  >
                    Back
                  </button>
                </p>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1 min-w-0 disabled:opacity-60 shadow-xs"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-60 shadow-xs"
                  >
                    {subscribed ? 'Joined!' : isSubmitting ? '...' : <Send className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>
              </>
            )}
            {etherealUrl && (
              <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-[10px] text-emerald-800 leading-relaxed">
                🎉 <strong>Subscription Registered!</strong> Since custom SMTP is not set up, you can click below to preview the admin dispatch notification sent to <strong>pulzitive@gmail.com</strong>:
                <a 
                  href={etherealUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block mt-1.5 font-bold underline hover:text-emerald-950 break-all cursor-pointer"
                >
                  View Sent Mail Inbox →
                </a>
              </div>
            )}
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-4">
        <p>Pulzitive Platform © 2026. All Rights Reserved.</p>
        <div className="flex gap-4">
          <button onClick={() => onNavigate('privacy')} className="hover:text-slate-900 transition-colors cursor-pointer bg-transparent border-none p-0">Privacy Policy</button>
          <button onClick={() => onNavigate('terms')} className="hover:text-slate-900 transition-colors cursor-pointer bg-transparent border-none p-0">Terms of Use</button>
          <button onClick={() => onNavigate('sitemap')} className="hover:text-slate-900 transition-colors cursor-pointer bg-transparent border-none p-0">Sitemap</button>
          {onOpenAdminLogin && (
            <button onClick={onOpenAdminLogin} className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors cursor-pointer bg-transparent border-none p-0">Admin Login</button>
          )}
        </div>
      </div>
    </footer>
  );
}
