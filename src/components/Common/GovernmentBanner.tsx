import React from 'react';
import { TribalPattern } from './TribalPattern';

export const GovernmentBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#1D0A69] text-white">
      {/* Subtle National Tricolor Ribbon */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-[#FFFFFF]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Main Official Title Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Emblem & Ministry Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Official Emblem Representation */}
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white/10 rounded-lg p-1 border border-white/20">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-300">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <path d="M50 18 L50 34 M50 66 L50 82 M18 50 L34 50 M66 50 L82 50" stroke="currentColor" strokeWidth="2.5" />
              <path d="M28 28 L39 39 M61 61 L72 72 M28 72 L39 61 M61 39 L72 28" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="4" fill="currentColor" />
            </svg>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200">
                भारत सरकार &bull; Government of India
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-white font-heading">
              जनजातीय कार्य मंत्रालय &bull; Ministry of Tribal Affairs
            </h1>
            <p className="text-[11px] sm:text-xs text-amber-200/90 font-medium">
              National DBT Scholarship &amp; Fellowship Management Portal for Scheduled Tribe Students
            </p>
          </div>
        </div>

        {/* Right Info: DBT Direct Benefit Transfer & Official Call Center */}
        <div className="hidden lg:flex items-center gap-4 text-right">
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-xs">
            <div className="text-[10px] uppercase font-bold text-amber-300">DBT Mission Bharat</div>
            <div className="text-slate-200 font-semibold">100% Aadhaar-Bridged PFMS Disbursal</div>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-300">MoTA Samadhan Toll-Free</div>
            <div className="text-amber-200 font-bold tracking-wide">1800-11-7777</div>
          </div>
        </div>
      </div>

      {/* Subtle Regional Motif Band Divider */}
      <TribalPattern variant="national-mosaic" height={10} opacity={0.35} color="#FFD166" />
    </div>
  );
};
