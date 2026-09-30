import React from 'react';
import { 
  X, 
  Calendar, 
  IndianRupee, 
  FileText, 
  CheckCircle, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Info,
  Clock,
  Layers
} from 'lucide-react';
import { ScholarshipScheme } from '../../types';
import { TribalPattern } from '../Common/TribalPattern';

interface SchemeDetailDrawerProps {
  scheme: ScholarshipScheme | null;
  onClose: () => void;
  onApply: (scheme: ScholarshipScheme) => void;
}

export const SchemeDetailDrawer: React.FC<SchemeDetailDrawerProps> = ({
  scheme,
  onClose,
  onApply,
}) => {
  if (!scheme) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scheme-drawer-title"
      >
        {/* Drawer Header with Government Deep Blue */}
        <div className="bg-[#1D0A69] text-white p-5 relative flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-amber-400 text-slate-950">
                  {scheme.level} SECTOR SCHEME
                </span>
                <span className="text-xs text-indigo-200 font-mono">
                  CODE: {scheme.code}
                </span>
              </div>
              <h2 id="scheme-drawer-title" className="text-lg sm:text-xl font-bold text-white leading-snug">
                {scheme.name}
              </h2>
              <p className="text-xs text-indigo-200 mt-1">
                {scheme.ministryOrDept} {scheme.state ? `• Government of ${scheme.state}` : ''}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              aria-label="Close Scheme Details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <TribalPattern variant="toda-woven" height={8} opacity={0.3} color="#FFD166" />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-800 text-sm">
          {/* Key Indicators Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-emerald-600" />
                Annual Grant
              </span>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                ₹{scheme.grantAmount.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-slate-500">per annum / DBT credited</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                Family Income Cap
              </span>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {scheme.incomeLimit === 0 ? 'No Limit' : `≤ ₹${(scheme.incomeLimit / 100000).toFixed(1)} Lakh`}
              </p>
              <span className="text-[10px] text-slate-500">certified by Competent Authority</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-rose-600" />
                Closing Deadline
              </span>
              <p className="text-base font-bold text-rose-700 mt-0.5">
                {scheme.deadline}
              </p>
              <span className="text-[10px] text-slate-500">Academic Year {scheme.academicYear}</span>
            </div>
          </div>

          {/* Scheme Overview */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-900" />
              Scheme Overview &amp; Objective
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
              {scheme.description}
            </p>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              Prescribed Eligibility Criteria
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                <span>
                  <strong>Social Category:</strong> Must belong to notified Scheduled Tribe ({scheme.categoryEligibility.join(', ')}). Valid Article 342 Tribe Certificate mandatory.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                <span>
                  <strong>Academic Levels Covered:</strong> {scheme.educationLevels.join(' • ')} in recognized institutions / universities.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                <span>
                  <strong>Aadhaar DBT Seeding:</strong> Applicant must possess an active Aadhaar number seeded and mapped with an operational bank account on NPCI mapper.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                <span>
                  <strong>No Duplication:</strong> Scholar cannot draw financial scholarship for the same academic course from any other Central or State Government scheme concurrently.
                </span>
              </li>
            </ul>
          </div>

          {/* Mandatory Documents Checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-900" />
              Mandatory Documents for Application
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scheme.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-800">{doc}</span>
                </div>
              ))}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-[10px]">
                  *
                </span>
                <span className="font-medium text-slate-800">Aadhaar Consent &amp; Seeding Proof</span>
              </div>
            </div>
          </div>

          {/* Application & Selection Process */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              Standard Operating Procedure (SOP)
            </h3>
            <ol className="space-y-2 text-xs list-decimal list-inside text-slate-700">
              <li><strong>Submission:</strong> Student registers with Aadhaar and files online application with academic &amp; caste documents.</li>
              <li><strong>Institutional / District Scrutiny:</strong> Verified against original institutional records by designated State/Central Verifiers.</li>
              <li><strong>AI &amp; Gazette Validation:</strong> Automated OCR field extraction with human verifier in the loop (72-hour deficiency correction window).</li>
              <li><strong>Selection Committee Screening:</strong> Scrutinized and awarded by the MoTA Selection Committee.</li>
              <li><strong>PFMS Direct Benefit Transfer (DBT):</strong> Disbursed directly into student's Aadhaar-seeded bank account.</li>
            </ol>
          </div>

          {/* Official Gazette Source */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Official Scheme Guidelines:</strong>{' '}
              {scheme.guidelineDocumentTitle || 'Ministry of Tribal Affairs Gazette Notification & Standard Operational Manual'}
              <p className="text-[11px] text-amber-800/90 mt-0.5">
                Published by {scheme.publishedBy} &bull; Academic Session {scheme.academicYear}
              </p>
            </div>
          </div>
        </div>

        {/* Drawer Footer with Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded text-xs hover:bg-slate-100 transition-colors"
          >
            Close Details
          </button>

          <button
            onClick={() => {
              onApply(scheme);
              onClose();
            }}
            className="px-5 py-2.5 bg-[#1D0A69] hover:bg-[#130649] text-white font-bold rounded text-xs shadow flex items-center gap-1.5 transition-colors"
          >
            <span>Proceed to Apply</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
