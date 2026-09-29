import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  FolderLock
} from 'lucide-react';
import { Application } from '../../types';
import { usePortalData } from '../../context/PortalDataContext';

interface DeficiencyResponseModalProps {
  application: Application;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const DeficiencyResponseModal: React.FC<DeficiencyResponseModalProps> = ({
  application,
  onClose,
  onSuccess,
}) => {
  const { resolveDeficiency, documents } = usePortalData();

  const [rectificationNote, setRectificationNote] = useState('');
  const [selectedDocTitle, setSelectedDocTitle] = useState(
    documents[0]?.title || 'Updated Domicile Certificate'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rectificationNote.trim()) {
      setError('Please provide an explanation of how the deficiency was addressed.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      resolveDeficiency(application.id, selectedDocTitle);
      setIsSubmitting(false);
      onSuccess(
        `Deficiency resolved for application ${application.applicationNumber}! Form re-submitted to Verifier Queue for final certification.`
      );
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-heading">
                Respond to 72-Hour Deficiency Notice
              </h3>
              <p className="text-[11px] text-amber-100">
                Application: <span className="font-mono font-bold">{application.applicationNumber}</span> &bull; {application.schemeName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Official Verifier Remarks Callout */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-900">
            <div className="flex items-center gap-1.5 font-bold">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Official Verifier Deficiency Remarks:</span>
            </div>
            <p className="text-slate-800 italic bg-white p-2.5 rounded-lg border border-amber-100 mt-1 leading-relaxed">
              "{application.verifierNotes || 'Document scrutiny revealed discrepancies. Please upload a clear and currently valid certificate.'}"
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Select Rectified Document */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Select Rectified Certificate from Document Vault *
            </label>
            <select
              value={selectedDocTitle}
              onChange={(e) => setSelectedDocTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.title}>
                  {d.title} ({d.certificateNumber} - {d.issuingAuthority})
                </option>
              ))}
              <option value="Current Financial Year Income Certificate (SDO)">
                Current Financial Year Income Certificate (SDO Issued)
              </option>
              <option value="Updated High-Resolution Marksheet Scan">
                Updated High-Resolution Marksheet Scan
              </option>
              <option value="Article 342 ST Gazette Certificate">
                Article 342 ST Gazette Certificate
              </option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">
              DigiLocker verified documents have faster turnaround in the verification queue.
            </span>
          </div>

          {/* Student Explanation Note */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Explanation &amp; Rectification Statement *
            </label>
            <textarea
              rows={4}
              value={rectificationNote}
              onChange={(e) => setRectificationNote(e.target.value)}
              placeholder="e.g. I have re-uploaded the latest annual family income certificate issued by the Sub-Divisional Officer (SDO) for FY 2026-27 with legible digital signature..."
              className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 leading-relaxed"
              required
            />
          </div>

          {/* Guarantee & Timelines */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Upon submission, your application status will automatically return to <strong>"Submitted (Pending Verification)"</strong> and alert the State/Central Verifier for accelerated re-inspection.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Rectification...' : 'Submit Rectification to Verifier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
