import React from 'react';
import { User, Laptop, Wrench, ShieldCheck, Sparkles, Award } from 'lucide-react';

interface UserAvatarIconProps {
  name: string;
  category?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  className?: string;
  showBadge?: boolean;
  verified?: boolean;
}

// Generate deterministic gradient & accent colors based on name or category
function getAvatarStyle(name: string, category?: string) {
  const cat = (category || '').toLowerCase();
  
  if (cat.includes('digital') || cat.includes('software') || cat.includes('developer') || cat.includes('design') || cat.includes('marketing')) {
    return {
      gradient: 'from-blue-600 via-indigo-600 to-slate-900',
      iconColor: 'text-blue-300',
      textColor: 'text-white',
      borderColor: 'border-blue-400/40',
      Icon: Laptop
    };
  }
  
  if (cat.includes('artisan') || cat.includes('mechanic') || cat.includes('electrical') || cat.includes('solar') || cat.includes('technician') || cat.includes('trade')) {
    return {
      gradient: 'from-amber-600 via-orange-600 to-slate-900',
      iconColor: 'text-amber-300',
      textColor: 'text-white',
      borderColor: 'border-amber-400/40',
      Icon: Wrench
    };
  }

  // Hash name for consistent gradient
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorVariants = [
    { gradient: 'from-emerald-600 via-teal-700 to-slate-900', iconColor: 'text-emerald-300', textColor: 'text-white', borderColor: 'border-emerald-400/40', Icon: User },
    { gradient: 'from-indigo-600 via-purple-700 to-slate-900', iconColor: 'text-indigo-300', textColor: 'text-white', borderColor: 'border-indigo-400/40', Icon: User },
    { gradient: 'from-sky-600 via-cyan-700 to-slate-900', iconColor: 'text-sky-300', textColor: 'text-white', borderColor: 'border-sky-400/40', Icon: User },
    { gradient: 'from-violet-600 via-fuchsia-700 to-slate-900', iconColor: 'text-violet-300', textColor: 'text-white', borderColor: 'border-violet-400/40', Icon: User },
    { gradient: 'from-teal-600 via-emerald-700 to-slate-900', iconColor: 'text-teal-300', textColor: 'text-white', borderColor: 'border-teal-400/40', Icon: User },
  ];

  return colorVariants[Math.abs(hash) % colorVariants.length];
}

export function getInitials(name: string): string {
  if (!name) return 'PZ';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'PZ';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const UserAvatarIcon: React.FC<UserAvatarIconProps> = ({
  name,
  category,
  size = 'md',
  className = '',
  showBadge = false,
  verified = false
}) => {
  const { gradient, iconColor, textColor, borderColor, Icon } = getAvatarStyle(name, category);
  const initials = getInitials(name);

  // Size mappings
  let sizeClasses = 'w-12 h-12 text-sm';
  let iconSize = 'w-4 h-4';
  let badgeSize = 'w-3.5 h-3.5';

  if (size === 'xs') {
    sizeClasses = 'w-8 h-8 text-[10px] rounded-lg';
    iconSize = 'w-3 h-3';
    badgeSize = 'w-2.5 h-2.5';
  } else if (size === 'sm') {
    sizeClasses = 'w-10 h-10 text-xs rounded-xl';
    iconSize = 'w-3.5 h-3.5';
    badgeSize = 'w-3 h-3';
  } else if (size === 'md') {
    sizeClasses = 'w-14 h-14 text-sm rounded-2xl';
    iconSize = 'w-4 h-4';
    badgeSize = 'w-3.5 h-3.5';
  } else if (size === 'lg') {
    sizeClasses = 'w-20 h-20 text-lg rounded-2xl';
    iconSize = 'w-5 h-5';
    badgeSize = 'w-4 h-4';
  } else if (size === 'xl') {
    sizeClasses = 'w-28 h-28 sm:w-36 sm:h-36 text-2xl sm:text-3xl rounded-3xl';
    iconSize = 'w-7 h-7 sm:w-9 sm:h-9';
    badgeSize = 'w-5 h-5';
  } else if (size === '2xl') {
    sizeClasses = 'w-32 h-32 text-3xl rounded-3xl';
    iconSize = 'w-8 h-8';
    badgeSize = 'w-6 h-6';
  } else if (typeof size === 'string' && size.includes('w-')) {
    sizeClasses = size;
  }

  return (
    <div className={`relative shrink-0 inline-flex items-center justify-center bg-gradient-to-br ${gradient} ${textColor} border ${borderColor} font-black tracking-wider shadow-md select-none overflow-hidden ${sizeClasses} ${className}`}>
      {/* Background Icon Watermark */}
      <Icon className={`absolute -bottom-1 -right-1 opacity-20 ${iconColor} w-2/3 h-2/3 pointer-events-none`} />
      
      {/* Main Avatar Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span>{initials}</span>
      </div>

      {/* Verified Badge Overlay */}
      {(verified || showBadge) && (
        <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow-sm border border-white/80 z-20" title="Verified Pulzitive Member">
          <ShieldCheck className={badgeSize} />
        </span>
      )}
    </div>
  );
};

export default UserAvatarIcon;
