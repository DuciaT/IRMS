export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SERVER = 'SERVER',
  CHEF = 'CHEF',
  CASHIER = 'CASHIER',
  HOST = 'HOST',
}

export const STAFF_ROLES = [
  UserRole.MANAGER,
  UserRole.SERVER,
  UserRole.CHEF,
  UserRole.CASHIER,
  UserRole.HOST,
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export function isUserRole(value: unknown): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}

export function isStaffRole(value: unknown): value is StaffRole {
  return STAFF_ROLES.includes(value as StaffRole);
}
