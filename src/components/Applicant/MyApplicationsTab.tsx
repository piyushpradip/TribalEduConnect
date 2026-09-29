import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Download, 
  ExternalLink, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Eye, 
  Award,
  X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
import { Application, STATUS_LABELS, STATUS_COLORS, ApplicationStatus } from '../../types';
import { SanctionOrderModal } from './SanctionOrderModal';
import { DeficiencyResponseModal } from './DeficiencyResponseModal';

export const MyApplicationsTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications } = usePortalData();

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showSlipModal, setShowSlipModal] = useState<Application | null>(null);
  const [showSanctionModal, setShowSanctionModal] = useState<Application | null>(null);
  const [deficiencyModalApp, setDeficiencyModalApp] = useState<Application | null>(null);
  const [successToast, setSuccessToast] = useState<string>('');

  const myApps = applications.filter((a) => a.applicantId === currentUser?.id);

  // Helper to determine step status
  const getStepStatus = (
    currentStatus: ApplicationStatus,
    targetStep: 'SUBMITTED' | 'VERIFIER_CERTIFIED' | 'COMMITTEE_APPROVED' | 'SCHOLARSHIP_RELEASED'
  ): 'COMPLETED' | 'CURRENT' | 'PENDING' | 'FLAGGED' => {
    if (currentStatus === 'DEFICIENT' && targetStep === 'VERIFIER_CERTIFIED') return 'FLAGGED';
    if (currentStatus === 'REJECTED') return 'PENDING';

    const sequence: ApplicationStatus[] = [
      'SUBMITTED',
      'VERIFIER_CERTIFIED',
      'COMMITTEE_APPROVED',
      'SCHOLARSHIP_RELEASED',
    ];

    const currentIndex = sequence.indexOf(currentStatus);
    const targetIndex = sequence.indexOf(targetStep);

    if (currentIndex >= targetIndex) return 'COMPLETED';
    if (currentIndex === targetIndex - 1) return 'CURRENT';
    return 'PENDING';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              My Submitted Scholarship Applications
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pipeline tracking every stage of your scholarship: Verifier Certification &rarr; Selection Committee Award &rarr; Officer DBT Release.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Applications</span>
          <strong className="text-xl font-extrabold text-blue-700">{myApps.length} Form(s)</strong>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Applications List */}
      {myApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No Applications Submitted Yet</h3>
          <p className="mt-1">Browse Central or State schemes to submit your first scholarship application.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myApps.map((app) => {
            const isDisbursed = app.status === 'SCHOLARSHIP_RELEASED';
            const isApproved = app.status === 'COMMITTEE_APPROVED';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-slate-300 transition-all space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {app.applicationNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {app.schemeLevel} SCHEME
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">{app.schemeName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {app.instituteName} &bull; {app.courseName} ({app.currentYear})
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                        STATUS_COLORS[app.status].bg
                      } ${STATUS_COLORS[app.status].text} ${STATUS_COLORS[app.status].border}`}
                    >
                      {STATUS_LABELS[app.status]}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700">
                      Grant: ₹{app.grantAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* VISUAL 4-STAGE PIPELINE TRACKER */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Live Progress Pipeline (State / Central Workflow)
                  </h4>

                  <div className="relative">
                    {/* Connecting Bar */}
                    <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-1 bg-slate-200 -z-0" />

                    <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
                      {/* Stage 1: Submitted */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                          ✓
                        </div>
                        <span className="text-xs font-bold text-slate-900 mt-2">1. Submitted</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Stage 2: Verifier Certified */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                            ['VERIFIER_CERTIFIED', 'COMMITTEE_APPROVED', 'SCHOLARSHIP_RELEASED'].includes(
                              app.status
                            )
                              ? 'bg-indigo-600 text-white'
                              : app.status === 'DEFICIENT'
                              ? 'bg-amber-500 text-white animate-bounce'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {['VERIFIER_CERTIFIED', 'COMMITTEE_APPROVED', 'SCHOLARSHIP_RELEASED'].includes(
                            app.status
                          ) ? (
                            '✓'
                          ) : app.status === 'DEFICIENT' ? (
                            '!'
                          ) : (
                            '2'
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-900 mt-2">
                          2. Verifier Certification
                        </span>
                        <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                          {app.certifiedByVerifierName ? `${app.certifiedByVerifierName}` : 'Under Review'}
                        </span>
                      </div>

                      {/* Stage 3: Committee Approved */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                            ['COMMITTEE_APPROVED', 'SCHOLARSHIP_RELEASED'].includes(app.status)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {['COMMITTEE_APPROVED', 'SCHOLARSHIP_RELEASED'].includes(app.status) ? (
                            '✓'
                          ) : (
                            '3'
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-900 mt-2">
                          3. Selection Committee
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {app.awardedAt ? `Awarded (${app.meritScore || 88}%)` : 'Pending Award'}
                        </span>
                      </div>

                      {/* Stage 4: Scholarship Disbursed */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                            app.status === 'SCHOLARSHIP_RELEASED'
                              ? 'bg-green-600 text-white'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {app.status === 'SCHOLARSHIP_RELEASED' ? '✓' : '4'}
                        </div>
                        <span className="text-xs font-bold text-slate-900 mt-2">
                          4. DBT Disbursed
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {app.disbursedAt ? 'Released to Bank' : 'Awaiting Release'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Alerts & Notes inside card */}
                {app.status === 'DEFICIENT' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Action Required from Student:</strong>
                        <p className="mt-0.5">{app.verifierNotes}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeficiencyModalApp(app)}
                      className="self-start sm:self-center px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors whitespace-nowrap shadow-xs"
                    >
                      Respond to Deficiency &amp; Re-Upload
                    </button>
                  </div>
                )}

                {app.status === 'SCHOLARSHIP_RELEASED' && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <strong>Scholarship Released via Direct Benefit Transfer (DBT):</strong>
                        <p className="text-[11px] text-emerald-800">
                          PFMS Txn: <strong>{app.pfmsTransactionId}</strong> &bull; Batch:{' '}
                          <strong>{app.disbursementBatchId}</strong>
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                      Disbursed on {new Date(app.disbursedAt || '').toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Bottom Card Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 text-xs gap-3">
                  <div className="text-slate-500">
                    Attached Documents: <strong>{app.documentsAttached.length} verified files</strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(app.status === 'COMMITTEE_APPROVED' || app.status === 'SCHOLARSHIP_RELEASED') && (
                      <button
                        onClick={() => setShowSanctionModal(app)}
                        className="flex items-center gap-1.5 px-3 py-1.5 font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        <span>MoTA Award Letter (Sanction Order)</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowSlipModal(app)}
                      className="flex items-center gap-1.5 px-3 py-1.5 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>Acknowledgment Slip</span>
                    </button>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="flex items-center gap-1.5 px-3 py-1.5 font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit Trail</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Acknowledgment Slip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  National Scholarship Portal Acknowledgment Slip
                </h3>
              </div>
              <button
                onClick={() => setShowSlipModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="text-center pb-2 border-b border-slate-200">
                <span className="font-extrabold text-sm text-slate-900 uppercase">Government of India &bull; State Welfare</span>
                <p className="text-[11px] text-slate-500">Official Direct Benefit Transfer (DBT) Electronic Slip</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div><strong>Application Number:</strong> {showSlipModal.applicationNumber}</div>
                <div><strong>Current Status:</strong> {STATUS_LABELS[showSlipModal.status]}</div>
                <div><strong>Applicant Name:</strong> {showSlipModal.applicantName}</div>
                <div><strong>Masked Aadhaar:</strong> {showSlipModal.aadhaarMasked}</div>
                <div><strong>Institution:</strong> {showSlipModal.instituteName}</div>
                <div><strong>Course:</strong> {showSlipModal.courseName}</div>
                <div><strong>Scholarship Scheme:</strong> {showSlipModal.schemeName}</div>
                <div><strong>Grant Amount:</strong> ₹{showSlipModal.grantAmount.toLocaleString()}</div>
                {showSlipModal.pfmsTransactionId && (
                  <div className="col-span-2 text-emerald-800 font-bold bg-emerald-50 p-2 rounded">
                    PFMS DBT Reference: {showSlipModal.pfmsTransactionId} (Batch: {showSlipModal.disbursementBatchId})
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-slate-400">Cryptographically signed by MoTA Central Engine</span>
              <button
                onClick={() => {
                  alert('Acknowledgment slip downloaded successfully (PDF preview generated).');
                  setShowSlipModal(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Verification Logs & Audit Ledger
                </h3>
                <p className="text-xs text-slate-500 font-mono">{selectedApp.applicationNumber}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedApp.statusHistory.map((log, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-700">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-700">{log.notes}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Officer/Performer: <strong>{log.performerName}</strong> ({log.performedByRole})</span>
                    {log.hashSignature && <span className="font-mono text-slate-500">{log.hashSignature.slice(0, 14)}...</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official MoTA Sanction Order & Award Letter Modal */}
      {showSanctionModal && (
        <SanctionOrderModal
          application={showSanctionModal}
          onClose={() => setShowSanctionModal(null)}
        />
      )}

      {/* Deficiency Rectification Response Modal */}
      {deficiencyModalApp && (
        <DeficiencyResponseModal
          application={deficiencyModalApp}
          onClose={() => setDeficiencyModalApp(null)}
          onSuccess={(msg) => {
            setSuccessToast(msg);
            setTimeout(() => setSuccessToast(''), 6000);
          }}
        />
      )}
    </div>
  );
};
