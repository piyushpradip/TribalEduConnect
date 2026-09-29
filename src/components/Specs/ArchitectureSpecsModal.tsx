import React, { useState } from 'react';
import { 
  X, 
  Database, 
  GitBranch, 
  Server, 
  ShieldCheck, 
  Layers, 
  Copy, 
  Check, 
  Code2, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface ArchitectureSpecsModalProps {
  onClose: () => void;
}

export const ArchitectureSpecsModal: React.FC<ArchitectureSpecsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'SCHEMA' | 'STATE_MACHINE' | 'API_ENDPOINTS' | 'SECURITY'>('SCHEMA');
  const [copiedCode, setCopiedCode] = useState(false);

  const prismaSchemaCode = `// ====================================================================
// SCHOLARSHIP MANAGEMENT SYSTEM - RELATIONAL SCHEMA (POSTGRESQL / PRISMA)
// Conforms to Ministry of Tribal Affairs (MoTA) & SIH Specifications
// ====================================================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  APPLICANT
  SSO          // State Scholarship Officer
  CSO          // Central Scholarship Officer
  SV           // State Verifier
  CV           // Central Verifier
  SCM          // Selection Committee Member
  SUPER_ADMIN
}

enum ApplicationStatus {
  DRAFT
  SUBMITTED
  VERIFIER_CERTIFIED
  DEFICIENT
  REJECTED
  COMMITTEE_APPROVED
  SCHOLARSHIP_RELEASED
}

enum SchemeLevel {
  CENTRAL
  STATE
}

enum DocumentType {
  DOMICILE_CERTIFICATE
  INCOME_CERTIFICATE
  CASTE_CERTIFICATE
  ACADEMIC_10TH
  ACADEMIC_12TH
  ACADEMIC_GRADUATION
  AADHAAR_CARD
  BONAFIDE_CERTIFICATE
}

model User {
  id              String         @id @default(uuid())
  email           String         @unique
  fullName        String
  role            Role           @default(APPLICANT)
  passwordHash    String
  mobile          String         @unique
  assignedState   String?        // Jurisdiction for SSO & SV
  department      String?
  aadhaarHash     String?        // SHA-256 HMAC for Zero-Knowledge match
  aadhaarMasked   String?        // 'XXXX-XXXX-1234' per DPDP Act 2023
  caste           String?
  district        String?
  isActive        Boolean        @default(true)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relationships
  applications    Application[]  @relation("ApplicantApplications")
  verifiedApps    Application[]  @relation("VerifierApplications")
  awardedApps     Application[]  @relation("CommitteeApplications")
  disbursedApps   Application[]  @relation("OfficerApplications")
  documents       Document[]
  auditLogs       AuditLog[]
  notifications   Notification[]
}

model ScholarshipScheme {
  id                   String        @id @default(uuid())
  code                 String        @unique // e.g. 'PMS-ST-CENTRAL'
  name                 String
  level                SchemeLevel   @default(CENTRAL)
  ministryOrDept       String
  state                String?       // For State level schemes
  academicYear         String        // '2026-2027'
  grantAmount          Decimal       @db.Decimal(12, 2)
  incomeLimit          Decimal       @db.Decimal(12, 2)
  categoryEligibility String[]      // ['ST', 'SC', 'OBC']
  educationLevels      String[]      // ['Post-Matric', 'Undergraduate']
  deadline             DateTime
  requiredDocuments    String[]
  slotsTotal           Int?
  slotsRemaining       Int?
  description          String        @db.Text
  isActive             Boolean       @default(true)
  publishedBy          String
  createdAt            DateTime      @default(now())

  // Relationships
  applications         Application[]
}

model Application {
  id                         String             @id @default(uuid())
  applicationNumber          String             @unique // e.g. 'SCH-2026-CENT-00124'
  applicantId                String
  applicant                  User               @relation("ApplicantApplications", fields: [applicantId], references: [id])
  schemeId                   String
  scheme                     ScholarshipScheme  @relation(fields: [schemeId], references: [id])
  
  instituteName              String
  courseName                 String
  currentYear                String
  annualIncome               Decimal            @db.Decimal(12, 2)
  grantAmount                Decimal            @db.Decimal(12, 2)
  meritScore                 Decimal?           @db.Decimal(5, 2) // 0.00 to 100.00
  status                     ApplicationStatus  @default(SUBMITTED)

  // Verifier Certification
  certifiedByVerifierId      String?
  certifiedByVerifier        User?              @relation("VerifierApplications", fields: [certifiedByVerifierId], references: [id])
  certifiedAt                DateTime?
  verifierNotes              String?            @db.Text

  // Selection Committee Approval
  awardedByCommitteeMemberId String?
  awardedByCommitteeMember   User?              @relation("CommitteeApplications", fields: [awardedByCommitteeMemberId], references: [id])
  awardedAt                  DateTime?
  committeeNotes             String?            @db.Text

  // Officer Release & Disbursement
  disbursedByOfficerId       String?
  disbursedByOfficer         User?              @relation("OfficerApplications", fields: [disbursedByOfficerId], references: [id])
  disbursedAt                DateTime?
  pfmsTransactionId          String?            @unique
  disbursementBatchId        String?

  createdAt                  DateTime           @default(now())
  updatedAt                  DateTime           @updatedAt

  // Relationships
  documents                  Document[]
  verificationLogs           VerificationLog[]
}

model Document {
  id                   String        @id @default(uuid())
  applicantId          String
  applicant            User          @relation(fields: [applicantId], references: [id])
  applicationId        String?
  application          Application?  @relation(fields: [applicationId], references: [id])
  docType              DocumentType
  title                String
  certificateNumber    String?
  issuingAuthority     String?
  issueDate            DateTime?
  fileStorageUri       String        // S3 / Blob storage URI (Encrypted)
  isDigiLockerVerified Boolean       @default(false)
  verificationStatus   String        @default("PENDING")
  uploadedAt           DateTime      @default(now())
}

model VerificationLog {
  id                String       @id @default(uuid())
  applicationId     String
  application       Application  @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  action            String       // 'SUBMIT', 'CERTIFY', 'FLAG_DEFICIENT', 'AWARD', 'DISBURSE'
  performedByRole   Role
  performerId       String
  performerName     String
  notes             String       @db.Text
  hashSignature     String?      // Cryptographic state seal
  timestamp         DateTime     @default(now())
}

model Notification {
  id                   String        @id @default(uuid())
  recipientId          String
  recipient            User          @relation(fields: [recipientId], references: [id])
  title                String
  message              String        @db.Text
  type                 String        // 'DISBURSEMENT', 'SUCCESS', 'WARNING', 'INFO'
  channelsDispatched   String[]      // ['IN_APP', 'SMS', 'EMAIL']
  relatedAppId         String?
  isRead               Boolean       @default(false)
  createdAt            DateTime      @default(now())
}

model AuditLog {
  id           String    @id @default(uuid())
  action       String
  module       String
  userId       String
  user         User      @relation(fields: [userId], references: [id])
  details      String    @db.Text
  ipAddress    String
  timestamp    DateTime  @default(now())
  blockHash    String    @unique
  previousHash String
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prismaSchemaCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                Technical Specifications &amp; Architecture Documentation
              </h3>
              <p className="text-xs text-slate-400">
                System Schema &bull; 5-Stage State Machine &bull; REST API Contract &bull; DPDP Act Security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('SCHEMA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'SCHEMA' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. PostgreSQL / Prisma Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('STATE_MACHINE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'STATE_MACHINE' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>2. Workflow Pipeline State Machine</span>
          </button>

          <button
            onClick={() => setActiveTab('API_ENDPOINTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'API_ENDPOINTS' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>3. RESTful API Definitions</span>
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'SECURITY' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Security &amp; PII Protocols</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* 1. PRISMA / DB SCHEMA */}
          {activeTab === 'SCHEMA' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Entity Relationship Database Schema (Prisma / PostgreSQL 16)
                  </h4>
                  <p className="text-slate-500 text-xs">
                    Covers Users, 7 Roles, Applications, Schemes, Documents, VerificationLogs, and Chained AuditLogs.
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-bold text-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Prisma Schema'}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                <pre>{prismaSchemaCode}</pre>
              </div>
            </div>
          )}

          {/* 2. STATE MACHINE PIPELINE */}
          {activeTab === 'STATE_MACHINE' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Application Lifecycle State-Machine Pipeline
                </h4>
                <p className="text-slate-500 text-xs mt-0.5">
                  Clear, deterministic status progression ensuring no application bypasses document certification or committee scoring.
                </p>
              </div>

              {/* State Machine Flow Diagram */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                  {/* Step 1 */}
                  <div className="p-3.5 bg-white rounded-xl border-2 border-blue-400 shadow-sm text-center">
                    <span className="font-mono font-bold text-blue-700 text-xs block mb-1">STAGE 1</span>
                    <strong className="text-slate-900 text-sm block">DRAFT &rarr; SUBMITTED</strong>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Actor: <strong>Applicant</strong>
                    </span>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Applicant enters data, attaches repository certificates, and gives Aadhaar DBT consent.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 bg-white rounded-xl border-2 border-indigo-400 shadow-sm text-center">
                    <span className="font-mono font-bold text-indigo-700 text-xs block mb-1">STAGE 2</span>
                    <strong className="text-slate-900 text-sm block">VERIFIER_CERTIFIED</strong>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Actor: <strong>SV / CV</strong>
                    </span>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Side-by-side inspection of Domicile, Income, and Caste certificates with DigiLocker.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 bg-white rounded-xl border-2 border-amber-400 shadow-sm text-center">
                    <span className="font-mono font-bold text-amber-700 text-xs block mb-1">BRANCH 2B</span>
                    <strong className="text-amber-800 text-sm block">DEFICIENT / REJECTED</strong>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Actor: <strong>SV / CV</strong>
                    </span>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Sent back to student with remarks (7-day re-upload window) or rejected if fraudulent.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 bg-white rounded-xl border-2 border-emerald-400 shadow-sm text-center">
                    <span className="font-mono font-bold text-emerald-700 text-xs block mb-1">STAGE 3</span>
                    <strong className="text-slate-900 text-sm block">COMMITTEE_APPROVED</strong>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Actor: <strong>SCM Panel</strong>
                    </span>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Merit scoring, quota allotment, and formal scholarship award authorization.
                    </p>
                  </div>

                  {/* Step 5 */}
                  <div className="p-3.5 bg-white rounded-xl border-2 border-green-600 shadow-sm text-center bg-green-50/30">
                    <span className="font-mono font-bold text-green-700 text-xs block mb-1">STAGE 4</span>
                    <strong className="text-green-900 text-sm block">SCHOLARSHIP_RELEASED</strong>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Actor: <strong>SSO / CSO</strong>
                    </span>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Disbursement triggered via PFMS DBT. Real-time SMS &amp; Email alerts dispatched!
                    </p>
                  </div>
                </div>
              </div>

              {/* State Transition Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Current State</th>
                      <th className="p-3">Event / Action</th>
                      <th className="p-3">Authorized Role</th>
                      <th className="p-3">Target State</th>
                      <th className="p-3">Automated Trigger</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-mono font-bold">DRAFT</td>
                      <td className="p-3">Submit Application</td>
                      <td className="p-3">Applicant</td>
                      <td className="p-3 font-mono font-bold text-blue-700">SUBMITTED</td>
                      <td className="p-3">Route to State or Central Verifier</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">SUBMITTED</td>
                      <td className="p-3">Certify Documents</td>
                      <td className="p-3">SV / CV</td>
                      <td className="p-3 font-mono font-bold text-indigo-700">VERIFIER_CERTIFIED</td>
                      <td className="p-3">Push to Selection Committee Queue</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">SUBMITTED</td>
                      <td className="p-3">Flag Deficiency</td>
                      <td className="p-3">SV / CV</td>
                      <td className="p-3 font-mono font-bold text-amber-700">DEFICIENT</td>
                      <td className="p-3">Instant SMS &amp; In-App alert to student</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">VERIFIER_CERTIFIED</td>
                      <td className="p-3">Award Scholarship</td>
                      <td className="p-3">SCM Panel</td>
                      <td className="p-3 font-mono font-bold text-emerald-700">COMMITTEE_APPROVED</td>
                      <td className="p-3">Queue in Officer Disbursement Pool</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">COMMITTEE_APPROVED</td>
                      <td className="p-3">Trigger Release / DBT</td>
                      <td className="p-3">SSO / CSO</td>
                      <td className="p-3 font-mono font-bold text-green-700">SCHOLARSHIP_RELEASED</td>
                      <td className="p-3">PFMS batch + SMS &amp; Email to all awardees</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. API ENDPOINTS */}
          {activeTab === 'API_ENDPOINTS' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                RESTful API Endpoint Contract (Auth, Verifier, Committee &amp; Disbursement)
              </h4>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Method</th>
                      <th className="p-3">Endpoint</th>
                      <th className="p-3">RBAC Access</th>
                      <th className="p-3">Payload / Function</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                      <td className="p-3 font-bold text-emerald-700">POST</td>
                      <td className="p-3 text-blue-700">/api/v1/auth/register-applicant</td>
                      <td className="p-3 text-slate-600 font-sans">Public (Applicant only)</td>
                      <td className="p-3 text-slate-600 font-sans">Basic details + Aadhaar + Mobile OTP validation</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-emerald-700">POST</td>
                      <td className="p-3 text-blue-700">/api/v1/auth/login</td>
                      <td className="p-3 text-slate-600 font-sans">All 7 Roles</td>
                      <td className="p-3 text-slate-600 font-sans">Returns JWT with role claims and jurisdiction</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-emerald-700">POST</td>
                      <td className="p-3 text-blue-700">/api/v1/auth/impersonate</td>
                      <td className="p-3 text-slate-600 font-sans">Super Admin</td>
                      <td className="p-3 text-slate-600 font-sans">Switches JWT claims without re-authenticating</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-blue-700">GET</td>
                      <td className="p-3 text-blue-700">/api/v1/seeding/npci-status/:aadhaar</td>
                      <td className="p-3 text-slate-600 font-sans">Applicant, Officers</td>
                      <td className="p-3 text-slate-600 font-sans">Real-time NPCI Aadhaar-Bank mapper check</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-700">PUT</td>
                      <td className="p-3 text-blue-700">/api/v1/verifier/certify/:appId</td>
                      <td className="p-3 text-slate-600 font-sans">SV, CV</td>
                      <td className="p-3 text-slate-600 font-sans">Side-by-side cert seal &rarr; moves to COMMITTEE_APPROVED</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-700">PUT</td>
                      <td className="p-3 text-blue-700">/api/v1/committee/award/:appId</td>
                      <td className="p-3 text-slate-600 font-sans">SCM</td>
                      <td className="p-3 text-slate-600 font-sans">Applies merit score and approves grant allocation</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-emerald-700">POST</td>
                      <td className="p-3 text-blue-700">/api/v1/officer/disburse-batch</td>
                      <td className="p-3 text-slate-600 font-sans">SSO, CSO</td>
                      <td className="p-3 text-slate-600 font-sans">Generates PFMS batch &amp; dispatches automated SMS/Email</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. SECURITY & PII PROTOCOLS */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                Sensitive PII &amp; DPDP Act 2023 Compliance Architecture
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Aadhaar Data Vault (ADV) Masking</span>
                  </h5>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    In strict compliance with UIDAI regulations and the Digital Personal Data Protection (DPDP) Act 2023, raw 12-digit Aadhaar numbers are never stored in plain text. They are tokenized into a salted SHA-256 HMAC and displayed only in masked format (<code>XXXX-XXXX-1234</code>).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographic Audit Ledger (HMAC-SHA256)</span>
                  </h5>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Every document certification, committee approval, and disbursement action calculates a chained hash containing the previous block's digest, timestamp, actor ID, and action payload. Any retroactive database tampering immediately breaks chain integrity.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span>AES-256 Envelope Document Encryption</span>
                  </h5>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Student certificates (Income, Domicile, Marksheets) uploaded to the repository are encrypted at rest using AES-256-GCM envelope encryption. Verifiers view decrypted streams only during an authorized active session.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Role-Based Access Control (RBAC) Guard</span>
                  </h5>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Server-enforced policy gates ensure that Verifiers can only certify (`VERIFIER_CERTIFIED`), Committee members can only award (`COMMITTEE_APPROVED`), and Officers can only release (`SCHOLARSHIP_RELEASED`), preventing privilege escalation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono">MoTA-SCHOLARSHIP-ARCH-SPEC v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
