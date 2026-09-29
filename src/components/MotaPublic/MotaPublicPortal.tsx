import React, { useState } from 'react';
import { 
  Home, 
  Layers, 
  BarChart3, 
  Phone, 
  TrendingUp, 
  LogIn, 
  UserPlus, 
  ArrowLeftRight, 
  GraduationCap,
  ShieldCheck,
  Building2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { MotaHeader } from './MotaHeader';
import { MotaHomeView } from './MotaHomeView';
import { MotaSchemesView } from './MotaSchemesView';
import { MotaContactUs } from './MotaContactUs';
import { MotaFiguresAtGlance } from './MotaFiguresAtGlance';
import { MinistryAnalyticsDashboard } from '../Analytics/MinistryAnalyticsDashboard';
import { useAuth } from '../../context/AuthContext';
import { ScholarshipScheme } from '../../types';

interface MotaPublicPortalProps {
  onOpenAuth: (mode?: 'LOGIN' | 'REGISTER') => void;
  onSwitchToWorkspace: () => void;
  onApplyScheme: (scheme: ScholarshipScheme) => void;
}

export type MotaPublicTab = 'home' | 'schemes' | 'dashboard' | 'contact_us' | 'fig_at_glance';

export const MotaPublicPortal: React.FC<MotaPublicPortalProps> = ({
  onOpenAuth,
  onSwitchToWorkspace,
  onApplyScheme,
}) => {
  const { currentUser, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<MotaPublicTab>('contact_us'); // Defaults to 'contact_us' or 'home', matching user screenshot context!

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* 1. Official Ashoka Emblem & MoTA Header */}
      <MotaHeader />

      {/* 2. Official Teal-Blue Navigation Bar matching tribal.nic.in/ScholarshiP.aspx */}
      <nav className="bg-[#135d88] text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 gap-1 overflow-x-auto scrollbar-none">
            {/* Left Nav Links */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors rounded-t-sm ${
                  activeTab === 'home'
                    ? 'bg-[#ea580c] text-white'
                    : 'text-white/90 hover:bg-[#0e486b] hover:text-white'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setActiveTab('schemes')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors rounded-t-sm ${
                  activeTab === 'schemes'
                    ? 'bg-[#ea580c] text-white'
                    : 'text-white/90 hover:bg-[#0e486b] hover:text-white'
                }`}
              >
                Schemes
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors rounded-t-sm ${
                  activeTab === 'dashboard'
                    ? 'bg-[#ea580c] text-white'
                    : 'text-white/90 hover:bg-[#0e486b] hover:text-white'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab('contact_us')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors rounded-t-sm ${
                  activeTab === 'contact_us'
                    ? 'bg-[#ea580c] text-white shadow-sm'
                    : 'text-white/90 hover:bg-[#0e486b] hover:text-white'
                }`}
              >
                Contact Us
              </button>

              <button
                onClick={() => setActiveTab('fig_at_glance')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors rounded-t-sm ${
                  activeTab === 'fig_at_glance'
                    ? 'bg-[#ea580c] text-white'
                    : 'text-white/90 hover:bg-[#0e486b] hover:text-white'
                }`}
              >
                Fig.at a Glance
              </button>
            </div>

            {/* Right Nav Actions: Login, Sign Up, Role Workspace */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {currentUser ? (
                <button
                  onClick={onSwitchToWorkspace}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs rounded-lg shadow-sm transition-all"
                  title="Switch to Authenticated RBAC Portal Dashboard"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{activeRole} Workspace</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('LOGIN')}
                    className="px-3 py-1.5 text-xs sm:text-sm font-bold text-white hover:text-amber-200 transition-colors flex items-center gap-1"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </button>

                  <button
                    onClick={() => onOpenAuth('REGISTER')}
                    className="px-3 py-1.5 text-xs sm:text-sm font-bold text-white hover:text-amber-200 transition-colors flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </button>

                  <button
                    onClick={onSwitchToWorkspace}
                    className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold border border-white/20 transition-all"
                  >
                    <span>Role Console</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 3. Tab Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {activeTab === 'home' && (
          <MotaHomeView 
            onNavigateTab={(tab) => setActiveTab(tab as MotaPublicTab)} 
            onOpenAuth={() => onOpenAuth('LOGIN')} 
          />
        )}

        {activeTab === 'schemes' && (
          <MotaSchemesView 
            onApplyScheme={onApplyScheme}
            onOpenAuth={() => onOpenAuth('LOGIN')}
          />
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
                Direct Benefit Transfer (DBT) National Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Real-time performance analytics of Scheduled Tribe scholarships across all 36 States &amp; UTs.
              </p>
            </div>
            <MinistryAnalyticsDashboard />
          </div>
        )}

        {activeTab === 'contact_us' && <MotaContactUs />}

        {activeTab === 'fig_at_glance' && <MotaFiguresAtGlance />}
      </main>

      {/* 4. Official MoTA Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h4 className="text-white font-bold font-serif text-sm">Ministry of Tribal Affairs</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Shastri Bhawan / August Kranti Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001
            </p>
            <p className="text-[10px] text-slate-500">
              Direct Benefit Transfer (DBT) Portal &bull; National Informatics Centre (NIC)
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-white font-bold font-serif text-xs uppercase tracking-wider">Five DBT Schemes</h4>
            <ul className="text-[11px] space-y-1 text-slate-300">
              <li>&bull; Post-Matric Scholarship (BVOBC)</li>
              <li>&bull; Pre-Matric Scholarship (BPVGK)</li>
              <li>&bull; Top Class Education (A023B)</li>
              <li>&bull; National Fellowship NFST (ARG45)</li>
              <li>&bull; National Overseas NOS (AZKMI)</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h4 className="text-white font-bold font-serif text-xs uppercase tracking-wider">Official Portals</h4>
            <ul className="text-[11px] space-y-1 text-slate-300">
              <li>
                <a href="https://tribal.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-center gap-1">
                  <span>tribal.nic.in</span> <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://dbtbharat.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-center gap-1">
                  <span>dbtbharat.gov.in</span> <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://pfms.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-center gap-1">
                  <span>pfms.nic.in (DBT System)</span> <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold font-serif text-xs uppercase tracking-wider">Security &amp; Standards</h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-bit SSL &bull; PFMS Validated</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Designed &amp; Developed in accordance with GIGW (Guidelines for Indian Government Websites).
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
          &copy; 2026 Ministry of Tribal Affairs, Government of India. All rights reserved. Content Owned by Ministry of Tribal Affairs, Hosted by National Informatics Centre (NIC).
        </div>
      </footer>
    </div>
  );
};
