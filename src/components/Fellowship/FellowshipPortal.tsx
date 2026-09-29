import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Send, 
  Building2, 
  Globe2, 
  ShieldCheck, 
  UserCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
import { ResearchFellowship } from '../../types';

export const FellowshipPortal: React.FC = () => {
  const { currentUser, activeRole } = useAuth();
  const { fellowships, endorseFellowshipMilestone, claimFellowshipStipend } = usePortalData();

  const [selectedFellowship, setSelectedFellowship] = useState<ResearchFellowship | null>(null);
  const [endorseNotes, setEndorseNotes] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const isApplicant = activeRole === 'APPLICANT';
  const isOfficerOrAdmin = ['CSO', 'SSO', 'SUPER_ADMIN'].includes(activeRole);

  const displayFellowships = isApplicant
    ? fellowships.filter((f) => f.scholarName === currentUser?.fullName)
    : fellowships;

  const handleEndorse = (fellowId: string) => {
    endorseFellowshipMilestone(fellowId, endorseNotes || 'Satisfactory academic progress in doctoral research milestone.');
    setSuccessToast(`Research milestone endorsed! Stipend released to DBT account.`);
    setSelectedFellowship(null);
    setEndorseNotes('');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleClaim = (fellowId: string) => {
    claimFellowshipStipend(fellowId);
    setSuccessToast(`Monthly research fellowship stipend claim submitted to PFMS portal.`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              Post-Selection Fellowship Lifecycle Management
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end administration for <strong>National Fellowship for ST (NFST)</strong> and <strong>National Overseas Scholarship (NOS)</strong> scholars: research milestones, supervisor endorsements, and monthly stipend DBT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-purple-600" />
            <span>NFST &bull; NOS Flagship Fellowships</span>
          </span>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active NFST &amp; NOS Fellows</p>
          <h3 className="text-2xl font-extrabold text-purple-700 mt-1">{fellowships.length}</h3>
          <span className="text-[11px] text-slate-500">M.Phil, Ph.D. &amp; Overseas Scholars</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Research Stipend</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹31,000 - ₹35,000</h3>
          <span className="text-[11px] text-emerald-600 font-medium">+ HRA &amp; ₹20,000/yr Contingency</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disbursement Mechanism</p>
          <h3 className="text-sm font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Direct Benefit Transfer (DBT)</span>
          </h3>
          <span className="text-[11px] text-slate-500">PFMS Aadhaar Payment Bridge</span>
        </div>
      </div>

      {/* Fellowships List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {isApplicant ? 'My Research Fellowship Profile & Milestones' : 'National Fellowship Scholars Directory (MoTA Central Roster)'}
          </h3>
          <span className="text-xs text-slate-500 font-medium">{displayFellowships.length} Fellow(s)</span>
        </div>

        <div className="divide-y divide-slate-100">
          {displayFellowships.map((fellow) => (
            <div key={fellow.id} className="p-6 hover:bg-slate-50/60 transition-colors space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-purple-50 text-purple-700 border border-purple-200">
                      {fellow.fellowId}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{fellow.caste}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{fellow.scholarName}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{fellow.university}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      fellow.progressStatus === 'SATISFACTORY'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    Milestone: {fellow.progressStatus}
                  </span>
                  <span className="text-xs font-extrabold text-purple-800">
                    Stipend: ₹{(fellow.monthlyStipend + fellow.hraAmount).toLocaleString()}/month
                  </span>
                </div>
              </div>

              {/* Research Topic */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Approved Research Synopsis:</span>
                <p className="text-slate-800 font-medium">{fellow.researchTopic}</p>
                <div className="mt-2 text-[11px] text-slate-500 flex flex-wrap gap-4">
                  <span>Supervisor: <strong>{fellow.supervisorName}</strong></span>
                  <span>Tenure Completed: <strong>{fellow.tenureMonthsCompleted} / {fellow.tenureTotalMonths} Months</strong></span>
                </div>
              </div>

              {/* Milestone Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Current Milestone: <strong>{fellow.currentMilestone}</strong></span>
                  <span>{Math.round((fellow.tenureMonthsCompleted / fellow.tenureTotalMonths) * 100)}% Tenure</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all"
                    style={{ width: `${(fellow.tenureMonthsCompleted / fellow.tenureTotalMonths) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Endorsed: {fellow.lastEndorsedAt ? new Date(fellow.lastEndorsedAt).toLocaleDateString() : 'Pending Endorsement'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isApplicant && !fellow.supervisorEndorsed && (
                    <button
                      onClick={() => handleClaim(fellow.fellowId)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Milestone Report</span>
                    </button>
                  )}

                  {isOfficerOrAdmin && (
                    <button
                      onClick={() => setSelectedFellowship(fellow)}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Endorse &amp; Release Stipend</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supervisor Endorsement Modal */}
      {selectedFellowship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Supervisor Research Progress Endorsement
                </h3>
              </div>
              <button onClick={() => setSelectedFellowship(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div><strong>Fellow:</strong> {selectedFellowship.scholarName} ({selectedFellowship.fellowId})</div>
              <div><strong>University:</strong> {selectedFellowship.university}</div>
              <div><strong>Milestone:</strong> {selectedFellowship.currentMilestone}</div>
              <div><strong>Monthly Stipend:</strong> ₹{(selectedFellowship.monthlyStipend + selectedFellowship.hraAmount).toLocaleString()}</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Official Guide / Supervisor Endorsement Remarks *
              </label>
              <textarea
                value={endorseNotes}
                onChange={(e) => setEndorseNotes(e.target.value)}
                rows={3}
                placeholder="Confirm that the scholar's research milestone progress is satisfactory and recommend monthly fellowship release..."
                className="w-full text-xs p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedFellowship(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEndorse(selectedFellowship.fellowId)}
                className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Endorsement &amp; Release</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
