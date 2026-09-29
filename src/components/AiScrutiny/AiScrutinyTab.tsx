import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  Scan, 
  Clock, 
  ArrowRight,
  FileCheck,
  Send,
  Eye
} from 'lucide-react';
import { usePortalData } from '../../context/PortalDataContext';
import { useAuth } from '../../context/AuthContext';
import { AiScrutinyResult } from '../../types';

export const AiScrutinyTab: React.FC = () => {
  const { applications, aiScrutinies, runAiDocumentScrutiny, trigger72hDeficiencyNotice } = usePortalData();
  const { activeRole } = useAuth();

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeScrutiny, setActiveScrutiny] = useState<AiScrutinyResult | null>(aiScrutinies[0] || null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [deficiencyReason, setDeficiencyReason] = useState('Income certificate validity expired; re-upload current financial year document.');
  const [noticeSentToast, setNoticeSentToast] = useState('');

  const selectedApp = applications.find((a) => a.id === selectedAppId);

  const handleRunAiAnalysis = () => {
    if (!selectedAppId) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = runAiDocumentScrutiny(selectedAppId);
      setActiveScrutiny(res);
      setIsAnalyzing(false);
    }, 900);
  };

  const handleSendDeficiencyNotice = () => {
    if (!selectedAppId) return;
    trigger72hDeficiencyNotice(selectedAppId, ['Income Certificate'], deficiencyReason);
    setNoticeSentToast(`72-Hour Deficiency Notice dispatched via SMS & Email to ${selectedApp?.applicantName}.`);
    setShowNoticeModal(false);
    setTimeout(() => setNoticeSentToast(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
              <Sparkles className="w-5 h-5 text-cyan-600" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              AI-Powered Document Intelligence &amp; Scrutiny Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automates eligibility and document scrutiny using OCR extraction, Article 342 ST Gazette cross-validation, and automated 72-hour deficiency detection under human oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold flex items-center gap-1.5">
            <Scan className="w-3.5 h-3.5 text-cyan-600" />
            <span>OCR &bull; Gazette Validator &bull; ELA Tamper Scrutiny</span>
          </span>
        </div>
      </div>

      {noticeSentToast && (
        <div className="p-4 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4" />
          <span>{noticeSentToast}</span>
        </div>
      )}

      {/* Select Application to Scrutinize */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Select Application for AI Document Scrutiny:
          </label>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="w-full text-xs px-3 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 font-semibold text-slate-800"
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.applicationNumber} &bull; {app.applicantName} ({app.caste}) - {app.schemeCode}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRunAiAnalysis}
          disabled={isAnalyzing}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Running AI Vision & Gazette Match...' : 'Execute AI Scrutiny Check'}</span>
        </button>
      </div>

      {/* AI Scrutiny Result Canvas */}
      {activeScrutiny ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: OCR Fields & Gazette Check */}
          <div className="lg:col-span-2 space-y-4">
            {/* Card 1: OCR Field Extraction */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    OCR Extracted Key Fields ({activeScrutiny.ocrConfidenceScore}% Confidence)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Automated Extraction
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Applicant Name Match</span>
                  <strong className="text-slate-900 text-sm">{activeScrutiny.ocrExtractedFields.name || selectedApp?.applicantName}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Father / Guardian</span>
                  <strong className="text-slate-900 text-sm">{activeScrutiny.ocrExtractedFields.fatherName || selectedApp?.fatherName}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Community / Tribe</span>
                  <strong className="text-blue-700 text-sm">{activeScrutiny.ocrExtractedFields.caste || selectedApp?.caste}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Certificate Issue Date</span>
                  <strong className="text-slate-900 text-sm">{activeScrutiny.ocrExtractedFields.issueDate || '15-04-2025'}</strong>
                </div>
              </div>
            </div>

            {/* Card 2: Constitution Article 342 ST Gazette Cross-Check */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Constitution Article 342 Presidential Order Gazette Check
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Official Gazette Match
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Notified Tribe Confirmed in State Schedule:</span>
                </p>
                <p className="text-emerald-900 text-xs pl-5 font-mono">
                  {activeScrutiny.notifiedTribeMatched}
                </p>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Matches against the Constitution (Scheduled Tribes) Order, 1950 (Part XXI for Jharkhand / Bihar / Odisha), preventing ineligible claims while ensuring genuine tribal scholars face zero friction.
              </p>
            </div>
          </div>

          {/* Column 3: ELA Tampering & Deficiency Decision */}
          <div className="space-y-4">
            {/* ELA Tamper Analysis Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  ELA Tamper Analysis (Forensics)
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {activeScrutiny.elaConfidencePercent}% Clean
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 font-bold">
                  ✓
                </div>
                <strong className="text-xs text-slate-900 block">No Digital Splicing Detected</strong>
                <p className="text-[11px] text-slate-500 mt-1">
                  Error Level Analysis (ELA) compression uniformity indicates original scanner capture.
                </p>
              </div>
            </div>

            {/* Recommendation & 72-Hour Deficiency Trigger */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                AI Recommendation &amp; Deficiency Workflow
              </h4>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <span className="font-bold block">Status: Auto-Eligible for Certification</span>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  All documents meet MoTA scheme criteria. Ready for Verifier sign-off.
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Issue 72-Hour Deficiency Notice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          Select an application and execute AI Scrutiny.
        </div>
      )}

      {/* 72h Deficiency Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Issue 72-Hour Deficiency Notice
                </h3>
              </div>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                Target Applicant: <strong>{selectedApp?.applicantName}</strong> ({selectedApp?.applicantMobile})
              </p>
              <p>
                Under MoTA automated workflow rules, issuing a deficiency notice grants the scholar a <strong>72-hour window</strong> to re-upload clear or updated documents before administrative rejection.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Deficiency Reason / Missing Requirement *
              </label>
              <textarea
                value={deficiencyReason}
                onChange={(e) => setDeficiencyReason(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowNoticeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendDeficiencyNotice}
                className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch 72h Alert (SMS &amp; Email)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
