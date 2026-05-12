export interface BillItem {
  name: string;
  quantity: number;
  total: number;
}

export interface Bill {
  id: string;
  orderId: string;
  tableId: string;
  customerName?: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: "pending" | "paid" | "cancelled" | "refunded";
  paymentMethod?: "cash" | "card" | "online";
  paidAt?: Date;
  tip?: number;
  serviceCharge?: number;
  discount?: number;
}

export interface Promotion {
  id: string;
  name: string;
  code?: string;
  type: "percentage" | "fixed";
  value: number;
  active: boolean;
  minOrderAmount?: number;
}
