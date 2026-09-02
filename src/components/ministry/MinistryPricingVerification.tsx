import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  CreditCard, 
  Building2, 
  Award, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { MinistrySubscriptionTier, MinisterProfile } from '../../types';

interface MinistryPricingVerificationProps {
  currentTier?: MinistrySubscriptionTier;
  onSelectTier: (tier: MinistrySubscriptionTier) => void;
  onSubmitVerification: (profileData: Partial<MinisterProfile>) => Promise<void>;
  defaultMinisterName?: string;
  defaultChurchName?: string;
  defaultEmail?: string;
}

export const MinistryPricingVerification: React.FC<MinistryPricingVerificationProps> = ({
  currentTier = 'GROWTH_MINISTRY',
  onSelectTier,
  onSubmitVerification,
  defaultMinisterName = 'Pastor John Doe',
  defaultChurchName = 'Grace City Chapel',
  defaultEmail = 'pastor.john@gracechurch.org'
}) => {
  const [activeTab, setActiveTab] = useState<'pricing' | 'verification'>('pricing');

  // Verification state
  const [ministerName, setMinisterName] = useState(defaultMinisterName);
  const [churchName, setChurchName] = useState(defaultChurchName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState('+234 803 456 7890');
  const [title, setTitle] = useState<'Pastor' | 'Apostle' | 'Bishop' | 'Prophet' | 'Evangelist' | 'Reverend' | 'Minister'>('Pastor');
  const [denomination, setDenomination] = useState('Evangelical / Charismatic');
  const [country, setCountry] = useState('Nigeria');
  const [city, setCity] = useState('Lagos');
  const [ministryFocus, setMinistryFocus] = useState<'Pastoral' | 'Worship' | 'Youth' | 'Evangelism' | 'Prophetic' | 'Media' | 'Church Planting'>('Pastoral');
  const [websiteUrl, setWebsiteUrl] = useState('https://gracecitychapel.org');
  const [ordinationProofUrl, setOrdinationProofUrl] = useState('https://drive.google.com/file/d/1OrdinationCertificate/view');
  const [bio, setBio] = useState('Lead Pastor dedicated to preaching grace, raising kingdom leaders, and gospel media leverage.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const tiers = [
    {
      id: 'FREE',
      name: 'Fellowship Free',
      priceNgn: '₦0',
      period: 'forever',
      description: 'Essential fellowship for gospel leaders starting out.',
      features: [
        'Access to Verified Ministers Directory',
        '24/7 Global Intercession Wall',
        'Dreams & Visions Interpretation Sanctuary',
        'Download Standard Sermon Graphic Kits',
        'Minister 1-on-1 Direct Messaging'
      ],
      popular: false,
      buttonText: 'Current Active Tier'
    },
    {
      id: 'STARTER',
      name: 'Media Starter',
      priceNgn: '₦55,000',
      period: '/ month',
      description: 'Automate weekly Sunday sermon reels with zero hassle.',
      features: [
        '4x Vertical Sermon Shorts (9:16) / month',
        'Kinetic animated captions + viral hooks',
        'Sunday 16:9 Presentation Slide Deck',
        'Church Google Drive Vault Sync',
        '48-hour delivery turnaround'
      ],
      popular: false,
      buttonText: 'Subscribe with Paystack'
    },
    {
      id: 'GROWTH_MINISTRY',
      name: 'Growth Ministry',
      priceNgn: '₦100,000',
      period: '/ month',
      description: 'The complete human-powered media department for active churches.',
      features: [
        '8x Vertical Sermon Shorts (9:16) / month',
        'Full Sermon Series Graphic Pack (PSD + Canva)',
        '4K ProPresenter / OBS Lower-Thirds Overlays',
        'Dedicated Human Media Specialist',
        'Priority Sunday 24-hour turnaround',
        'All Pro Asset Library Downloads'
      ],
      popular: true,
      buttonText: 'Subscribe with Paystack'
    },
    {
      id: 'ENTERPRISE',
      name: 'Kingdom Enterprise',
      priceNgn: '₦200,000',
      period: '/ month',
      description: 'Comprehensive media architecture for multi-campus networks.',
      features: [
        'Unlimited Monthly Sermon Shorts & Edits',
        'Multi-Campus Custom Drive Architecture',
        'Full Conference & Event Video Teasers',
        'Podcast & Broadcast Audio Mastering',
        'Dedicated Lead Media Director on WhatsApp',
        'Same-Day Sunday Evening Delivery'
      ],
      popular: false,
      buttonText: 'Contact for Apostolic Retainer'
    }
  ];

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitVerification({
        displayName: ministerName,
        churchName,
        email,
        phone,
        title,
        denomination,
        country,
        city,
        ministryFocus,
        websiteUrl,
        ordinationProofUrl,
        bio,
        verificationStatus: 'VERIFIED'
      });
      setVerificationSuccess(true);
      setTimeout(() => setVerificationSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Navigation Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Media Plans & Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Minister Verification Portal
          </button>
        </div>
      </div>

      {activeTab === 'pricing' ? (
        <div className="space-y-8 w-full">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Invest in Your Church's Digital Footprint
            </h2>
            <p className="text-sm text-slate-600">
              No hidden fees. Human video editors specialized in Christian theology and high-retention vertical editing.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {tiers.map((tier) => {
              const isSelected = currentTier === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`bg-white rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                    tier.popular
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    {tier.popular && (
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200">
                        Most Popular for Churches
                      </span>
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{tier.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 py-2">
                      <span className="text-3xl font-extrabold text-slate-900">{tier.priceNgn}</span>
                      <span className="text-xs text-slate-500">{tier.period}</span>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100">
                      {tier.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <button
                      onClick={() => onSelectTier(tier.id as MinistrySubscriptionTier)}
                      className={`w-full py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-100 border border-slate-300 text-slate-800 font-bold'
                          : tier.popular
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      {isSelected ? 'Active Plan' : tier.buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Minister Ordination Verification Form */
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Kingdom Trust & Safety
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Ministers Network Ordination & Credentials Verification
            </h3>
            <p className="text-xs text-slate-600">
              To safeguard our spiritual intercession wall and exclusive minister directory, we verify pastoral credentials, church affiliations, or ordination licenses.
            </p>
          </div>

          {verificationSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Credentials Verified & Updated!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your minister profile has been certified with the Verified Pastor Shield across the platform directory and prayer wall.
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ecclesiastical Title</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Pastor">Pastor</option>
                    <option value="Apostle">Apostle</option>
                    <option value="Bishop">Bishop</option>
                    <option value="Prophet">Prophet</option>
                    <option value="Evangelist">Evangelist</option>
                    <option value="Reverend">Reverend</option>
                    <option value="Minister">Minister</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal / Ministerial Name *</label>
                  <input
                    type="text"
                    value={ministerName}
                    onChange={(e) => setMinisterName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Church / Ministry Name *</label>
                  <input
                    type="text"
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Denomination / Network</label>
                  <input
                    type="text"
                    value={denomination}
                    onChange={(e) => setDenomination(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Ministry Focus</label>
                  <select
                    value={ministryFocus}
                    onChange={(e) => setMinistryFocus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Pastoral">Pastoral</option>
                    <option value="Worship">Worship</option>
                    <option value="Youth">Youth</option>
                    <option value="Evangelism">Evangelism</option>
                    <option value="Prophetic">Prophetic</option>
                    <option value="Media">Media</option>
                    <option value="Church Planting">Church Planting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Church Website or Official Social Page</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://gracecitychapel.org"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ordination Proof / Pastoral License (Google Drive or Cloud Link)
                </label>
                <input
                  type="url"
                  value={ordinationProofUrl}
                  onChange={(e) => setOrdinationProofUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brief Ministry Bio & Vision Statement</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting Credentials...' : 'Submit for Ordination Badge'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
