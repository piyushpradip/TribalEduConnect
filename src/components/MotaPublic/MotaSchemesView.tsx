import React, { useState } from 'react';
import { 
  Layers, 
  FileText, 
  Download, 
  CheckCircle2, 
  Building2, 
  IndianRupee, 
  GraduationCap, 
  Globe2, 
  ArrowRight,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { MOTA_OFFICIAL_SCHEMES } from '../../mock/motaOfficialData';
import { useAuth } from '../../context/AuthContext';
import { ScholarshipScheme } from '../../types';
import { SchemeDetailDrawer } from './SchemeDetailDrawer';

interface MotaSchemesViewProps {
  onApplyScheme?: (scheme: ScholarshipScheme) => void;
  onOpenAuth?: () => void;
}

export const MotaSchemesView: React.FC<MotaSchemesViewProps> = ({ 
  onApplyScheme, 
  onOpenAuth 
}) => {
  const { currentUser } = useAuth();
  const [selectedScheme, setSelectedScheme] = useState<ScholarshipScheme | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredSchemes = MOTA_OFFICIAL_SCHEMES.filter(s => {
    if (filterType === 'CENTRAL_SECTOR') return s.fundingCategory === 'Central Sector Scheme';
    if (filterType === 'CENTRALLY_SPONSORED') return s.fundingCategory === 'Centrally Sponsored Scheme';
    if (filterType === 'FELLOWSHIP') return s.schemeType === 'FELLOWSHIP' || s.schemeType === 'OVERSEAS';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Filter Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
            Flagship Schemes
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-serif">
            MoTA Scholarship &amp; Fellowship Schemes (DBT)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            5 Officially Notified Schemes implemented by the Ministry of Tribal Affairs for Scheduled Tribe students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'ALL'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 5 Schemes
          </button>
          <button
            onClick={() => setFilterType('CENTRAL_SECTOR')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'CENTRAL_SECTOR'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Central Sector (100%)
          </button>
          <button
            onClick={() => setFilterType('CENTRALLY_SPONSORED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'CENTRALLY_SPONSORED'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Centrally Sponsored (75:25)
          </button>
          <button
            onClick={() => setFilterType('FELLOWSHIP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'FELLOWSHIP'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            NFST &amp; NOS Research
          </button>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.code}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Left Accent Header */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 lg:w-80 flex-shrink-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono font-black text-sm px-2.5 py-1 bg-white/20 rounded-md text-blue-200 border border-white/10">
                    CODE: {scheme.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/30">
                    {scheme.benefitType || 'In Cash'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-serif leading-snug">
                  {scheme.name}
                </h3>
                <p className="text-[11px] text-blue-200/80 mt-1">
                  {scheme.fundingCategory}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200/70">Grant / Stipend:</span>
                  <strong className="text-emerald-400 font-mono text-sm">
                    {scheme.grantAmount > 100000 
                      ? `Up to ₹${(scheme.grantAmount / 100000).toFixed(1)} Lakh/yr` 
                      : `₹${scheme.grantAmount.toLocaleString()}/yr`}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200/70">Income Ceiling:</span>
                  <strong className="text-white">
                    {scheme.incomeLimit >= 9000000 ? 'No Ceiling' : `₹${(scheme.incomeLimit / 100000).toFixed(1)} Lakh`}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200/70">Deadline:</span>
                  <strong className="text-amber-300 font-mono text-xs">{scheme.deadline}</strong>
                </div>
              </div>
            </div>

            {/* Right Detailed Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <p className="text-xs text-slate-700 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Key Tags / Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Eligible Education Levels
                    </span>
                    <ul className="text-[11px] text-slate-700 space-y-0.5">
                      {scheme.educationLevels.map((lvl, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span>{lvl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Mandatory Documentation Required
                    </span>
                    <ul className="text-[11px] text-slate-700 space-y-0.5">
                      {scheme.requiredDocuments.slice(0, 3).map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                          <span className="truncate">{doc}</span>
                        </li>
                      ))}
                      {scheme.requiredDocuments.length > 3 && (
                        <li className="text-[10px] text-blue-600 font-semibold pl-3">
                          + {scheme.requiredDocuments.length - 3} more certificates
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {scheme.guidelineDocumentTitle && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50/60 border border-blue-100 rounded-lg text-[11px] text-blue-900">
                    <FileText className="w-4 h-4 text-blue-700 flex-shrink-0" />
                    <span className="truncate font-medium">{scheme.guidelineDocumentTitle}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Disbursed via PFMS DBT</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Portal Open for FY 2026-27</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedScheme(scheme)}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md text-xs border border-slate-300 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-indigo-900" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => {
                      if (currentUser) {
                        if (onApplyScheme) onApplyScheme(scheme);
                      } else {
                        if (onOpenAuth) onOpenAuth();
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1D0A69] hover:bg-[#130649] text-white font-bold rounded-md text-xs shadow-xs transition-all"
                  >
                    <span>Apply Online</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Detail Gazette Drawer */}
      {selectedScheme && (
        <SchemeDetailDrawer
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          onApply={(sch) => {
            if (currentUser) {
              if (onApplyScheme) onApplyScheme(sch);
            } else {
              if (onOpenAuth) onOpenAuth();
            }
          }}
        />
      )}
    </div>
  );
};
