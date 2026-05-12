import { type LucideIcon } from "lucide-react";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: OrderStatus;
  time: string;
  location: string;
}

export interface StatusConfig {
  [key: string]: {
    color: string;
    icon: LucideIcon;
    label: string;
  };
}
