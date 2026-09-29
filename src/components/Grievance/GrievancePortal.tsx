import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Search, 
  Send, 
  ShieldCheck, 
  Building2, 
  User, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';

export interface GrievanceTicket {
  id: string;
  ticketNumber: string;
  applicantId: string;
  applicantName: string;
  applicantMobile: string;
  category: 'DISBURSEMENT_PFMS' | 'DEFICIENCY_CLARIFICATION' | 'FELLOWSHIP_STIPEND' | 'DOCUMENT_REVERIFICATION' | 'OTHER';
  subject: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
  officerRemarks?: string;
  assignedOfficerName?: string;
}

const INITIAL_GRIEVANCES: GrievanceTicket[] = [
  {
    id: 'grv_1',
    ticketNumber: 'GRV-MOTA-2026-0042',
    applicantId: 'usr_applicant_1',
    applicantName: 'Birsa Munda',
    applicantMobile: '+91 98765 43210',
    category: 'DISBURSEMENT_PFMS',
    subject: 'PFMS DBT UTR number confirmation for Top Class Scholarship',
    description: 'My application has been marked approved by the selection committee. Requesting confirmation of the PFMS mandate dispatch date to State Bank of India.',
    priority: 'HIGH',
    status: 'RESOLVED',
    createdAt: '2026-09-20T10:30:00Z',
    resolvedAt: '2026-09-22T14:15:00Z',
    officerRemarks: 'Disbursement mandate generated under PFMS Batch #49120. Grant credited to your SBI account ending in 7140 on 22nd Sept.',
    assignedOfficerName: 'Sunita Meena, IAS (CSO)',
  },
  {
    id: 'grv_2',
    ticketNumber: 'GRV-MOTA-2026-0089',
    applicantId: 'usr_applicant_2',
    applicantName: 'Sunita Soren',
    applicantMobile: '+91 98111 22334',
    category: 'FELLOWSHIP_STIPEND',
    subject: 'National Overseas Scholarship (NOS) Foreign Exchange Remittance Schedule',
    description: 'Enrolled in D.Phil at Oxford University for Michaelmas Term 2026. Inquiring regarding the GBP tuition fee transfer directly to the university bursar office.',
    priority: 'HIGH',
    status: 'UNDER_REVIEW',
    createdAt: '2026-09-25T11:00:00Z',
    officerRemarks: 'High Commission of India, London education wing notified. Tuition remittance file currently being processed at MoTA Finance Division.',
    assignedOfficerName: 'Dr. Geeta Subramanian (CV)',
  },
  {
    id: 'grv_3',
    ticketNumber: 'GRV-MOTA-2026-0114',
    applicantId: 'usr_applicant_3',
    applicantName: 'Jaipal Singh Marandi',
    applicantMobile: '+91 97110 33445',
    category: 'DEFICIENCY_CLARIFICATION',
    subject: 'Clarification regarding ST Caste Gazette verification for JNU Ph.D.',
    description: 'Received note regarding Tehsildar vs DC seal on Santhal community certificate. Uploaded Gazette Notification No. 142 from e-District Jharkhand.',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdAt: '2026-09-28T09:40:00Z',
  },
];

export const GrievancePortal: React.FC = () => {
  const { currentUser, activeRole } = useAuth();
  const { auditLogs } = usePortalData();

  const [tickets, setTickets] = useState<GrievanceTicket[]>(() => {
    const saved = localStorage.getItem('mota_grievances_v1');
    return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
  });

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<GrievanceTicket | null>(null);

  // New Grievance Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCategory, setNewCategory] = useState<GrievanceTicket['category']>('DISBURSEMENT_PFMS');
  const [newPriority, setNewPriority] = useState<GrievanceTicket['priority']>('HIGH');
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Officer Resolution Form
  const [officerReply, setOfficerReply] = useState('');
  const [newStatus, setNewStatus] = useState<'UNDER_REVIEW' | 'RESOLVED'>('RESOLVED');
  const [toastMessage, setToastMessage] = useState('');

  const isApplicant = activeRole === 'APPLICANT';
  const isOfficerOrAdmin = ['SSO', 'CSO', 'SV', 'CV', 'SUPER_ADMIN'].includes(activeRole);

  const saveTickets = (updated: GrievanceTicket[]) => {
    setTickets(updated);
    localStorage.setItem('mota_grievances_v1', JSON.stringify(updated));
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const ticketNo = `GRV-MOTA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTkt: GrievanceTicket = {
      id: `grv_${Date.now()}`,
      ticketNumber: ticketNo,
      applicantId: currentUser?.id || 'usr_applicant_1',
      applicantName: currentUser?.fullName || 'Tribal Scholar',
      applicantMobile: currentUser?.mobile || '+91 98765 43210',
      category: newCategory,
      priority: newPriority,
      subject: newSubject.trim(),
      description: newDescription.trim(),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    saveTickets([newTkt, ...tickets]);
    setShowNewModal(false);
    setNewSubject('');
    setNewDescription('');
    setToastMessage(`Grievance ticket ${ticketNo} lodged successfully! SLA tracking initiated.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleResolveTicket = (ticketId: string) => {
    if (!officerReply.trim()) return;

    const updated = tickets.map((t) => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status: newStatus,
        officerRemarks: officerReply.trim(),
        resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : undefined,
        assignedOfficerName: `${currentUser?.fullName} (${activeRole})`,
      };
    });

    saveTickets(updated);
    setSelectedTicket(null);
    setOfficerReply('');
    setToastMessage(`Official resolution dispatched for ticket ${selectedTicket?.ticketNumber}.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const displayedTickets = tickets
    .filter((t) => (isApplicant ? t.applicantName === currentUser?.fullName || t.applicantId === currentUser?.id : true))
    .filter((t) => (filterCategory === 'ALL' ? true : t.category === filterCategory))
    .filter((t) => (filterStatus === 'ALL' ? true : t.status === filterStatus))
    .filter((t) =>
      searchQuery
        ? t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.applicantName.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              MoTA Samadhan &bull; Digital Grievance &amp; Helpdesk
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Time-bound citizen and scholar grievance redressal mechanism with SLA countdowns for scholarship scrutiny, DBT disbursement delays, and fellowship administration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isApplicant && (
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Lodge New Grievance</span>
            </button>
          )}
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Citizen Charter 72-Hour SLA</span>
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Grievances</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{tickets.length}</h3>
          <span className="text-[11px] text-slate-500">Tracked in Central Grievance Matrix</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved Successfully</p>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
            {tickets.filter((t) => t.status === 'RESOLVED').length}
          </h3>
          <span className="text-[11px] text-emerald-600 font-medium">94.8% Average SLA Compliance</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Action</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
            {tickets.filter((t) => t.status !== 'RESOLVED').length}
          </h3>
          <span className="text-[11px] text-slate-500">In Active Officer Scrutiny</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket ID, scholar name, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open (New)</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Categories</option>
            <option value="DISBURSEMENT_PFMS">PFMS DBT Disbursement</option>
            <option value="DEFICIENCY_CLARIFICATION">Deficiency Clarification</option>
            <option value="FELLOWSHIP_STIPEND">Fellowship Stipend</option>
            <option value="DOCUMENT_REVERIFICATION">Document Re-verification</option>
          </select>
        </div>
      </div>

      {/* Grievance Ticket Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {displayedTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-700">No Grievances Found</p>
            <p className="mt-1">All issues have been resolved or no tickets match the current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                  <th className="p-3.5">Ticket Number</th>
                  <th className="p-3.5">Scholar Details</th>
                  <th className="p-3.5">Category &amp; Subject</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date Lodged</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-700">{t.ticketNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{t.applicantName}</div>
                      <div className="text-[11px] text-slate-500">{t.applicantMobile}</div>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 mb-0.5">
                        {t.category.replace('_', ' ')}
                      </span>
                      <div className="font-medium text-slate-900 truncate">{t.subject}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          t.priority === 'HIGH'
                            ? 'bg-rose-100 text-rose-800'
                            : t.priority === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'UNDER_REVIEW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{t.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-800 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details & Officer Resolution Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-600 text-white">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm">Grievance Ticket: {selectedTicket.ticketNumber}</h3>
                  <p className="text-[11px] text-slate-400">Lodged on {new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{selectedTicket.subject}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed pt-1">{selectedTicket.description}</p>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span>Scholar: <strong>{selectedTicket.applicantName}</strong> ({selectedTicket.applicantMobile})</span>
                  <span>Category: <strong>{selectedTicket.category.replace('_', ' ')}</strong></span>
                </div>
              </div>

              {/* Official Response Thread */}
              {selectedTicket.officerRemarks ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Official Ministry Resolution Note:</span>
                    </span>
                    <span className="text-[10px] font-normal text-emerald-700">
                      Officer: {selectedTicket.assignedOfficerName || 'MoTA Officer'}
                    </span>
                  </div>
                  <p className="text-slate-800 bg-white p-3 rounded-lg border border-emerald-100 mt-2 leading-relaxed">
                    "{selectedTicket.officerRemarks}"
                  </p>
                  {selectedTicket.resolvedAt && (
                    <span className="text-[10px] text-slate-400 block pt-1">
                      Resolved on: {new Date(selectedTicket.resolvedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[11px]">
                  Pending official administrative resolution. Ministry officers are currently reviewing the records.
                </div>
              )}

              {/* Officer Resolution Controls */}
              {isOfficerOrAdmin && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 pt-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Ministry Officer Action Console:
                  </h4>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Update Status:</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="ticketStatus"
                          value="UNDER_REVIEW"
                          checked={newStatus === 'UNDER_REVIEW'}
                          onChange={() => setNewStatus('UNDER_REVIEW')}
                        />
                        <span>Mark Under Active Review</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="ticketStatus"
                          value="RESOLVED"
                          checked={newStatus === 'RESOLVED'}
                          onChange={() => setNewStatus('RESOLVED')}
                        />
                        <span className="font-bold text-emerald-700">Mark Resolved &amp; Close</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Official Response / Resolution Remarks *:
                    </label>
                    <textarea
                      rows={3}
                      value={officerReply}
                      onChange={(e) => setOfficerReply(e.target.value)}
                      placeholder="Enter verified resolution details, transaction IDs, or guidance for the student..."
                      className="w-full text-xs p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    disabled={!officerReply.trim()}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Submit Official Resolution
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Grievance Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-4 bg-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                <h3 className="font-bold text-sm">Lodge New MoTA Grievance Ticket</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Grievance Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                >
                  <option value="DISBURSEMENT_PFMS">PFMS DBT Disbursement &amp; Bank Seeding Issue</option>
                  <option value="DEFICIENCY_CLARIFICATION">Deficiency 72-Hour Notice Clarification</option>
                  <option value="FELLOWSHIP_STIPEND">NFST / NOS Research Fellowship Monthly Stipend</option>
                  <option value="DOCUMENT_REVERIFICATION">e-District / Gazette Caste Certificate Scrutiny</option>
                  <option value="OTHER">Other Scholarship Related Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Summary *</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Inquiring regarding PFMS disbursement credit date for Top Class Scheme"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide complete facts, application number, bank details, or issue explanation..."
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
                >
                  Lodge Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
