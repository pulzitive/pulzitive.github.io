import React from 'react';
import { 
  Tv, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Video, 
  HeartHandshake,
  Download,
  LayoutDashboard,
  Crown,
  Globe
} from 'lucide-react';
import { AnimatedHeroTitle } from '../AnimatedHeroTitle';
import { UserProfile } from '../../types';

interface MinistryHeroProps {
  onOpenAuthModal: (mode?: 'signin' | 'signup', tab?: string) => void;
  isUserSignedIn?: boolean;
  currentUser?: UserProfile | null;
  onGoToDashboard?: () => void;
}

export const MinistryHero: React.FC<MinistryHeroProps> = ({ 
  onOpenAuthModal, 
  isUserSignedIn = false,
  currentUser = null,
  onGoToDashboard = () => {}
}) => {
  return (
    <div className="relative overflow-hidden w-full text-slate-900 py-10 md:py-16 text-center">
      {/* Background Accent Gradients & Animated Floating Icons */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-100/50 via-teal-100/40 to-blue-100/50 blur-3xl pointer-events-none -z-10" />

      {/* Floating Background Icons */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-[8%] opacity-[0.07] animate-bounce" style={{ animationDuration: '6s' }}>
          <Video className="w-16 h-16 text-emerald-600" />
        </div>
        <div className="absolute bottom-1/4 right-[8%] opacity-[0.07] animate-pulse" style={{ animationDuration: '4s' }}>
          <Flame className="w-20 h-20 text-teal-600" />
        </div>
        <div className="absolute top-1/3 right-[15%] opacity-[0.06] animate-bounce" style={{ animationDuration: '8s' }}>
          <Tv className="w-14 h-14 text-indigo-600" />
        </div>
        <div className="absolute bottom-1/3 left-[15%] opacity-[0.06] animate-pulse" style={{ animationDuration: '5s' }}>
          <HeartHandshake className="w-12 h-12 text-emerald-700" />
        </div>
        <div className="absolute top-1/2 left-[5%] opacity-[0.05] animate-pulse" style={{ animationDuration: '7s' }}>
          <Sparkles className="w-14 h-14 text-amber-500" />
        </div>
        <div className="absolute bottom-1/2 right-[6%] opacity-[0.05] animate-bounce" style={{ animationDuration: '9s' }}>
          <Globe className="w-14 h-14 text-blue-600" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Title */}
        <div className="mb-6 max-w-4xl text-center">
          <AnimatedHeroTitle 
            primaryText="Empowering Pastors with"
            highlightText="Done-For-You Media"
            suffixText="& Prophetic Fellowship."
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-tight"
          />
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8 text-center mx-auto">
          A dedicated ecosystem designed exclusively for gospel ministers. Delegate your Sunday sermon editing, vertical reels, and graphic series to expert human media editors, while connecting with verified leaders across the globe for intercession, dreams interpretation, and kingdom resources.
        </p>

        {/* Logged in Welcome bar or Action Buttons */}
        {isUserSignedIn && currentUser?.role === 'Minister' ? (
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-xl mb-12 max-w-2xl w-full text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Signed in as Verified Minister: <strong>{currentUser.displayName}</strong></span>
            </div>
            <p className="text-xs text-slate-600">
              Your ministerial dashboard is active with full access to Sunday video editing tickets, prayer petitions, and apostolic fellowship.
            </p>
            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <LayoutDashboard className="w-5 h-5 text-white" />
              <span>Launch Pastors & Ministers Dashboard</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center mb-12 w-full">
            <button
              id="hero-register-pastor-btn"
              onClick={() => onOpenAuthModal('signup', 'media')}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Video className="w-5 h-5 text-white" />
              <span className="text-white font-extrabold tracking-wide">Register Church / Minister</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Key Metrics / Trust Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-8 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 text-center sm:text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">1,240+</div>
              <div className="text-xs text-slate-500 font-medium">Verified Ministers</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 text-center sm:text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">45,000+</div>
              <div className="text-xs text-slate-500 font-medium">Sermon Clips Rendered</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 text-center sm:text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">48-Hour</div>
              <div className="text-xs text-slate-500 font-medium">Sermon Turnaround SLA</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 text-center sm:text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">100%</div>
              <div className="text-xs text-slate-500 font-medium">Kingdom-Aligned Editors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
