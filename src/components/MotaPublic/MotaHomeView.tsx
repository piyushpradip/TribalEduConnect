import React from 'react';
import { 
  GraduationCap, 
  Layers, 
  FileCheck2, 
  Coins, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Globe2, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { MOTA_OFFICIAL_SCHEMES } from '../../mock/motaOfficialData';
import { useAuth } from '../../context/AuthContext';

interface MotaHomeViewProps {
  onNavigateTab: (tabId: string) => void;
  onOpenAuth: () => void;
}

export const MotaHomeView: React.FC<MotaHomeViewProps> = ({ 
  onNavigateTab, 
  onOpenAuth 
}) => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      {/* Live Official Announcement Marquee */}
      <div className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl flex items-center gap-3 text-xs font-bold shadow-xs">
        <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider flex-shrink-0">
          MoTA Bulletin
        </span>
        <div className="overflow-hidden whitespace-nowrap">
          <p className="inline-block animate-marquee">
            Applications invited for National Fellowship for ST Students (NFST) 2026-27 &bull; National Overseas Scholarship (NOS) portal open till 31st Oct 2026 &bull; Ensure your Bank Account is Aadhaar Seeded with NPCI Mapper for seamless Direct Benefit Transfer (DBT) credit &bull; Pre-Matric &amp; Post-Matric scholarship state verification in progress.
          </p>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#0c4a6e] via-[#075985] to-[#1e3a8a] text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden border border-blue-400/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ministry of Tribal Affairs Unified Digital Gateway</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight leading-tight">
            Direct Benefit Transfer (DBT) Portal for Scheduled Tribe Scholars
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-sans">
            End-to-end administration of Pre-Matric, Post-Matric, Top Class, National Fellowship (NFST), and National Overseas Scholarship (NOS) schemes. Facilitating paperless application, automated scrutiny, verifier certification, and direct PFMS disbursement to bank accounts.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!currentUser ? (
              <>
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold rounded-xl text-xs transition-all shadow-md"
                >
                  <span>Student Registration &bull; Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all"
                >
                  <span>Official / Scholar Login</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigateTab('schemes')}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md"
              >
                <span>Browse &amp; Apply for Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onNavigateTab('fig_at_glance')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-900/60 hover:bg-blue-900 text-blue-200 hover:text-white font-semibold rounded-xl text-xs border border-blue-400/30 transition-all"
            >
              <span>View Fig. at a Glance</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars of MoTA DBT Transformation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">100% DBT via PFMS</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Scholarship and fellowship funds are directly credited into students' bank accounts via Aadhaar Payment Bridge (APB) with zero intermediaries.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Aadhaar &amp; DigiLocker</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tamper-proof verification of caste, income, domicile, and educational transcripts directly authenticated with national state repositories.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">AI Scrutiny &amp; OCR</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automated document intelligence detects incomplete applications, flags eligibility discrepancies, and issues 72-hour deficiency redressal notices.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">End-to-End Workflow</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Transparent tracking from student registration, verifier certification, committee selection, to monthly fellowship milestone disbursement.
          </p>
        </div>
      </div>

      {/* 5 Flagship Schemes Quick Links */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Scheme Catalog</span>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              Five Notified Schemes on the MoTA DBT Portal
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('schemes')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Scheme Guidelines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOTA_OFFICIAL_SCHEMES.map((scheme) => (
            <div
              key={scheme.code}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {scheme.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {scheme.level}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-2 font-serif">
                  {scheme.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {scheme.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Grant Amount</span>
                  <strong className="text-emerald-700 text-xs font-mono">
                    ₹{scheme.grantAmount > 100000 ? `${(scheme.grantAmount / 100000).toFixed(1)} Lakh` : scheme.grantAmount.toLocaleString()}
                  </strong>
                </div>

                <button
                  onClick={() => onNavigateTab('schemes')}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-lg border border-slate-300 text-[11px] transition-colors"
                >
                  Details &rarr;
                </button>
              </div>
            </div>
          ))}

          {/* Sixth Card: Figures at a Glance Shortcut */}
          <div className="p-4 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-blue-950 mt-2 font-serif">
                Figures at a Glance
              </h4>
              <p className="text-[11px] text-blue-800/80 mt-1">
                Explore real physical and financial performance data, total ST student beneficiaries, and state-wise disbursement statistics.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('fig_at_glance')}
              className="w-full py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Open Fig. at a Glance &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
