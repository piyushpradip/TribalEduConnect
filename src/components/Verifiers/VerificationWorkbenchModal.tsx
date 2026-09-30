import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Eye, 
  Building2, 
  Award, 
  Search, 
  Info,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Application, StudentDocument } from '../../types';
import { usePortalData } from '../../context/PortalDataContext';
import { TribalPattern } from '../Common/TribalPattern';

interface VerificationWorkbenchModalProps {
  application: Application;
  onClose: () => void;
  onCertifySuccess?: () => void;
}

export const VerificationWorkbenchModal: React.FC<VerificationWorkbenchModalProps> = ({
  application,
  onClose,
  onCertifySuccess,
}) => {
  const { documents, certifyApplication, flagApplicationDeficient, rejectApplicationByVerifier } = usePortalData();

  // Find all documents uploaded for this applicant
  const appDocs = documents.filter((d) => d.applicantId === application.applicantId);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [selectedFieldHighlight, setSelectedFieldHighlight] = useState<string | null>('income');
  
  const [actionTab, setActionTab] = useState<'CERTIFY' | 'DEFICIENCY' | 'REJECT'>('CERTIFY');
  const [certifyNotes, setCertifyNotes] = useState(
    'All uploaded certificates (Domicile, Income, Category, Academic) verified against state e-District digital repository. Certified valid for MoTA Selection Committee screening.'
  );
  const [deficiencyReason, setDeficiencyReason] = useState(
    'Uploaded Income Certificate has exceeded 1-year validity period. Please re-upload current financial year document issued by Circle Officer / Tehsildar.'
  );
  const [deficiencyField, setDeficiencyField] = useState('Income Certificate');
  const [rejectReason, setRejectReason] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const currentDoc: StudentDocument | undefined = appDocs[selectedDocIndex] || appDocs[0];

  const handleCertify = () => {
    certifyApplication(application.id, certifyNotes);
    setActionNotice('Application Certified and forwarded to the Selection Committee.');
    setTimeout(() => {
      if (onCertifySuccess) onCertifySuccess();
      onClose();
    }, 1200);
  };

  const handleSendDeficiency = () => {
    if (!deficiencyReason.trim()) return;
    flagApplicationDeficient(application.id, deficiencyReason);
    setActionNotice(`72-Hour Deficiency Notice dispatched to ${application.applicantName}.`);
    setTimeout(() => {
      if (onCertifySuccess) onCertifySuccess();
      onClose();
    }, 1200);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectApplicationByVerifier(application.id, rejectReason);
    setActionNotice('Application rejected with documented grounds.');
    setTimeout(() => {
      if (onCertifySuccess) onCertifySuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-7xl bg-white rounded-lg shadow-2xl border border-slate-300 flex flex-col h-[94vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workbench-title"
      >
        {/* Government Deep Blue Workbench Header */}
        <div className="bg-[#1D0A69] text-white px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider">
                    Official Verification Workbench
                  </span>
                  <span className="text-xs text-indigo-200 font-mono">
                    ID: {application.applicationNumber}
                  </span>
                </div>
                <h2 id="workbench-title" className="text-sm sm:text-base font-bold text-white">
                  Evidence-Linked Verification: {application.applicantName} ({application.caste})
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                aria-label="Close Verification Workbench"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-2.5">
            <TribalPattern variant="national-mosaic" height={6} opacity={0.3} color="#FFD166" />
          </div>
        </div>

        {/* Success Action Banner */}
        {actionNotice && (
          <div className="bg-emerald-700 text-white px-4 py-2 text-xs font-bold flex items-center gap-2 flex-shrink-0 animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* 2-Column Split Workbench Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT PANE: Document Viewer + Interactive Highlight Regions */}
          <div className="w-full lg:w-7/12 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col bg-slate-100 overflow-hidden">
            {/* Document Tabs */}
            <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex-shrink-0 mr-1">
                Certificates:
              </span>
              {appDocs.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No certificates uploaded</span>
              ) : (
                appDocs.map((doc, idx) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocIndex(idx);
                      setSelectedFieldHighlight(null);
                    }}
                    className={`px-2.5 py-1.5 rounded text-xs font-semibold whitespace-nowrap border transition-colors flex items-center gap-1.5 ${
                      selectedDocIndex === idx
                        ? 'bg-[#1D0A69] text-white border-[#1D0A69]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{doc.title.replace('Certificate', 'Cert.')}</span>
                    {doc.isDigiLockerVerified && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Document Details & Security Stamp Header */}
            {currentDoc && (
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{currentDoc.title}</span>
                  <span className="text-slate-500 font-mono text-[11px]">#{currentDoc.certificateNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    DigiLocker Verified
                  </span>
                  <span className="text-slate-500">Issuer: {currentDoc.issuingAuthority}</span>
                </div>
              </div>
            )}

            {/* Simulated High-Res Document Viewer with Field Regions */}
            <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center relative">
              <div className="w-full max-w-xl bg-white border border-slate-300 shadow-md p-6 text-slate-800 text-xs rounded relative min-h-[380px]">
                {/* Government Official Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                  <span className="text-5xl font-extrabold uppercase rotate-[-25deg]">
                    VERIFIED EVIDENCE
                  </span>
                </div>

                {/* Document Certificate Header */}
                <div className="text-center border-b border-slate-300 pb-3 mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    GOVERNMENT OF {application.state?.toUpperCase() || 'JHARKHAND'}
                  </p>
                  <p className="text-[9px] text-slate-400">OFFICE OF THE REVENUE / SUB-DIVISIONAL MAGISTRATE</p>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 uppercase">
                    {currentDoc?.title || 'Official Statutory Certificate'}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Certificate No: {currentDoc?.certificateNumber || 'CRT/2026/88921'} &bull; Issue Date: {currentDoc?.issueDate || '2026-04-10'}
                  </p>
                </div>

                {/* Certificate Body with Interactive Highlights */}
                <div className="space-y-3.5 leading-relaxed text-slate-700">
                  <p>
                    This is to solemnly certify that <strong className="text-slate-950 font-bold">{application.applicantName}</strong>, 
                    son/daughter of resident of Village/Township under District of <strong className="text-slate-950">{application.district || 'Ranchi'}</strong>, 
                    State of <strong className="text-slate-950">{application.state || 'Jharkhand'}</strong>.
                  </p>

                  {/* Highlightable Region 1: Caste / Social Category */}
                  <div 
                    onClick={() => setSelectedFieldHighlight('caste')}
                    className={`p-2 rounded border cursor-pointer transition-all ${
                      selectedFieldHighlight === 'caste' 
                        ? 'bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-400/40' 
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      <span>Article 342 Social Category Claim</span>
                      <span className="text-amber-800">Source: Caste Registry</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">
                      Community: <span className="font-bold underline text-indigo-950">{application.caste}</span> (Notified in Presidential Gazette Order).
                    </p>
                  </div>

                  {/* Highlightable Region 2: Family Annual Income */}
                  <div 
                    onClick={() => setSelectedFieldHighlight('income')}
                    className={`p-2 rounded border cursor-pointer transition-all ${
                      selectedFieldHighlight === 'income' 
                        ? 'bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-400/40' 
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      <span>Certified Annual Family Income</span>
                      <span className="text-amber-800">Source: Revenue Circle Officer</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">
                      Total Annual Family Income: <span className="font-bold text-emerald-800">₹{application.annualIncome.toLocaleString('en-IN')}</span> (Rupees in words verified).
                    </p>
                  </div>

                  {/* Highlightable Region 3: Academic Institution & Marks */}
                  <div 
                    onClick={() => setSelectedFieldHighlight('academic')}
                    className={`p-2 rounded border cursor-pointer transition-all ${
                      selectedFieldHighlight === 'academic' 
                        ? 'bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-400/40' 
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      <span>Enrolled Institution &amp; Prior Academic Merit</span>
                      <span className="text-amber-800">Source: University Registrar</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">
                      Admitted Course: <span className="font-bold text-slate-950">{application.courseName}</span> at <span className="font-bold text-slate-950">{application.instituteName}</span>.
                    </p>
                  </div>

                  {/* Official Digital Seal & QR Code */}
                  <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
                    <div>
                      <p className="font-bold text-slate-700">Digital Signature Valid</p>
                      <p>e-District Public Key Infrastructure (PKI)</p>
                      <p className="font-mono text-[9px] text-slate-400">HASH: SHA256:7f9a...3b21</p>
                    </div>
                    <div className="w-14 h-14 border border-slate-300 bg-slate-50 p-1 flex items-center justify-center text-center text-[9px] font-mono">
                      QR CODE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Evidence Matcher + Action Workbench */}
          <div className="w-full lg:w-5/12 flex flex-col bg-white overflow-y-auto">
            {/* Field Match Inspector */}
            <div className="p-4 border-b border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-900" />
                  Field-by-Field Evidence Audit
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                  All 4 Mandatory Fields Matched
                </span>
              </div>

              {/* Comparison 1: Income */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Annual Family Income</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Exact Match (OCR 96%)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Form Claim:</span>
                    <span className="font-bold text-slate-800">₹{application.annualIncome.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Certificate Value:</span>
                    <span className="font-bold text-emerald-800">₹{application.annualIncome.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Comparison 2: Caste / ST Gazette */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Article 342 Tribe Schedule</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Gazette Validated
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Candidate Caste:</span>
                    <span className="font-bold text-slate-800">{application.caste}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Gazette Entry:</span>
                    <span className="font-bold text-slate-800">Schedule V &bull; {application.state || 'Jharkhand'}</span>
                  </div>
                </div>
              </div>

              {/* Comparison 3: Domicile Jurisdiction */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Domicile &amp; Residential Territory</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Jurisdiction Confirmed
                  </span>
                </div>
                <p className="text-slate-800 font-semibold mt-1">
                  {application.state || 'Jharkhand'} &bull; District: {application.district || 'Ranchi'}
                </p>
              </div>
            </div>

            {/* Verifier Action Section */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Official Verifier Determination
                </h3>

                {/* Action Mode Toggle */}
                <div className="flex border border-slate-300 rounded overflow-hidden text-xs font-semibold mb-3">
                  <button
                    onClick={() => setActionTab('CERTIFY')}
                    className={`flex-1 py-2 text-center transition-colors ${
                      actionTab === 'CERTIFY'
                        ? 'bg-[#1D0A69] text-white font-bold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    1. Certify Valid
                  </button>
                  <button
                    onClick={() => setActionTab('DEFICIENCY')}
                    className={`flex-1 py-2 text-center transition-colors ${
                      actionTab === 'DEFICIENCY'
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    2. 72h Deficiency
                  </button>
                  <button
                    onClick={() => setActionTab('REJECT')}
                    className={`flex-1 py-2 text-center transition-colors ${
                      actionTab === 'REJECT'
                        ? 'bg-rose-700 text-white font-bold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    3. Reject
                  </button>
                </div>

                {/* Sub-form based on Action */}
                {actionTab === 'CERTIFY' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Verification Certificate Notes (Stored in Cryptographic Audit Log):
                    </label>
                    <textarea
                      value={certifyNotes}
                      onChange={(e) => setCertifyNotes(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500">
                      Signing as authorized Verifier. This certification will be visible to the MoTA Selection Committee.
                    </p>
                  </div>
                )}

                {actionTab === 'DEFICIENCY' && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Flagged Certificate / Field:
                      </label>
                      <select
                        value={deficiencyField}
                        onChange={(e) => setDeficiencyField(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Income Certificate">Income Certificate (Validity / Clarity)</option>
                        <option value="Caste Certificate">ST Caste Certificate (Issuing Authority / Gazette)</option>
                        <option value="Domicile Certificate">Domicile Certificate (Address mismatch)</option>
                        <option value="Academic Marksheet">Academic Marksheet (Missing semester transcript)</option>
                        <option value="Institution Bonafide">College Bonafide with Fee Structure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Actionable Reason for Applicant:
                      </label>
                      <textarea
                        value={deficiencyReason}
                        onChange={(e) => setDeficiencyReason(e.target.value)}
                        rows={3}
                        className="w-full text-xs p-2.5 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none bg-amber-50/40"
                      />
                    </div>
                    <p className="text-[10px] text-amber-800">
                      Applicant will be granted a 72-hour window to re-upload without penalty or application cancellation.
                    </p>
                  </div>
                )}

                {actionTab === 'REJECT' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-rose-800">
                      Statutory Grounds for Rejection (Mandatory under MoTA Guidelines):
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Annual Family Income ₹8,50,000 exceeds statutory limit of ₹2,50,000 for Pre-Matric ST scheme."
                      rows={3}
                      className="w-full text-xs p-2.5 border border-rose-300 rounded focus:ring-2 focus:ring-rose-500 focus:outline-none bg-rose-50/30"
                    />
                    <p className="text-[10px] text-rose-700">
                      Rejection closes this application cycle. Student will be notified via SMS and email with right of appeal.
                    </p>
                  </div>
                )}
              </div>

              {/* Execution Button */}
              <div className="pt-4 border-t border-slate-200">
                {actionTab === 'CERTIFY' && (
                  <button
                    onClick={handleCertify}
                    className="w-full py-2.5 bg-[#198754] hover:bg-[#157347] text-white font-bold text-xs rounded shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Digitally Certify &amp; Forward Application</span>
                  </button>
                )}

                {actionTab === 'DEFICIENCY' && (
                  <button
                    onClick={handleSendDeficiency}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Dispatch 72-Hour Deficiency Notice</span>
                  </button>
                )}

                {actionTab === 'REJECT' && (
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className="w-full py-2.5 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold text-xs rounded shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Execute Formal Rejection</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
