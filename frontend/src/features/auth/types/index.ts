// Authentication Service Types
export type UserRole = 'manager' | 'server' | 'chef' | 'cashier' | 'host' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// Role-based access control definitions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'], // Full access
  manager: [
    'orders:*',
    'tables:*',
    'kitchen:read',
    'billing:*',
    'inventory:*',
    'analytics:*',
    'users:read',
  ],
  server: [
    'orders:create',
    'orders:read',
    'orders:update',
    'tables:read',
    'tables:update',
  ],
  chef: [
    'kitchen:*',
    'inventory:read',
    'orders:read',
  ],
  cashier: [
    'billing:*',
    'orders:read',
  ],
  host: [
    'tables:*',
    'reservations:*',
  ],
};
