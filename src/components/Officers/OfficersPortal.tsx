import React, { useState } from 'react';
import { 
  Send, 
  PlusCircle, 
  Coins, 
  CheckCircle2, 
  Users, 
  Building2, 
  Calendar, 
  Layers, 
  Filter, 
  Smartphone, 
  Mail, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Search,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
import { ScholarshipScheme, Application } from '../../types';

interface OfficersPortalProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
}

export const OfficersPortal: React.FC<OfficersPortalProps> = ({ currentTab, onTabChange }) => {
  const { currentUser, activeRole } = useAuth();
  const { schemes, applications, createScheme, disburseScholarshipsBatch, updateSchemeStatus } = usePortalData();

  const isStateOfficer = activeRole === 'SSO';
  const officerState = currentUser?.assignedState;

  // Filter schemes based on officer role
  const relevantSchemes = schemes.filter((s) => {
    if (isStateOfficer) {
      return s.level === 'STATE' && (!officerState || s.state === officerState);
    }
    return s.level === 'CENTRAL';
  });

  // Filter applications ready for release (Status: COMMITTEE_APPROVED)
  const readyForReleaseApps = applications.filter((a) => {
    if (a.status !== 'COMMITTEE_APPROVED') return false;
    if (isStateOfficer) {
      return a.schemeLevel === 'STATE' && (!officerState || a.state === officerState);
    }
    return a.schemeLevel === 'CENTRAL';
  });

  // Already disbursed apps
  const disbursedApps = applications.filter((a) => {
    if (a.status !== 'SCHOLARSHIP_RELEASED') return false;
    if (isStateOfficer) {
      return a.schemeLevel === 'STATE' && (!officerState || a.state === officerState);
    }
    return a.schemeLevel === 'CENTRAL';
  });

  // Selected apps for batch disbursement
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [disbursementSuccessModal, setDisbursementSuccessModal] = useState<{
    count: number;
    totalAmount: number;
    batchId: string;
    dispatchedNotice: { name: string; phone: string; email: string; message: string };
  } | null>(null);

  // New Scheme Form State
  const [schemeName, setSchemeName] = useState('');
  const [schemeCode, setSchemeCode] = useState('');
  const [grantAmount, setGrantAmount] = useState<number>(30000);
  const [incomeLimit, setIncomeLimit] = useState<number>(250000);
  const [slotsTotal, setSlotsTotal] = useState<number>(5000);
  const [deadline, setDeadline] = useState('2026-12-31');
  const [schemeDescription, setSchemeDescription] = useState('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppIds(readyForReleaseApps.map((a) => a.id));
    } else {
      setSelectedAppIds([]);
    }
  };

  const handleToggleApp = (id: string) => {
    setSelectedAppIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Trigger Disbursement and Automated Real-Time Notifications
  const handleTriggerDisbursement = (appIdsToDisburse: string[]) => {
    if (appIdsToDisburse.length === 0) return;

    const targets = readyForReleaseApps.filter((a) => appIdsToDisburse.includes(a.id));
    const totalAmount = targets.reduce((sum, a) => sum + a.grantAmount, 0);
    const batchId = `PFMS-DBT-${Date.now().toString().slice(-6)}`;

    disburseScholarshipsBatch(appIdsToDisburse, batchId);
    setSelectedAppIds([]);

    const targetRecipient = targets[0];
    setDisbursementSuccessModal({
      count: targets.length,
      totalAmount,
      batchId,
      dispatchedNotice: {
        name: targetRecipient?.applicantName || 'Applicant',
        phone: targetRecipient?.applicantMobile || '+91 98765 43210',
        email: targetRecipient?.applicantEmail || 'applicant@student.ac.in',
        message: `Congratulations ${targetRecipient?.applicantName}! Your scholarship grant of ₹${targetRecipient?.grantAmount.toLocaleString()} has been released directly via PFMS DBT to your bank account. Batch ID: ${batchId}.`,
      },
    });
  };

  const handleCreateSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeName || !schemeCode) return;

    createScheme({
      code: schemeCode.toUpperCase().trim(),
      name: schemeName.trim(),
      level: isStateOfficer ? 'STATE' : 'CENTRAL',
      ministryOrDept: isStateOfficer
        ? `Welfare Department, Govt. of ${officerState || 'State'}`
        : 'Ministry of Tribal Affairs, Govt. of India',
      state: isStateOfficer ? officerState || 'Jharkhand' : undefined,
      academicYear: '2026-2027',
      grantAmount: Number(grantAmount),
      incomeLimit: Number(incomeLimit),
      categoryEligibility: ['ST', 'SC', 'OBC'],
      educationLevels: ['Undergraduate', 'Postgraduate', 'Technical'],
      deadline,
      requiredDocuments: ['Domicile Certificate', 'Income Certificate', 'Caste Certificate', 'Academic Marksheet'],
      slotsTotal: Number(slotsTotal),
      description: schemeDescription || 'Government scholarship scheme for empowering students.',
      isActive: true,
      publishedBy: currentUser?.fullName || 'Scholarship Officer',
    });

    setShowCreateModal(false);
    setSchemeName('');
    setSchemeCode('');
  };

  return (
    <div className="space-y-6">
      {/* Top Officer Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Coins className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              {isStateOfficer
                ? `State Scholarship Officer (SSO) — ${officerState || 'State'} Jurisdiction`
                : 'Central Scholarship Officer (CSO) — National Apex Portal'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Primary functions: Release & disbursement of scholarships, automated notification triggers, and schemes lifecycle management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Scheme</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ready for Release</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
            {readyForReleaseApps.length} Candidates
          </h3>
          <span className="text-[11px] text-slate-500">Certified &amp; Committee-Approved</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disbursement Queue Value</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹
            {readyForReleaseApps
              .reduce((sum, a) => sum + a.grantAmount, 0)
              .toLocaleString()}
          </h3>
          <span className="text-[11px] text-amber-600 font-medium">Pending Officer Release</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Disbursed Funds</p>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
            ₹
            {disbursedApps
              .reduce((sum, a) => sum + a.grantAmount, 0)
              .toLocaleString()}
          </h3>
          <span className="text-[11px] text-emerald-600 font-medium">{disbursedApps.length} Disbursed Batches</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Managed Schemes</p>
          <h3 className="text-2xl font-extrabold text-blue-700 mt-1">{relevantSchemes.length}</h3>
          <span className="text-[11px] text-slate-500">Under Officer Management</span>
        </div>
      </div>

      {/* Main Tabs: Schemes vs Disbursement Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Bar inside Officer Module */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('disbursement_queue')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'disbursement_queue' || currentTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Scholarship Disbursement Queue ({readyForReleaseApps.length})</span>
            </button>

            <button
              onClick={() => onTabChange('manage_schemes')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'manage_schemes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Schemes Management ({relevantSchemes.length})</span>
            </button>

            <button
              onClick={() => onTabChange('disbursed_history')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'disbursed_history'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Disbursed History ({disbursedApps.length})</span>
            </button>
          </div>

          {readyForReleaseApps.length > 0 && (currentTab === 'disbursement_queue' || currentTab === 'dashboard') && (
            <button
              onClick={() => handleTriggerDisbursement(selectedAppIds.length ? selectedAppIds : readyForReleaseApps.map((a) => a.id))}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 animate-pulse"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                Trigger DBT Release ({selectedAppIds.length || readyForReleaseApps.length} Candidates)
              </span>
            </button>
          )}
        </div>

        {/* View 1: Disbursement Queue */}
        {(currentTab === 'disbursement_queue' || currentTab === 'dashboard') && (
          <div className="p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Finalized Candidates Awaiting Scholarship Release
                </h3>
                <p className="text-xs text-slate-500">
                  These applications have passed Verifier Document Certification &amp; Selection Committee Merit Screening. Clicking Release triggers instant automated SMS/Email alerts to the students and creates the PFMS DBT batch.
                </p>
              </div>
            </div>

            {readyForReleaseApps.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="font-bold text-slate-700">All Certified Candidates Have Been Disbursed!</p>
                <p className="mt-1">New candidates will appear here as soon as the Selection Committee approves awards.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                      <th className="p-3 w-10">
                        <input
                          type="checkbox"
                          checked={selectedAppIds.length === readyForReleaseApps.length && readyForReleaseApps.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded text-blue-600"
                        />
                      </th>
                      <th className="p-3">App Number</th>
                      <th className="p-3">Applicant &amp; Caste</th>
                      <th className="p-3">Scheme Name</th>
                      <th className="p-3">Grant Amount</th>
                      <th className="p-3">Merit Score</th>
                      <th className="p-3">Approved By SCM</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {readyForReleaseApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedAppIds.includes(app.id)}
                            onChange={() => handleToggleApp(app.id)}
                            className="rounded text-blue-600"
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-blue-700">
                          {app.applicationNumber}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{app.applicantName}</div>
                          <div className="text-[11px] text-slate-500">{app.caste} &bull; {app.state}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-800">{app.schemeName}</div>
                          <div className="text-[11px] text-slate-500">{app.instituteName}</div>
                        </td>
                        <td className="p-3 font-extrabold text-emerald-700 text-sm">
                          ₹{app.grantAmount.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {app.meritScore ? `${app.meritScore}%` : 'Approved'}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-600">
                          {app.awardedByCommitteeMemberName || 'Selection Committee'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleTriggerDisbursement([app.id])}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1 ml-auto"
                          >
                            <Send className="w-3 h-3" />
                            <span>Release DBT</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* View 2: Schemes Management */}
        {currentTab === 'manage_schemes' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Active &amp; Published Scholarship Schemes</h3>
              <span className="text-xs text-slate-500">{relevantSchemes.length} Schemes Published</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relevantSchemes.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                        {s.code}
                      </span>
                      <button
                        onClick={() => updateSchemeStatus(s.id, !s.isActive)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {s.isActive ? 'Active & Receiving Apps' : 'Inactive'}
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{s.ministryOrDept}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Grant</span>
                        <strong className="text-blue-700">₹{s.grantAmount.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Income Limit</span>
                        <strong>&lt; ₹{s.incomeLimit.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
                    <span>{s.slotsRemaining?.toLocaleString()} slots remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 3: Disbursed History */}
        {currentTab === 'disbursed_history' && (
          <div className="p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Released Scholarship Grants &amp; PFMS Transaction Log
            </h3>
            {disbursedApps.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">No disbursements recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                      <th className="p-3">App Number</th>
                      <th className="p-3">Beneficiary</th>
                      <th className="p-3">Scheme</th>
                      <th className="p-3">Amount Released</th>
                      <th className="p-3">PFMS Transaction ID</th>
                      <th className="p-3">Disbursed Date</th>
                      <th className="p-3">Disbursing Officer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {disbursedApps.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-700">{a.applicationNumber}</td>
                        <td className="p-3 font-semibold text-slate-900">{a.applicantName}</td>
                        <td className="p-3 text-slate-600">{a.schemeName}</td>
                        <td className="p-3 font-extrabold text-emerald-700">₹{a.grantAmount.toLocaleString()}</td>
                        <td className="p-3 font-mono text-slate-800">{a.pfmsTransactionId}</td>
                        <td className="p-3 text-slate-500">{new Date(a.disbursedAt || '').toLocaleDateString()}</td>
                        <td className="p-3 text-slate-600">{a.disbursedByOfficerName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create New Scheme Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Create &amp; Publish New {isStateOfficer ? 'State' : 'Central'} Scholarship Scheme
                </h3>
                <p className="text-xs text-slate-500">
                  {isStateOfficer ? `Governed by ${officerState || 'State'} Welfare Department` : 'Ministry of Tribal Affairs Central Sector'}
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchemeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Scheme Title *</label>
                <input
                  type="text"
                  value={schemeName}
                  onChange={(e) => setSchemeName(e.target.value)}
                  placeholder="e.g. Higher Technical Study Scholarship for ST Youth 2026"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheme Code *</label>
                  <input
                    type="text"
                    value={schemeCode}
                    onChange={(e) => setSchemeCode(e.target.value)}
                    placeholder="e.g. HTS-ST-2026"
                    className="w-full px-3 py-2 border rounded-lg uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual Grant Amount (₹) *</label>
                  <input
                    type="number"
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Maximum Family Income Limit (₹)</label>
                  <input
                    type="number"
                    value={incomeLimit}
                    onChange={(e) => setIncomeLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Available Quota Slots</label>
                  <input
                    type="number"
                    value={slotsTotal}
                    onChange={(e) => setSlotsTotal(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scheme Description</label>
                <textarea
                  value={schemeDescription}
                  onChange={(e) => setSchemeDescription(e.target.value)}
                  rows={3}
                  placeholder="Provide scheme objectives, target student beneficiaries, and allowance breakdown..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Publish Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Automated Real-Time Notification & Disbursement Success Modal */}
      {disbursementSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Scholarship Disbursement Triggered Successfully!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                PFMS Direct Benefit Transfer (DBT) instruction recorded &amp; Automated Notifications Dispatched
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiaries Disbursed:</span>
                <strong>{disbursementSuccessModal.count} Student(s)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Funds Released:</span>
                <strong className="text-emerald-700 text-sm">
                  ₹{disbursementSuccessModal.totalAmount.toLocaleString()}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PFMS Batch Reference:</span>
                <span className="font-mono font-bold text-slate-800">{disbursementSuccessModal.batchId}</span>
              </div>
            </div>

            {/* AUTOMATED NOTIFICATION AUDIT RECEIPT */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Real-Time Automated Alert Dispatched:</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  SMS &amp; Email Sent
                </span>
              </div>
              <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded border border-blue-100">
                <p><strong>To:</strong> {disbursementSuccessModal.dispatchedNotice.name} ({disbursementSuccessModal.dispatchedNotice.phone} / {disbursementSuccessModal.dispatchedNotice.email})</p>
                <p className="mt-1 italic text-slate-600">"{disbursementSuccessModal.dispatchedNotice.message}"</p>
              </div>
            </div>

            <button
              onClick={() => setDisbursementSuccessModal(null)}
              className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              Close &amp; Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
