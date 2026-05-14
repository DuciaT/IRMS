import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../features/admin/types/types";

interface UserRecord {
  password: string;
  user: User;
}

interface UserStore {
  users: User[];
  virtualDatabase: Record<string, UserRecord>;
  addVirtualUser: (email: string, data: UserRecord) => void;
  updateVirtualUser: (
    email: string,
    data: { password?: string; user: Partial<User> },
  ) => void;
  setInitialUsers: (users: User[]) => void;
  deleteVirtualUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      virtualDatabase: {
        "manager@gmail.com": {
          password: "manager123",
          user: {
            id: "USR-001",
            name: "John Manager",
            email: "manager@gmail.com",
            role: "manager",
            status: "active",
            createdAt: new Date(),
          },
        },
        "server@gmail.com": {
          password: "server123",
          user: {
            id: "USR-002",
            name: "Sarah Server",
            email: "server@gmail.com",
            role: "server",
            status: "active",
            createdAt: new Date(),
          },
        },
        "chef@gmail.com": {
          password: "chef123",
          user: {
            id: "USR-003",
            name: "Mike Chef",
            email: "chef@gmail.com",
            role: "chef",
            status: "active",
            createdAt: new Date(),
          },
        },
        "cashier@gmail.com": {
          password: "cashier123",
          user: {
            id: "USR-004",
            name: "Emma Cashier",
            email: "cashier@gmail.com",
            role: "cashier",
            status: "active",
            createdAt: new Date(),
          },
        },
        "host@gmail.com": {
          password: "host123",
          user: {
            id: "USR-005",
            name: "David Host",
            email: "host@gmail.com",
            role: "host",
            status: "active",
            createdAt: new Date(),
          },
        },
        "admin@gmail.com": {
          password: "admin123",
          user: {
            id: "USR-006",
            name: "Admin User",
            email: "admin@gmail.com",
            role: "admin",
            status: "active",
            createdAt: new Date(),
          },
        },
      },

      addVirtualUser: (email, data) =>
        set((state) => ({
          virtualDatabase: {
            ...state.virtualDatabase,
            [email.toLowerCase()]: data,
          },
          users: [data.user, ...state.users],
        })),

      updateVirtualUser: (email, data) =>
        set((state) => {
          const key = email.toLowerCase();
          const existing = state.virtualDatabase[key];
          if (!existing) return state;

          const updatedUser = { ...existing.user, ...data.user };
          return {
            virtualDatabase: {
              ...state.virtualDatabase,
              [key]: {
                password: data.password || existing.password,
                user: updatedUser,
              },
            },
            users: state.users.map((u) =>
              u.email.toLowerCase() === key ? updatedUser : u,
            ),
          };
        }),
      deleteVirtualUser: (userId) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
          virtualDatabase: Object.fromEntries(
            Object.entries(state.virtualDatabase).filter(
              ([_, record]) => record.user.id !== userId,
            ),
          ),
        })),

      toggleUserStatus: (userId) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? { ...u, status: u.status === "active" ? "inactive" : "active" }
              : u,
          ),
        })),

      setInitialUsers: (initialUsers) =>
        set((state) => ({
          users: state.users.length === 0 ? initialUsers : state.users,
        })),
    }),
    { name: "irms-virtual-db-v1" },
  ),
);
