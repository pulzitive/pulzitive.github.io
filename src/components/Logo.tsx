import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  // Height classes for consistent responsive design
  const sizeClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-9 sm:h-10',
    lg: 'h-14 sm:h-16'
  };

  return (
    <div className={`flex items-center gap-2 select-none shrink-0 ${className}`}>
      {/* High-fidelity vector SVG matching the uploaded custom P logo */}
      <svg 
        viewBox="0 0 160 160" 
        className={`${sizeClasses[size]} aspect-square`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Pulzitive P Logo Symbol"
      >
        {/* Outer dark blue border stripe of P */}
        <path 
          d="M 40,25 L 40,135 M 40,25 L 95,25 C 125,25 125,75 95,75 L 40,75" 
          stroke="#104a7b" 
          strokeWidth="11" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Inner Yellow Stripe */}
        <path 
          d="M 52,38 L 52,62 M 52,38 L 88,38 C 102,38 102,62 88,62 L 52,62" 
          stroke="#eec20e" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Middle Green Stripe */}
        <path 
          d="M 46,31.5 L 46,120 M 46,31.5 L 92,31.5 C 114,31.5 114,68.5 92,68.5 L 46,68.5" 
          stroke="#008f51" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Inner Red stripe crossing bottom stem corner */}
        <path 
          d="M 58,45 L 58,55 M 58,45 L 82,45 C 90,45 90,55 82,55 L 58,55" 
          stroke="#d92d2d" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* The active heartbeat/ECG wave crossing the P from left to right */}
        <path 
          d="M 12,75 L 34,75 L 44,45 L 54,105 L 64,25 L 74,90 L 84,70 L 94,75 L 115,75" 
          stroke="#008f51" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Beautiful high-contrast glowing heartbeat accents */}
        <circle cx="64" cy="25" r="4.5" fill="#d92d2d" />
        <circle cx="54" cy="105" r="4.5" fill="#eec20e" />
        <circle cx="44" cy="45" r="4.5" fill="#104a7b" />
      </svg>
      
      {showText && (
        <span className="font-sans font-black tracking-tight text-slate-900 hover:text-emerald-600 transition-colors text-base sm:text-lg">
          Pulzitive
        </span>
      )}
    </div>
  );
}
