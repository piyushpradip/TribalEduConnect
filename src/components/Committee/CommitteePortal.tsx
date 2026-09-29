import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  FileCheck2, 
  Coins, 
  GraduationCap, 
  User, 
  Sparkles, 
  Building2, 
  ArrowRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
import { Application } from '../../types';

interface CommitteePortalProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
}

export const CommitteePortal: React.FC<CommitteePortalProps> = ({ currentTab, onTabChange }) => {
  const { currentUser } = useAuth();
  const { applications, awardScholarship, rejectApplicationByCommittee } = usePortalData();

  // Certified apps ready for selection committee evaluation
  const certifiedApps = applications.filter((a) => a.status === 'VERIFIER_CERTIFIED');

  // Apps already awarded by committee
  const awardedApps = applications.filter((a) =>
    ['COMMITTEE_APPROVED', 'SCHOLARSHIP_RELEASED'].includes(a.status)
  );

  // Evaluation modal
  const [evaluatingApp, setEvaluatingApp] = useState<Application | null>(null);
  const [meritScore, setMeritScore] = useState<number>(88);
  const [committeeRemarks, setCommitteeRemarks] = useState(
    'Candidate verified with top merit ranking in ST-General category. Full award approved.'
  );
  const [awardSuccess, setAwardSuccess] = useState<string | null>(null);

  const openEvaluationModal = (app: Application) => {
    setEvaluatingApp(app);
    setMeritScore(Math.floor(75 + Math.random() * 20));
    setCommitteeRemarks(
      `Applicant demonstrates strong academic consistency and valid socio-economic criteria. Approved under Quota Tier 1.`
    );
    setAwardSuccess(null);
  };

  const handleAward = () => {
    if (!evaluatingApp) return;
    awardScholarship(evaluatingApp.id, Number(meritScore), committeeRemarks);
    setAwardSuccess(
      `Scholarship successfully awarded to ${evaluatingApp.applicantName} for ₹${evaluatingApp.grantAmount.toLocaleString()}! Queued for Officer release.`
    );
    setTimeout(() => {
      setEvaluatingApp(null);
    }, 1500);
  };

  const handleReject = () => {
    if (!evaluatingApp) return;
    const reason = prompt('Please enter the reason for committee rejection:');
    if (!reason) return;
    rejectApplicationByCommittee(evaluatingApp.id, reason);
    setEvaluatingApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              Selection Committee Member (SCM) Portal
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Primary function: Final screening &amp; merit evaluation of verifier-certified scholarship applications, quota ranking, and awarding scholarships.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
          {certifiedApps.length} Certified Candidate(s) Awaiting Award
        </span>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Final Screening</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{certifiedApps.length}</h3>
          <span className="text-[11px] text-slate-500">Verified by State/Central Verifiers</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Committee Awards</p>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{awardedApps.length}</h3>
          <span className="text-[11px] text-emerald-600 font-medium">Forwarded for Officer Release</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Committee Member</p>
          <h3 className="text-sm font-extrabold text-slate-900 mt-1">{currentUser?.fullName}</h3>
          <span className="text-[11px] text-slate-500">Apex Selection Panel</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('committee_queue')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'committee_queue' || currentTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certified Candidate Queue ({certifiedApps.length})</span>
            </button>

            <button
              onClick={() => onTabChange('awarded_list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'awarded_list'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Awarded Candidates Archive ({awardedApps.length})</span>
            </button>
          </div>
        </div>

        {/* View 1: Certified Candidate Queue */}
        {(currentTab === 'committee_queue' || currentTab === 'dashboard') && (
          <div className="p-6">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Verifier-Certified Applications Ready for Final Selection
                </h3>
                <p className="text-xs text-slate-500">
                  Every candidate listed below has had their Domicile, Income, and Academic certificates certified by an authorized Verifier. Review merit score and award the scholarship.
                </p>
              </div>
            </div>

            {certifiedApps.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="font-bold text-slate-700">All Certified Candidates Have Been Screened!</p>
                <p className="mt-1">New candidates will appear here as soon as State or Central Verifiers certify documents.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                      <th className="p-3">App Number</th>
                      <th className="p-3">Applicant &amp; Caste</th>
                      <th className="p-3">Scheme &amp; Level</th>
                      <th className="p-3">Grant Amount</th>
                      <th className="p-3">Certified By</th>
                      <th className="p-3">Verifier Remarks</th>
                      <th className="p-3 text-right">Committee Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {certifiedApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-700">
                          {app.applicationNumber}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{app.applicantName}</div>
                          <div className="text-[11px] text-slate-500">{app.caste} &bull; {app.state}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-800">{app.schemeName}</div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                            {app.schemeLevel}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-emerald-700 text-sm">
                          ₹{app.grantAmount.toLocaleString()}
                        </td>
                        <td className="p-3 text-[11px] text-slate-600">
                          {app.certifiedByVerifierName || 'Verified'}
                        </td>
                        <td className="p-3 text-[11px] text-slate-600 italic max-w-xs truncate">
                          "{app.verifierNotes}"
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => openEvaluationModal(app)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors inline-flex items-center gap-1"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Award Scholarship</span>
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

        {/* View 2: Awarded Candidates */}
        {currentTab === 'awarded_list' && (
          <div className="p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Scholarships Approved by Selection Committee
            </h3>
            {awardedApps.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">No awarded candidates yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                      <th className="p-3">App Number</th>
                      <th className="p-3">Applicant Name</th>
                      <th className="p-3">Scheme</th>
                      <th className="p-3">Grant Amount</th>
                      <th className="p-3">Merit Score</th>
                      <th className="p-3">Awarded Date</th>
                      <th className="p-3">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {awardedApps.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-700">{a.applicationNumber}</td>
                        <td className="p-3 font-semibold text-slate-900">{a.applicantName}</td>
                        <td className="p-3 text-slate-600">{a.schemeName}</td>
                        <td className="p-3 font-extrabold text-emerald-700">₹{a.grantAmount.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {a.meritScore ? `${a.meritScore}%` : 'Approved'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{new Date(a.awardedAt || a.updatedAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {a.status === 'SCHOLARSHIP_RELEASED' ? 'Disbursed (DBT)' : 'Awaiting Officer Release'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Merit Evaluation & Award Modal */}
      {evaluatingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Selection Committee Merit Screening
                </h3>
              </div>
              <button
                onClick={() => setEvaluatingApp(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {awardSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">Scholarship Successfully Awarded!</h4>
                <p className="text-xs text-slate-600">{awardSuccess}</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div><strong>Applicant:</strong> {evaluatingApp.applicantName}</div>
                    <div><strong>Application ID:</strong> {evaluatingApp.applicationNumber}</div>
                    <div><strong>Scheme:</strong> {evaluatingApp.schemeName}</div>
                    <div><strong>Grant Amount:</strong> ₹{evaluatingApp.grantAmount.toLocaleString()}</div>
                    <div><strong>Category:</strong> {evaluatingApp.caste}</div>
                    <div><strong>Income:</strong> ₹{evaluatingApp.annualIncome.toLocaleString()}/yr</div>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-[11px]">
                  <strong>Verifier Certification Record:</strong> Certified by{' '}
                  <strong>{evaluatingApp.certifiedByVerifierName}</strong> on{' '}
                  {new Date(evaluatingApp.certifiedAt || '').toLocaleDateString()}. Notes:{' '}
                  <em>"{evaluatingApp.verifierNotes}"</em>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Merit &amp; Eligibility Evaluation Score (% / Score out of 100) *
                  </label>
                  <input
                    type="number"
                    value={meritScore}
                    onChange={(e) => setMeritScore(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="w-full text-sm font-bold px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Weighted combination of academic marks (Class 12th/Graduation) + socio-economic priority.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Committee Decision Remarks *
                  </label>
                  <textarea
                    value={committeeRemarks}
                    onChange={(e) => setCommitteeRemarks(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-3 border-t flex items-center justify-between">
                  <button
                    onClick={handleReject}
                    className="px-3.5 py-2 text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200"
                  >
                    Reject with Reason
                  </button>

                  <button
                    onClick={handleAward}
                    className="px-5 py-2 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve &amp; Award Scholarship</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
