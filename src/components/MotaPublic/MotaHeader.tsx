import React from 'react';
import { Globe2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MotaHeader: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Top Accessibility / Language Sub-strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-3 sm:px-6 py-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">भारत सरकार | Government of India</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">आदिवासी कल्याण मंत्रालय</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-slate-400">Screen Reader Access</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <div className="flex items-center gap-1.5">
            <Globe2 className="w-3 h-3 text-blue-400" />
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="text-white hover:text-blue-300 font-bold uppercase transition-colors"
            >
              {language === 'hi' ? 'English' : 'हिन्दी (Hindi)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Official Header matching tribal.nic.in */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Ashoka Emblem + Ministry Text */}
          <div className="flex items-center gap-3 sm:gap-4 self-start md:self-auto">
            {/* National Emblem SVG */}
            <div className="w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 100 120" className="w-full h-full text-slate-800" fill="currentColor">
                <path d="M50 5 L55 20 L70 20 L58 29 L62 44 L50 35 L38 44 L42 29 L30 20 L45 20 Z" fill="#b45309" opacity="0.3"/>
                {/* Ashoka Pillar Stylized Crest */}
                <circle cx="50" cy="55" r="32" fill="none" stroke="#1e3a8a" strokeWidth="3" />
                <circle cx="50" cy="55" r="28" fill="none" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="50" cy="55" r="6" fill="#1e3a8a" />
                {/* Ashoka Chakra 24 Spokes representation */}
                {[...Array(24)].map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="55"
                    x2={50 + 26 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={55 + 26 * Math.sin((i * 15 * Math.PI) / 180)}
                    stroke="#1e3a8a"
                    strokeWidth="1"
                  />
                ))}
                {/* Base Pedestal */}
                <rect x="25" y="92" width="50" height="6" rx="2" fill="#1e293b" />
                <rect x="20" y="99" width="60" height="4" rx="1" fill="#334155" />
                <text x="50" y="115" fontSize="10" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontFamily="serif">सत्यमेव जयते</text>
              </svg>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight font-serif">
                जनजातीय कार्य मंत्रालय
              </h2>
              <h1 className="text-lg sm:text-2xl font-extrabold text-blue-900 tracking-tight leading-tight font-serif">
                Ministry of Tribal Affairs
              </h1>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium block">
                Government of India
              </span>
            </div>
          </div>

          {/* Center Logos: 75 Azadi Ka Amrit Mahotsav & G20 India */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Azadi Ka Amrit Mahotsav Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/60 rounded-xl border border-amber-200/70">
              <span className="text-2xl font-black text-amber-700 font-serif leading-none">75</span>
              <div className="text-left leading-none">
                <span className="block text-[11px] font-bold text-amber-900">Azadi Ka</span>
                <span className="block text-[10px] font-extrabold text-orange-600 uppercase tracking-tight">Amrit Mahotsav</span>
              </div>
            </div>

            {/* G20 Bharat 2023 India Logo Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-blue-50/50 rounded-xl border border-blue-200/70">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
                G20
              </div>
              <div className="text-left leading-none">
                <span className="block text-[11px] font-bold text-slate-800">वसुधैव कुटुम्बकम्</span>
                <span className="block text-[9px] font-medium text-slate-500 uppercase tracking-tight">One Earth &bull; One Family &bull; One Future</span>
              </div>
            </div>
          </div>

          {/* Right: Direct Benefit Transfer (DBT) */}
          <div className="text-left md:text-right self-end md:self-auto">
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#1a4480] tracking-tight font-serif">
              Direct Benefit Transfer
            </h2>
            <p className="text-lg sm:text-2xl font-extrabold text-[#1a4480] font-serif leading-tight">
              (DBT)
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              National Scholarship &amp; Fellowship Portal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
