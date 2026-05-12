import { useStore } from '../../../store/useStore';
import { type User, type UserRole, ROLE_PERMISSIONS } from '../types';

export const useAuthService = () => {
  const currentUser = useStore((state) => state.currentUser);
  const setUser = useStore((state) => state.setUser);
  const logout = useStore((state) => state.logout);

  const login = async (email: string, password: string): Promise<User | null> => {
    // Mock authentication - In production, this would call an API
    const mockUsers: Record<string, { password: string; user: User }> = {
      'manager@irms.com': {
        password: 'manager123',
        user: {
          id: 'USR-001',
          name: 'John Manager',
          email: 'manager@irms.com',
          role: 'manager',
          status: 'active',
          createdAt: new Date(),
        },
      },
      'server@irms.com': {
        password: 'server123',
        user: {
          id: 'USR-002',
          name: 'Sarah Server',
          email: 'server@irms.com',
          role: 'server',
          status: 'active',
          createdAt: new Date(),
        },
      },
      'chef@irms.com': {
        password: 'chef123',
        user: {
          id: 'USR-003',
          name: 'Mike Chef',
          email: 'chef@irms.com',
          role: 'chef',
          status: 'active',
          createdAt: new Date(),
        },
      },
      'cashier@irms.com': {
        password: 'cashier123',
        user: {
          id: 'USR-004',
          name: 'Emma Cashier',
          email: 'cashier@irms.com',
          role: 'cashier',
          status: 'active',
          createdAt: new Date(),
        },
      },
      'host@irms.com': {
        password: 'host123',
        user: {
          id: 'USR-005',
          name: 'David Host',
          email: 'host@irms.com',
          role: 'host',
          status: 'active',
          createdAt: new Date(),
        },
      },
      'admin@irms.com': {
        password: 'admin123',
        user: {
          id: 'USR-006',
          name: 'Admin User',
          email: 'admin@irms.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
        },
      },
    };

    const userCredentials = mockUsers[email];
    if (userCredentials && userCredentials.password === password) {
      const user = { ...userCredentials.user, lastLogin: new Date() };
      setUser(user);
      return user;
    }

    return null;
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;

    const userPermissions = ROLE_PERMISSIONS[currentUser.role];
    
    // Admin has all permissions
    if (userPermissions.includes('*')) return true;

    // Check exact match or wildcard match
    return userPermissions.some(p => {
      if (p === permission) return true;
      
      // Check wildcard permissions (e.g., "orders:*" matches "orders:read")
      const [resource, action] = p.split(':');
      const [reqResource, reqAction] = permission.split(':');
      
      return resource === reqResource && action === '*';
    });
  };

  const canAccessResource = (resource: string, action: string = 'read'): boolean => {
    return hasPermission(`${resource}:${action}`);
  };

  const getUserRole = (): UserRole | null => {
    return currentUser?.role || null;
  };

  const isAuthenticated = (): boolean => {
    return currentUser !== null;
  };

  return {
    currentUser,
    login,
    logout,
    hasPermission,
    canAccessResource,
    getUserRole,
    isAuthenticated,
  };
};
