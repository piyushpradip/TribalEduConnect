import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ScholarshipScheme, 
  Application, 
  StudentDocument, 
  SeedingStatus, 
  Notification, 
  AuditLog,
  VerificationLog,
  User,
  DocumentType,
  ResearchFellowship,
  AiScrutinyResult
} from '../types';
import { 
  INITIAL_SCHEMES, 
  INITIAL_APPLICATIONS, 
  INITIAL_DOCUMENTS, 
  INITIAL_SEEDING_STATUS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_FELLOWSHIPS,
  INITIAL_AI_SCRUTINY
} from '../mock/initialData';
import { useAuth } from './AuthContext';

interface PortalDataContextType {
  schemes: ScholarshipScheme[];
  applications: Application[];
  documents: StudentDocument[];
  seedingStatuses: Record<string, SeedingStatus>;
  notifications: Notification[];
  auditLogs: AuditLog[];
  fellowships: ResearchFellowship[];
  aiScrutinies: AiScrutinyResult[];
  // Scheme Actions (Officers)
  createScheme: (scheme: Omit<ScholarshipScheme, 'id' | 'publishedAt' | 'slotsRemaining'>) => void;
  updateSchemeStatus: (schemeId: string, isActive: boolean) => void;
  // Application Actions (Applicant)
  submitApplication: (
    schemeId: string,
    formData: {
      instituteName: string;
      courseName: string;
      currentYear: string;
      annualIncome: number;
    }
  ) => Promise<{ success: boolean; applicationId?: string; message?: string }>;
  // Verifier Actions
  certifyApplication: (applicationId: string, notes: string) => void;
  flagApplicationDeficient: (applicationId: string, remarks: string) => void;
  rejectApplicationByVerifier: (applicationId: string, reason: string) => void;
  // Selection Committee Actions
  awardScholarship: (applicationId: string, meritScore: number, remarks: string) => void;
  rejectApplicationByCommittee: (applicationId: string, reason: string) => void;
  // Officer Disbursement Actions
  disburseScholarshipsBatch: (applicationIds: string[], pfmsBatchId?: string) => void;
  // Document Management (Applicant)
  uploadDocument: (doc: Omit<StudentDocument, 'id' | 'uploadedAt' | 'verificationStatus'>) => void;
  connectDigiLocker: (applicantId: string) => void;
  // Seeding Status
  refreshSeedingStatus: (applicantId: string) => void;
  linkAbcId: (applicantId: string, abcId: string, institution: string) => void;
  // Notification Management
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  // Post-Selection Fellowship Lifecycle (NFST / NOS)
  endorseFellowshipMilestone: (fellowId: string, supervisorNotes: string) => void;
  claimFellowshipStipend: (fellowId: string) => void;
  // AI Document Scrutiny & Deficiency Workflow
  runAiDocumentScrutiny: (appId: string) => AiScrutinyResult;
  trigger72hDeficiencyNotice: (appId: string, missingItems: string[], reason: string) => void;
  resolveDeficiency: (appId: string, docTitle: string) => void;
}

const PortalDataContext = createContext<PortalDataContextType | undefined>(undefined);

function generateHash(data: string, prevHash: string): string {
  let hash = 0;
  const str = data + prevHash + Date.now().toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(32, '0');
}

export const PortalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [schemes, setSchemes] = useState<ScholarshipScheme[]>(() => {
    const saved = localStorage.getItem('mota_schemes_v2');
    return saved ? JSON.parse(saved) : INITIAL_SCHEMES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('mota_applications_v2');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [documents, setDocuments] = useState<StudentDocument[]>(() => {
    const saved = localStorage.getItem('mota_documents_v2');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [seedingStatuses, setSeedingStatuses] = useState<Record<string, SeedingStatus>>(() => {
    const saved = localStorage.getItem('mota_seeding_v2');
    return saved ? JSON.parse(saved) : INITIAL_SEEDING_STATUS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('mota_notifications_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('mota_audit_logs_v2');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [fellowships, setFellowships] = useState<ResearchFellowship[]>(() => {
    const saved = localStorage.getItem('mota_fellowships_v2');
    return saved ? JSON.parse(saved) : INITIAL_FELLOWSHIPS;
  });

  const [aiScrutinies, setAiScrutinies] = useState<AiScrutinyResult[]>(() => {
    const saved = localStorage.getItem('mota_ai_scrutiny_v2');
    return saved ? JSON.parse(saved) : INITIAL_AI_SCRUTINY;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mota_schemes_v2', JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem('mota_applications_v2', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('mota_documents_v2', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('mota_seeding_v2', JSON.stringify(seedingStatuses));
  }, [seedingStatuses]);

  useEffect(() => {
    localStorage.setItem('mota_notifications_v2', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mota_audit_logs_v2', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('mota_fellowships_v2', JSON.stringify(fellowships));
  }, [fellowships]);

  useEffect(() => {
    localStorage.setItem('mota_ai_scrutiny_v2', JSON.stringify(aiScrutinies));
  }, [aiScrutinies]);

  const logAuditAction = (
    action: string,
    module: AuditLog['module'],
    details: string,
    user?: User | null
  ) => {
    const activeU = user || currentUser;
    const prevHash = auditLogs[0]?.blockHash || '00000000000000000000000000000000';
    const newHash = generateHash(action + details, prevHash);

    const newLog: AuditLog = {
      id: `audit_${Date.now()}`,
      action,
      module,
      userId: activeU?.id || 'sys_unauth',
      userName: activeU?.fullName || 'MoTA Automated Core',
      userRole: activeU?.role || 'SUPER_ADMIN',
      details,
      ipAddress: '164.100.' + Math.floor(Math.random() * 200 + 1) + '.' + Math.floor(Math.random() * 200 + 1),
      timestamp: new Date().toISOString(),
      blockHash: newHash,
      previousHash: prevHash,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // SCHEME ACTIONS
  const createScheme = (schemeData: Omit<ScholarshipScheme, 'id' | 'publishedAt' | 'slotsRemaining'>) => {
    const newScheme: ScholarshipScheme = {
      ...schemeData,
      id: `sch_${schemeData.level.toLowerCase()}_${Date.now()}`,
      publishedAt: new Date().toISOString(),
      slotsRemaining: schemeData.slotsTotal || 5000,
    };
    setSchemes((prev) => [newScheme, ...prev]);
    logAuditAction(
      'CREATE_SCHEME',
      'OFFICER',
      `Officer published new ${schemeData.level} MoTA scheme: "${schemeData.name}" (${schemeData.code}) with grant of ₹${schemeData.grantAmount.toLocaleString()}`
    );
  };

  const updateSchemeStatus = (schemeId: string, isActive: boolean) => {
    setSchemes((prev) =>
      prev.map((s) => (s.id === schemeId ? { ...s, isActive } : s))
    );
    logAuditAction('UPDATE_SCHEME_STATUS', 'OFFICER', `Scheme ${schemeId} active status set to ${isActive}`);
  };

  // APPLICANT ACTIONS
  const submitApplication = async (
    schemeId: string,
    formData: {
      instituteName: string;
      courseName: string;
      currentYear: string;
      annualIncome: number;
    }
  ): Promise<{ success: boolean; applicationId?: string; message?: string }> => {
    if (!currentUser || currentUser.role !== 'APPLICANT') {
      return { success: false, message: 'Only registered tribal scholars can submit applications.' };
    }

    const scheme = schemes.find((s) => s.id === schemeId);
    if (!scheme) {
      return { success: false, message: 'Scheme not found.' };
    }

    if (formData.annualIncome > scheme.incomeLimit) {
      return {
        success: false,
        message: `Your declared family income (₹${formData.annualIncome.toLocaleString()}) exceeds the scheme limit of ₹${scheme.incomeLimit.toLocaleString()}.`,
      };
    }

    const existing = applications.find(
      (a) => a.applicantId === currentUser.id && a.schemeId === schemeId && a.status !== 'REJECTED'
    );
    if (existing) {
      return {
        success: false,
        message: 'You have already submitted an active application for this scheme. Track it under "My Applications".',
      };
    }

    const studentDocs = documents.filter((d) => d.applicantId === currentUser.id);

    const appPrefix = scheme.code.slice(0, 4) || 'MOTA';
    const appNumber = `SCH-2026-${appPrefix}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newLog: VerificationLog = {
      id: `log_${Date.now()}`,
      applicationId: '',
      action: 'SUBMIT',
      performedByRole: 'APPLICANT',
      performerName: currentUser.fullName,
      performerId: currentUser.id,
      notes: `Application submitted for ${scheme.name}. Attached ${studentDocs.length} certificates.`,
      timestamp: new Date().toISOString(),
      hashSignature: generateHash(appNumber, 'GENESIS_APP'),
    };

    const newApp: Application = {
      id: `app_${Date.now()}`,
      applicationNumber: appNumber,
      applicantId: currentUser.id,
      applicantName: currentUser.fullName,
      applicantEmail: currentUser.email,
      applicantMobile: currentUser.mobile,
      caste: currentUser.caste || 'ST (Scheduled Tribe)',
      state: currentUser.assignedState || 'Jharkhand',
      district: currentUser.district || 'Ranchi',
      fatherName: 'Guardian of ' + currentUser.fullName,
      annualIncome: formData.annualIncome,
      aadhaarMasked: currentUser.aadhaarMasked || 'XXXX-XXXX-9812',
      instituteName: formData.instituteName,
      courseName: formData.courseName,
      currentYear: formData.currentYear,
      schemeId: scheme.id,
      schemeName: scheme.name,
      schemeCode: scheme.code,
      schemeLevel: scheme.level,
      grantAmount: scheme.grantAmount,
      status: 'SUBMITTED',
      statusHistory: [newLog],
      documentsAttached: studentDocs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    newLog.applicationId = newApp.id;

    setApplications((prev) => [newApp, ...prev]);

    // Send confirmation notification
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      recipientId: currentUser.id,
      recipientEmail: currentUser.email,
      recipientMobile: currentUser.mobile,
      recipientRole: 'APPLICANT',
      title: 'Application Submitted & Dispatched for Verification',
      message: `Your application ${newApp.applicationNumber} for "${scheme.name}" has been received. It has been routed to the ${scheme.level === 'CENTRAL' ? 'Central Verifier (CV)' : 'State Verifier (SV)'} for document scrutiny.`,
      type: 'INFO',
      channel: ['IN_APP', 'SMS'],
      relatedApplicationId: newApp.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [notif, ...prev]);

    logAuditAction(
      'SUBMIT_APPLICATION',
      'APPLICATION',
      `Scholar ${currentUser.fullName} submitted application ${newApp.applicationNumber} for scheme ${scheme.name}`
    );

    return { success: true, applicationId: newApp.id };
  };

  // VERIFIER ACTIONS
  const certifyApplication = (applicationId: string, notes: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const log: VerificationLog = {
      id: `log_${Date.now()}`,
      applicationId,
      action: 'CERTIFY',
      performedByRole: currentUser?.role || 'SV',
      performerName: currentUser?.fullName || 'State Verifier',
      performerId: currentUser?.id || 'usr_verifier',
      notes: notes || 'All required documents (Domicile, Income, ST Caste, Academic) verified and certified.',
      timestamp: new Date().toISOString(),
      hashSignature: generateHash(applicationId + 'CERTIFY', app.statusHistory[app.statusHistory.length - 1]?.hashSignature || ''),
    };

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== applicationId) return a;
        return {
          ...a,
          status: 'VERIFIER_CERTIFIED',
          certifiedByVerifierId: currentUser?.id,
          certifiedByVerifierName: currentUser?.fullName,
          certifiedAt: new Date().toISOString(),
          verifierNotes: notes,
          statusHistory: [...a.statusHistory, log],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // Notify Applicant
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      recipientId: app.applicantId,
      recipientEmail: app.applicantEmail,
      recipientMobile: app.applicantMobile,
      recipientRole: 'APPLICANT',
      title: 'Documents Certified by Ministry Verifier!',
      message: `Your certificates for Application ${app.applicationNumber} have been scrutinized and certified by ${currentUser?.fullName}. Your file has now moved to the Selection Committee for merit evaluation.`,
      type: 'SUCCESS',
      channel: ['IN_APP', 'SMS', 'EMAIL'],
      relatedApplicationId: app.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    logAuditAction(
      'CERTIFY_APPLICATION',
      'VERIFIER',
      `Verifier ${currentUser?.fullName} (${currentUser?.role}) certified Application ${app.applicationNumber}. Notes: ${notes}`
    );
  };

  const flagApplicationDeficient = (applicationId: string, remarks: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const log: VerificationLog = {
      id: `log_${Date.now()}`,
      applicationId,
      action: 'FLAG_DEFICIENT',
      performedByRole: currentUser?.role || 'SV',
      performerName: currentUser?.fullName || 'Verifier',
      performerId: currentUser?.id || 'usr_verifier',
      notes: remarks,
      timestamp: new Date().toISOString(),
    };

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== applicationId) return a;
        return {
          ...a,
          status: 'DEFICIENT',
          verifierNotes: remarks,
          statusHistory: [...a.statusHistory, log],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const notif: Notification = {
      id: `notif_${Date.now()}`,
      recipientId: app.applicantId,
      recipientEmail: app.applicantEmail,
      recipientMobile: app.applicantMobile,
      recipientRole: 'APPLICANT',
      title: '72-Hour Deficiency Notice Issued',
      message: `A deficiency has been flagged in Application ${app.applicationNumber}: "${remarks}". Please re-upload the corrected document within 72 hours to prevent rejection.`,
      type: 'WARNING',
      channel: ['IN_APP', 'SMS', 'EMAIL'],
      relatedApplicationId: app.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    logAuditAction('FLAG_DEFICIENT', 'VERIFIER', `Verifier issued 72h deficiency notice for Application ${app.applicationNumber}: ${remarks}`);
  };

  const rejectApplicationByVerifier = (applicationId: string, reason: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const log: VerificationLog = {
      id: `log_${Date.now()}`,
      applicationId,
      action: 'REJECT',
      performedByRole: currentUser?.role || 'SV',
      performerName: currentUser?.fullName || 'Verifier',
      performerId: currentUser?.id || 'usr_verifier',
      notes: reason,
      timestamp: new Date().toISOString(),
    };

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== applicationId) return a;
        return {
          ...a,
          status: 'REJECTED',
          verifierNotes: reason,
          statusHistory: [...a.statusHistory, log],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const notif: Notification = {
      id: `notif_${Date.now()}`,
      recipientId: app.applicantId,
      recipientEmail: app.applicantEmail,
      recipientRole: 'APPLICANT',
      title: 'Application Scrutiny Result: Rejected',
      message: `Your Application ${app.applicationNumber} for "${app.schemeName}" was rejected during document verification. Reason: ${reason}.`,
      type: 'ALERT',
      channel: ['IN_APP', 'EMAIL'],
      relatedApplicationId: app.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    logAuditAction('REJECT_APPLICATION', 'VERIFIER', `Verifier rejected Application ${app.applicationNumber}. Reason: ${reason}`);
  };

  // SELECTION COMMITTEE ACTIONS
  const awardScholarship = (applicationId: string, meritScore: number, remarks: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const log: VerificationLog = {
      id: `log_${Date.now()}`,
      applicationId,
      action: 'AWARD',
      performedByRole: 'SCM',
      performerName: currentUser?.fullName || 'Selection Committee Chair',
      performerId: currentUser?.id || 'usr_scm',
      notes: `Scholarship award approved. Merit score: ${meritScore}%. Remarks: ${remarks}`,
      timestamp: new Date().toISOString(),
      hashSignature: generateHash(applicationId + 'AWARD', app.statusHistory[app.statusHistory.length - 1]?.hashSignature || ''),
    };

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== applicationId) return a;
        return {
          ...a,
          status: 'COMMITTEE_APPROVED',
          meritScore,
          awardedByCommitteeMemberId: currentUser?.id,
          awardedByCommitteeMemberName: currentUser?.fullName,
          awardedAt: new Date().toISOString(),
          committeeNotes: remarks,
          statusHistory: [...a.statusHistory, log],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const notif: Notification = {
      id: `notif_${Date.now()}`,
      recipientId: app.applicantId,
      recipientEmail: app.applicantEmail,
      recipientMobile: app.applicantMobile,
      recipientRole: 'APPLICANT',
      title: 'Scholarship Award Approved by Selection Committee!',
      message: `Congratulations! The Selection Committee has evaluated your credentials with a Merit Score of ${meritScore}% and approved grant allocation of ₹${app.grantAmount.toLocaleString()}. It is now queued for final PFMS DBT release.`,
      type: 'SUCCESS',
      channel: ['IN_APP', 'SMS', 'EMAIL'],
      relatedApplicationId: app.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    logAuditAction(
      'AWARD_SCHOLARSHIP',
      'COMMITTEE',
      `Selection Committee approved award for Application ${app.applicationNumber}. Merit: ${meritScore}%, Amount: ₹${app.grantAmount.toLocaleString()}`
    );
  };

  const rejectApplicationByCommittee = (applicationId: string, reason: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const log: VerificationLog = {
      id: `log_${Date.now()}`,
      applicationId,
      action: 'REJECT',
      performedByRole: 'SCM',
      performerName: currentUser?.fullName || 'Selection Committee',
      performerId: currentUser?.id || 'usr_scm',
      notes: reason,
      timestamp: new Date().toISOString(),
    };

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== applicationId) return a;
        return {
          ...a,
          status: 'REJECTED',
          committeeNotes: reason,
          statusHistory: [...a.statusHistory, log],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const notif: Notification = {
      id: `notif_${Date.now()}`,
      recipientId: app.applicantId,
      recipientRole: 'APPLICANT',
      title: 'Selection Committee Screening Result',
      message: `Application ${app.applicationNumber} was not selected in the quota merit tier. Reason: ${reason}.`,
      type: 'ALERT',
      channel: ['IN_APP'],
      relatedApplicationId: app.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    logAuditAction('REJECT_BY_COMMITTEE', 'COMMITTEE', `Committee rejected Application ${app.applicationNumber}. Reason: ${reason}`);
  };

  // SCHOLARSHIP OFFICER ACTIONS
  const disburseScholarshipsBatch = (applicationIds: string[], pfmsBatchId?: string) => {
    const batchId = pfmsBatchId || `PFMS-DBT-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    setApplications((prev) =>
      prev.map((a) => {
        if (!applicationIds.includes(a.id) || a.status !== 'COMMITTEE_APPROVED') {
          return a;
        }

        const txnId = `PFMS-TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;

        const log: VerificationLog = {
          id: `log_${Date.now()}_${a.id}`,
          applicationId: a.id,
          action: 'DISBURSE',
          performedByRole: currentUser?.role || 'CSO',
          performerName: currentUser?.fullName || 'Scholarship Officer',
          performerId: currentUser?.id || 'usr_officer',
          notes: `Scholarship grant of ₹${a.grantAmount.toLocaleString()} released via PFMS DBT Batch ${batchId}. Transaction Reference: ${txnId}`,
          timestamp: now,
          hashSignature: generateHash(a.id + 'DISBURSE', a.statusHistory[a.statusHistory.length - 1]?.hashSignature || ''),
        };

        return {
          ...a,
          status: 'SCHOLARSHIP_RELEASED',
          disbursedByOfficerId: currentUser?.id,
          disbursedByOfficerName: currentUser?.fullName,
          disbursedAt: now,
          pfmsTransactionId: txnId,
          disbursementBatchId: batchId,
          statusHistory: [...a.statusHistory, log],
          updatedAt: now,
        };
      })
    );

    // Automated notifications dispatched to all selected applicants
    const newNotifs: Notification[] = [];
    applications
      .filter((a) => applicationIds.includes(a.id) && a.status === 'COMMITTEE_APPROVED')
      .forEach((app) => {
        const studentSeeding = seedingStatuses[app.applicantId];
        const bankLast4 = studentSeeding?.accountNumberMasked?.slice(-4) || '7140';
        const bankName = studentSeeding?.bankName || 'Aadhaar-seeded bank account';

        const notif: Notification = {
          id: `notif_disb_${Date.now()}_${app.id}`,
          recipientId: app.applicantId,
          recipientEmail: app.applicantEmail,
          recipientMobile: app.applicantMobile,
          recipientRole: 'APPLICANT',
          title: `Scholarship Disbursed: ₹${app.grantAmount.toLocaleString()} Released via DBT!`,
          message: `Dear ${app.applicantName}, your scholarship grant under "${app.schemeName}" has been successfully disbursed by ${currentUser?.fullName}. Direct Benefit Transfer (DBT) credit has been sent to your ${bankName} ending in ${bankLast4} via PFMS Batch ${batchId}.`,
          type: 'DISBURSEMENT',
          channel: ['IN_APP', 'SMS', 'EMAIL'],
          relatedApplicationId: app.id,
          isRead: false,
          createdAt: now,
        };
        newNotifs.push(notif);
      });

    setNotifications((prev) => [...newNotifs, ...prev]);

    logAuditAction(
      'TRIGGER_DISBURSEMENT_BATCH',
      'OFFICER',
      `Officer ${currentUser?.fullName} released scholarship disbursement for ${applicationIds.length} applicant(s). Batch ID: ${batchId}. Automated SMS, Email & In-App notifications dispatched.`
    );
  };

  // POST-SELECTION FELLOWSHIP LIFECYCLE (NFST / NOS)
  const endorseFellowshipMilestone = (fellowId: string, supervisorNotes: string) => {
    const now = new Date().toISOString();
    setFellowships((prev) =>
      prev.map((f) => {
        if (f.fellowId !== fellowId) return f;
        return {
          ...f,
          supervisorEndorsed: true,
          progressStatus: 'SATISFACTORY',
          stipendDisbursementStatus: 'PROCESSING_PFMS',
          lastEndorsedAt: now,
          tenureMonthsCompleted: Math.min(f.tenureTotalMonths, f.tenureMonthsCompleted + 6),
        };
      })
    );

    const target = fellowships.find((f) => f.fellowId === fellowId);
    if (target) {
      logAuditAction(
        'FELLOWSHIP_MILESTONE_ENDORSED',
        'FELLOWSHIP',
        `University Supervisor endorsed Research Milestone for Fellow ${target.scholarName} (${target.fellowId}). Monthly stipend ₹${target.monthlyStipend.toLocaleString()} + HRA queued for release. Notes: ${supervisorNotes}`
      );
    }
  };

  const claimFellowshipStipend = (fellowId: string) => {
    const now = new Date().toISOString();
    setFellowships((prev) =>
      prev.map((f) => {
        if (f.fellowId !== fellowId) return f;
        return {
          ...f,
          stipendDisbursementStatus: 'DISBURSED',
        };
      })
    );
    const target = fellowships.find((f) => f.fellowId === fellowId);
    if (target) {
      logAuditAction(
        'FELLOWSHIP_STIPEND_DISBURSED',
        'FELLOWSHIP',
        `Monthly research fellowship stipend of ₹${(target.monthlyStipend + target.hraAmount).toLocaleString()} disbursed via PFMS DBT for Fellow ${target.scholarName} (${target.fellowId})`
      );
    }
  };

  // AI DOCUMENT SCRUTINY & DEFICIENCY RESOLUTION
  const runAiDocumentScrutiny = (appId: string): AiScrutinyResult => {
    const app = applications.find((a) => a.id === appId);
    const result: AiScrutinyResult = {
      applicationId: appId,
      applicantName: app?.applicantName || 'Scholar',
      documentTitle: 'Scheduled Tribe Community & Domicile Record',
      ocrConfidenceScore: 97.8,
      ocrExtractedFields: {
        name: app?.applicantName || '',
        fatherName: app?.fatherName || '',
        caste: app?.caste || 'ST',
        annualIncome: app ? `₹${app.annualIncome.toLocaleString()}` : '₹1,45,000',
        certificateNumber: `ST/JH/2026/${Math.floor(1000 + Math.random() * 9000)}`,
        issueDate: '15-04-2025',
      },
      article342GazetteMatch: true,
      notifiedTribeMatched: `${app?.caste || 'Munda'} (Notified Scheduled Tribe under Presidential Order 1950)`,
      elaTamperIndicator: 'CLEAN',
      elaConfidencePercent: 99.1,
      deficienciesDetected: [],
      recommendation: 'PASS_AUTO_ELIGIBLE',
    };

    setAiScrutinies((prev) => [result, ...prev.filter((item) => item.applicationId !== appId)]);
    logAuditAction('AI_DOCUMENT_SCRUTINY', 'APPLICATION', `AI Document Intelligence analyzed Application ${app?.applicationNumber || appId}: OCR 97.8%, Article 342 Gazette Confirmed.`);
    return result;
  };

  const trigger72hDeficiencyNotice = (appId: string, missingItems: string[], reason: string) => {
    flagApplicationDeficient(appId, `72-Hour Resolution Notice: Missing/Deficient: ${missingItems.join(', ')}. ${reason}`);
  };

  const resolveDeficiency = (appId: string, docTitle: string) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== appId) return a;
        return {
          ...a,
          status: 'SUBMITTED',
          verifierNotes: `Deficiency resolved: Re-uploaded "${docTitle}". Returned to Verifier Queue for final certification.`,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    logAuditAction('DEFICIENCY_RESOLVED', 'APPLICATION', `Applicant resolved deficiency for Application ${appId} by re-uploading ${docTitle}`);
  };

  // DOCUMENT MANAGEMENT
  const uploadDocument = (docData: Omit<StudentDocument, 'id' | 'uploadedAt' | 'verificationStatus'>) => {
    const newDoc: StudentDocument = {
      ...docData,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'PENDING',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    logAuditAction('UPLOAD_DOCUMENT', 'APPLICATION', `Scholar uploaded document: ${docData.title} (${docData.docType})`);
  };

  const connectDigiLocker = (applicantId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.applicantId === applicantId) {
          return {
            ...d,
            isDigiLockerVerified: true,
            verificationStatus: 'VERIFIED',
            remarks: 'Pulled & cryptographically verified from DigiLocker National Repository (e-District).',
          };
        }
        return d;
      })
    );

    const notif: Notification = {
      id: `notif_dl_${Date.now()}`,
      recipientId: applicantId,
      recipientRole: 'APPLICANT',
      title: 'DigiLocker Repository Connected',
      message: 'Your Domicile, Income, and Academic certificates have been successfully synced and verified via National DigiLocker API.',
      type: 'SUCCESS',
      channel: ['IN_APP'],
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
    logAuditAction('DIGILOCKER_SYNC', 'APPLICATION', `Scholar ${applicantId} synced credentials via DigiLocker`);
  };

  // SEEDING STATUS
  const refreshSeedingStatus = (applicantId: string) => {
    setSeedingStatuses((prev) => {
      const current = prev[applicantId] || {
        applicantId,
        aadhaarNumberMasked: currentUser?.aadhaarMasked || 'XXXX-XXXX-9812',
        isBankSeeded: true,
        bankName: 'State Bank of India',
        accountNumberMasked: 'XXXX-XXXX-7140',
        ifscCode: 'SBIN0000167',
        npciMapperStatus: 'ACTIVE',
        dbtEnabled: true,
        lastCheckedAt: new Date().toISOString(),
        abcId: 'ABC-8841-9023-1144',
        isAbcLinked: true,
        abcCreditsCount: 48,
        institutionLinked: 'Birla Institute of Technology, Mesra',
      };
      return {
        ...prev,
        [applicantId]: {
          ...current,
          lastCheckedAt: new Date().toISOString(),
          npciMapperStatus: 'ACTIVE',
          dbtEnabled: true,
        },
      };
    });

    logAuditAction('NPCI_DBT_CHECK', 'APPLICATION', `Real-time NPCI Aadhaar-Bank mapper checked for scholar ${applicantId}`);
  };

  const linkAbcId = (applicantId: string, abcId: string, institution: string) => {
    setSeedingStatuses((prev) => {
      const existing = prev[applicantId] || {
        applicantId,
        aadhaarNumberMasked: currentUser?.aadhaarMasked || 'XXXX-XXXX-9812',
        isBankSeeded: true,
        bankName: 'State Bank of India',
        accountNumberMasked: 'XXXX-XXXX-7140',
        ifscCode: 'SBIN0000167',
        npciMapperStatus: 'ACTIVE',
        dbtEnabled: true,
        lastCheckedAt: new Date().toISOString(),
        abcId: '',
        isAbcLinked: false,
        abcCreditsCount: 0,
        institutionLinked: '',
      };
      return {
        ...prev,
        [applicantId]: {
          ...existing,
          abcId,
          isAbcLinked: true,
          abcCreditsCount: 52,
          institutionLinked: institution,
        },
      };
    });

    logAuditAction('LINK_ABC_ID', 'APPLICATION', `Scholar ${applicantId} linked ABC ID: ${abcId}`);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.recipientId === userId ? { ...n, isRead: true } : n))
    );
  };

  return (
    <PortalDataContext.Provider
      value={{
        schemes,
        applications,
        documents,
        seedingStatuses,
        notifications,
        auditLogs,
        fellowships,
        aiScrutinies,
        createScheme,
        updateSchemeStatus,
        submitApplication,
        certifyApplication,
        flagApplicationDeficient,
        rejectApplicationByVerifier,
        awardScholarship,
        rejectApplicationByCommittee,
        disburseScholarshipsBatch,
        uploadDocument,
        connectDigiLocker,
        refreshSeedingStatus,
        linkAbcId,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        endorseFellowshipMilestone,
        claimFellowshipStipend,
        runAiDocumentScrutiny,
        trigger72hDeficiencyNotice,
        resolveDeficiency,
      }}
    >
      {children}
    </PortalDataContext.Provider>
  );
};

export const usePortalData = () => {
  const context = useContext(PortalDataContext);
  if (!context) {
    throw new Error('usePortalData must be used within a PortalDataProvider');
  }
  return context;
};
