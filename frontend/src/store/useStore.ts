import { create } from "zustand";

export type UserRole =
  | "manager"
  | "server"
  | "chef"
  | "cashier"
  | "host"
  | "admin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  image?: string;
  customizations?: string[];
  allergens?: string[];
  isCombo?: boolean;
  comboItems?: string[]; // IDs of items in combo
  ingredients?: { ingredientId: string; quantity: number }[]; // For inventory tracking
  promotionId?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  notes?: string;
  customizations?: Record<string, any>;
  status: "new" | "cooking" | "ready" | "served" | "cancelled";
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "paid";
  createdAt: Date;
  updatedAt: Date;
  serverId: string;
  totalAmount: number;
  notes?: string;
  priority?: "normal" | "high" | "urgent";
  customerName?: string;
  customerPhone?: string;
  partySize?: number;
}

export type TableStatus =
  | "available"
  | "reserved"
  | "occupied"
  | "cleaning"
  | "out-of-service";

export interface Table {
  id: string;
  number: number;
  seats: number;
  status: TableStatus;
  currentOrder?: string;
  reservationId?: string;
  customerName?: string;
  customerPhone?: string;
  partySize?: number;
  reservationTime?: Date;
  x: number;
  y: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  partySize: number;
  dateTime: Date;
  tableId?: string;
  status: "pending" | "confirmed" | "seated" | "cancelled";
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minThreshold: number;
  status: "ok" | "low" | "out";
}

export interface Bill {
  id: string;
  orderId: string;
  tableId: string;
  customerName?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  paymentMethod?: "cash" | "card" | "online";
  paymentStatus: "pending" | "paid" | "cancelled";
  createdAt: Date;
  paidAt?: Date;
}

export interface WaitlistEntry {
  id: string;
  customerName: string;
  phone: string;
  partySize: number;
  createdAt: Date;
  estimatedWaitTime: number; // in minutes
  status: "waiting" | "seated" | "cancelled";
  notes?: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: "percentage" | "fixed" | "combo";
  value: number; // percentage or fixed amount
  applicableItems?: string[]; // menu item IDs
  minOrderAmount?: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
  code?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action:
    | "refund"
    | "void_bill"
    | "discount_override"
    | "price_adjustment"
    | "menu_update"
    | "user_change"
    | "inventory_adjust";
  targetType: "bill" | "order" | "menu" | "user" | "inventory";
  targetId: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface InventoryHistory {
  id: string;
  inventoryItemId: string;
  inventoryItemName: string;
  action: "add" | "remove" | "adjust" | "consumed";
  quantityChange: number;
  quantityAfter: number;
  performedBy: string;
  performedByName: string;
  reason?: string;
  relatedOrderId?: string;
  timestamp: Date;
}

interface AppState {
  currentUser: User | null;
  menuItems: MenuItem[];
  orders: Order[];
  tables: Table[];
  reservations: Reservation[];
  inventory: InventoryItem[];
  bills: Bill[];
  waitlist: WaitlistEntry[];
  promotions: Promotion[];
  auditLogs: AuditLog[];
  inventoryHistory: InventoryHistory[];

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderItemStatus: (
    orderId: string,
    itemId: string,
    status: OrderItem["status"],
  ) => void;
  updateTableStatus: (id: string, status: TableStatus) => void;
  updateTableWithCustomer: (
    id: string,
    status: TableStatus,
    customerInfo?: {
      customerName?: string;
      customerPhone?: string;
      partySize?: number;
      reservationTime?: Date;
    },
  ) => void;
  transferTable: (fromTableId: string, toTableId: string) => void;
  addTable: (table: Table) => void;
  deleteTable: (id: string) => void;
  addReservation: (reservation: Reservation) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  addMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventory: (
    id: string,
    quantity: number,
    reason?: string,
    userId?: string,
  ) => void;
  addBill: (bill: Bill) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  addToWaitlist: (entry: WaitlistEntry) => void;
  updateWaitlistEntry: (id: string, updates: Partial<WaitlistEntry>) => void;
  removeFromWaitlist: (id: string) => void;
  addPromotion: (promotion: Promotion) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  addAuditLog: (log: AuditLog) => void;
  addInventoryHistory: (history: InventoryHistory) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  menuItems: [
    {
      id: "1",
      name: "Wagyu Beef Tenderloin",
      category: "Premium Mains",
      price: 89,
      description: "Prime cut with truffle reduction and seasonal vegetables",
      available: true,
      allergens: ["gluten"],
      customizations: ["cooking-level", "sauce-type"],
    },
    {
      id: "2",
      name: "Mediterranean Sea Bass",
      category: "Seafood",
      price: 72,
      description: "Pan-seared with herbs de Provence and lemon butter",
      available: true,
      allergens: ["fish"],
    },
    {
      id: "3",
      name: "Lobster Thermidor",
      category: "Signature",
      price: 95,
      description: "Classic French preparation with cognac cream sauce",
      available: true,
      allergens: ["shellfish", "dairy"],
    },
    {
      id: "4",
      name: "Truffle Risotto",
      category: "Vegetarian",
      price: 48,
      description: "Creamy Arborio rice with black truffle shavings",
      available: true,
      allergens: ["dairy"],
    },
    {
      id: "5",
      name: "Chocolate Soufflé",
      category: "Dessert",
      price: 24,
      description: "Light and airy with vanilla ice cream",
      available: true,
      allergens: ["dairy", "eggs"],
    },
    {
      id: "6",
      name: "Duck Confit",
      category: "Premium Mains",
      price: 78,
      description:
        "Slow-cooked duck leg with orange glaze and roasted vegetables",
      available: true,
    },
    {
      id: "7",
      name: "Caesar Salad",
      category: "Appetizers",
      price: 18,
      description:
        "Crisp romaine lettuce with classic Caesar dressing and parmesan",
      available: true,
      ingredients: [
        { ingredientId: "INV-007", quantity: 0.2 },
        { ingredientId: "INV-008", quantity: 0.05 },
      ],
    },
    // {
    //   id: "8",
    //   name: "Premium Dinner Combo",
    //   category: "Combos",
    //   price: 145,
    //   description: "Wagyu Tenderloin + Truffle Risotto + Dessert of choice",
    //   available: true,
    //   isCombo: true,
    //   comboItems: ["1", "4", "5"],
    // },
    // {
    //   id: "9",
    //   name: "Seafood Feast Combo",
    //   category: "Combos",
    //   price: 155,
    //   description:
    //     "Mediterranean Sea Bass + Lobster Thermidor + Chocolate Soufflé",
    //   available: true,
    //   isCombo: true,
    //   comboItems: ["2", "3", "5"],
    // },
    {
      id: "10",
      name: "Classic Espresso",
      category: "Beverages",
      price: 5,
      description: "Rich Italian espresso",
      available: true,
    },
    {
      id: "11",
      name: "Cappuccino",
      category: "Beverages",
      price: 7,
      description: "Espresso with steamed milk and foam",
      available: true,
      allergens: ["dairy"],
    },
    {
      id: "12",
      name: "Fresh Orange Juice",
      category: "Beverages",
      price: 8,
      description: "Freshly squeezed orange juice",
      available: true,
    },
    {
      id: "13",
      name: "Mineral Water",
      category: "Beverages",
      price: 4,
      description: "Sparkling or still",
      available: true,
      customizations: ["size"],
    },
    {
      id: "14",
      name: "Red Wine (Glass)",
      category: "Beverages",
      price: 15,
      description: "Premium selection of red wines",
      available: true,
    },
    {
      id: "15",
      name: "White Wine (Glass)",
      category: "Beverages",
      price: 15,
      description: "Premium selection of white wines",
      available: true,
    },
    {
      id: "16",
      name: "Craft Beer",
      category: "Beverages",
      price: 9,
      description: "Selection of local craft beers",
      available: true,
    },
    {
      id: "17",
      name: "Green Tea",
      category: "Beverages",
      price: 6,
      description: "Premium Japanese green tea",
      available: true,
    },
    {
      id: "18",
      name: "Iced Latte",
      category: "Beverages",
      price: 8,
      description: "Chilled espresso with cold milk",
      available: true,
      allergens: ["dairy"],
    },
    {
      id: "19",
      name: "Lemonade",
      category: "Beverages",
      price: 6,
      description: "Homemade fresh lemonade",
      available: true,
    },
  ],

  orders: [
    {
      id: "ORD-001",
      tableId: "T2",
      items: [
        {
          id: "OI-001",
          menuItemId: "1",
          menuItemName: "Wagyu Beef Tenderloin",
          quantity: 2,
          price: 89,
          notes: "Medium rare, no salt",
          status: "cooking",
        },
        {
          id: "OI-002",
          menuItemId: "4",
          menuItemName: "Truffle Risotto",
          quantity: 1,
          price: 48,
          status: "new",
        },
      ],
      status: "preparing",
      createdAt: new Date(Date.now() - 15 * 60000),
      updatedAt: new Date(Date.now() - 5 * 60000),
      serverId: "USR-002",
      totalAmount: 226,
    },
    {
      id: "ORD-002",
      tableId: "T5",
      items: [
        {
          id: "OI-003",
          menuItemId: "3",
          menuItemName: "Lobster Thermidor",
          quantity: 1,
          price: 95,
          status: "ready",
        },
        {
          id: "OI-004",
          menuItemId: "2",
          menuItemName: "Mediterranean Sea Bass",
          quantity: 2,
          price: 72,
          status: "cooking",
        },
      ],
      status: "preparing",
      createdAt: new Date(Date.now() - 25 * 60000),
      updatedAt: new Date(Date.now() - 8 * 60000),
      serverId: "USR-002",
      totalAmount: 239,
    },
    {
      id: "ORD-003",
      tableId: "T7",
      items: [
        {
          id: "OI-005",
          menuItemId: "6",
          menuItemName: "Duck Confit",
          quantity: 3,
          price: 78,
          status: "served",
        },
        {
          id: "OI-006",
          menuItemId: "5",
          menuItemName: "Chocolate Soufflé",
          quantity: 2,
          price: 24,
          status: "new",
        },
      ],
      status: "delivered",
      createdAt: new Date(Date.now() - 45 * 60000),
      updatedAt: new Date(Date.now() - 10 * 60000),
      serverId: "USR-002",
      totalAmount: 282,
    },
  ],

  tables: [
    { id: "T1", number: 1, seats: 2, status: "available", x: 50, y: 50 },
    {
      id: "T2",
      number: 2,
      seats: 4,
      status: "occupied",
      currentOrder: "ORD-001",
      x: 200,
      y: 50,
    },
    { id: "T3", number: 3, seats: 4, status: "available", x: 350, y: 50 },
    {
      id: "T4",
      number: 4,
      seats: 6,
      status: "reserved",
      reservationId: "RES-001",
      x: 500,
      y: 50,
    },
    {
      id: "T5",
      number: 5,
      seats: 2,
      status: "occupied",
      currentOrder: "ORD-002",
      x: 50,
      y: 200,
    },
    { id: "T6", number: 6, seats: 4, status: "cleaning", x: 200, y: 200 },
    {
      id: "T7",
      number: 7,
      seats: 8,
      status: "occupied",
      currentOrder: "ORD-003",
      x: 350,
      y: 200,
    },
    { id: "T8", number: 8, seats: 4, status: "available", x: 500, y: 200 },
  ],

  reservations: [
    {
      id: "RES-001",
      customerName: "Robert Chen",
      phone: "+1 (555) 123-4567",
      partySize: 4,
      dateTime: new Date(Date.now() + 2 * 60 * 60000),
      tableId: "T4",
      status: "confirmed",
      notes: "Anniversary dinner, window seat preferred",
    },
    {
      id: "RES-002",
      customerName: "Maria Garcia",
      phone: "+1 (555) 234-5678",
      partySize: 6,
      dateTime: new Date(Date.now() + 4 * 60 * 60000),
      status: "pending",
      notes: "Birthday celebration",
    },
    {
      id: "RES-003",
      customerName: "David Smith",
      phone: "+1 (555) 345-6789",
      partySize: 2,
      dateTime: new Date(Date.now() + 6 * 60 * 60000),
      status: "confirmed",
    },
  ],

  inventory: [
    {
      id: "INV-001",
      name: "Wagyu Beef",
      unit: "kg",
      quantity: 25,
      minThreshold: 10,
      status: "ok",
    },
    {
      id: "INV-002",
      name: "Fresh Truffle",
      unit: "g",
      quantity: 150,
      minThreshold: 100,
      status: "ok",
    },
    {
      id: "INV-003",
      name: "Sea Bass",
      unit: "kg",
      quantity: 8,
      minThreshold: 15,
      status: "low",
    },
    {
      id: "INV-004",
      name: "Lobster",
      unit: "pc",
      quantity: 12,
      minThreshold: 5,
      status: "ok",
    },
    {
      id: "INV-005",
      name: "Arborio Rice",
      unit: "kg",
      quantity: 3,
      minThreshold: 10,
      status: "low",
    },
    {
      id: "INV-006",
      name: "Duck",
      unit: "pc",
      quantity: 8,
      minThreshold: 5,
      status: "ok",
    },
    {
      id: "INV-007",
      name: "Romaine Lettuce",
      unit: "kg",
      quantity: 15,
      minThreshold: 8,
      status: "ok",
    },
    {
      id: "INV-008",
      name: "Parmesan Cheese",
      unit: "kg",
      quantity: 4,
      minThreshold: 3,
      status: "ok",
    },
  ],

  bills: [
    {
      id: "BILL-001",
      orderId: "ORD-001",
      tableId: "T2",
      customerName: "John Doe",
      items: [
        {
          name: "Wagyu Beef Tenderloin",
          quantity: 2,
          price: 89,
          total: 178,
        },
        {
          name: "Truffle Risotto",
          quantity: 1,
          price: 48,
          total: 48,
        },
      ],
      subtotal: 226,
      tax: 22.6,
      tip: 22.6,
      total: 271.2,
      paymentMethod: "card",
      paymentStatus: "pending",
      createdAt: new Date(Date.now() - 15 * 60000),
      paidAt: new Date(Date.now() - 5 * 60000),
    },
    {
      id: "BILL-002",
      orderId: "ORD-002",
      tableId: "T5",
      customerName: "Jane Smith",
      items: [
        {
          name: "Lobster Thermidor",
          quantity: 1,
          price: 95,
          total: 95,
        },
        {
          name: "Mediterranean Sea Bass",
          quantity: 2,
          price: 72,
          total: 144,
        },
      ],
      subtotal: 239,
      tax: 23.9,
      tip: 23.9,
      total: 286.8,
      paymentMethod: "cash",
      paymentStatus: "paid",
      createdAt: new Date(Date.now() - 25 * 60000),
      paidAt: new Date(Date.now() - 8 * 60000),
    },
    {
      id: "BILL-003",
      orderId: "ORD-003",
      tableId: "T7",
      customerName: "Alice Johnson",
      items: [
        {
          name: "Duck Confit",
          quantity: 3,
          price: 78,
          total: 234,
        },
        {
          name: "Chocolate Soufflé",
          quantity: 2,
          price: 24,
          total: 48,
        },
      ],
      subtotal: 282,
      tax: 28.2,
      tip: 28.2,
      total: 338.4,
      paymentMethod: "online",
      paymentStatus: "paid",
      createdAt: new Date(Date.now() - 45 * 60000),
      paidAt: new Date(Date.now() - 10 * 60000),
    },
  ],

  waitlist: [
    {
      id: "WAIT-001",
      customerName: "Emily Brown",
      phone: "+1 (555) 987-6543",
      partySize: 4,
      createdAt: new Date(Date.now() - 10 * 60000),
      estimatedWaitTime: 25,
      status: "waiting",
      notes: "Prefer booth seating",
    },
    {
      id: "WAIT-002",
      customerName: "Chris Taylor",
      phone: "+1 (555) 876-5432",
      partySize: 2,
      createdAt: new Date(Date.now() - 5 * 60000),
      estimatedWaitTime: 15,
      status: "waiting",
    },
  ],

  promotions: [
    {
      id: "PROMO-001",
      name: "Weekend Special",
      description: "20% off on all premium mains",
      type: "percentage",
      value: 20,
      applicableItems: ["1", "6"],
      startDate: new Date("2026-04-19"),
      endDate: new Date("2026-04-20"),
      active: true,
      code: "WEEKEND20",
    },
    {
      id: "PROMO-002",
      name: "Happy Hour",
      description: "$10 off orders above $100",
      type: "fixed",
      value: 10,
      minOrderAmount: 100,
      startDate: new Date("2026-04-18"),
      endDate: new Date("2026-04-30"),
      active: true,
      code: "HAPPY10",
    },
  ],

  auditLogs: [
    {
      id: "AUDIT-001",
      userId: "USR-001",
      userName: "John Manager",
      action: "refund",
      targetType: "bill",
      targetId: "BILL-001",
      oldValue: { paymentStatus: "paid", total: 271.2 },
      newValue: { paymentStatus: "refunded", total: 0 },
      reason: "Customer complaint - food quality issue",
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      ipAddress: "192.168.1.100",
    },
    {
      id: "AUDIT-002",
      userId: "USR-001",
      userName: "John Manager",
      action: "price_adjustment",
      targetType: "bill",
      targetId: "BILL-002",
      oldValue: { subtotal: 239 },
      newValue: { subtotal: 215 },
      reason: "VIP customer discount",
      timestamp: new Date(Date.now() - 4 * 60 * 60000),
      ipAddress: "192.168.1.100",
    },
  ],

  inventoryHistory: [
    {
      id: "INVHIST-001",
      inventoryItemId: "INV-001",
      inventoryItemName: "Wagyu Beef",
      action: "consumed",
      quantityChange: -2,
      quantityAfter: 25,
      performedBy: "SYSTEM",
      performedByName: "Kitchen System",
      reason: "Order preparation",
      relatedOrderId: "ORD-001",
      timestamp: new Date(Date.now() - 1 * 60 * 60000),
    },
    {
      id: "INVHIST-002",
      inventoryItemId: "INV-005",
      inventoryItemName: "Arborio Rice",
      action: "add",
      quantityChange: 20,
      quantityAfter: 23,
      performedBy: "USR-001",
      performedByName: "John Manager",
      reason: "Weekly stock replenishment",
      timestamp: new Date(Date.now() - 12 * 60 * 60000),
    },
  ],

  setUser: (user) => set({ currentUser: user }),

  logout: () => set({ currentUser: null }),

  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),

  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id
          ? { ...order, ...updates, updatedAt: new Date() }
          : order,
      ),
    })),

  updateOrderItemStatus: (orderId, itemId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === itemId ? { ...item, status } : item,
              ),
              updatedAt: new Date(),
            }
          : order,
      ),
    })),

  updateTableStatus: (id, status) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === id ? { ...table, status } : table,
      ),
    })),

  updateTableWithCustomer: (id, status, customerInfo) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === id
          ? {
              ...table,
              status,
              customerName: customerInfo?.customerName,
              customerPhone: customerInfo?.customerPhone,
              partySize: customerInfo?.partySize,
              reservationTime: customerInfo?.reservationTime,
            }
          : table,
      ),
    })),

  transferTable: (fromTableId, toTableId) =>
    set((state) => {
      const fromTable = state.tables.find((t) => t.id === fromTableId);
      const toTable = state.tables.find((t) => t.id === toTableId);

      if (!fromTable || !toTable) return state;

      return {
        tables: state.tables.map((table) => {
          if (table.id === fromTableId) {
            return {
              ...table,
              status: "available" as const,
              currentOrder: undefined,
              customerName: undefined,
              customerPhone: undefined,
              partySize: undefined,
              reservationTime: undefined,
              reservationId: undefined,
            };
          }
          if (table.id === toTableId) {
            return {
              ...table,
              status: fromTable.status,
              currentOrder: fromTable.currentOrder,
              customerName: fromTable.customerName,
              customerPhone: fromTable.customerPhone,
              partySize: fromTable.partySize,
              reservationTime: fromTable.reservationTime,
              reservationId: fromTable.reservationId,
            };
          }
          return table;
        }),
        orders: state.orders.map((order) =>
          order.tableId === fromTableId
            ? { ...order, tableId: toTableId, updatedAt: new Date() }
            : order,
        ),
        bills: state.bills.map((bill) =>
          bill.tableId === fromTableId ? { ...bill, tableId: toTableId } : bill,
        ),
      };
    }),

  addTable: (table) =>
    set((state) => ({
      tables: [...state.tables, table],
    })),

  deleteTable: (id) =>
    set((state) => {
      const table = state.tables.find((t) => t.id === id);
      // Only allow deleting available tables
      if (table && table.status === "available") {
        return {
          tables: state.tables.filter((t) => t.id !== id),
        };
      }
      return state;
    }),

  addReservation: (reservation) =>
    set((state) => ({
      reservations: [...state.reservations, reservation],
    })),

  updateMenuItem: (id, updates) =>
    set((state) => {
      const currentUser = state.currentUser;
      const oldItem = state.menuItems.find((item) => item.id === id);

      if (currentUser && oldItem) {
        const auditLog: AuditLog = {
          id: `AUDIT-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: "menu_update",
          targetType: "menu",
          targetId: id,
          oldValue: oldItem,
          newValue: { ...oldItem, ...updates },
          timestamp: new Date(),
        };

        return {
          menuItems: state.menuItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
          auditLogs: [...state.auditLogs, auditLog],
        };
      }

      return {
        menuItems: state.menuItems.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      };
    }),

  addMenuItem: (item) =>
    set((state) => ({
      menuItems: [...state.menuItems, item],
    })),

  deleteMenuItem: (id) =>
    set((state) => ({
      menuItems: state.menuItems.filter((item) => item.id !== id),
    })),

  addInventoryItem: (item) =>
    set((state) => ({
      inventory: [...state.inventory, item],
    })),

  updateInventory: (id, quantity, reason, userId) =>
    set((state) => {
      const item = state.inventory.find((i) => i.id === id);
      if (!item) return state;

      const currentUser = state.currentUser;
      const quantityChange = quantity - item.quantity;
      const newQuantity = quantity;
      const status =
        newQuantity <= 0
          ? "out"
          : newQuantity < item.minThreshold
            ? "low"
            : "ok";

      const history: InventoryHistory = {
        id: `INVHIST-${Date.now()}`,
        inventoryItemId: id,
        inventoryItemName: item.name,
        action:
          quantityChange > 0 ? "add" : quantityChange < 0 ? "remove" : "adjust",
        quantityChange,
        quantityAfter: newQuantity,
        performedBy: userId || currentUser?.id || "SYSTEM",
        performedByName: currentUser?.name || "System",
        reason: reason || "Manual adjustment",
        timestamp: new Date(),
      };

      return {
        inventory: state.inventory.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: newQuantity, status };
          }
          return item;
        }),
        inventoryHistory: [...state.inventoryHistory, history],
      };
    }),

  addBill: (bill) =>
    set((state) => ({
      bills: [...state.bills, bill],
    })),

  updateBill: (id, updates) =>
    set((state) => ({
      bills: state.bills.map((bill) =>
        bill.id === id ? { ...bill, ...updates } : bill,
      ),
    })),

  addToWaitlist: (entry) =>
    set((state) => ({
      waitlist: [...state.waitlist, entry],
    })),

  updateWaitlistEntry: (id, updates) =>
    set((state) => ({
      waitlist: state.waitlist.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry,
      ),
    })),

  removeFromWaitlist: (id) =>
    set((state) => ({
      waitlist: state.waitlist.filter((entry) => entry.id !== id),
    })),

  addPromotion: (promotion) =>
    set((state) => ({
      promotions: [...state.promotions, promotion],
    })),

  updatePromotion: (id, updates) =>
    set((state) => ({
      promotions: state.promotions.map((promo) =>
        promo.id === id ? { ...promo, ...updates } : promo,
      ),
    })),

  deletePromotion: (id) =>
    set((state) => ({
      promotions: state.promotions.filter((promo) => promo.id !== id),
    })),

  addAuditLog: (log) =>
    set((state) => ({
      auditLogs: [...state.auditLogs, log],
    })),

  acceptOrder: (orderId: string) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId),
    })),

  addInventoryHistory: (history) =>
    set((state) => ({
      inventoryHistory: [...state.inventoryHistory, history],
    })),
}));
