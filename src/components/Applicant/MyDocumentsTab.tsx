import React, { useState } from 'react';
import { 
  FolderLock, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
import { DocumentType, StudentDocument } from '../../types';

export const MyDocumentsTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { documents, uploadDocument, connectDigiLocker } = usePortalData();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<StudentDocument | null>(null);

  // Upload Form state
  const [docType, setDocType] = useState<DocumentType>('DOMICILE_CERTIFICATE');
  const [docTitle, setDocTitle] = useState('');
  const [certNumber, setCertNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [issueDate, setIssueDate] = useState('');

  const myDocs = documents.filter((d) => d.applicantId === currentUser?.id);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    uploadDocument({
      applicantId: currentUser.id,
      docType,
      title: docTitle.trim() || `${docType.replace(/_/g, ' ')}`,
      certificateNumber: certNumber.trim() || `CERT-${Date.now().toString().slice(-6)}`,
      issuingAuthority: issuingAuthority.trim() || 'Designated State Authority',
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      fileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
      fileSize: '1.2 MB',
      isDigiLockerVerified: false,
    });

    setShowUploadModal(false);
    setDocTitle('');
    setCertNumber('');
    setIssuingAuthority('');
    setIssueDate('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & DigiLocker Connection Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <FolderLock className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              My Documents Repository
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Secure vault for Domicile, Income, Academic, and Caste certificates. Verifiers inspect these documents side-by-side with your form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* DigiLocker Button */}
          <button
            onClick={() => currentUser && connectDigiLocker(currentUser.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl shadow-sm hover:from-blue-800 hover:to-indigo-800 transition-all"
            title="Fetch digital certificates directly from DigiLocker"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Sync with DigiLocker</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* DigiLocker Status Card */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-700 font-extrabold text-sm shadow-sm">
            DL
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>National DigiLocker Integration</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Connected & Active
              </span>
            </h4>
            <p className="text-slate-600 text-xs">
              Cryptographically pulled certificates carry the digital signature of the issuing e-District authority.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-500 block">DigiLocker Verified Docs</span>
          <strong className="text-base font-extrabold text-blue-700">
            {myDocs.filter((d) => d.isDigiLockerVerified).length} of {myDocs.length}
          </strong>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {myDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="w-5 h-5" />
                </span>

                <div className="flex flex-col items-end gap-1">
                  {doc.isDigiLockerVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> DigiLocker Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      <Clock className="w-3 h-3" /> Self-Uploaded
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      doc.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {doc.verificationStatus}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Type: <strong>{doc.docType.replace(/_/g, ' ')}</strong>
              </p>

              <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] space-y-1">
                {doc.certificateNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cert No:</span>
                    <span className="font-mono font-bold text-slate-800">{doc.certificateNumber}</span>
                  </div>
                )}
                {doc.issuingAuthority && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Authority:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[150px]">
                      {doc.issuingAuthority}
                    </span>
                  </div>
                )}
                {doc.issueDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issued On:</span>
                    <span className="text-slate-800">{doc.issueDate}</span>
                  </div>
                )}
              </div>

              {doc.remarks && (
                <p className="text-[10px] text-slate-500 mt-2 italic bg-slate-50 p-1.5 rounded">
                  Note: {doc.remarks}
                </p>
              )}
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">{doc.fileSize} &bull; PDF/JPG</span>
              <button
                onClick={() => setSelectedPreviewDoc(doc)}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Certificate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Upload Certificate to Repository</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Category *</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DOMICILE_CERTIFICATE">Domicile / Residence Certificate</option>
                  <option value="INCOME_CERTIFICATE">Income Certificate</option>
                  <option value="CASTE_CERTIFICATE">Caste / Category Certificate (ST/SC/OBC)</option>
                  <option value="ACADEMIC_10TH">Class 10th Marksheet & Passing Certificate</option>
                  <option value="ACADEMIC_12TH">Class 12th Marksheet & Passing Certificate</option>
                  <option value="ACADEMIC_GRADUATION">Graduation Degree / Transcript</option>
                  <option value="BONAFIDE_CERTIFICATE">College Bonafide & Fee Receipt</option>
                  <option value="AADHAAR_CARD">Masked Aadhaar Card Copy</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Jharkhand State Domicile Certificate 2026"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Certificate Number</label>
                  <input
                    type="text"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    placeholder="e.g. DOM/JH/2026/8891"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issuing Authority / Officer</label>
                <input
                  type="text"
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  placeholder="e.g. Sub-Divisional Officer (SDO) / Tehsildar"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl text-center hover:bg-slate-50 cursor-pointer">
                <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                <p className="font-semibold text-slate-700 text-xs">Click to browse or drop certificate file</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG up to 5MB (Encrypted storage)</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedPreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedPreviewDoc.title}</h3>
                <p className="text-xs text-slate-500">
                  Cert No: <strong>{selectedPreviewDoc.certificateNumber || 'N/A'}</strong> &bull; Authority:{' '}
                  {selectedPreviewDoc.issuingAuthority || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-[60vh] flex items-center justify-center p-2">
              <img
                src={selectedPreviewDoc.fileUrl}
                alt={selectedPreviewDoc.title}
                className="max-h-[55vh] object-contain rounded-lg shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500">
                Status:{' '}
                <strong className="text-emerald-700 font-bold">
                  {selectedPreviewDoc.verificationStatus}
                </strong>
              </span>
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="px-4 py-1.5 font-bold bg-slate-900 text-white rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
