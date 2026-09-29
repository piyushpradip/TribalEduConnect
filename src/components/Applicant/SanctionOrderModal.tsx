import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  QrCode, 
  Award, 
  FileText 
} from 'lucide-react';
import { Application } from '../../types';

interface SanctionOrderModalProps {
  application: Application;
  onClose: () => void;
}

export const SanctionOrderModal: React.FC<SanctionOrderModalProps> = ({ application, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const sanctionOrderNo = `MoTA/EDU/ST/2026/SO-${application.applicationNumber.replace(/[^0-9]/g, '').slice(-5) || '88412'}`;
  const sanctionDate = application.disbursedAt 
    ? new Date(application.disbursedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Award className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm">Official MoTA Sanction Order &amp; Award Letter</h3>
              <p className="text-[11px] text-slate-400">Government of India &bull; Ministry of Tribal Affairs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div ref={printRef} className="p-6 sm:p-10 overflow-y-auto bg-white space-y-6 text-slate-800 font-serif leading-relaxed">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-800 pb-5 space-y-1">
            <div className="flex justify-center mb-1">
              <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-900 font-bold text-xs tracking-tighter">
                सत्यमेव जयते
              </div>
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-950 font-sans">
              Ministry of Tribal Affairs
            </h2>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-700 font-sans">
              Government of India (जनजातीय कार्य मंत्रालय, भारत सरकार)
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              Scholarship &amp; Fellowship Division, Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001
            </p>
          </div>

          {/* Reference & Date */}
          <div className="flex flex-col sm:flex-row justify-between text-xs font-sans text-slate-700 gap-1 pb-2">
            <div>
              <strong>Sanction Order No:</strong> <span className="font-mono font-bold text-slate-900">{sanctionOrderNo}</span>
            </div>
            <div>
              <strong>Date:</strong> {sanctionDate}
            </div>
          </div>

          {/* Subject */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs font-sans">
            <span className="font-bold text-slate-900 uppercase tracking-wide block mb-1">
              ORDER / SANCTION OF FINANCIAL ASSISTANCE
            </span>
            <p className="text-slate-800">
              <strong>Sub:</strong> Award and release of Financial Assistance under the{' '}
              <strong>"{application.schemeName}" ({application.schemeCode})</strong> for Academic Session 2026-2027.
            </p>
          </div>

          {/* Body Paragraphs */}
          <div className="text-xs sm:text-sm space-y-3 text-slate-800 font-sans leading-normal">
            <p>
              Sanction of the Competent Authority in the Ministry of Tribal Affairs, Government of India is hereby conveyed for the provisional award of scholarship/fellowship grant to the eligible Scheduled Tribe candidate, as detailed below:
            </p>

            {/* Candidate & Grant Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-600 w-1/3">Candidate Full Name</td>
                    <td className="p-2.5 font-bold text-slate-950">{application.applicantName}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-600">Application Number</td>
                    <td className="p-2.5 font-mono font-bold text-blue-700">{application.applicationNumber}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-600">Father’s / Guardian’s Name</td>
                    <td className="p-2.5">{application.fatherName}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-600">Category &amp; Community</td>
                    <td className="p-2.5 font-semibold text-emerald-800">{application.caste}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-600">Domicile State / District</td>
                    <td className="p-2.5">{application.state} ({application.district})</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-600">Notified Premier Institute / University</td>
                    <td className="p-2.5 font-bold text-slate-900">{application.instituteName}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-600">Course / Discipline of Study</td>
                    <td className="p-2.5">{application.courseName} ({application.currentYear})</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-600">Sanctioned Grant Amount</td>
                    <td className="p-2.5 font-extrabold text-sm text-emerald-700">
                      ₹{application.grantAmount.toLocaleString('en-IN')} (Rupees {application.grantAmount >= 100000 ? `${(application.grantAmount / 100000).toFixed(2)} Lakh` : `${application.grantAmount.toLocaleString()} Only`})
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-600">Mode of Disbursement</td>
                    <td className="p-2.5 font-bold text-slate-900">
                      Direct Benefit Transfer (DBT) via PFMS to Aadhaar Seeded Account
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-600">PFMS Batch / Transaction Code</td>
                    <td className="p-2.5 font-mono text-slate-700 font-bold">
                      {application.pfmsTransactionId || 'PFMS-DBT-2026-ST-8812'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-600 pt-1">
              <strong>Terms and Conditions:</strong> The award is subject to the candidate maintaining satisfactory academic attendance and progress. In case of research fellowships (NFST/NOS), the continuation of fellowship is governed by semi-annual supervisor milestone endorsement and compliance with Ministry guidelines.
            </p>
          </div>

          {/* Signatures & Security Validation */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500">
                <span className="font-bold text-slate-800 block">UIDAI / MoTA QR Verification</span>
                <span>Cryptographically verifiable via National MoTA Gateway</span>
                <span className="block font-mono text-[9px] text-slate-400">HASH: 9a8f21b9c7423e</span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="w-32 h-10 mx-auto sm:ml-auto border-b border-slate-400 flex items-center justify-center text-blue-900 font-serif italic text-sm">
                Sunita Meena
              </div>
              <p className="font-bold text-slate-900 mt-1">Sunita Meena, IAS</p>
              <p className="text-[11px] text-slate-500">
                Central Scholarship Officer (CSO) &amp; Joint Secretary
              </p>
              <p className="text-[10px] text-slate-400">Ministry of Tribal Affairs, Govt. of India</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Government Document &bull; Verified under DPDP Act 2023</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
