import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Coins, 
  FolderLock, 
  CreditCard, 
  ArrowRight, 
  Bell, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  GraduationCap,
  Globe2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { STATUS_LABELS, STATUS_COLORS } from '../../types';

interface ApplicantDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const { applications, documents, seedingStatuses, notifications, fellowships } = usePortalData();
  const { t } = useLanguage();

  const myApps = applications.filter((a) => a.applicantId === currentUser?.id);
  const myDocs = documents.filter((d) => d.applicantId === currentUser?.id);
  const mySeeding = seedingStatuses[currentUser?.id || ''];
  const myNotifs = notifications.filter((n) => n.recipientId === currentUser?.id);
  const myFellowships = fellowships.filter((f) => f.scholarName === currentUser?.fullName);

  const totalSanctioned = myApps
    .filter((a) => a.status === 'COMMITTEE_APPROVED' || a.status === 'SCHOLARSHIP_RELEASED')
    .reduce((sum, a) => sum + a.grantAmount, 0);

  const latestApp = myApps[0];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-5 sm:p-7 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ministry of Tribal Affairs &bull; Academic Year 2026-27</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-heading">
              {t('welcomeScholar')}, {currentUser?.fullName || 'Scholar'}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              Access National Fellowships (NFST), Overseas Scholarships (NOS), and Post-Matric schemes. Track verifier certifications, committee awards, and PFMS DBT releases in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('central_schemes')}
              className="px-3.5 py-2 bg-white text-blue-900 text-xs font-bold rounded-xl shadow-sm hover:bg-blue-50 transition-colors flex items-center gap-1.5 min-h-[44px]"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Central Schemes</span>
            </button>
            <button
              onClick={() => onNavigateTab('fellowship_portal')}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 min-h-[44px] shadow-sm"
            >
              <GraduationCap className="w-4 h-4 text-purple-200" />
              <span>NFST / NOS Fellowships</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Applied Schemes */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{myApps.length}</h3>
            <span className="text-[10px] sm:text-[11px] text-blue-600 font-medium">In Pipeline</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Verified Documents */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Repository</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{myDocs.length}</h3>
            <span className="text-[10px] sm:text-[11px] text-emerald-600 font-medium">
              {myDocs.filter((d) => d.isDigiLockerVerified).length} DigiLocker Verified
            </span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <FolderLock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Total Sanctioned Amount */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Sanctioned Grants</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">
              ₹{totalSanctioned.toLocaleString()}
            </h3>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Approved / Disbursed</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* DBT Seeding Status */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">NPCI DBT Status</p>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              {mySeeding?.npciMapperStatus === 'ACTIVE' ? 'Active & Seeded' : 'Check Seeding'}
            </h3>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate block max-w-[120px]">
              {mySeeding?.bankName ? mySeeding.bankName : 'SBI Bank Linked'}
            </span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Latest Application Pipeline + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Latest Application Progress Tracker */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Active Application Live Pipeline</h3>
              <p className="text-xs text-slate-500">Real-time scrutiny status through Verifier Certification and Apex Committee Selection</p>
            </div>
            <button
              onClick={() => onNavigateTab('my_applications')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 min-h-[44px]"
            >
              <span>View All ({myApps.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {latestApp ? (
            <div className="space-y-4 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase font-mono">
                    {latestApp.applicationNumber}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{latestApp.schemeName}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Grant: <strong>₹{latestApp.grantAmount.toLocaleString()}</strong> &bull; Submitted:{' '}
                    {new Date(latestApp.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    STATUS_COLORS[latestApp.status].bg
                  } ${STATUS_COLORS[latestApp.status].text} ${STATUS_COLORS[latestApp.status].border}`}
                >
                  {STATUS_LABELS[latestApp.status]}
                </span>
              </div>

              {/* Responsive Progress Pipeline */}
              <div className="py-2 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[320px] relative px-2">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0" />

                  {/* 1. Submitted */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 mt-1.5">1. Submitted</span>
                    <span className="text-[9px] text-slate-400">Citizen Form</span>
                  </div>

                  {/* 2. Verifier */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                        ['VERIFIER_CERTIFIED', 'COMMITTEE_APPROVED', 'SCHOLARSHIP_RELEASED'].includes(
                          latestApp.status
                        )
                          ? 'bg-indigo-600 text-white'
                          : latestApp.status === 'DEFICIENT'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {['VERIFIER_CERTIFIED', 'COMMITTEE_APPROVED', 'SCHOLARSHIP_RELEASED'].includes(
                        latestApp.status
                      )
                        ? '✓'
                        : '2'}
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 mt-1.5">2. Verifier</span>
                    <span className="text-[9px] text-slate-400">Certify Docs</span>
                  </div>

                  {/* 3. Committee */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                        ['COMMITTEE_APPROVED', 'SCHOLARSHIP_RELEASED'].includes(latestApp.status)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {['COMMITTEE_APPROVED', 'SCHOLARSHIP_RELEASED'].includes(latestApp.status) ? '✓' : '3'}
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 mt-1.5">3. Committee</span>
                    <span className="text-[9px] text-slate-400">Merit Award</span>
                  </div>

                  {/* 4. Disbursed */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                        latestApp.status === 'SCHOLARSHIP_RELEASED'
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {latestApp.status === 'SCHOLARSHIP_RELEASED' ? '✓' : '4'}
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 mt-1.5">4. Disbursed</span>
                    <span className="text-[9px] text-slate-400">PFMS DBT</span>
                  </div>
                </div>
              </div>

              {latestApp.verifierNotes && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                  <strong>Verifier Remark:</strong> {latestApp.verifierNotes}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No active applications in queue.
              <div className="mt-3">
                <button
                  onClick={() => onNavigateTab('central_schemes')}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 min-h-[44px]"
                >
                  Browse Available MoTA Schemes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Real-Time Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Real-Time Alerts</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {myNotifs.length} total
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2 space-y-2">
              {myNotifs.slice(0, 3).map((notif) => (
                <div key={notif.id} className="pt-2.5 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-800 truncate">{notif.title}</span>
                    <span className="text-[9px] text-slate-400 whitespace-nowrap ml-2">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigateTab('seeding_status')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>Verify Bank DBT &amp; ABC Linkage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
