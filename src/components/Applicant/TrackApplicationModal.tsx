import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Building2, 
  IndianRupee, 
  Send,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { usePortalData } from '../../context/PortalDataContext';
import { Application, STATUS_LABELS, STATUS_COLORS } from '../../types';
import { TribalPattern } from '../Common/TribalPattern';

interface TrackApplicationModalProps {
  onClose: () => void;
  onOpenDeficiency?: (app: Application) => void;
  onOpenSanction?: (app: Application) => void;
}

export const TrackApplicationModal: React.FC<TrackApplicationModalProps> = ({
  onClose,
  onOpenDeficiency,
  onOpenSanction,
}) => {
  const { applications } = usePortalData();
  const [searchQuery, setSearchQuery] = useState('APP-2026-ST-8821');
  const [searchedApp, setSearchedApp] = useState<Application | null>(
    applications.find((a) => a.applicationNumber === 'APP-2026-ST-8821') || applications[0] || null
  );
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = applications.find(
      (a) =>
        a.applicationNumber.toLowerCase().includes(query) ||
        a.applicantName.toLowerCase().includes(query) ||
        a.aadhaarMasked.toLowerCase().includes(query)
    );

    setSearchedApp(found || null);
    setHasSearched(true);
  };

  // 6 official stages in the scholarship lifecycle
  const getStageStatus = (app: Application, stageIndex: number) => {
    // 0: Submission
    // 1: Verifier Scrutiny
    // 2: Eligibility & Gazette
    // 3: Committee Screening
    // 4: Sanction Order
    // 5: PFMS DBT Disbursal
    if (app.status === 'REJECTED') {
      return stageIndex === 0 ? 'COMPLETED' : stageIndex === 1 ? 'REJECTED' : 'PENDING';
    }
    if (app.status === 'DEFICIENT') {
      return stageIndex === 0 ? 'COMPLETED' : stageIndex === 1 ? 'DEFICIENT' : 'PENDING';
    }
    if (app.status === 'DRAFT') {
      return stageIndex === 0 ? 'IN_PROGRESS' : 'PENDING';
    }
    if (app.status === 'SUBMITTED') {
      return stageIndex === 0 ? 'COMPLETED' : stageIndex === 1 ? 'IN_PROGRESS' : 'PENDING';
    }
    if (app.status === 'VERIFIER_CERTIFIED') {
      return stageIndex <= 1 ? 'COMPLETED' : stageIndex === 2 ? 'IN_PROGRESS' : 'PENDING';
    }
    if (app.status === 'COMMITTEE_APPROVED') {
      return stageIndex <= 3 ? 'COMPLETED' : stageIndex === 4 ? 'IN_PROGRESS' : 'PENDING';
    }
    if (app.status === 'SCHOLARSHIP_RELEASED') {
      return 'COMPLETED';
    }
    return 'PENDING';
  };

  const stages = [
    { title: 'Application Submitted', desc: 'Filed with DigiLocker and academic documents' },
    { title: 'Verifier Certification', desc: 'Field & certificate validation by State/Central Verifier' },
    { title: 'Gazette & Eligibility Audit', desc: 'Article 342 ST list validation & income threshold review' },
    { title: 'Selection Committee Screening', desc: 'Final merit review and sanction recommendation' },
    { title: 'Ministry Sanction Order', desc: 'Formal financial sanction generated under DBT rules' },
    { title: 'PFMS DBT Disbursal', desc: 'Direct credit to student Aadhaar-seeded bank account' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-300 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="track-modal-title"
      >
        {/* Top Header */}
        <div className="bg-[#1D0A69] text-white p-4 sm:p-5 relative flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                  Citizen Service
                </span>
                <span className="text-xs text-indigo-200">Public Application Tracking Portal</span>
              </div>
              <h2 id="track-modal-title" className="text-base sm:text-lg font-bold text-white">
                Real-Time Scholarship Lifecycle &amp; DBT Status Tracker
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Close Tracker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3">
            <TribalPattern variant="warli-inspired" height={8} opacity={0.3} color="#FFD166" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Application ID (e.g. APP-2026-ST-8821) or Applicant Name"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1D0A69] hover:bg-[#130649] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Status</span>
            </button>
          </form>

          {/* Sample quick buttons */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 overflow-x-auto">
            <span className="font-semibold text-slate-600 flex-shrink-0">Quick IDs:</span>
            {applications.slice(0, 3).map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  setSearchQuery(app.applicationNumber);
                  setSearchedApp(app);
                  setHasSearched(true);
                }}
                className="px-2 py-0.5 bg-white border border-slate-200 hover:border-indigo-400 rounded text-indigo-900 font-mono text-[10px] flex-shrink-0"
              >
                {app.applicationNumber} ({app.applicantName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {searchedApp ? (
            <div className="space-y-6">
              {/* Application Snapshot Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                      Application ID: {searchedApp.applicationNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {searchedApp.applicantName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {searchedApp.schemeName} ({searchedApp.schemeCode})
                    </p>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold border ${
                        STATUS_COLORS[searchedApp.status].bg
                      } ${STATUS_COLORS[searchedApp.status].text} ${
                        STATUS_COLORS[searchedApp.status].border
                      }`}
                    >
                      {STATUS_LABELS[searchedApp.status]}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Last Updated: {new Date(searchedApp.updatedAt || searchedApp.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Academic Course:</span>
                    <span className="font-semibold text-slate-800">{searchedApp.courseName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Institution:</span>
                    <span className="font-semibold text-slate-800 truncate block" title={searchedApp.instituteName}>
                      {searchedApp.instituteName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Grant Entitlement:</span>
                    <span className="font-bold text-emerald-700">₹{searchedApp.grantAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Aadhaar Seeding:</span>
                    <span className="font-semibold text-slate-800">{searchedApp.aadhaarMasked}</span>
                  </div>
                </div>

                {/* Deficiency Action Notice if Deficient */}
                {searchedApp.status === 'DEFICIENT' && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-amber-900">Clarification / Document Replacement Required:</strong>
                        <p className="text-amber-800 text-[11px] mt-0.5">
                          {searchedApp.verifierNotes || 'A clarification has been flagged by the scrutiny officer. Please review and re-upload within the 72-hour window.'}
                        </p>
                      </div>
                    </div>
                    {onOpenDeficiency && (
                      <button
                        onClick={() => {
                          onOpenDeficiency(searchedApp);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs whitespace-nowrap transition-colors"
                      >
                        Respond to Deficiency
                      </button>
                    )}
                  </div>
                )}

                {/* Sanction Release Order Details if Sanctioned */}
                {searchedApp.status === 'SCHOLARSHIP_RELEASED' && searchedApp.pfmsTransactionId && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-emerald-950">PFMS Sanction Disbursed:</strong>
                        <p className="text-emerald-900 text-[11px] mt-0.5 font-mono">
                          PFMS UTR: {searchedApp.pfmsTransactionId} &bull; Batch: {searchedApp.disbursementBatchId || 'BATCH-2026-08'}
                        </p>
                      </div>
                    </div>
                    {onOpenSanction && (
                      <button
                        onClick={() => {
                          onOpenSanction(searchedApp);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs whitespace-nowrap transition-colors"
                      >
                        View Sanction Order
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 6-Stage Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-1">
                  Chronological Verification &amp; Disbursal Progress
                </h4>

                <div className="space-y-4">
                  {stages.map((stage, idx) => {
                    const status = getStageStatus(searchedApp, idx);

                    return (
                      <div key={idx} className="flex items-start gap-3 relative">
                        {/* Connecting Line */}
                        {idx < stages.length - 1 && (
                          <div 
                            className={`absolute left-[13px] top-[26px] bottom-[-16px] w-[2px] ${
                              status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          />
                        )}

                        {/* Status Icon */}
                        <div className="flex-shrink-0 z-10">
                          {status === 'COMPLETED' ? (
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border-2 border-emerald-600">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          ) : status === 'IN_PROGRESS' ? (
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center border-2 border-indigo-600 animate-pulse">
                              <Clock className="w-4 h-4" />
                            </div>
                          ) : status === 'DEFICIENT' ? (
                            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center border-2 border-amber-600">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                          ) : status === 'REJECTED' ? (
                            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center border-2 border-rose-600">
                              <X className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-2 border-slate-300 text-xs font-bold">
                              {idx + 1}
                            </div>
                          )}
                        </div>

                        {/* Stage Text */}
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className={`text-xs font-bold ${
                              status === 'COMPLETED' ? 'text-emerald-900' :
                              status === 'IN_PROGRESS' ? 'text-indigo-900' :
                              status === 'DEFICIENT' ? 'text-amber-900' :
                              'text-slate-600'
                            }`}>
                              {stage.title}
                            </h5>
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              {status === 'COMPLETED' ? 'Completed' :
                               status === 'IN_PROGRESS' ? 'In Progress' :
                               status === 'DEFICIENT' ? 'Clarification Required' :
                               status === 'REJECTED' ? 'Rejected' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Application Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                We could not find an application matching "{searchQuery}". Please check your application reference number.
              </p>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Aadhaar DBT Bridge &bull; PFMS Integrated Status Check
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded ml-auto transition-colors"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
