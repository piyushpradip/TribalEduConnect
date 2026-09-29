export type Role = 
  | 'APPLICANT'
  | 'SSO'         // State Scholarship Officer
  | 'CSO'         // Central Scholarship Officer
  | 'SV'          // State Verifier
  | 'CV'          // Central Verifier
  | 'SCM'         // Selection Committee Member
  | 'SUPER_ADMIN';

export const ROLE_LABELS: Record<Role, string> = {
  APPLICANT: 'Tribal Scholar / Applicant (Student)',
  SSO: 'State Scholarship Officer (SSO)',
  CSO: 'Central Scholarship Officer (CSO)',
  SV: 'State Verifier (SV)',
  CV: 'Central Verifier (CV)',
  SCM: 'Selection Committee Member (SCM)',
  SUPER_ADMIN: 'MoTA Super Admin / NIC Director',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  APPLICANT: 'Explore and apply for MoTA Central & State scholarships/fellowships, track real-time pipelines, and manage research milestones.',
  SSO: 'Manage state schemes, oversee district verifications, and disburse state tribal scholarship allocations via PFMS DBT.',
  CSO: 'Administer National Fellowship (NFST), National Overseas Scholarship (NOS), Top Class ST, and publish quotas.',
  SV: 'Side-by-side inspection of state jurisdiction student records with uploaded Domicile, Income, and Caste certificates.',
  CV: 'Central sector jurisdiction document scrutiny, DigiLocker seal verification, and preliminary AI scrutiny oversight.',
  SCM: 'Conduct final screening, evaluate academic merit scores, and approve awards for verified tribal applicants.',
  SUPER_ADMIN: 'Manage ministry users, assign RBAC permissions, inspect cryptographic audit logs, and switch portals.',
};

export type ApplicationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VERIFIER_CERTIFIED'
  | 'DEFICIENT'
  | 'REJECTED'
  | 'COMMITTEE_APPROVED'
  | 'SCHOLARSHIP_RELEASED';

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted (Pending Verification)',
  VERIFIER_CERTIFIED: 'Verifier Certified',
  DEFICIENT: 'Correction Needed (72h Notice)',
  REJECTED: 'Rejected',
  COMMITTEE_APPROVED: 'Committee Approved (Awarded)',
  SCHOLARSHIP_RELEASED: 'Scholarship Disbursed (PFMS DBT)',
};

export const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
  DRAFT: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  SUBMITTED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  VERIFIER_CERTIFIED: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-300' },
  DEFICIENT: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  REJECTED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' },
  COMMITTEE_APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  SCHOLARSHIP_RELEASED: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' },
};

export type SchemeLevel = 'CENTRAL' | 'STATE';

export interface ScholarshipScheme {
  id: string;
  code: string; // Official codes: BVOBC, BPVGK, A023B, ARG45, AZKMI
  name: string;
  level: SchemeLevel;
  ministryOrDept: string;
  state?: string; // Applicable for state schemes (e.g. 'Bihar', 'Jharkhand')
  academicYear: string;
  grantAmount: number; // In INR
  incomeLimit: number; // Maximum family income limit per annum
  categoryEligibility: string[]; // e.g. ['ST', 'SC', 'OBC', 'General']
  educationLevels: string[]; // e.g. ['Pre-Matric', 'Post-Matric', 'Undergraduate', 'Postgraduate', 'M.Phil.', 'Ph.D.']
  deadline: string;
  requiredDocuments: string[];
  slotsTotal?: number;
  slotsRemaining?: number;
  description: string;
  isActive: boolean;
  publishedBy: string;
  publishedAt: string;
  schemeType?: 'FELLOWSHIP' | 'OVERSEAS' | 'HIGHER_ED' | 'POST_MATRIC' | 'PRE_MATRIC';
  benefitType?: 'In Cash' | 'In Others';
  fundingCategory?: 'Central Sector Scheme' | 'Centrally Sponsored Scheme';
  guidelineDocumentTitle?: string;
}

export interface NotifiedPremierInstitute {
  sNo: number;
  name: string;
  location: string;
  state: string;
  course: string;
}

export type DocumentType = 
  | 'DOMICILE_CERTIFICATE'
  | 'INCOME_CERTIFICATE'
  | 'CASTE_CERTIFICATE'
  | 'ACADEMIC_10TH'
  | 'ACADEMIC_12TH'
  | 'ACADEMIC_GRADUATION'
  | 'ACADEMIC_POSTGRADUATION'
  | 'PHD_REGISTRATION'
  | 'OVERSEAS_OFFER_LETTER'
  | 'AADHAAR_CARD'
  | 'BONAFIDE_CERTIFICATE';

export interface StudentDocument {
  id: string;
  applicantId: string;
  docType: DocumentType;
  title: string;
  certificateNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
  isDigiLockerVerified: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  remarks?: string;
}

export interface SeedingStatus {
  applicantId: string;
  aadhaarNumberMasked: string;
  isBankSeeded: boolean;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  npciMapperStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  dbtEnabled: boolean;
  lastCheckedAt: string;
  abcId: string;
  isAbcLinked: boolean;
  abcCreditsCount: number;
  institutionLinked: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  mobile: string;
  assignedState?: string;
  department?: string;
  aadhaarMasked?: string;
  caste?: string;
  district?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface VerificationLog {
  id: string;
  applicationId: string;
  action: 'SUBMIT' | 'CERTIFY' | 'FLAG_DEFICIENT' | 'REJECT' | 'AWARD' | 'DISBURSE' | 'AI_SCRUTINY';
  performedByRole: Role | 'SYSTEM_AI';
  performerName: string;
  performerId: string;
  notes: string;
  timestamp: string;
  hashSignature?: string;
}

export interface Application {
  id: string;
  applicationNumber: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantMobile: string;
  caste: string;
  state: string;
  district: string;
  fatherName: string;
  annualIncome: number;
  aadhaarMasked: string;
  instituteName: string;
  courseName: string;
  currentYear: string;
  schemeId: string;
  schemeName: string;
  schemeCode: string;
  schemeLevel: SchemeLevel;
  grantAmount: number;
  meritScore?: number;
  status: ApplicationStatus;
  statusHistory: VerificationLog[];
  documentsAttached: StudentDocument[];
  certifiedByVerifierId?: string;
  certifiedByVerifierName?: string;
  certifiedAt?: string;
  verifierNotes?: string;
  awardedByCommitteeMemberId?: string;
  awardedByCommitteeMemberName?: string;
  awardedAt?: string;
  committeeNotes?: string;
  disbursedByOfficerId?: string;
  disbursedByOfficerName?: string;
  disbursedAt?: string;
  pfmsTransactionId?: string;
  disbursementBatchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  recipientEmail?: string;
  recipientMobile?: string;
  recipientRole: Role;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT' | 'DISBURSEMENT';
  channel: ('IN_APP' | 'SMS' | 'EMAIL')[];
  relatedApplicationId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: 'AUTH' | 'APPLICATION' | 'VERIFIER' | 'COMMITTEE' | 'OFFICER' | 'ADMIN' | 'NOTIFICATION' | 'FELLOWSHIP';
  userId: string;
  userName: string;
  userRole: Role | 'SYSTEM_AI';
  details: string;
  ipAddress: string;
  timestamp: string;
  blockHash: string;
  previousHash: string;
}

// Research Fellowship Management (NFST / NOS)
export interface ResearchFellowship {
  id: string;
  fellowId: string; // e.g., 'NFST-2026-PHD-041'
  scholarName: string;
  caste: string;
  university: string;
  researchTopic: string;
  supervisorName: string;
  monthlyStipend: number;
  hraAmount: number;
  currentMilestone: string;
  progressStatus: 'SATISFACTORY' | 'UNDER_REVIEW' | 'PENDING_SUBMISSION';
  supervisorEndorsed: boolean;
  stipendDisbursementStatus: 'DISBURSED' | 'PENDING_ENDORSEMENT' | 'PROCESSING_PFMS';
  lastEndorsedAt?: string;
  tenureMonthsCompleted: number;
  tenureTotalMonths: number;
}

// AI Document Scrutiny & Intelligence
export interface AiScrutinyResult {
  applicationId: string;
  applicantName: string;
  documentTitle: string;
  ocrConfidenceScore: number;
  ocrExtractedFields: {
    name?: string;
    fatherName?: string;
    caste?: string;
    certificateNumber?: string;
    annualIncome?: string;
    issueDate?: string;
  };
  article342GazetteMatch: boolean;
  notifiedTribeMatched?: string;
  elaTamperIndicator: 'CLEAN' | 'ANOMALY_SUSPECTED' | 'REVIEW_ADVISED';
  elaConfidencePercent: number;
  deficienciesDetected: string[];
  recommendation: 'PASS_AUTO_ELIGIBLE' | 'OFFICER_REVIEW_NEEDED' | 'DEFICIENCY_NOTICE_72H';
}
