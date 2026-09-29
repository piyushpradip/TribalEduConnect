import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  MapPin, 
  FolderLock, 
  CreditCard, 
  FileText, 
  PlusCircle, 
  CheckCheck, 
  Send, 
  Users, 
  FileCheck2, 
  Award, 
  History, 
  ShieldCheck, 
  UserCog, 
  Building2,
  GraduationCap,
  Sparkles,
  BarChart3,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Role } from '../types';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onTabChange, 
  mobileOpen = false, 
  onMobileClose 
}) => {
  const { activeRole, currentUser } = useAuth();
  const { t } = useLanguage();

  const getNavItems = (): NavItem[] => {
    switch (activeRole) {
      case 'APPLICANT':
        return [
          { id: 'dashboard', label: t('dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'central_schemes', label: t('centralSchemes'), icon: <Layers className="w-4 h-4" />, badge: 'National' },
          { id: 'state_schemes', label: t('stateSchemes'), icon: <MapPin className="w-4 h-4" /> },
          { id: 'fellowship_portal', label: 'NFST & NOS Fellowships', icon: <GraduationCap className="w-4 h-4" />, badge: 'Ph.D./Master' },
          { id: 'my_documents', label: t('myDocuments'), icon: <FolderLock className="w-4 h-4" /> },
          { id: 'seeding_status', label: t('seedingStatus'), icon: <CreditCard className="w-4 h-4" /> },
          { id: 'my_applications', label: t('myApplications'), icon: <FileText className="w-4 h-4" />, badge: 'Pipeline' },
        ];

      case 'SSO':
      case 'CSO':
        return [
          { id: 'dashboard', label: 'Officer Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'manage_schemes', label: t('schemesManagement'), icon: <PlusCircle className="w-4 h-4" />, badge: 'Active' },
          { id: 'disbursement_queue', label: t('disbursementQueue'), icon: <Send className="w-4 h-4" />, badge: 'Action' },
          { id: 'fellowship_portal', label: 'NFST & NOS Fellowships', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'ministry_analytics', label: t('ministryAnalytics'), icon: <BarChart3 className="w-4 h-4" />, badge: 'MoTA' },
          { id: 'disbursed_history', label: 'Disbursement Records', icon: <History className="w-4 h-4" /> },
        ];

      case 'SV':
      case 'CV':
        return [
          { id: 'dashboard', label: 'Verifier Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'verification_queue', label: t('verificationQueue'), icon: <FileCheck2 className="w-4 h-4" />, badge: 'Side-by-Side' },
          { id: 'ai_scrutiny', label: t('aiScrutiny'), icon: <Sparkles className="w-4 h-4" />, badge: 'AI Vision' },
          { id: 'certified_history', label: 'Certified Archives', icon: <CheckCheck className="w-4 h-4" /> },
        ];

      case 'SCM':
        return [
          { id: 'dashboard', label: 'Committee Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'committee_queue', label: t('meritScreening'), icon: <Award className="w-4 h-4" />, badge: 'Certified' },
          { id: 'awarded_list', label: 'Awarded Scholarships', icon: <History className="w-4 h-4" /> },
          { id: 'ministry_analytics', label: t('ministryAnalytics'), icon: <BarChart3 className="w-4 h-4" /> },
        ];

      case 'SUPER_ADMIN':
        return [
          { id: 'dashboard', label: 'System Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'user_management', label: t('userManagement'), icon: <Users className="w-4 h-4" />, badge: '7 Roles' },
          { id: 'ministry_analytics', label: t('ministryAnalytics'), icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'audit_ledger', label: t('auditLedger'), icon: <ShieldCheck className="w-4 h-4" />, badge: 'Chained' },
          { id: 'impersonate_tools', label: 'Portal Switcher Hub', icon: <UserCog className="w-4 h-4" /> },
        ];

      default:
        return [
          { id: 'dashboard', label: t('dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
        ];
    }
  };

  const navItems = getNavItems();

  const handleItemClick = (id: string) => {
    onTabChange(id);
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="md:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
        />
      )}

      {/* Sidebar Content (Desktop: fixed width; Mobile: slide-over drawer) */}
      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-50 w-72 md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col min-h-[calc(100vh-4rem)] border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Drawer Header with Close Button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-bold text-white text-xs uppercase tracking-wider">MoTA Portal Navigation</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Persona Card */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
              {activeRole.slice(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                {t('activeModule')}
              </p>
              <h3 className="text-sm font-bold text-white truncate">
                {activeRole === 'APPLICANT' && 'Tribal Scholar Portal'}
                {activeRole === 'SSO' && 'State Officer (SSO)'}
                {activeRole === 'CSO' && 'Central Officer (CSO)'}
                {activeRole === 'SV' && 'State Verifier (SV)'}
                {activeRole === 'CV' && 'Central Verifier (CV)'}
                {activeRole === 'SCM' && 'Selection Committee'}
                {activeRole === 'SUPER_ADMIN' && 'Super Admin Console'}
              </h3>
            </div>
          </div>

          {currentUser?.assignedState && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
              <Building2 className="w-3 h-3 text-amber-400" />
              <span>State: <strong>{currentUser.assignedState}</strong></span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group min-h-[44px] ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Security Stamp */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 text-slate-400 mb-0.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
          <p className="leading-tight text-[10px]">
            Aadhaar Vault &bull; NPCI APB &bull; Article 342 Notified ST
          </p>
        </div>
      </aside>
    </>
  );
};
