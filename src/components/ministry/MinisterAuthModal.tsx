import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  Flame, 
  Church, 
  Globe, 
  MapPin, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, MinisterProfile } from '../../types';
import { signUpWithEmailReal, signInWithEmailReal, saveMinisterProfile, getFriendlyAuthErrorMessage } from '../../firebase';

interface MinisterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
  defaultTabInterest?: string;
}

export const MinisterAuthModal: React.FC<MinisterAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signup',
  defaultTabInterest = 'media'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Pastor');
  const [churchName, setChurchName] = useState('');
  const [denomination, setDenomination] = useState('Evangelical / Charismatic');
  const [country, setCountry] = useState('Nigeria');
  const [city, setCity] = useState('Lagos');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      const userProfile = await signInWithEmailReal(email, password);
      // Ensure user role is Minister
      userProfile.role = 'Minister';
      onSuccess(userProfile);
      onClose();
    } catch (err: any) {
      console.error(err);
      setAuthError(getFriendlyAuthErrorMessage(err?.code || err?.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match. Please re-type your password.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const fullDisplayName = `${title} ${name}`;
      const userProfile = await signUpWithEmailReal(email, password, fullDisplayName, 'Minister', phone);
      
      // Enrich user profile with church and ordination metadata
      const enrichedProfile: UserProfile = {
        ...userProfile,
        displayName: fullDisplayName,
        role: 'Minister',
        phone,
        companyName: churchName,
        profileCompleted: true
      };

      // Also persist to minister profiles
      const ministerProf: MinisterProfile = {
        uid: userProfile.uid,
        email: email,
        displayName: name,
        title: title,
        churchName: churchName,
        denomination: denomination,
        country: country,
        city: city,
        ministryFocus: 'Pastoral',
        verificationStatus: 'PENDING',
        role: 'MINISTER',
        subscriptionTier: 'GROWTH_MINISTRY',
        googleDriveFolderName: `${churchName.replace(/\s+/g, '_')}_Media_Vault`,
        createdAt: new Date().toISOString()
      };

      try {
        await saveMinisterProfile(ministerProf);
      } catch (profErr) {
        console.warn('Could not save minister profile to collection:', profErr);
      }

      onSuccess(enrichedProfile);
      onClose();
    } catch (err: any) {
      console.error(err);
      setAuthError(getFriendlyAuthErrorMessage(err?.code || err?.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 relative my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'signup' ? 'Pastors & Ministers Registration' : 'Pastor & Minister Sign In'}
          </h2>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            {mode === 'signup' 
              ? 'Access the Pastors & Ministers Dashboard with Done-For-You Media Engine, Global Intercession Wall, Prophetic Sanctuary & Sermon Vault.'
              : 'Sign in to access your church sermon video edits, prayers, and pastoral network.'
            }
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('signup'); setAuthError(null); }}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register as Pastor / Minister
          </button>
          <button
            type="button"
            onClick={() => { setMode('signin'); setAuthError(null); }}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In to Ministry Portal
          </button>
        </div>

        {/* Error Banner */}
        {authError && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{authError}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ministerial Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="pastor@yourchurch.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl cursor-pointer shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>Sign In & Open Minister Dashboard</span>
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                >
                  <option value="Pastor">Pastor</option>
                  <option value="Apostle">Apostle</option>
                  <option value="Bishop">Bishop</option>
                  <option value="Prophet">Prophet</option>
                  <option value="Evangelist">Evangelist</option>
                  <option value="Reverend">Reverend</option>
                  <option value="Minister">Minister</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Elder">Elder</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., John Adebayo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Church / Ministry Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Grace City Chapel"
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Denomination / Stream</label>
                <select
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                >
                  <option value="Evangelical / Charismatic">Evangelical / Charismatic</option>
                  <option value="Pentecostal">Pentecostal</option>
                  <option value="Baptist / Reformed">Baptist / Reformed</option>
                  <option value="Anglican / Episcopal">Anglican / Episcopal</option>
                  <option value="Methodist / Presbyterian">Methodist / Presbyterian</option>
                  <option value="Non-Denominational Apostolic">Non-Denominational Apostolic</option>
                  <option value="Other Christian Fellowship">Other Christian Fellowship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Lagos, London, Houston"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Nigeria, United Kingdom, USA"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="pastor@gracecity.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                By registering, you receive instant access to your dedicated Google Drive media cloud vault, automated sermon reels workflow, and apostolic intercession wall.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl cursor-pointer shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>Create Account & Launch Pastors Dashboard</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
