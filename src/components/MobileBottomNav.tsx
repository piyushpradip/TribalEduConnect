import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  MapPin, 
  GraduationCap, 
  FileText, 
  FolderLock, 
  CreditCard, 
  Menu,
  Sparkles,
  Send,
  FileCheck2,
  Award,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenMobileMenu,
}) => {
  const { activeRole } = useAuth();
  const { t } = useLanguage();

  // Primary 4 shortcuts based on active role + Menu button
  const getMobileTabs = () => {
    switch (activeRole) {
      case 'APPLICANT':
        return [
          { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'central_schemes', label: 'Central', icon: <Layers className="w-5 h-5" /> },
          { id: 'fellowship_portal', label: 'Fellowships', icon: <GraduationCap className="w-5 h-5" /> },
          { id: 'my_applications', label: 'Track', icon: <FileText className="w-5 h-5" /> },
        ];
      case 'SSO':
      case 'CSO':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'manage_schemes', label: 'Schemes', icon: <Layers className="w-5 h-5" /> },
          { id: 'disbursement_queue', label: 'DBT Release', icon: <Send className="w-5 h-5" /> },
          { id: 'ministry_analytics', label: 'Analytics', icon: <Sparkles className="w-5 h-5" /> },
        ];
      case 'SV':
      case 'CV':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'verification_queue', label: 'Verify', icon: <FileCheck2 className="w-5 h-5" /> },
          { id: 'ai_scrutiny', label: 'AI Scrutiny', icon: <Sparkles className="w-5 h-5" /> },
          { id: 'certified_history', label: 'Certified', icon: <FileText className="w-5 h-5" /> },
        ];
      case 'SCM':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'committee_queue', label: 'Merit Queue', icon: <Award className="w-5 h-5" /> },
          { id: 'awarded_list', label: 'Awarded', icon: <FileText className="w-5 h-5" /> },
          { id: 'ministry_analytics', label: 'Reports', icon: <Sparkles className="w-5 h-5" /> },
        ];
      case 'SUPER_ADMIN':
        return [
          { id: 'dashboard', label: 'Console', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'user_management', label: 'Users', icon: <Users className="w-5 h-5" /> },
          { id: 'audit_ledger', label: 'Audit Log', icon: <FileText className="w-5 h-5" /> },
          { id: 'impersonate_tools', label: 'Switch', icon: <Sparkles className="w-5 h-5" /> },
        ];
      default:
        return [
          { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
        ];
    }
  };

  const tabs = getMobileTabs();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 px-2 py-1 shadow-2xl flex items-center justify-around pb-[calc(env(safe-area-inset-bottom,0px)+4px)]">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[56px] min-h-[48px] ${
              isActive
                ? 'text-blue-400 font-bold bg-slate-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className={isActive ? 'text-blue-400 transform scale-110 transition-transform' : ''}>
              {tab.icon}
            </span>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">{tab.label}</span>
          </button>
        );
      })}

      {/* Menu / Drawer Toggle */}
      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-400 hover:text-slate-200 min-w-[56px] min-h-[48px]"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] tracking-tight mt-0.5 leading-none">Menu</span>
      </button>
    </nav>
  );
};
