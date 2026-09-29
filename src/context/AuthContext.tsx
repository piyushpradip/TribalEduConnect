import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { INITIAL_USERS } from '../mock/initialData';

export interface ApplicantRegistrationData {
  fullName: string;
  fatherName: string;
  gender: string;
  dob: string;
  email: string;
  mobile: string;
  caste: string;
  state: string;
  district: string;
  password: string;
  aadhaarNumber: string; // 12-digit
}

interface AuthContextType {
  currentUser: User | null;
  activeRole: Role;
  isImpersonating: boolean;
  impersonatedUser: User | null;
  allUsers: User[];
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  quickLoginAsRole: (role: Role) => void;
  registerApplicant: (data: ApplicantRegistrationData) => Promise<{ success: boolean; message?: string }>;
  impersonateRole: (role: Role, specificUserId?: string) => void;
  exitImpersonation: () => void;
  logout: () => void;
  updateUserStatus: (userId: string, isActive: boolean) => void;
  addNewUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Verhoeff checksum algorithm for 12-digit Indian Aadhaar numbers
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

export function validateVerhoeffChecksum(aadhaar: string): boolean {
  const clean = aadhaar.replace(/\D/g, '');
  if (clean.length !== 12) return false;
  let c = 0;
  for (let i = 0; i < clean.length; i++) {
    const digit = parseInt(clean[clean.length - 1 - i], 10);
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digit]];
  }
  return c === 0;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('scholarship_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Default logged in user: Rahul Munda (Applicant) for immediate rich view
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('scholarship_active_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [isImpersonating, setIsImpersonating] = useState<boolean>(false);
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('scholarship_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('scholarship_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('scholarship_active_user');
    }
  }, [currentUser]);

  // Determine active role based on impersonation
  const effectiveUser = isImpersonating && impersonatedUser ? impersonatedUser : currentUser;
  const activeRole: Role = effectiveUser ? effectiveUser.role : 'APPLICANT';

  const login = async (email: string, _password?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.mobile.replace(/\s+/g, '') === cleanEmail.replace(/\s+/g, '')
    );

    if (!found) {
      return { success: false, message: 'Invalid credentials. User not found with this email/mobile.' };
    }

    if (!found.isActive) {
      return { success: false, message: 'Your account is currently deactivated. Please contact the administrator.' };
    }

    setCurrentUser(found);
    setIsImpersonating(false);
    setImpersonatedUser(null);
    return { success: true };
  };

  const quickLoginAsRole = (role: Role) => {
    const found = allUsers.find((u) => u.role === role && u.isActive);
    if (found) {
      setCurrentUser(found);
      setIsImpersonating(false);
      setImpersonatedUser(null);
    }
  };

  const registerApplicant = async (data: ApplicantRegistrationData): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail || u.mobile === data.mobile);
    if (existing) {
      return { success: false, message: 'An applicant account with this email or mobile number already exists.' };
    }

    // Mask Aadhaar per DPDP Act: XXXX-XXXX-1234
    const cleanAadhaar = data.aadhaarNumber.replace(/\D/g, '');
    const last4 = cleanAadhaar.slice(-4) || '1234';
    const aadhaarMasked = `XXXX-XXXX-${last4}`;

    const newApplicant: User = {
      id: `usr_applicant_${Date.now()}`,
      email: cleanEmail,
      fullName: data.fullName.trim(),
      role: 'APPLICANT',
      mobile: data.mobile,
      assignedState: data.state,
      district: data.district,
      caste: data.caste,
      aadhaarMasked,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}&backgroundColor=2563eb,7c3aed`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setAllUsers((prev) => [newApplicant, ...prev]);
    setCurrentUser(newApplicant);
    setIsImpersonating(false);
    setImpersonatedUser(null);

    return { success: true };
  };

  const impersonateRole = (role: Role, specificUserId?: string) => {
    if (currentUser?.role !== 'SUPER_ADMIN' && !isImpersonating) {
      console.warn('Impersonation is only available for Super Admin');
      return;
    }

    let target: User | undefined;
    if (specificUserId) {
      target = allUsers.find((u) => u.id === specificUserId);
    } else {
      target = allUsers.find((u) => u.role === role && u.isActive);
    }

    if (target) {
      setIsImpersonating(true);
      setImpersonatedUser(target);
    }
  };

  const exitImpersonation = () => {
    setIsImpersonating(false);
    setImpersonatedUser(null);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsImpersonating(false);
    setImpersonatedUser(null);
  };

  const updateUserStatus = (userId: string, isActive: boolean) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive } : u))
    );
  };

  const addNewUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${userData.role.toLowerCase()}_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAllUsers((prev) => [...prev, newUser]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: effectiveUser,
        activeRole,
        isImpersonating,
        impersonatedUser,
        allUsers,
        login,
        quickLoginAsRole,
        registerApplicant,
        impersonateRole,
        exitImpersonation,
        logout,
        updateUserStatus,
        addNewUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
