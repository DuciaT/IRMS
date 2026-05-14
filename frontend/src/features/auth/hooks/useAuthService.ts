import { useStore } from "../../../store/useStore";
import { type User, type UserRole, ROLE_PERMISSIONS } from "../types";
import { useUserStore } from "../../../store/useUserStore";

export const useAuthService = () => {
  const currentUser = useStore((state) => state.currentUser);
  const setUser = useStore((state) => state.setUser);
  const logout = useStore((state) => state.logout);
  const { virtualDatabase } = useUserStore();

  const login = async (
    email: string,
    password: string,
  ): Promise<User | null> => {
    // Mock authentication - In production, this would call an API
    const record = virtualDatabase[email.toLowerCase()];

    if (record && record.password === password) {
      const user = { ...record.user, lastLogin: new Date() };
      setUser(user);
      return user;
    }

    return null;
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;

    const userPermissions = ROLE_PERMISSIONS[currentUser.role];

    // Admin has all permissions
    if (userPermissions.includes("*")) return true;

    // Check exact match or wildcard match
    return userPermissions.some((p) => {
      if (p === permission) return true;

      // Check wildcard permissions (e.g., "orders:*" matches "orders:read")
      const [resource, action] = p.split(":");
      const [reqResource, reqAction] = permission.split(":");

      return resource === reqResource && action === "*";
    });
  };

  const canAccessResource = (
    resource: string,
    action: string = "read",
  ): boolean => {
    return hasPermission(`${resource}:${action}`);
  };

  const getUserRole = (): UserRole | null => {
    return currentUser?.role || null;
  };

  const isAuthenticated = (): boolean => {
    return currentUser !== null;
  };

  return {
    currentUser: useStore((state) => state.currentUser),
    login,
    logout,
    hasPermission,
    canAccessResource,
    getUserRole,
    isAuthenticated,
  };
};
