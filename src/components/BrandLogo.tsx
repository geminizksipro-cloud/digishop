import React from 'react';

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark'; // 'light' is for dark backgrounds (white text), 'dark' is for light backgrounds (dark slate text)
  showSubtitle?: boolean;
}

export default function BrandLogo({
  className = '',
  iconOnly = false,
  size = 'md',
  variant = 'dark',
  showSubtitle = false,
}: BrandLogoProps) {
  // Size classes
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const subtitleSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const textColorClass = variant === 'light' ? 'text-white' : 'text-slate-800';
  const subtitleColorClass = variant === 'light' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`flex items-center gap-2 ${className}`} id="brand-logo-component">
      {/* SVG Vector Logo Icon */}
      <div className={`${iconSizes[size]} shrink-0 relative`} id="brand-logo-icon">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(59,130,246,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="logo-pink-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="logo-purple-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="logo-blue-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            {/* Subtle glow for wheels */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Floating digital asset pixel/cubes (representing tech/digital product nature) - shifted vertically by -10 */}
          <rect x="12" y="22" width="9" height="9" rx="2.5" fill="#f43f5e" />
          <rect x="22" y="14" width="7" height="7" rx="2" fill="#d946ef" />
          <rect x="18" y="34" width="8" height="8" rx="2" fill="#a855f7" />
          <rect x="24" y="44" width="7" height="7" rx="2" fill="#6366f1" />

          {/* Upper Swoosh (D-Cart Top Frame - Pink/Magenta to Purple) - shifted vertically by -10 */}
          <path
            d="M 30 29 
               C 30 29, 68 29, 70 29 
               C 80 29, 86 35, 86 42
               C 86 46.5, 82 51.5, 75.5 53
               C 70 54.2, 53 54.2, 42.5 54.2
               L 36.5 34 
               Z"
            fill="url(#logo-pink-purple)"
          />

          {/* Lower Loop (D-Cart Bottom Basket/Sleek Frame - Purple to Blue/Cyan) - shifted vertically by -10 */}
          <path
            d="M 38 56 
               C 42 56, 75 56, 79.5 54.5
               C 86.5 52, 85 64, 76.5 68
               C 68 72, 53 72.5, 41.5 72.5
               C 39 72.5, 37.2 71, 36.8 68.5
               L 33.2 50 
               L 37.8 50 
               Z"
            fill="url(#logo-blue-cyan)"
          />

          {/* Connection bar/support of the cart - shifted vertically by -10 */}
          <rect x="42" y="71" width="22" height="3" rx="1.5" fill="url(#logo-blue-cyan)" opacity="0.3" />

          {/* Wheels (Floating Purple/Blue gradient wheels) - shifted vertically by -10 */}
          <circle cx="41" cy="80" r="5.5" fill="#8b5cf6" filter="url(#glow)" />
          <circle cx="61" cy="80" r="5.5" fill="#06b6d4" filter="url(#glow)" />
          
          {/* Innermost wheel hubs for visual depth - shifted vertically by -10 */}
          <circle cx="41" cy="80" r="2" fill="#ffffff" />
          <circle cx="61" cy="80" r="2" fill="#ffffff" />
        </svg>
      </div>

      {/* Brand Text */}
      {!iconOnly && (
        <div className="flex flex-col select-none" id="brand-logo-text-container">
          <div className="flex items-center">
            <span className={`font-semibold tracking-tight ${textSizes[size]} ${textColorClass}`}>
              DigiMarkt
              <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 ml-0.5">
                BD
              </span>
            </span>
          </div>

          {(showSubtitle || size === 'lg' || size === 'xl') && (
            <div className={`flex items-center gap-1.5 mt-0.5 font-bold tracking-wide uppercase ${subtitleSizes[size]} ${subtitleColorClass}`} id="brand-logo-subtitle">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="2.5">
                <rect x="5" y="11" width="14" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Secure • Private • Unlimited</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
