import React from 'react';

export type TribalPatternVariant = 
  | 'warli-inspired' 
  | 'gond-inspired' 
  | 'toda-woven' 
  | 'forest-line' 
  | 'saura-rhythm' 
  | 'national-mosaic';

interface TribalPatternProps {
  variant?: TribalPatternVariant;
  className?: string;
  height?: number | string;
  opacity?: number;
  color?: string;
  asBackground?: boolean;
}

/**
 * Reusable, authentic vector pattern component representing diverse
 * documented regional tribal & indigenous visual traditions of India.
 * Subtle, respectful, non-stereotypical geometric and nature-inspired motifs.
 */
export const TribalPattern: React.FC<TribalPatternProps> = ({
  variant = 'national-mosaic',
  className = '',
  height = 14,
  opacity = 0.15,
  color = '#1D0A69',
  asBackground = false,
}) => {
  // 1. Warli-inspired geometric rhythmic step lines
  if (variant === 'warli-inspired') {
    return (
      <div 
        className={`w-full overflow-hidden select-none pointer-events-none ${asBackground ? 'absolute inset-0' : ''} ${className}`}
        style={{ height: asBackground ? '100%' : height, opacity }}
        aria-hidden="true"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pat-warli" width="48" height="16" patternUnits="userSpaceOnUse">
              <path 
                d="M0,8 L8,0 L16,8 L24,0 L32,8 L40,0 L48,8 L40,16 L32,8 L24,16 L16,8 L8,16 Z" 
                fill="none" 
                stroke={color} 
                strokeWidth="1.2" 
              />
              <circle cx="24" cy="8" r="1.5" fill={color} />
              <circle cx="8" cy="8" r="1" fill={color} />
              <circle cx="40" cy="8" r="1" fill={color} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pat-warli)" />
        </svg>
      </div>
    );
  }

  // 2. Gond-inspired fine dotting & organic curves
  if (variant === 'gond-inspired') {
    return (
      <div 
        className={`w-full overflow-hidden select-none pointer-events-none ${asBackground ? 'absolute inset-0' : ''} ${className}`}
        style={{ height: asBackground ? '100%' : height, opacity }}
        aria-hidden="true"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pat-gond" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 Q10,2 20,10 T40,10" fill="none" stroke={color} strokeWidth="1" strokeDasharray="1.5 2" />
              <path d="M0,16 Q10,8 20,16 T40,16" fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="1 2.5" />
              <circle cx="10" cy="4" r="1.2" fill={color} />
              <circle cx="30" cy="4" r="1.2" fill={color} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pat-gond)" />
        </svg>
      </div>
    );
  }

  // 3. Toda-inspired geometric diamond weaves
  if (variant === 'toda-woven') {
    return (
      <div 
        className={`w-full overflow-hidden select-none pointer-events-none ${asBackground ? 'absolute inset-0' : ''} ${className}`}
        style={{ height: asBackground ? '100%' : height, opacity }}
        aria-hidden="true"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pat-toda" width="32" height="16" patternUnits="userSpaceOnUse">
              <polygon points="16,1 31,8 16,15 1,8" fill="none" stroke={color} strokeWidth="1" />
              <polygon points="16,4 25,8 16,12 7,8" fill="none" stroke={color} strokeWidth="0.75" />
              <line x1="0" y1="8" x2="32" y2="8" stroke={color} strokeWidth="0.5" strokeDasharray="2 2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pat-toda)" />
        </svg>
      </div>
    );
  }

  // 4. Forest and seed geometry (eco-centric indigenous motifs)
  if (variant === 'forest-line') {
    return (
      <div 
        className={`w-full overflow-hidden select-none pointer-events-none ${asBackground ? 'absolute inset-0' : ''} ${className}`}
        style={{ height: asBackground ? '100%' : height, opacity }}
        aria-hidden="true"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pat-forest" width="36" height="18" patternUnits="userSpaceOnUse">
              <path d="M0,9 Q9,2 18,9 Q27,16 36,9" fill="none" stroke={color} strokeWidth="1" />
              <path d="M18,9 L14,5 M18,9 L22,5 M18,9 L14,13 M18,9 L22,13" stroke={color} strokeWidth="0.8" />
              <circle cx="18" cy="9" r="1.5" fill={color} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pat-forest)" />
        </svg>
      </div>
    );
  }

  // 5. Saura-inspired linear rhythm band
  if (variant === 'saura-rhythm') {
    return (
      <div 
        className={`w-full overflow-hidden select-none pointer-events-none ${asBackground ? 'absolute inset-0' : ''} ${className}`}
        style={{ height: asBackground ? '100%' : height, opacity }}
        aria-hidden="true"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pat-saura" width="24" height="14" patternUnits="userSpaceOnUse">
              <line x1="0" y1="2" x2="24" y2="2" stroke={color} strokeWidth="1" />
              <line x1="0" y1="12" x2="24" y2="12" stroke={color} strokeWidth="1" />
              <line x1="4" y1="2" x2="8" y2="12" stroke={color} strokeWidth="1" />
              <line x1="12" y1="2" x2="16" y2="12" stroke={color} strokeWidth="1" />
              <line x1="20" y1="2" x2="24" y2="12" stroke={color} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pat-saura)" />
        </svg>
      </div>
    );
  }

  // Default: National Tribal Mosaic Ribbon (combines geometric harmony)
  return (
    <div 
      className={`w-full overflow-hidden select-none pointer-events-none ${asBackground ? 'absolute inset-0' : ''} ${className}`}
      style={{ height: asBackground ? '100%' : height, opacity }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pat-national" width="60" height="14" patternUnits="userSpaceOnUse">
            <line x1="0" y1="1" x2="60" y2="1" stroke={color} strokeWidth="0.8" />
            <line x1="0" y1="13" x2="60" y2="13" stroke={color} strokeWidth="0.8" />
            <polygon points="10,2 15,7 10,12 5,7" fill="none" stroke={color} strokeWidth="0.9" />
            <circle cx="10" cy="7" r="1.2" fill={color} />
            <line x1="20" y1="4" x2="28" y2="10" stroke={color} strokeWidth="0.8" strokeDasharray="1 1" />
            <line x1="28" y1="4" x2="20" y2="10" stroke={color} strokeWidth="0.8" strokeDasharray="1 1" />
            <polygon points="40,2 45,7 40,12 35,7" fill="none" stroke={color} strokeWidth="0.9" />
            <circle cx="40" cy="7" r="1.2" fill={color} />
            <circle cx="53" cy="7" r="1.5" fill="none" stroke={color} strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pat-national)" />
      </svg>
    </div>
  );
};
