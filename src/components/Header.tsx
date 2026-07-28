/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Menu, X, Bell, LogIn, LogOut, ChevronDown, User, Sparkles, BookOpen, 
  ShoppingBag, ShieldAlert, Award, Calendar, Globe, DollarSign, UserPlus, Briefcase
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { 
  triggerSignOut,
  signInWithEmailReal,
  signUpWithEmailReal,
  getFriendlyAuthErrorMessage,
  saveProfile
} from '../firebase';
import Logo from './Logo';

const countriesList = [
  { code: 'NG', dialCode: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'AF', dialCode: '+93', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AL', dialCode: '+355', name: 'Albania', flag: '🇦🇱' },
  { code: 'DZ', dialCode: '+213', name: 'Algeria', flag: '🇩🇿' },
  { code: 'AD', dialCode: '+376', name: 'Andorra', flag: '🇦🇩' },
  { code: 'AO', dialCode: '+244', name: 'Angola', flag: '🇦🇴' },
  { code: 'AR', dialCode: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AM', dialCode: '+374', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'AT', dialCode: '+43', name: 'Austria', flag: '🇦🇹' },
  { code: 'AZ', dialCode: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'BS', dialCode: '+1-242', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BH', dialCode: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'BD', dialCode: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BB', dialCode: '+1-246', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BY', dialCode: '+375', name: 'Belarus', flag: '🇧🇾' },
  { code: 'BE', dialCode: '+32', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BZ', dialCode: '+501', name: 'Belize', flag: '🇧🇿' },
  { code: 'BJ', dialCode: '+229', name: 'Benin', flag: '🇧🇯' },
  { code: 'BT', dialCode: '+975', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'BO', dialCode: '+591', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BA', dialCode: '+387', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BW', dialCode: '+267', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BR', dialCode: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BN', dialCode: '+673', name: 'Brunei', flag: '🇧🇳' },
  { code: 'BG', dialCode: '+359', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'BF', dialCode: '+226', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', dialCode: '+257', name: 'Burundi', flag: '🇧🇮' },
  { code: 'KH', dialCode: '+855', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'CM', dialCode: '+237', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CV', dialCode: '+238', name: 'Cape Verde', flag: '🇨🇻' },
  { code: 'CF', dialCode: '+236', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'TD', dialCode: '+235', name: 'Chad', flag: '🇹🇩' },
  { code: 'CL', dialCode: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: 'CN', dialCode: '+86', name: 'China', flag: '🇨🇳' },
  { code: 'CO', dialCode: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: 'KM', dialCode: '+269', name: 'Comoros', flag: '🇰🇲' },
  { code: 'CR', dialCode: '+506', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'HR', dialCode: '+385', name: 'Croatia', flag: '🇭🇷' },
  { code: 'CU', dialCode: '+53', name: 'Cuba', flag: '🇨🇺' },
  { code: 'CY', dialCode: '+357', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'CZ', dialCode: '+420', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'CD', dialCode: '+243', name: 'Democratic Republic of the Congo', flag: '🇨🇩' },
  { code: 'DK', dialCode: '+45', name: 'Denmark', flag: '🇩🇰' },
  { code: 'DJ', dialCode: '+253', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'DM', dialCode: '+1-767', name: 'Dominica', flag: '🇩🇲' },
  { code: 'DO', dialCode: '+1-809', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'EC', dialCode: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'EG', dialCode: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SV', dialCode: '+503', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'GQ', dialCode: '+240', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'ER', dialCode: '+291', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'EE', dialCode: '+372', name: 'Estonia', flag: '🇪🇪' },
  { code: 'ET', dialCode: '+251', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'FJ', dialCode: '+679', name: 'Fiji', flag: '🇫🇯' },
  { code: 'FI', dialCode: '+358', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', dialCode: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'GA', dialCode: '+241', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', dialCode: '+220', name: 'Gambia', flag: '🇬🇲' },
  { code: 'GE', dialCode: '+995', name: 'Georgia', flag: '🇬🇪' },
  { code: 'DE', dialCode: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'GH', dialCode: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GR', dialCode: '+30', name: 'Greece', flag: '🇬🇷' },
  { code: 'GD', dialCode: '+1-473', name: 'Grenada', flag: '🇬🇩' },
  { code: 'GT', dialCode: '+502', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'GN', dialCode: '+224', name: 'Guinea', flag: '🇬🇳' },
  { code: 'GW', dialCode: '+245', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: 'GY', dialCode: '+592', name: 'Guyana', flag: '🇬🇾' },
  { code: 'HT', dialCode: '+509', name: 'Haiti', flag: '🇭🇹' },
  { code: 'HN', dialCode: '+504', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HK', dialCode: '+852', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'HU', dialCode: '+36', name: 'Hungary', flag: '🇭🇺' },
  { code: 'IS', dialCode: '+354', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IN', dialCode: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'ID', dialCode: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IR', dialCode: '+98', name: 'Iran', flag: '🇮🇷' },
  { code: 'IQ', dialCode: '+964', name: 'Iraq', flag: '🇮🇶' },
  { code: 'IE', dialCode: '+353', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', dialCode: '+972', name: 'Israel', flag: '🇮🇱' },
  { code: 'IT', dialCode: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: 'CI', dialCode: '+225', name: 'Ivory Coast', flag: '🇨🇮' },
  { code: 'JM', dialCode: '+1-876', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JP', dialCode: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'JO', dialCode: '+962', name: 'Jordan', flag: '🇯🇴' },
  { code: 'KZ', dialCode: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KE', dialCode: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: 'KW', dialCode: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'KG', dialCode: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'LA', dialCode: '+856', name: 'Laos', flag: '🇱🇦' },
  { code: 'LV', dialCode: '+371', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LB', dialCode: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'LS', dialCode: '+266', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'LR', dialCode: '+231', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LY', dialCode: '+218', name: 'Libya', flag: '🇱🇾' },
  { code: 'LI', dialCode: '+423', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LT', dialCode: '+370', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LU', dialCode: '+352', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MK', dialCode: '+389', name: 'Macedonia', flag: '🇲🇰' },
  { code: 'MG', dialCode: '+261', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MW', dialCode: '+265', name: 'Malawi', flag: '🇲🇼' },
  { code: 'MY', dialCode: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MV', dialCode: '+960', name: 'Maldives', flag: '🇲🇻' },
  { code: 'ML', dialCode: '+223', name: 'Mali', flag: '🇲🇱' },
  { code: 'MT', dialCode: '+356', name: 'Malta', flag: '🇲🇹' },
  { code: 'MR', dialCode: '+222', name: 'Mauritania', flag: '🇲🇷' },
  { code: 'MU', dialCode: '+230', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'MX', dialCode: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: 'MD', dialCode: '+373', name: 'Moldova', flag: '🇲🇩' },
  { code: 'MC', dialCode: '+377', name: 'Monaco', flag: '🇲🇨' },
  { code: 'MN', dialCode: '+976', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'ME', dialCode: '+382', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'MA', dialCode: '+212', name: 'Morocco', flag: '🇲🇦' },
  { code: 'MZ', dialCode: '+258', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'MM', dialCode: '+95', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'NA', dialCode: '+264', name: 'Namibia', flag: '🇳🇦' },
  { code: 'NP', dialCode: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: 'NL', dialCode: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NZ', dialCode: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NI', dialCode: '+505', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NE', dialCode: '+227', name: 'Niger', flag: '🇳🇪' },
  { code: 'NO', dialCode: '+47', name: 'Norway', flag: '🇳🇴' },
  { code: 'OM', dialCode: '+968', name: 'Oman', flag: '🇴🇲' },
  { code: 'PK', dialCode: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PS', dialCode: '+970', name: 'Palestine', flag: '🇵🇸' },
  { code: 'PA', dialCode: '+507', name: 'Panama', flag: '🇵🇦' },
  { code: 'PG', dialCode: '+675', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: 'PY', dialCode: '+595', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', dialCode: '+51', name: 'Peru', flag: '🇵🇪' },
  { code: 'PH', dialCode: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', dialCode: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', dialCode: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: 'QA', dialCode: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: 'RO', dialCode: '+40', name: 'Romania', flag: '🇷🇴' },
  { code: 'RU', dialCode: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: 'RW', dialCode: '+250', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SN', dialCode: '+221', name: 'Senegal', flag: '🇸🇳' },
  { code: 'RS', dialCode: '+381', name: 'Serbia', flag: '🇷🇸' },
  { code: 'SC', dialCode: '+248', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SL', dialCode: '+232', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SG', dialCode: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'SK', dialCode: '+421', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', dialCode: '+386', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'SO', dialCode: '+252', name: 'Somalia', flag: '🇸🇴' },
  { code: 'ZA', dialCode: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: 'ES', dialCode: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: 'LK', dialCode: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'SD', dialCode: '+249', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SE', dialCode: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', dialCode: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SY', dialCode: '+963', name: 'Syria', flag: '🇸🇾' },
  { code: 'TW', dialCode: '+886', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TZ', dialCode: '+255', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'TH', dialCode: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TG', dialCode: '+228', name: 'Togo', flag: '🇹🇬' },
  { code: 'TN', dialCode: '+216', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'TR', dialCode: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: 'UG', dialCode: '+256', name: 'Uganda', flag: '🇺🇬' },
  { code: 'UA', dialCode: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'UY', dialCode: '+598', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'UZ', dialCode: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'VE', dialCode: '+58', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', dialCode: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'YE', dialCode: '+967', name: 'Yemen', flag: '🇾🇪' },
  { code: 'ZM', dialCode: '+260', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', dialCode: '+263', name: 'Zimbabwe', flag: '🇿🇼' }
];

interface HeaderProps {
  currentUser: UserProfile | null;
  onNavigate: (page: string) => void;
  activePage: string;
  onUserChanged: (user: UserProfile | null) => void;
  notifications: Array<{ id: string; text: string; read: boolean }>;
  onMarkNotificationsRead: () => void;
  isAuthModalOpen?: boolean;
  setIsAuthModalOpen?: (isOpen: boolean) => void;
  authTab?: 'signin' | 'signup' | 'sms';
  setAuthTab?: (tab: 'signin' | 'signup' | 'sms') => void;
  isAdminAuth?: boolean;
  setIsAdminAuth?: (val: boolean) => void;
  isClientSignUpOnly?: boolean;
}

export default function Header({
  currentUser,
  onNavigate,
  activePage,
  onUserChanged,
  notifications,
  onMarkNotificationsRead,
  isAuthModalOpen: propIsAuthModalOpen,
  setIsAuthModalOpen: propSetIsAuthModalOpen,
  authTab: propAuthTab,
  setAuthTab: propSetAuthTab,
  isAdminAuth,
  setIsAdminAuth,
  isClientSignUpOnly = false
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  
  const [localIsAuthModalOpen, setLocalIsAuthModalOpen] = useState(false);
  const [localAuthTab, setLocalAuthTab] = useState<'signin' | 'signup'>('signin');

  const isAuthModalOpen = propIsAuthModalOpen !== undefined ? propIsAuthModalOpen : localIsAuthModalOpen;
  const setIsAuthModalOpen = propSetIsAuthModalOpen !== undefined ? propSetIsAuthModalOpen : setLocalIsAuthModalOpen;
  const authTab = propAuthTab !== undefined ? propAuthTab : localAuthTab;
  const setAuthTab = propSetAuthTab !== undefined ? propSetAuthTab : setLocalAuthTab;
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('+234');
  const [signUpRole, setSignUpRole] = useState<UserRole>('Student');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  
  // SMS Authentication State variables
  const [smsPhoneNumber, setSmsPhoneNumber] = useState('');
  const [smsOtpCode, setSmsOtpCode] = useState('');
  const [smsVerificationId, setSmsVerificationId] = useState('');
  const [smsOtpSent, setSmsOtpSent] = useState(false);
  const [smsSimulatedOtp, setSmsSimulatedOtp] = useState('');

  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const availableRoles: { role: UserRole; label: string; desc: string; icon: any }[] = [
    { role: 'Student', label: 'Student', desc: 'Track XP, Badges & Learn', icon: Award },
    { role: 'Parent', label: 'Parent', desc: 'Monitor Progress & Advise', icon: User },
    { role: 'Teacher', label: 'Teacher', desc: 'Manage Students & Commissions', icon: BookOpen },
    { role: 'School Admin', label: 'School Portal', desc: 'Institution Rosters & Billing', icon: ShieldAlert },
    { role: 'Mentor', label: 'Mentor Hub', desc: 'Guided Mentees & Real-time chat', icon: Globe },
    { role: 'Sponsor', label: 'Sponsorship Desk', desc: 'Fund Technical Talents', icon: DollarSign },
    { role: 'Talent', label: 'Talent Dashboard', desc: 'List Services & Get Hired', icon: Briefcase },
    { role: 'Client', label: 'Customer / Client', desc: 'Hire Local Artisans & Services', icon: Calendar },
    { role: 'Admin', label: 'Global Administration', desc: 'Revenue, Leads & platform controls', icon: Sparkles }
  ];

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const profile = await signInWithEmailReal(signInEmail, signInPassword);
      if (activePage === 'home') {
        profile.role = 'Client';
        await saveProfile(profile);
      }
      onUserChanged(profile);
      setIsAuthModalOpen(false);
      setSignInEmail('');
      setSignInPassword('');
      onNavigate('dashboard');
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setAuthError(getFriendlyAuthErrorMessage(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      sessionStorage.setItem('selected_role', signUpRole);
      const fullPhone = `${selectedPhoneCode}${signUpPhone}`;
      const profile = await signUpWithEmailReal(signUpEmail, signUpPassword, signUpName, signUpRole, fullPhone);
      if (activePage === 'home') {
        profile.role = 'Client';
        await saveProfile(profile);
      }
      onUserChanged(profile);
      setIsAuthModalOpen(false);
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPhone('');
      setSignUpPassword('');
      onNavigate('dashboard');
    } catch (err: any) {
      console.error("Sign-up error:", err);
      setAuthError(getFriendlyAuthErrorMessage(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    const isAcademyRole = currentUser && ['Student', 'Parent', 'Teacher', 'School Admin', 'Mentor', 'Sponsor'].includes(currentUser.role);
    await triggerSignOut();
    onUserChanged(null);
    if (isAcademyRole || activePage === 'academy') {
      onNavigate('academy');
    } else {
      onNavigate('home');
    }
  };

  const rolesToDisplay = isAdminAuth
    ? availableRoles.filter(item => item.role === 'Admin')
    : isClientSignUpOnly || activePage === 'home'
      ? availableRoles.filter(item => item.role === 'Client')
      : activePage === 'talents'
        ? availableRoles.filter(item => item.role === 'Talent' || item.role === 'Client')
        : activePage === 'academy'
          ? availableRoles.filter(item => item.role === 'Student')
          : availableRoles.filter(item => item.role !== 'Client' && item.role !== 'Admin');

  React.useEffect(() => {
    if (isAdminAuth) {
      setSignUpRole('Admin');
    } else if (isClientSignUpOnly || activePage === 'home') {
      setSignUpRole('Client');
    } else if (activePage === 'talents') {
      setSignUpRole('Talent');
    } else {
      setSignUpRole('Student');
    }
  }, [activePage, isAuthModalOpen, isAdminAuth, isClientSignUpOnly]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'home' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'portfolio' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => onNavigate('talents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'talents' ? 'bg-slate-900 text-emerald-400 font-bold' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Talents
            </button>
            <button
              onClick={() => onNavigate('academy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'academy' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Academy
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'marketplace' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Resource Vault
            </button>
            <button
              onClick={() => onNavigate('community')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'community' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'pricing' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Pricing Plans
            </button>
            <button
              onClick={() => onNavigate('pr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'pr' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Press
            </button>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`hidden md:block px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                  activePage === 'dashboard' 
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500' 
                    : 'text-emerald-400 border-emerald-400/30 hover:bg-emerald-500/10'
                }`}
              >
                Access Dashboard
              </button>
            )}

            {/* Notifications */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotifDropdownOpen(!isNotifDropdownOpen);
                    if (!isNotifDropdownOpen) onMarkNotificationsRead();
                  }}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-900 rounded-full cursor-pointer transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950 animate-ping"></span>
                  )}
                </button>
                {isNotifDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2.5 text-xs z-50 text-slate-200">
                    <h4 className="font-semibold text-white pb-1.5 mb-1.5 border-b border-slate-800 flex justify-between">
                      <span>Notifications</span>
                      {unreadCount > 0 && <span className="text-[10px] text-emerald-400 font-mono">({unreadCount} new)</span>}
                    </h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-2">No notifications yet</p>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className="p-1.5 bg-slate-950/50 rounded border border-slate-800/30">
                            <p className="text-[10px] leading-tight">{notif.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sign Up / Sign In Block */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthTab('signin');
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Start</span>
                </button>
              </div>
            ) : (
              /* User Profile Menu */
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer font-medium tracking-wide transition-all shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="max-w-[100px] truncate">{currentUser.displayName || 'My Profile'}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-left">
                    <div className="border-b border-slate-800 pb-3 mb-3">
                      <p className="text-xs font-bold text-white truncate">{currentUser.displayName || 'User Profile'}</p>
                      <p className="text-[10px] text-gray-400 truncate">{currentUser.email}</p>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                        <p className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">Assigned Role</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="text-xs font-semibold text-emerald-400">{currentUser.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left p-2 rounded-xl hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-900 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-2">
          <button
            onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('portfolio'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Portfolio
          </button>
          <button
            onClick={() => { onNavigate('talents'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Talents
          </button>
          <button
            onClick={() => { onNavigate('academy'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Academy
          </button>
          <button
            onClick={() => { onNavigate('marketplace'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Resource Vault
          </button>
          <button
            onClick={() => { onNavigate('community'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Community
          </button>
          <button
            onClick={() => { onNavigate('pricing'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Pricing Plans
          </button>
          <button
            onClick={() => { onNavigate('pr'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Press
          </button>
          {!currentUser ? (
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setAuthTab('signin');
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-center px-3 py-2.5 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl cursor-pointer shadow-md transition-colors"
              >
                Start
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <p className="px-3 text-[9px] text-gray-500 uppercase font-mono">Active Account: {currentUser.role}</p>
              <button
                onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-emerald-400 bg-slate-950 hover:bg-slate-800 rounded-lg border border-emerald-500/20 cursor-pointer"
              >
                Access Dashboard
              </button>
              <button
                onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
      {/* UNIFIED AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5 text-left">
            <button 
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthError(null);
                if (setIsAdminAuth) setIsAdminAuth(false);
              }} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
              <div>
                <h3 className="text-lg font-black text-white leading-none">Access Pulzitive Portal</h3>
                <p className="text-[10px] text-gray-400 mt-1">Live Firestore portal</p>
              </div>
            </div>

            {isClientSignUpOnly && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] p-3.5 rounded-2xl space-y-1">
                <p className="font-bold text-emerald-200">✨ Client Access Activated</p>
                <p className="text-[10px] text-emerald-300/80 leading-relaxed">
                  Please sign up or sign in as a <strong>Client</strong> below to instantly unlock your Website SEO audit and calendar coordinates.
                </p>
              </div>
            )}

            {/* Segmented Tab Controls */}
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800/80 gap-1">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signin');
                  setAuthError(null);
                }}
                className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-xl transition-all cursor-pointer ${
                  authTab === 'signin'
                    ? 'bg-slate-800 text-emerald-400 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signup');
                  setAuthError(null);
                }}
                className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-xl transition-all cursor-pointer ${
                  authTab === 'signup'
                    ? 'bg-slate-800 text-emerald-400 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Start
              </button>
            </div>
 
            {/* Error Banner */}
            {authError && (
              authError === 'auth/unauthorized-domain' ? (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs p-4 rounded-2xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-200">Domain Authorization Required!</h4>
                      <p className="text-[10px] text-amber-300/90 mt-1 leading-relaxed">
                        This custom domain (<span className="font-mono text-white underline">pulzitive.github.io</span>) has not yet been authorized in your Firebase Project's Settings.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950/60 p-3 rounded-xl text-[10px] space-y-1.5 border border-slate-800 text-slate-300">
                     <p className="font-semibold text-slate-200">How to authorize this domain:</p>
                     <ol className="list-decimal pl-4 space-y-1">
                       <li>Open the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-semibold hover:text-emerald-300">Firebase Console</a>.</li>
                       <li>Go to <span className="font-semibold text-slate-200">Authentication &gt; Settings</span> tab.</li>
                       <li>Scroll down to <span className="font-semibold text-slate-200">Authorized domains</span> and click <span className="font-semibold text-slate-200">Add domain</span>.</li>
                       <li>Add: <span className="font-mono text-white bg-slate-800 px-1 py-0.5 rounded">pulzitive.github.io</span></li>
                     </ol>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[11px] p-3.5 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-rose-400" />
                    <span className="font-medium">{authError}</span>
                  </div>
                </div>
              )
            )}
 
            {/* Form Content */}
            {authTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., adebayo@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-black py-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogIn className="w-3.5 h-3.5" />
                  )}
                  <span>Sign In</span>
                </button>
              </form>
            )}
 
            {authTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Adebayo Oluwaseun"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., adebayo@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Phone Number</label>
                  <div className="flex gap-1.5">
                    <select 
                      value={selectedPhoneCode}
                      onChange={(e) => setSelectedPhoneCode(e.target.value)}
                      className="bg-white border border-slate-300 text-slate-900 text-xs rounded-xl px-2.5 py-2 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-400 max-w-[130px]"
                    >
                      {countriesList.map((country) => (
                        <option key={`${country.code}-${country.dialCode}`} value={country.dialCode} className="text-slate-900 bg-white">
                          {country.flag} {country.dialCode} ({country.code})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., 8011223344"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Select Profile Role</label>
                  <select
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 text-xs font-medium"
                  >
                    {rolesToDisplay.map(item => (
                      <option key={item.role} value={item.role} className="text-slate-900 bg-white">
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-black py-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserPlus className="w-3.5 h-3.5" />
                  )}
                  <span>Start / Create Account</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
