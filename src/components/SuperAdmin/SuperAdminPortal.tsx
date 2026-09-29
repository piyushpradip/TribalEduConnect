import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ArrowLeftRight,
  UserCog,
  UserPlus, 
  Activity, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Lock, 
  Hash, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
import { Role, ROLE_LABELS, ROLE_DESCRIPTIONS, User } from '../../types';

interface SuperAdminPortalProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
}

export const SuperAdminPortal: React.FC<SuperAdminPortalProps> = ({ currentTab, onTabChange }) => {
  const { allUsers, impersonateRole, updateUserStatus, addNewUser } = useAuth();
  const { auditLogs, applications, schemes } = usePortalData();

  const [searchUser, setSearchUser] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Audit search
  const [searchAudit, setSearchAudit] = useState('');

  // Add User Form state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('SV');
  const [newMobile, setNewMobile] = useState('+91 9');
  const [newState, setNewState] = useState('Jharkhand');
  const [newDept, setNewDept] = useState('');

  const filteredUsers = allUsers.filter((u) => {
    const q = searchUser.toLowerCase();
    const matchesSearch =
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    const q = searchAudit.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.module.toLowerCase().includes(q)
    );
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail) return;

    addNewUser({
      email: newEmail.trim().toLowerCase(),
      fullName: newFullName.trim(),
      role: newRole,
      mobile: newMobile.trim(),
      assignedState: newRole === 'SSO' || newRole === 'SV' ? newState : undefined,
      department: newDept.trim() || 'Designated Administrative Department',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newFullName)}`,
      isActive: true,
    });

    setShowAddUserModal(false);
    setNewFullName('');
    setNewEmail('');
    setNewDept('');
  };

  const personaCards: { role: Role; title: string; color: string; desc: string }[] = [
    { role: 'APPLICANT', title: 'Applicant (Student) Portal', color: 'from-blue-600 to-indigo-700', desc: 'Experience the student journey: browse schemes, upload docs, track real-time applications pipeline.' },
    { role: 'SSO', title: 'State Scholarship Officer (SSO)', color: 'from-amber-600 to-orange-700', desc: 'Create and publish state schemes, trigger DBT release, and dispatch automated notifications.' },
    { role: 'CSO', title: 'Central Scholarship Officer (CSO)', color: 'from-blue-700 to-blue-900', desc: 'Manage National MoTA schemes and trigger central scholarship release to verified students.' },
    { role: 'SV', title: 'State Verifier (SV)', color: 'from-indigo-600 to-purple-700', desc: 'Side-by-side inspection of student data with uploaded Domicile, Income, and Caste certificates.' },
    { role: 'CV', title: 'Central Verifier (CV)', color: 'from-cyan-700 to-blue-800', desc: 'Central sector jurisdiction document certification and DigiLocker validation.' },
    { role: 'SCM', title: 'Selection Committee Member (SCM)', color: 'from-emerald-600 to-teal-700', desc: 'Final eligibility screening, merit scoring, and scholarship award approval.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              Super Admin Console &amp; RBAC Control Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global management of all 7 roles, immutable cryptographic audit logs, and instantaneous role switching / impersonation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('impersonate_tools')}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:from-indigo-700 hover:to-blue-700 transition-all"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Switch Role / Impersonate</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total System Users</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{allUsers.length}</h3>
          <span className="text-[11px] text-slate-500">Across 7 Defined Roles</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applications</p>
          <h3 className="text-2xl font-extrabold text-blue-700 mt-1">{applications.length}</h3>
          <span className="text-[11px] text-blue-600 font-medium">State &amp; Central Intake</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Managed Schemes</p>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{schemes.length}</h3>
          <span className="text-[11px] text-emerald-600 font-medium">National / State Published</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Immutable Audit Blocks</p>
          <h3 className="text-2xl font-extrabold text-purple-700 mt-1">{auditLogs.length}</h3>
          <span className="text-[11px] text-purple-600 font-medium">Hash-Chained Records</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('user_management')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'user_management' || currentTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User &amp; RBAC Management ({allUsers.length})</span>
            </button>

            <button
              onClick={() => onTabChange('impersonate_tools')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'impersonate_tools'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Portal Switcher / Persona Hub</span>
            </button>

            <button
              onClick={() => onTabChange('audit_ledger')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'audit_ledger'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Global Audit Ledger ({auditLogs.length})</span>
            </button>
          </div>

          {(currentTab === 'user_management' || currentTab === 'dashboard') && (
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Role User</span>
            </button>
          )}
        </div>

        {/* View 1: User & RBAC Management */}
        {(currentTab === 'user_management' || currentTab === 'dashboard') && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Search user by name, email or role..."
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="ALL">All Roles ({allUsers.length})</option>
                <option value="APPLICANT">Applicants Only</option>
                <option value="SSO">State Officers (SSO)</option>
                <option value="CSO">Central Officers (CSO)</option>
                <option value="SV">State Verifiers (SV)</option>
                <option value="CV">Central Verifiers (CV)</option>
                <option value="SCM">Selection Committee (SCM)</option>
                <option value="SUPER_ADMIN">Super Admins</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                    <th className="p-3">User</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Jurisdiction / Dept</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Impersonate / Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                            alt={user.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{user.fullName}</div>
                            <div className="text-[11px] text-slate-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                          {ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {user.assignedState ? (
                          <span className="font-semibold text-slate-800">{user.assignedState} State</span>
                        ) : (
                          <span>{user.department || 'National HQ'}</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{user.mobile}</td>
                      <td className="p-3">
                        <button
                          onClick={() => updateUserStatus(user.id, !user.isActive)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Deactivated'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => impersonateRole(user.role, user.id)}
                          className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg inline-flex items-center gap-1"
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          <span>Switch to View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 2: Portal Switcher / Persona Hub */}
        {currentTab === 'impersonate_tools' && (
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Super Admin Dynamic Portal Switcher (Zero Re-Authentication)
              </h3>
              <p className="text-xs text-slate-500">
                Click any portal below to seamlessly enter that persona with full access to their views, queues, and workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {personaCards.map((persona) => (
                <div
                  key={persona.role}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${persona.color} text-white flex items-center justify-center font-bold text-sm mb-3 shadow-md`}>
                      {persona.role.slice(0, 2)}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {persona.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{persona.desc}</p>
                  </div>

                  <button
                    onClick={() => impersonateRole(persona.role)}
                    className="mt-5 w-full py-2 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Enter {persona.role} View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 3: Global Audit Ledger */}
        {currentTab === 'audit_ledger' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Global Cryptographic Audit Ledger (HMAC &amp; Chained Hashes)
                </h3>
                <p className="text-xs text-slate-500">
                  Every user action, certification, approval, and scholarship disbursement creates a tamper-evident audit record.
                </p>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchAudit}
                  onChange={(e) => setSearchAudit(e.target.value)}
                  placeholder="Search audit trail..."
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">{log.action}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {log.module}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs">{log.details}</p>

                  <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                    <span>
                      Actor: <strong>{log.userName}</strong> ({log.userRole}) &bull; IP: {log.ipAddress}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span>Hash: {log.blockHash.slice(0, 16)}...</span>
                      <span className="text-emerald-600 font-bold">✓ Valid</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Pre-Created Role Account</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name &amp; Designation *</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Dr. Alok Ranjan (State Verifier)"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. alok.verifier@gov.in"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as Role)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="SSO">State Scholarship Officer (SSO)</option>
                    <option value="CSO">Central Scholarship Officer (CSO)</option>
                    <option value="SV">State Verifier (SV)</option>
                    <option value="CV">Central Verifier (CV)</option>
                    <option value="SCM">Selection Committee Member (SCM)</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              {(newRole === 'SSO' || newRole === 'SV') && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned State Jurisdiction</label>
                  <select
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Assam">Assam</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department / Office</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="e.g. District Welfare Office (DWO), Ranchi"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
