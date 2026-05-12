import { UserRole } from '../user/user-role.enum';

export interface RoleModuleView {
  key: string;
  label: string;
  path: string;
  permissions: string[];
}

export interface RoleView {
  role: UserRole;
  landingPath: string;
  modules: RoleModuleView[];
  permissions: string[];
}

export const ROLE_VIEWS: Record<UserRole, RoleView> = {
  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    landingPath: '/admin/staff',
    permissions: [
      'staff:read',
      'staff:create',
      'staff:update',
      'staff:lock',
      'staff:delete',
      'audit:read',
      'system:configure',
    ],
    modules: [
      {
        key: 'staff',
        label: 'Staff Accounts',
        path: '/admin/staff',
        permissions: [
          'staff:read',
          'staff:create',
          'staff:update',
          'staff:lock',
          'staff:delete',
        ],
      },
      {
        key: 'audit',
        label: 'Audit Log',
        path: '/admin/audit',
        permissions: ['audit:read'],
      },
      {
        key: 'system',
        label: 'System Access',
        path: '/admin/system',
        permissions: ['system:configure'],
      },
    ],
  },
  [UserRole.MANAGER]: {
    role: UserRole.MANAGER,
    landingPath: '/manager/reports',
    permissions: [
      'menu:read',
      'menu:update',
      'promotion:update',
      'inventory:read',
      'reports:read',
      'operations:read',
    ],
    modules: [
      {
        key: 'reports',
        label: 'Analytics & Reports',
        path: '/manager/reports',
        permissions: ['reports:read'],
      },
      {
        key: 'menu',
        label: 'Menu Management',
        path: '/manager/menu',
        permissions: ['menu:read', 'menu:update', 'promotion:update'],
      },
      {
        key: 'inventory',
        label: 'Inventory Monitoring',
        path: '/manager/inventory',
        permissions: ['inventory:read'],
      },
    ],
  },
  [UserRole.SERVER]: {
    role: UserRole.SERVER,
    landingPath: '/server/orders',
    permissions: [
      'menu:read',
      'order:create',
      'order:update',
      'table:read',
      'kitchen-status:read',
    ],
    modules: [
      {
        key: 'orders',
        label: 'Digital Ordering',
        path: '/server/orders',
        permissions: ['menu:read', 'order:create', 'order:update'],
      },
      {
        key: 'tables',
        label: 'Table Status',
        path: '/server/tables',
        permissions: ['table:read', 'kitchen-status:read'],
      },
    ],
  },
  [UserRole.CHEF]: {
    role: UserRole.CHEF,
    landingPath: '/kitchen',
    permissions: ['kds:read', 'kds:update', 'inventory:consume'],
    modules: [
      {
        key: 'kitchen',
        label: 'Kitchen Display',
        path: '/kitchen',
        permissions: ['kds:read', 'kds:update'],
      },
    ],
  },
  [UserRole.CASHIER]: {
    role: UserRole.CASHIER,
    landingPath: '/cashier/billing',
    permissions: [
      'bill:read',
      'bill:create',
      'payment:create',
      'receipt:export',
    ],
    modules: [
      {
        key: 'billing',
        label: 'Billing & Payment',
        path: '/cashier/billing',
        permissions: [
          'bill:read',
          'bill:create',
          'payment:create',
          'receipt:export',
        ],
      },
    ],
  },
  [UserRole.HOST]: {
    role: UserRole.HOST,
    landingPath: '/host/reservations',
    permissions: [
      'table:read',
      'reservation:create',
      'reservation:update',
      'waitlist:update',
    ],
    modules: [
      {
        key: 'reservations',
        label: 'Reservations',
        path: '/host/reservations',
        permissions: ['table:read', 'reservation:create', 'reservation:update'],
      },
      {
        key: 'waitlist',
        label: 'Waitlist',
        path: '/host/waitlist',
        permissions: ['waitlist:update'],
      },
    ],
  },
};

export function getRoleView(role: UserRole): RoleView {
  const roleView = ROLE_VIEWS[role];

  if (!roleView) {
    throw new Error(`Missing role view configuration for role ${role}.`);
  }

  return structuredClone(roleView);
}
