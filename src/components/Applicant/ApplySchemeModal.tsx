import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, FileText, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { ScholarshipScheme, StudentDocument } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';

interface ApplySchemeModalProps {
  scheme: ScholarshipScheme;
  onClose: () => void;
  onSuccess: (appId: string) => void;
}

export const ApplySchemeModal: React.FC<ApplySchemeModalProps> = ({ scheme, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const { documents, submitApplication } = usePortalData();

  const [step, setStep] = useState<number>(1);
  const [instituteName, setInstituteName] = useState('Birla Institute of Technology (BIT), Mesra');
  const [courseName, setCourseName] = useState('B.Tech Computer Science & Engineering');
  const [currentYear, setCurrentYear] = useState('Year 2');
  const [annualIncome, setAnnualIncome] = useState<number>(145000);
  const [consentAadhaar, setConsentAadhaar] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const applicantDocs = documents.filter((d) => d.applicantId === currentUser?.id);

  const handleSubmit = async () => {
    if (!consentAadhaar) {
      setErrorMessage('You must provide consent for Aadhaar-based DBT verification.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await submitApplication(scheme.id, {
        instituteName,
        courseName,
        currentYear,
        annualIncome: Number(annualIncome),
      });

      if (res.success && res.applicationId) {
        onSuccess(res.applicationId);
      } else {
        setErrorMessage(res.message || 'Application submission failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20">
              {scheme.level} SCHEME APPLICATION
            </span>
            <h3 className="text-lg font-bold mt-1">{scheme.name}</h3>
            <p className="text-xs text-blue-100">{scheme.ministryOrDept}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Navigation */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-blue-600 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>1</span>
            <span>Student & Academic Info</span>
          </div>
          <div className="w-12 h-px bg-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-blue-600 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>2</span>
            <span>Documents & Consent</span>
          </div>
          <div className="w-12 h-px bg-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-blue-600 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>3</span>
            <span>Review & Submit</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Auto-Filled From Verified Student Profile
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-slate-700">
                  <div><strong>Applicant:</strong> {currentUser?.fullName}</div>
                  <div><strong>Category:</strong> {currentUser?.caste || 'ST'}</div>
                  <div><strong>State:</strong> {currentUser?.assignedState || 'Jharkhand'}</div>
                  <div><strong>Aadhaar:</strong> {currentUser?.aadhaarMasked || 'XXXX-XXXX-9812'}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enrolled Educational Institution / University *
                </label>
                <input
                  type="text"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. National Institute of Technology, Jamshedpur"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course / Degree Programme *
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. B.Tech Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Academic Year / Semester *
                  </label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Year 1">Year 1 / Semester 1-2</option>
                    <option value="Year 2">Year 2 / Semester 3-4</option>
                    <option value="Year 3">Year 3 / Semester 5-6</option>
                    <option value="Year 4">Year 4 / Semester 7-8</option>
                    <option value="Postgraduate Year 1">Postgraduate Year 1</option>
                    <option value="Postgraduate Year 2">Postgraduate Year 2</option>
                    <option value="Ph.D. Scholar">Ph.D. Research Scholar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Annual Family Income (in ₹) *
                </label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 145000"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Scheme maximum ceiling: <strong>₹{scheme.incomeLimit.toLocaleString()}</strong> per annum.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Documents Required For This Scheme ({scheme.requiredDocuments.length})
                </h4>
                <div className="space-y-2">
                  {scheme.requiredDocuments.map((docReq, idx) => {
                    const hasDoc = applicantDocs.some((d) =>
                      d.title.toLowerCase().includes(docReq.toLowerCase().split(' ')[0]) ||
                      docReq.toLowerCase().includes('certificate')
                    );
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-slate-800">{docReq}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Attached from My Documents
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAadhaar}
                    onChange={(e) => setConsentAadhaar(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 leading-relaxed text-[11px]">
                    I hereby give my voluntary consent to use my Aadhaar Number (
                    <strong>{currentUser?.aadhaarMasked}</strong>) for identity authentication, state verification, and Direct Benefit Transfer (DBT) credit through the National Payments Corporation of India (NPCI) Aadhaar Payment Bridge.
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  Application Summary Preview
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Scheme Name:</span>
                    <strong>{scheme.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Grant Amount:</span>
                    <strong className="text-emerald-700">₹{scheme.grantAmount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Institution:</span>
                    <strong>{instituteName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Course & Year:</span>
                    <strong>{courseName} ({currentYear})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Annual Family Income:</span>
                    <strong>₹{annualIncome.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">DBT Linked Bank:</span>
                    <strong className="text-blue-700">State Bank of India (XXXX-7140)</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-[11px] leading-relaxed">
                <strong>Next Step:</strong> Upon clicking "Confirm & Submit Application", your application will be routed to the <strong>{scheme.level === 'CENTRAL' ? 'Central Verifier (CV)' : 'State Verifier (SV)'}</strong> for side-by-side document certification. You will receive an instant in-app and SMS alert.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm & Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
