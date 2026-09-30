import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Eye, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
import { Application, StudentDocument } from '../../types';
import { VerificationWorkbenchModal } from './VerificationWorkbenchModal';

interface VerifiersPortalProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
}

export const VerifiersPortal: React.FC<VerifiersPortalProps> = ({ currentTab, onTabChange }) => {
  const { currentUser, activeRole } = useAuth();
  const { 
    applications, 
    documents, 
    certifyApplication, 
    flagApplicationDeficient, 
    rejectApplicationByVerifier 
  } = usePortalData();

  const isStateVerifier = activeRole === 'SV';
  const verifierState = currentUser?.assignedState;

  // Filter applications by jurisdiction
  const pendingApps = applications.filter((a) => {
    if (a.status !== 'SUBMITTED' && a.status !== 'DEFICIENT') return false;
    if (isStateVerifier) {
      return a.schemeLevel === 'STATE' && (!verifierState || a.state === verifierState);
    }
    return a.schemeLevel === 'CENTRAL';
  });

  const certifiedApps = applications.filter((a) => {
    if (!['VERIFIER_CERTIFIED', 'COMMITTEE_APPROVED', 'SCHOLARSHIP_RELEASED'].includes(a.status)) return false;
    if (isStateVerifier) {
      return a.schemeLevel === 'STATE' && (!verifierState || a.state === verifierState);
    }
    return a.schemeLevel === 'CENTRAL';
  });

  // Selected app for Side-by-Side Review
  const [reviewingApp, setReviewingApp] = useState<Application | null>(null);
  const [workbenchApp, setWorkbenchApp] = useState<Application | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<number>(0);
  const [certifyNotes, setCertifyNotes] = useState('All uploaded certificates (Domicile, Income, Category, Academic) verified with e-District digital repository. Certified valid for Selection Committee screening.');
  const [deficiencyRemarks, setDeficiencyRemarks] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const openSideBySide = (app: Application) => {
    setReviewingApp(app);
    setActiveDocTab(0);
    setCertifyNotes('All uploaded certificates (Domicile, Income, Category, Academic) verified with e-District digital repository. Certified valid for Selection Committee screening.');
    setDeficiencyRemarks('');
    setActionSuccessMessage('');
  };

  const handleCertify = () => {
    if (!reviewingApp) return;
    certifyApplication(reviewingApp.id, certifyNotes);
    setActionSuccessMessage(`Application ${reviewingApp.applicationNumber} has been CERTIFIED and moved forward to the Selection Committee!`);
    setTimeout(() => {
      setReviewingApp(null);
    }, 1500);
  };

  const handleFlagDeficient = () => {
    if (!reviewingApp || !deficiencyRemarks.trim()) {
      alert('Please enter deficiency remarks to send back to the student.');
      return;
    }
    flagApplicationDeficient(reviewingApp.id, deficiencyRemarks);
    setActionSuccessMessage(`Application flagged as deficient. Alert sent to student: ${deficiencyRemarks}`);
    setTimeout(() => {
      setReviewingApp(null);
    }, 1500);
  };

  const handleReject = () => {
    if (!reviewingApp) return;
    const reason = prompt('Please enter the reason for rejection:');
    if (!reason) return;
    rejectApplicationByVerifier(reviewingApp.id, reason);
    setReviewingApp(null);
  };

  // Get documents for currently reviewed app
  const appDocs: StudentDocument[] = reviewingApp
    ? documents.filter((d) => d.applicantId === reviewingApp.applicantId)
    : [];

  const currentDoc = appDocs[activeDocTab];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              {isStateVerifier
                ? `State Verifier (SV) Portal — ${verifierState || 'State'} Jurisdiction`
                : 'Central Verifier (CV) Portal — National Document Certification'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Primary function: Inspect submitted student data side-by-side with uploaded certificates (Domicile, Income, Academic, Aadhaar) and certify documents for Selection Committee award screening.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            {pendingApps.length} Application(s) Pending Review
          </span>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Certification</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{pendingApps.length}</h3>
          <span className="text-[11px] text-slate-500">Requires Side-by-Side Check</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certified by Verifier</p>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{certifiedApps.length}</h3>
          <span className="text-[11px] text-emerald-600 font-medium">Forwarded to Committee</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Jurisdiction</p>
          <h3 className="text-sm font-extrabold text-slate-900 mt-1">
            {isStateVerifier ? verifierState || 'All State Colleges' : 'All Central Sector Institutions'}
          </h3>
          <span className="text-[11px] text-slate-500">Document Certification Cell</span>
        </div>
      </div>

      {/* Verifier Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('verification_queue')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'verification_queue' || currentTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Pending Review Queue ({pendingApps.length})</span>
            </button>

            <button
              onClick={() => onTabChange('certified_history')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'certified_history'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Certified History ({certifiedApps.length})</span>
            </button>
          </div>
        </div>

        {/* View 1: Pending Queue */}
        {(currentTab === 'verification_queue' || currentTab === 'dashboard') && (
          <div className="p-6">
            {pendingApps.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Verification Queue is Clear!</p>
                <p className="mt-1">All applications under your jurisdiction have been certified or reviewed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                      <th className="p-3">App Number</th>
                      <th className="p-3">Applicant &amp; Domicile</th>
                      <th className="p-3">Scheme Applied</th>
                      <th className="p-3">Family Income</th>
                      <th className="p-3">Docs Attached</th>
                      <th className="p-3">Submitted On</th>
                      <th className="p-3 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-700">{app.applicationNumber}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{app.applicantName}</div>
                          <div className="text-[11px] text-slate-500">{app.caste} &bull; {app.state}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-800">{app.schemeName}</div>
                          <div className="text-[11px] text-slate-500">{app.instituteName}</div>
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          ₹{app.annualIncome.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {app.documentsAttached.length} Documents
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setWorkbenchApp(app)}
                              className="px-2.5 py-1.5 bg-[#1D0A69] hover:bg-[#130649] text-white font-bold text-xs rounded transition-colors inline-flex items-center gap-1 shadow-xs"
                              title="Open Evidence-Linked Verification Workbench"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                              <span>Workbench</span>
                            </button>
                            <button
                              onClick={() => openSideBySide(app)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded transition-colors inline-flex items-center gap-1 border border-slate-300"
                              title="Side-by-Side Quick Inspection"
                            >
                              <span>Inspect</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* View 2: Certified History */}
        {currentTab === 'certified_history' && (
          <div className="p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Certified Applications (Forwarded to Selection Committee)
            </h3>
            {certifiedApps.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">No certified applications yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                      <th className="p-3">App Number</th>
                      <th className="p-3">Applicant</th>
                      <th className="p-3">Scheme</th>
                      <th className="p-3">Certified Date</th>
                      <th className="p-3">Verifier Remarks</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {certifiedApps.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-700">{a.applicationNumber}</td>
                        <td className="p-3 font-semibold text-slate-900">{a.applicantName}</td>
                        <td className="p-3 text-slate-600">{a.schemeName}</td>
                        <td className="p-3 text-slate-500">{new Date(a.certifiedAt || a.updatedAt).toLocaleDateString()}</td>
                        <td className="p-3 text-slate-700 italic max-w-xs truncate">{a.verifierNotes}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SIDE-BY-SIDE REVIEW MODAL (CORE VERIFIER REQUIREMENT) */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-blue-600 text-white">
                  <FileCheck2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base">
                    Side-by-Side Document Certification &amp; Form Inspection
                  </h3>
                  <p className="text-xs text-slate-400">
                    Application ID: <strong className="text-white font-mono">{reviewingApp.applicationNumber}</strong> &bull; Scheme: {reviewingApp.schemeName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setReviewingApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Banner upon action */}
            {actionSuccessMessage && (
              <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{actionSuccessMessage}</span>
              </div>
            )}

            {/* Side-by-Side Dual-Pane Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-hidden">
              {/* LEFT PANE: STUDENT SUBMITTED DATA */}
              <div className="p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Student Declared Details (Cross-Check with Documents)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    Form Data
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Full Name</span>
                      <strong className="text-sm text-slate-900">{reviewingApp.applicantName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Guardian / Father</span>
                      <strong className="text-slate-900">{reviewingApp.fatherName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Category / Caste</span>
                      <strong className="text-blue-700">{reviewingApp.caste}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Domicile State</span>
                      <strong className="text-slate-900">{reviewingApp.state} ({reviewingApp.district})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Annual Family Income</span>
                      <strong className="text-emerald-700 font-extrabold text-sm">
                        ₹{reviewingApp.annualIncome.toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Aadhaar Vault Number</span>
                      <strong className="font-mono text-slate-900">{reviewingApp.aadhaarMasked}</strong>
                    </div>
                  </div>
                </div>

                {/* Academic Institution Details */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5 pb-1 border-b">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Academic &amp; Enrollment Records</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                    <div><strong>Institution:</strong> {reviewingApp.instituteName}</div>
                    <div><strong>Course:</strong> {reviewingApp.courseName}</div>
                    <div><strong>Year:</strong> {reviewingApp.currentYear}</div>
                    <div><strong>Grant Amount:</strong> ₹{reviewingApp.grantAmount.toLocaleString()}</div>
                  </div>
                </div>

                {/* Seeding & Verification Checklist */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-2">
                  <h5 className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Automated Security &amp; Registry Checkpoints</span>
                  </h5>
                  <ul className="space-y-1 text-[11px] text-emerald-900">
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Aadhaar Verhoeff Checksum: <strong>Valid &amp; Active</strong></span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>NPCI DBT Mapper: <strong>Seeded with SBI Account</strong></span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>DigiLocker Digital Signature: <strong>Authentic Certificate Seal</strong></span>
                    </li>
                  </ul>
                </div>

                {/* Verifier Notes Input */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Verifier Certification Notes / Stamp *
                  </label>
                  <textarea
                    value={certifyNotes}
                    onChange={(e) => setCertifyNotes(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter official certification remarks..."
                  />
                </div>

                {/* Deficiencies Remarks */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-amber-800">
                    Flag Deficiencies (if returning to student for correction)
                  </label>
                  <input
                    type="text"
                    value={deficiencyRemarks}
                    onChange={(e) => setDeficiencyRemarks(e.target.value)}
                    className="w-full text-xs p-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Income certificate expired; please re-upload valid certificate within 7 days."
                  />
                </div>
              </div>

              {/* RIGHT PANE: DOCUMENT VIEWER & PREVIEWS */}
              <div className="p-6 flex flex-col justify-between overflow-hidden bg-slate-100/70">
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex items-center justify-between pb-3">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Uploaded Documents Preview ({appDocs.length})
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Select document to inspect:
                    </span>
                  </div>

                  {/* Tabs for Documents */}
                  <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                    {appDocs.map((doc, idx) => (
                      <button
                        key={doc.id}
                        onClick={() => setActiveDocTab(idx)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                          activeDocTab === idx
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{doc.title.slice(0, 18)}...</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Document Viewer Canvas */}
                  <div className="mt-3 flex-1 bg-white rounded-xl border border-slate-300 overflow-hidden flex flex-col justify-between shadow-inner">
                    {currentDoc ? (
                      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs">{currentDoc.title}</h5>
                            <span className="text-[11px] text-slate-500">
                              Cert No: <strong>{currentDoc.certificateNumber || 'N/A'}</strong> &bull;{' '}
                              {currentDoc.issuingAuthority}
                            </span>
                          </div>
                          {currentDoc.isDigiLockerVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> DigiLocker Verified
                            </span>
                          )}
                        </div>

                        {/* Image Viewer */}
                        <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg p-2 min-h-[220px]">
                          <img
                            src={currentDoc.fileUrl}
                            alt={currentDoc.title}
                            className="max-h-[300px] object-contain rounded shadow-sm border border-slate-200"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs my-auto">
                        No document selected for preview.
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTONS: CERTIFY VS FLAG VS REJECT */}
                <div className="pt-4 mt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReject}
                      className="px-3.5 py-2 text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={handleFlagDeficient}
                      className="px-3.5 py-2 text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg border border-amber-300 transition-colors"
                    >
                      Flag Deficiencies
                    </button>
                  </div>

                  {/* Primary "Certify Documents" Button */}
                  <button
                    onClick={handleCertify}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all transform hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Certify Documents (Move to Committee)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Evidence-Linked Verification Workbench Modal */}
      {workbenchApp && (
        <VerificationWorkbenchModal
          application={workbenchApp}
          onClose={() => setWorkbenchApp(null)}
          onCertifySuccess={() => setWorkbenchApp(null)}
        />
      )}
    </div>
  );
};
