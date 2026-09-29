import React, { useState } from 'react';
import { 
  Bell, 
  ArrowLeftRight, 
  LogOut, 
  ChevronDown, 
  FileCode2, 
  Building2, 
  GraduationCap, 
  Smartphone, 
  Mail, 
  Globe2,
  Menu,
  Sparkles,
  CloudCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortalData } from '../context/PortalDataContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Role, ROLE_LABELS } from '../types';

interface NavbarProps {
  onOpenSpecsModal: () => void;
  onOpenAuthModal: () => void;
  onOpenSyncModal: () => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenSpecsModal, 
  onOpenAuthModal, 
  onOpenSyncModal,
  onToggleMobileMenu 
}) => {
  const { 
    currentUser, 
    activeRole, 
    isImpersonating, 
    impersonateRole, 
    exitImpersonation, 
    logout,
    quickLoginAsRole 
  } = useAuth();

  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = usePortalData();
  const { language, setLanguage, t } = useLanguage();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const userNotifications = notifications.filter(
    (n) => n.recipientId === currentUser?.id || n.recipientRole === activeRole
  );
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const rolesList: Role[] = ['APPLICANT', 'SSO', 'CSO', 'SV', 'CV', 'SCM', 'SUPER_ADMIN'];

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'National' },
    { code: 'hi', label: 'हिन्दी', sub: 'राजभाषा' },
    { code: 'sat', label: 'ᱥᱟᱱᱛᱟᱲᱤ', sub: 'Santhali' },
    { code: 'or', label: 'ଓଡ଼ିଆ', sub: 'Odia' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Super Admin Impersonation Notice Bar */}
      {isImpersonating && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>
              <strong>MINISTRY IMPERSONATION ACTIVE:</strong> You are browsing as{' '}
              <span className="font-bold underline uppercase">{ROLE_LABELS[activeRole]}</span> ({currentUser?.fullName}).
            </span>
          </div>
          <button
            onClick={exitImpersonation}
            className="ml-4 px-2.5 py-0.5 bg-white text-amber-900 font-bold rounded-lg hover:bg-amber-50 transition-colors text-xs whitespace-nowrap"
          >
            Exit Impersonation
          </button>
        </div>
      )}

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Left: Hamburger (Mobile) + Portal Branding */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-heading">
                    Tribal<span className="text-blue-600">Setu</span>
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                    MoTA National
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block truncate max-w-[280px] lg:max-w-none">
                  {t('portalSubtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Multilingual Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors min-h-[38px]"
                title="Select Portal Language"
              >
                <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="uppercase text-[11px] font-bold">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language / ᱯᱟᱹᱨᱥᱤ
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        language === l.code ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{l.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cross-Device Synchronizer Hub Button */}
            <button
              onClick={onOpenSyncModal}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors min-h-[38px]"
              title="Multi-Device Cloud Sync & Data Transfer Hub"
            >
              <CloudCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="hidden sm:inline font-bold text-slate-700">Sync</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* PWA Mobile App Install Prompt Button */}
            <PWAInstallButton />

            {/* Tech Specs & Architecture Button */}
            <button
              onClick={onOpenSpecsModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
              title="View Database Schema, Architecture, State Machine & REST APIs"
            >
              <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
              <span>MoTA Architecture Specs</span>
            </button>

            {/* Role Switcher / Impersonation Dropdown */}
            {(currentUser?.role === 'SUPER_ADMIN' || isImpersonating) ? (
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-blue-700 transition-all border border-indigo-500 min-h-[38px]"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Switch Role:</span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
                    {activeRole}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">Ministry Role Impersonation</p>
                      <p className="text-[11px] text-slate-500">
                        Seamlessly switch between any verified portal view:
                      </p>
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1">
                      {rolesList.map((role) => {
                        const isCurrent = activeRole === role;
                        return (
                          <button
                            key={role}
                            onClick={() => {
                              impersonateRole(role);
                              setShowRoleDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                              isCurrent ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-blue-600' : 'bg-slate-300'}`} />
                              {ROLE_LABELS[role]}
                            </span>
                            {isCurrent && <span className="text-[10px] text-blue-600 font-semibold">Active</span>}
                          </button>
                        );
                      })}
                    </div>
                    {isImpersonating && (
                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            exitImpersonation();
                            setShowRoleDropdown(false);
                          }}
                          className="w-full py-1.5 text-center text-xs font-bold bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                          Return to Super Admin Console
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors min-h-[38px]"
                  title="Switch Authorized Persona"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden md:inline">Persona:</span>
                  <span className="font-semibold text-slate-800 text-[11px] sm:text-xs">{activeRole}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                      Switch Authorized Role Access
                    </div>
                    {rolesList.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          quickLoginAsRole(r);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          activeRole === r ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{ROLE_LABELS[r]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                title="Notifications & SMS/Email Alerts"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Notifications &amp; Alerts</h4>
                      <p className="text-[11px] text-slate-500">Real-time SMS, Email &amp; In-App alerts</p>
                    </div>
                    {unreadCount > 0 && currentUser && (
                      <button
                        onClick={() => markAllNotificationsAsRead(currentUser.id)}
                        className="text-[11px] font-semibold text-blue-600 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {userNotifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                            !notif.isRead ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              {notif.type === 'DISBURSEMENT' ? (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              ) : notif.type === 'WARNING' ? (
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                              )}
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2">
                            {notif.channel.includes('SMS') && (
                              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                <Smartphone className="w-2.5 h-2.5 text-emerald-600" /> SMS Sent
                              </span>
                            )}
                            {notif.channel.includes('EMAIL') && (
                              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                <Mail className="w-2.5 h-2.5 text-blue-600" /> Email Dispatched
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar & Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors min-h-[38px]"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.fullName}</p>
                    <p className="text-[10px] text-slate-500 leading-none mt-1 font-medium">
                      {ROLE_LABELS[activeRole]}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                      <div className="mt-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {ROLE_LABELS[activeRole]}
                        </span>
                      </div>
                      {currentUser.assignedState && (
                        <p className="text-[11px] text-slate-500 mt-1">State: {currentUser.assignedState}</p>
                      )}
                      {currentUser.aadhaarMasked && (
                        <p className="text-[11px] text-slate-500">Aadhaar: {currentUser.aadhaarMasked}</p>
                      )}
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm min-h-[38px]"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
