import type { UserRole } from "../types/index";

export const ROLES_CONFIG = [
  {
    value: "manager" as UserRole,
    label: "Manager",
    color: "from-primary to-primary/80",
    email: "manager@gmail.com",
  },
  {
    value: "server" as UserRole,
    label: "Server / Waiter",
    color: "from-blue-600 to-blue-500",
    email: "server@gmail.com",
  },
  {
    value: "chef" as UserRole,
    label: "Chef / Kitchen",
    color: "from-orange-600 to-orange-500",
    email: "chef@gmail.com",
  },
  {
    value: "cashier" as UserRole,
    label: "Cashier",
    color: "from-green-600 to-green-500",
    email: "cashier@gmail.com",
  },
  {
    value: "admin" as UserRole,
    label: "System Admin",
    color: "from-red-600 to-red-500",
    email: "admin@gmail.com",
  },
];
