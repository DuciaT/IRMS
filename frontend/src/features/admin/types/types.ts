import { Shield, Users, type LucideIcon } from "lucide-react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "manager" | "server" | "chef" | "cashier" | "host" | "admin";
  status: "active" | "inactive";
  location: string;
  joinedDate: string;
}

export const roleConfig: Record<
  string,
  { color: string; label: string; icon: LucideIcon }
> = {
  manager: {
    color: "bg-purple-100 text-purple-700",
    label: "Manager",
    icon: Shield,
  },
  server: { color: "bg-blue-100 text-blue-700", label: "Server", icon: Users },
  chef: { color: "bg-orange-100 text-orange-700", label: "Chef", icon: Users },
  cashier: {
    color: "bg-green-100 text-green-700",
    label: "Cashier",
    icon: Users,
  },
  admin: { color: "bg-red-100 text-red-700", label: "Admin", icon: Shield },
};
