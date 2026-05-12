// Role-Based Access Control Constants
import { type UserRole } from '../../features/auth/types/index';

export const ROLES: Record<string, UserRole> = {
  MANAGER: 'manager',
  SERVER: 'server',
  CHEF: 'chef',
  CASHIER: 'cashier',
  HOST: 'host',
  ADMIN: 'admin',
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  manager: 'Manager',
  server: 'Server/Waiter',
  chef: 'Chef/Kitchen Staff',
  cashier: 'Cashier',
  host: 'Host/Receptionist',
  admin: 'System Administrator',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  manager: 'Full access to all restaurant operations and analytics',
  server: 'Take orders, manage tables, and serve customers',
  chef: 'Manage kitchen operations and view inventory',
  cashier: 'Process payments and manage billing',
  host: 'Manage table assignments and reservations',
  admin: 'System administration and user management',
};

// Portal names for each role
export const PORTAL_NAMES: Record<UserRole, string> = {
  manager: 'Manager Portal',
  server: 'Server Portal',
  chef: 'Kitchen Portal',
  cashier: 'Cashier Portal',
  host: 'Host Portal',
  admin: 'Admin Portal',
};
