import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Building2, 
  ExternalLink, 
  GraduationCap, 
  Info,
  AlertTriangle,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';

export const SeedingStatusTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { seedingStatuses, refreshSeedingStatus, linkAbcId } = usePortalData();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAbcModal, setShowAbcModal] = useState(false);
  const [abcInput, setAbcInput] = useState('');
  const [institutionInput, setInstitutionInput] = useState('');

  const status = currentUser ? seedingStatuses[currentUser.id] : null;

  const handleRefresh = () => {
    if (!currentUser) return;
    setIsRefreshing(true);
    setTimeout(() => {
      refreshSeedingStatus(currentUser.id);
      setIsRefreshing(false);
    }, 800);
  };

  const handleLinkAbc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !abcInput.trim()) return;
    linkAbcId(currentUser.id, abcInput.trim(), institutionInput.trim() || 'Birla Institute of Technology, Mesra');
    setShowAbcModal(false);
    setAbcInput('');
    setInstitutionInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CreditCard className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              Seeding Status: DBT & Academic Bank of Credits (ABC)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status check of your Aadhaar-seeded bank account on the NPCI Mapper and your APAAR / ABC ID linkage.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Checking NPCI Mapper...' : 'Re-verify NPCI Status'}</span>
        </button>
      </div>

      {/* 2-Column Grid: Bank DBT vs ABC ID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Aadhaar-Bank Account Linkage Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">NPCI Aadhaar-Bank Seeding</h3>
                  <span className="text-[11px] text-slate-500">Direct Benefit Transfer (DBT) Mapper</span>
                </div>
              </div>

              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{status?.npciMapperStatus || 'ACTIVE'}</span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Aadhaar Vault Number:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {status?.aadhaarNumberMasked || currentUser?.aadhaarMasked || 'XXXX-XXXX-9812'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Seeded Bank Name:</span>
                  <strong className="text-slate-900">{status?.bankName || 'State Bank of India (SBI)'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Number:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {status?.accountNumberMasked || 'XXXX-XXXX-7140'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IFSC Code:</span>
                  <span className="font-mono text-slate-800">{status?.ifscCode || 'SBIN0000167'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DBT Payment Mandate:</span>
                  <span className="font-bold text-emerald-700">Enabled (PFMS-Ready)</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed">
                <strong>Disbursement Readiness:</strong> Your bank account is successfully linked to the NPCI Aadhaar Payment Bridge. When the State or Central Scholarship Officer releases your grant, funds will credit directly into this account.
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Last checked via NPCI Gateway:</span>
            <strong>{status?.lastCheckedAt ? new Date(status.lastCheckedAt).toLocaleString() : 'Recently'}</strong>
          </div>
        </div>

        {/* Module 2: ABC ID / APAAR ID Integration */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Academic Bank of Credits (ABC)</h3>
                  <span className="text-[11px] text-slate-500">National APAAR ID Registry</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  status?.isAbcLinked
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status?.isAbcLinked ? 'Linked & Active' : 'Not Linked'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">12-Digit ABC / APAAR ID:</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">
                    {status?.abcId || 'Not Linked Yet'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Linked University / College:</span>
                  <strong className="text-slate-900 truncate max-w-[200px]">
                    {status?.institutionLinked || 'Pending Institution Link'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verified Academic Credits:</span>
                  <strong className="text-emerald-700">{status?.abcCreditsCount || 0} Credits</strong>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                <strong>UGC & MoE Requirement:</strong> Under National Education Policy (NEP) guidelines, scholarship verification teams reference ABC ID records to confirm enrollment and ongoing attendance before disbursement.
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">ABC Credit Registry Sync</span>
            <button
              onClick={() => setShowAbcModal(true)}
              className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            >
              {status?.isAbcLinked ? 'Update ABC ID' : 'Link ABC ID'}
            </button>
          </div>
        </div>
      </div>

      {/* Link / Update ABC ID Modal */}
      {showAbcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Link Academic Bank of Credits (ABC)</h3>
              <button
                onClick={() => setShowAbcModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLinkAbc} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  12-Digit ABC / APAAR ID *
                </label>
                <input
                  type="text"
                  value={abcInput}
                  onChange={(e) => setAbcInput(e.target.value)}
                  placeholder="e.g. ABC-8841-9023-1144"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Obtained from Digilocker or www.abc.gov.in
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  College / University Name
                </label>
                <input
                  type="text"
                  value={institutionInput}
                  onChange={(e) => setInstitutionInput(e.target.value)}
                  placeholder="e.g. Birla Institute of Technology (BIT), Mesra"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAbcModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Verify & Link ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
