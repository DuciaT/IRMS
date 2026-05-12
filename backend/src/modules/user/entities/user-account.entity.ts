import { StaffStatus } from '../staff-status.enum';
import { UserRole } from '../user-role.enum';

export interface UserAccount {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: StaffStatus;
  phone?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  lastLoginAt?: string;
}

export type SafeUserAccount = Omit<UserAccount, 'passwordHash'>;
