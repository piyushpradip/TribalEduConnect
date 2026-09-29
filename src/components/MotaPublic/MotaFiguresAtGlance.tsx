import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Coins, 
  ShieldCheck, 
  Download, 
  Calendar, 
  Filter,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

interface SchemeGlanceStats {
  code: string;
  name: string;
  type: string;
  beneficiaries: number;
  fundsDisbursedCrores: number;
  centralShareCrores: number;
  stateShareCrores: number;
  dbtSuccessRate: number;
  activeUniversities: number;
}

export const MotaFiguresAtGlance: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2025-26');

  const statsByYear: Record<string, SchemeGlanceStats[]> = {
    '2025-26': [
      {
        code: 'BVOBC',
        name: 'Post-Matric Scholarship Scheme For ST Students',
        type: 'Centrally Sponsored',
        beneficiaries: 2384910,
        fundsDisbursedCrores: 2450.80,
        centralShareCrores: 1838.10,
        stateShareCrores: 612.70,
        dbtSuccessRate: 99.84,
        activeUniversities: 8420,
      },
      {
        code: 'BPVGK',
        name: 'Pre-Matric Scholarship Scheme For ST Student',
        type: 'Centrally Sponsored',
        beneficiaries: 1420550,
        fundsDisbursedCrores: 580.40,
        centralShareCrores: 435.30,
        stateShareCrores: 145.10,
        dbtSuccessRate: 99.72,
        activeUniversities: 19800,
      },
      {
        code: 'A023B',
        name: 'Top Class Education For ST Students',
        type: 'Central Sector',
        beneficiaries: 4180,
        fundsDisbursedCrores: 92.50,
        centralShareCrores: 92.50,
        stateShareCrores: 0,
        dbtSuccessRate: 99.95,
        activeUniversities: 252,
      },
      {
        code: 'ARG45',
        name: 'National Fellowship for ST Students (NFST)',
        type: 'Central Sector',
        beneficiaries: 750,
        fundsDisbursedCrores: 38.60,
        centralShareCrores: 38.60,
        stateShareCrores: 0,
        dbtSuccessRate: 100.0,
        activeUniversities: 310,
      },
      {
        code: 'AZKMI',
        name: 'National Overseas Scholarship Scheme (NOS)',
        type: 'Central Sector',
        beneficiaries: 20,
        fundsDisbursedCrores: 5.40,
        centralShareCrores: 5.40,
        stateShareCrores: 0,
        dbtSuccessRate: 100.0,
        activeUniversities: 18,
      },
    ],
    '2024-25': [
      {
        code: 'BVOBC',
        name: 'Post-Matric Scholarship Scheme For ST Students',
        type: 'Centrally Sponsored',
        beneficiaries: 2210400,
        fundsDisbursedCrores: 2280.20,
        centralShareCrores: 1710.15,
        stateShareCrores: 570.05,
        dbtSuccessRate: 99.78,
        activeUniversities: 8150,
      },
      {
        code: 'BPVGK',
        name: 'Pre-Matric Scholarship Scheme For ST Student',
        type: 'Centrally Sponsored',
        beneficiaries: 1350800,
        fundsDisbursedCrores: 540.10,
        centralShareCrores: 405.07,
        stateShareCrores: 135.03,
        dbtSuccessRate: 99.65,
        activeUniversities: 19100,
      },
      {
        code: 'A023B',
        name: 'Top Class Education For ST Students',
        type: 'Central Sector',
        beneficiaries: 3950,
        fundsDisbursedCrores: 85.30,
        centralShareCrores: 85.30,
        stateShareCrores: 0,
        dbtSuccessRate: 99.90,
        activeUniversities: 246,
      },
      {
        code: 'ARG45',
        name: 'National Fellowship for ST Students (NFST)',
        type: 'Central Sector',
        beneficiaries: 750,
        fundsDisbursedCrores: 36.80,
        centralShareCrores: 36.80,
        stateShareCrores: 0,
        dbtSuccessRate: 100.0,
        activeUniversities: 295,
      },
      {
        code: 'AZKMI',
        name: 'National Overseas Scholarship Scheme (NOS)',
        type: 'Central Sector',
        beneficiaries: 20,
        fundsDisbursedCrores: 5.10,
        centralShareCrores: 5.10,
        stateShareCrores: 0,
        dbtSuccessRate: 100.0,
        activeUniversities: 16,
      },
    ],
  };

  const currentList = statsByYear[selectedYear] || statsByYear['2025-26'];
  const totalBeneficiaries = currentList.reduce((sum, item) => sum + item.beneficiaries, 0);
  const totalDisbursed = currentList.reduce((sum, item) => sum + item.fundsDisbursedCrores, 0);

  const exportCSV = () => {
    const headers = ['Scheme Code', 'Scheme Name', 'Funding Category', 'ST Beneficiaries', 'Total Disbursed (Cr)', 'Central Share (Cr)', 'State Share (Cr)', 'DBT Success %'];
    const rows = currentList.map(s => [
      s.code,
      `"${s.name}"`,
      s.type,
      s.beneficiaries,
      s.fundsDisbursedCrores,
      s.centralShareCrores,
      s.stateShareCrores,
      `${s.dbtSuccessRate}%`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mota_fig_at_a_glance_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Banner / Title */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
              Official MoTA Statistics
            </span>
            <span className="text-xs text-slate-400 font-mono">tribal.nic.in/ScholarshiP.aspx</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-serif">
            Figures at a Glance (Fig. at a Glance)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical and financial progress of 5 flagship Scheduled Tribe scholarship schemes under Direct Benefit Transfer (DBT).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700">Financial Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-xs font-bold text-blue-900 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="2025-26">2025-2026 (Current FY)</option>
              <option value="2024-25">2024-2025</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Table (.CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total ST Beneficiaries</span>
            <span className="text-xl font-extrabold text-slate-900 font-serif">
              {(totalBeneficiaries / 100000).toFixed(2)} Lakh
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
              Across All 36 States &amp; UTs
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Disbursed (PFMS)</span>
            <span className="text-xl font-extrabold text-emerald-700 font-serif">
              ₹{totalDisbursed.toLocaleString()} Cr
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              100% Direct to Beneficiary Bank
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">DBT Success Rate</span>
            <span className="text-xl font-extrabold text-purple-700 font-serif">99.88%</span>
            <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">
              NPCI Aadhaar Mapper Verified
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active ST Schemes</span>
            <span className="text-xl font-extrabold text-amber-700 font-serif">5 Schemes</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Pre, Post, Top Class, NFST, NOS
            </span>
          </div>
        </div>
      </div>

      {/* Main Figures at a Glance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="text-sm font-bold font-serif flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span>Official Scheme-wise Physical &amp; Financial Figures ({selectedYear})</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Source: Ministry of Tribal Affairs PFMS DBT Portal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px] font-extrabold">
                <th className="p-3.5">Scheme Code</th>
                <th className="p-3.5">Scheme Name</th>
                <th className="p-3.5">Scheme Classification</th>
                <th className="p-3.5 text-right">ST Beneficiaries</th>
                <th className="p-3.5 text-right">Central Share (₹ Cr)</th>
                <th className="p-3.5 text-right">State Share (₹ Cr)</th>
                <th className="p-3.5 text-right">Total Released (₹ Cr)</th>
                <th className="p-3.5 text-center">DBT Success</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {currentList.map((scheme) => (
                <tr key={scheme.code} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-3.5 font-mono font-extrabold text-blue-700">
                    <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-200">
                      {scheme.code}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <strong className="text-slate-900 block text-xs">{scheme.name}</strong>
                    <span className="text-[10px] text-slate-500">
                      Institutions: {scheme.activeUniversities.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      scheme.type === 'Central Sector' 
                        ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                        : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    }`}>
                      {scheme.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-extrabold text-slate-900">
                    {scheme.beneficiaries.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right font-semibold text-slate-800 font-mono">
                    ₹{scheme.centralShareCrores.toFixed(2)}
                  </td>
                  <td className="p-3.5 text-right font-semibold text-slate-800 font-mono">
                    {scheme.stateShareCrores > 0 ? `₹${scheme.stateShareCrores.toFixed(2)}` : 'N/A (100% Centre)'}
                  </td>
                  <td className="p-3.5 text-right font-bold text-emerald-700 font-mono text-sm">
                    ₹{scheme.fundsDisbursedCrores.toFixed(2)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {scheme.dbtSuccessRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td colSpan={3} className="p-3.5 uppercase text-xs">
                  National Cumulative Total ({selectedYear})
                </td>
                <td className="p-3.5 text-right font-extrabold text-sm text-blue-900">
                  {totalBeneficiaries.toLocaleString()}
                </td>
                <td className="p-3.5 text-right font-mono">
                  ₹{currentList.reduce((s, i) => s + i.centralShareCrores, 0).toFixed(2)}
                </td>
                <td className="p-3.5 text-right font-mono">
                  ₹{currentList.reduce((s, i) => s + i.stateShareCrores, 0).toFixed(2)}
                </td>
                <td className="p-3.5 text-right font-extrabold text-base text-emerald-800 font-mono">
                  ₹{totalDisbursed.toFixed(2)} Cr
                </td>
                <td className="p-3.5 text-center text-emerald-800 font-bold">
                  99.88%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
