import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Building2, 
  HelpCircle,
  ExternalLink,
  Search
} from 'lucide-react';

export const MotaContactUs: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [searchState, setSearchState] = useState('');

  const stateNodalOfficers = [
    { state: 'Jharkhand', officer: 'Dr. Rameshwar Oraon', phone: '0651-2400234', email: 'director-tw@jharkhand.gov.in', address: 'Directorate of Tribal Welfare, Kalyan Bhawan, Ranchi' },
    { state: 'Odisha', officer: 'Sh. Sushil Kumar Das, OAS', phone: '0674-2391039', email: 'stscdev@odisha.gov.in', address: 'ST & SC Development Department, Lok Seva Bhawan, Bhubaneswar' },
    { state: 'Madhya Pradesh', officer: 'Smt. Pallavi Jain Govil, IAS', phone: '0755-2551577', email: 'commtribal@mp.gov.in', address: 'Tribal Development Department, Rajiv Gandhi Bhawan, Bhopal' },
    { state: 'Chhattisgarh', officer: 'Sh. Narendra Kumar Dugga, IAS', phone: '0771-2510271', email: 'tribalwelfare.cg@gov.in', address: 'Indravati Bhawan, Nawa Raipur, Atal Nagar' },
    { state: 'Maharashtra', officer: 'Dr. Nitin Patil, IAS', phone: '020-26362846', email: 'trti.mah@nic.in', address: 'Tribal Research & Training Institute (TRTI), Queen’s Garden, Pune' },
    { state: 'Assam', officer: 'Sh. Mukesh Ch. Sahu, IAS', phone: '0361-2237274', email: 'wptbc-assam@nic.in', address: 'Welfare of Plain Tribes & Backward Classes Department, Dispur' },
    { state: 'Gujarat', officer: 'Sh. K. K. Nirala, IAS', phone: '079-23253301', email: 'comm-tribal@gujarat.gov.in', address: 'Birsa Munda Bhavan, Sector 10-A, Gandhinagar' },
    { state: 'Rajasthan', officer: 'Sh. Ashutosh A.T. Pednekar, IAS', phone: '0294-2415174', email: 'tadraj@rajasthan.gov.in', address: 'Tribal Area Development Department (TAD), Chetak Circle, Udaipur' },
  ];

  const filteredOfficers = stateNodalOfficers.filter(o => 
    o.state.toLowerCase().includes(searchState.toLowerCase()) || 
    o.officer.toLowerCase().includes(searchState.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketMessage) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketName('');
      setTicketEmail('');
      setTicketSubject('');
      setTicketMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Exact Match from Official tribal.nic.in/ScholarshiP.aspx Screenshot */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Phone className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base font-serif">Ministry of Tribal Affairs &bull; Contact Directory</h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 bg-blue-800 text-blue-100 rounded-full border border-blue-600">
            Shastri Bhawan, New Delhi
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-8 font-sans">
          {/* Section 1: Admin / Scholarship Queries (From User's Image) */}
          <div className="space-y-3">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                1
              </span>
              <span>For Admin / Scholarship Related Queries:-</span>
            </h4>

            <div className="ml-0 sm:ml-9 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-800 text-sm">
                Under Secretary (Scholarships &amp; Fellowships)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Contact Person</span>
                  <strong className="text-slate-900 font-semibold text-sm">Sh. Satish Kumar Singh</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Contact Telephone</span>
                  <a href="tel:011-23343708" className="text-blue-700 font-mono font-bold hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> 011-23343708
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Email ID</span>
                  <span className="font-mono font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                    satish[dot]edu[at]nic[dot]in
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Queries (From User's Image) */}
          <div className="space-y-3">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                2
              </span>
              <span>For Technical Queries &amp; Portal Assistance:-</span>
            </h4>

            <div className="ml-0 sm:ml-9 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs text-slate-700">
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Technical Support Email ID</span>
                <span className="font-mono font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-1">
                  rahul[dot]bansal[at]govcontractor[dot]nic[dot]in
                </span>
                <p className="text-[11px] text-slate-500 mt-2">
                  (For issues related to Aadhaar authentication failure, DigiLocker certificate mismatch, portal login, and DBT status check)
                </p>
              </div>
            </div>
          </div>

          {/* Ministry Headquarters Physical Address */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-sm">Ministry Headquarters</strong>
                <p className="text-slate-600">
                  Ministry of Tribal Affairs, August Kranti Bhawan / Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001
                </p>
              </div>
            </div>
            <a
              href="https://tribal.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors self-end sm:self-auto"
            >
              <span>Visit Official MoTA Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* State Nodal Officers Directory for ST Scholarships */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              State Tribal Welfare Nodal Officers Directory
            </h3>
            <p className="text-xs text-slate-500">
              Contact your state department for verification status, domicile verification, and state quota queries.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchState}
              onChange={(e) => setSearchState(e.target.value)}
              placeholder="Filter by State or Officer..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                <th className="p-3">State / UT</th>
                <th className="p-3">Designation &amp; Nodal Officer</th>
                <th className="p-3">Contact Telephone</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Office Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.map((o) => (
                <tr key={o.state} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-blue-900">{o.state}</td>
                  <td className="p-3 font-semibold text-slate-800">{o.officer}</td>
                  <td className="p-3 font-mono text-slate-700">{o.phone}</td>
                  <td className="p-3 font-mono text-blue-700">{o.email}</td>
                  <td className="p-3 text-slate-500">{o.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Online Citizen & Scholar Grievance Redressal Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Submit Grievance / Scholarship Clarification Request
            </h3>
            <p className="text-xs text-slate-500">
              Directly routed to the Central Verification Cell &amp; Technical Support Unit.
            </p>
          </div>
        </div>

        {ticketSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <strong className="block text-sm">Grievance Ticket Registered Successfully!</strong>
              <p className="text-xs">
                Your Token ID: <span className="font-mono font-bold">MOTA-GRV-{Math.floor(100000 + Math.random() * 900000)}</span>. You will receive an SMS and email update within 48 business hours.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Scholar / Officer Full Name *</label>
              <input
                type="text"
                value={ticketName}
                onChange={(e) => setTicketName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={ticketEmail}
                onChange={(e) => setTicketEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Query Subject / Scheme Name</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. National Fellowship for ST (NFST) Monthly Stipend Claim Inquiry"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Message / Grievance Description *</label>
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                rows={4}
                placeholder="Describe your query, including Application Number or Aadhaar reference if applicable..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Grievance</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
