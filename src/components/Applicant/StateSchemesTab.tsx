import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Calendar, 
  ArrowRight, 
  Building2, 
  Filter 
} from 'lucide-react';
import { usePortalData } from '../../context/PortalDataContext';
import { useAuth } from '../../context/AuthContext';
import { ScholarshipScheme } from '../../types';
import { ApplySchemeModal } from './ApplySchemeModal';

interface StateSchemesTabProps {
  onApplicationSubmitted?: (appId: string) => void;
}

export const StateSchemesTab: React.FC<StateSchemesTabProps> = ({ onApplicationSubmitted }) => {
  const { schemes } = usePortalData();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');
  const [selectedScheme, setSelectedScheme] = useState<ScholarshipScheme | null>(null);

  // Filter only state schemes
  const stateSchemes = schemes.filter((s) => s.level === 'STATE');

  const availableStates = Array.from(
    new Set(stateSchemes.map((s) => s.state).filter(Boolean) as string[])
  );

  const filteredSchemes = stateSchemes.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      (s.state && s.state.toLowerCase().includes(q));

    const matchesState = selectedStateFilter === 'ALL' || s.state === selectedStateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              State-Specific Scholarship Schemes
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Scholarship programmes managed directly by State Welfare Departments (e-Kalyan, PRERANA, MPTAAS, etc.)
          </p>
        </div>

        {/* State Filter & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
          >
            <option value="ALL">All States ({availableStates.length})</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>
                {st} {currentUser?.assignedState === st ? '(Your State)' : ''}
              </option>
            ))}
          </select>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search state scheme..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* State Badge Alert */}
      {currentUser?.assignedState && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>
              Your Registered Domicile State:{' '}
              <strong>{currentUser.assignedState}</strong>. Schemes matching your state will receive priority routing to your State Verifier.
            </span>
          </span>
          <button
            onClick={() => setSelectedStateFilter(currentUser.assignedState || 'ALL')}
            className="px-2.5 py-1 text-[11px] font-bold bg-white text-amber-800 rounded border border-amber-300 hover:bg-amber-100"
          >
            Filter for {currentUser.assignedState}
          </button>
        </div>
      )}

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => {
          const isMyState = scheme.state === currentUser?.assignedState;
          return (
            <div
              key={scheme.id}
              className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group ${
                isMyState ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200'
              }`}
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {scheme.state} State
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{scheme.code}</span>
                  </div>
                  {isMyState && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Domicile Match
                    </span>
                  )}
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
                    <span className="font-extrabold text-amber-700 text-sm">
                      ₹{scheme.grantAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/ academic year</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Max Income Limit</span>
                    <span className="font-bold text-slate-800 text-xs">
                      &lt; ₹{(scheme.incomeLimit / 100000).toFixed(1)} Lakh/yr
                    </span>
                    <span className="text-[10px] text-slate-500 block">State Domicile Mandatory</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="mt-4 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Eligibility:</span>
                  {scheme.categoryEligibility.map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  <span>Deadline: <strong>{new Date(scheme.deadline).toLocaleDateString()}</strong></span>
                </div>

                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
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
    </div>
  );
};
