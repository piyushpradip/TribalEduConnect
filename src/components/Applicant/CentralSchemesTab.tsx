import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Calendar, 
  IndianRupee, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Info,
  Sparkles
} from 'lucide-react';
import { usePortalData } from '../../context/PortalDataContext';
import { ScholarshipScheme } from '../../types';
import { ApplySchemeModal } from './ApplySchemeModal';

interface CentralSchemesTabProps {
  onApplicationSubmitted?: (appId: string) => void;
}

export const CentralSchemesTab: React.FC<CentralSchemesTabProps> = ({ onApplicationSubmitted }) => {
  const { schemes } = usePortalData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<ScholarshipScheme | null>(null);
  const [selectedDetailsScheme, setSelectedDetailsScheme] = useState<ScholarshipScheme | null>(null);

  // Filter only central schemes
  const centralSchemes = schemes.filter((s) => s.level === 'CENTRAL');

  const filteredSchemes = centralSchemes.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.ministryOrDept.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              Central & National Scholarship Schemes
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Government of India scholarship initiatives sponsored by the Ministry of Tribal Affairs (MoTA) and Ministry of Social Justice.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search national schemes..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
          >
            {/* Header of Scheme Card */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {scheme.code}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {scheme.slotsRemaining?.toLocaleString()} slots open
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                {scheme.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{scheme.ministryOrDept}</span>
              </p>

              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {scheme.description}
              </p>

              {/* Key Indicators */}
              <div className="grid grid-cols-2 gap-2 mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Grant Amount</span>
                  <span className="font-extrabold text-blue-700 text-sm">
                    ₹{scheme.grantAmount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/ academic year</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Income Ceiling</span>
                  <span className="font-bold text-slate-800 text-xs">
                    &lt; ₹{(scheme.incomeLimit / 100000).toFixed(1)} Lakh/yr
                  </span>
                  <span className="text-[10px] text-slate-500 block">Family Income</span>
                </div>
              </div>

              {/* Required Documents Tags */}
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Required Documents ({scheme.requiredDocuments.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {scheme.requiredDocuments.slice(0, 3).map((d, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                    >
                      {d}
                    </span>
                  ))}
                  {scheme.requiredDocuments.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold">
                      +{scheme.requiredDocuments.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>Deadline: <strong>{new Date(scheme.deadline).toLocaleDateString()}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDetailsScheme(scheme)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Guidelines
                </button>
                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Scheme Wizard Modal */}
      {selectedScheme && (
        <ApplySchemeModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          onSuccess={(appId) => {
            setSelectedScheme(null);
            if (onApplicationSubmitted) onApplicationSubmitted(appId);
          }}
        />
      )}

      {/* Guidelines Modal */}
      {selectedDetailsScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 px-2 py-0.5 rounded bg-blue-50">
                  {selectedDetailsScheme.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedDetailsScheme.name}</h3>
              </div>
              <button
                onClick={() => setSelectedDetailsScheme(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-3 max-h-96 overflow-y-auto">
              <p><strong>Description:</strong> {selectedDetailsScheme.description}</p>
              <div>
                <strong>Eligibility Criteria:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Category: {selectedDetailsScheme.categoryEligibility.join(', ')}</li>
                  <li>Education Levels: {selectedDetailsScheme.educationLevels.join(', ')}</li>
                  <li>Maximum Family Income: ₹{selectedDetailsScheme.incomeLimit.toLocaleString()} / year</li>
                  <li>Aadhaar-seeded bank account enabled for Direct Benefit Transfer (DBT).</li>
                </ul>
              </div>

              <div>
                <strong>Mandatory Documents:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {selectedDetailsScheme.requiredDocuments.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                onClick={() => setSelectedDetailsScheme(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = selectedDetailsScheme;
                  setSelectedDetailsScheme(null);
                  setSelectedScheme(s);
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
