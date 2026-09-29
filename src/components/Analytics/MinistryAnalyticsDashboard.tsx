import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Coins, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  GraduationCap, 
  Globe2,
  PieChart
} from 'lucide-react';
import { usePortalData } from '../../context/PortalDataContext';

export const MinistryAnalyticsDashboard: React.FC = () => {
  const { schemes, applications, auditLogs, fellowships } = usePortalData();

  const totalFunds = applications
    .filter((a) => a.status === 'SCHOLARSHIP_RELEASED')
    .reduce((sum, a) => sum + a.grantAmount, 0);

  const pendingFunds = applications
    .filter((a) => a.status === 'COMMITTEE_APPROVED')
    .reduce((sum, a) => sum + a.grantAmount, 0);

  const stateStats = [
    { state: 'Jharkhand', applicants: 14200, budget: '₹48.2 Cr', quotaUtilization: '92%' },
    { state: 'Odisha', applicants: 11800, budget: '₹39.5 Cr', quotaUtilization: '88%' },
    { state: 'Madhya Pradesh', applicants: 18500, budget: '₹62.1 Cr', quotaUtilization: '95%' },
    { state: 'Chhattisgarh', applicants: 10400, budget: '₹34.8 Cr', quotaUtilization: '86%' },
    { state: 'Assam & NE', applicants: 12900, budget: '₹41.3 Cr', quotaUtilization: '89%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              Ministry Analytics &amp; Scheme Performance Dashboard
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monitoring for MoTA administrators: application throughput, verification Turnaround Time (TAT), quota consumption, and DBT fund releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Academic Year 2026-27 Progress</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disbursed DBT Volume</p>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">₹{totalFunds.toLocaleString()}</h3>
          <span className="text-[11px] text-emerald-600 font-medium">Credited to Aadhaar Accounts</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved Awaiting DBT</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">₹{pendingFunds.toLocaleString()}</h3>
          <span className="text-[11px] text-slate-500">In Officer Release Pool</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Verification TAT</p>
          <h3 className="text-2xl font-extrabold text-blue-700 mt-1">3.4 Days</h3>
          <span className="text-[11px] text-emerald-600 font-medium">&darr; 64% faster with AI Scrutiny</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">72h Deficiency Resolution</p>
          <h3 className="text-2xl font-extrabold text-purple-700 mt-1">91.8%</h3>
          <span className="text-[11px] text-slate-500">Scholars Re-uploaded on time</span>
        </div>
      </div>

      {/* Scheme Quota Utilization & State Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flagship Schemes Quota Consumption */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-purple-600" />
              <span>Flagship Central Quota Consumption</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">Allotted Slots</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* NFST */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>National Fellowship for ST (NFST Ph.D. / M.Phil)</span>
                <span className="text-purple-700">566 / 750 Slots (75.5%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '75.5%' }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Stipend: ₹31k-35k/month + contingency</span>
            </div>

            {/* NOS */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>National Overseas Scholarship (NOS Abroad Top 500)</span>
                <span className="text-blue-700">93 / 125 Slots (74.4%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '74.4%' }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Full tuition + USD 15,400 allowance</span>
            </div>

            {/* Top Class */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Top Class Institutions (IITs/IIMs/NITs/AIIMS)</span>
                <span className="text-emerald-700">3,310 / 4,200 Slots (78.8%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '78.8%' }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Course reimbursement + living + laptop</span>
            </div>
          </div>
        </div>

        {/* State Tribal Welfare Allocation Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>State Tribal Welfare Allocation &amp; Quota Progress</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">75:25 Co-Funding</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                  <th className="p-2.5">State Jurisdiction</th>
                  <th className="p-2.5">Beneficiaries</th>
                  <th className="p-2.5">DBT Outlay</th>
                  <th className="p-2.5">Quota Utilized</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stateStats.map((st, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{st.state}</td>
                    <td className="p-2.5 text-slate-600">{st.applicants.toLocaleString()}</td>
                    <td className="p-2.5 font-bold text-emerald-700">{st.budget}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-700">
                        {st.quotaUtilization}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
