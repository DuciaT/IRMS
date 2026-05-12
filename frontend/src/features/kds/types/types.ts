export type OrderStatus = "new" | "cooking" | "ready" | "served" | "cancelled";
export type OrderPriority = "normal" | "high" | "urgent";

export interface OrderItemType {
  id: string;
  menuItemName: string;
  quantity: number;
  status: OrderStatus;
  notes?: string;
}

export interface OrderType {
  id: string;
  tableId: string;
  status: string;
  createdAt: Date;
  priority?: OrderPriority;
  items: OrderItemType[];
}

export interface UserType {
  role: "manager" | "server" | "chef" | "admin";
}

export interface TableType {
  id: string;
  number: number;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}
