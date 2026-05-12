import { motion } from "framer-motion";
import {
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Order {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
  time: string;
  location: string;
}

const orders: Order[] = [
  {
    id: "#ORD-2847",
    customer: "Sarah Johnson",
    items: 3,
    total: "$127.50",
    status: "preparing",
    time: "5 min ago",
    location: "NYC - Manhattan",
  },
  {
    id: "#ORD-2846",
    customer: "Michael Chen",
    items: 2,
    total: "$89.00",
    status: "confirmed",
    time: "12 min ago",
    location: "Tokyo - Shibuya",
  },
  {
    id: "#ORD-2845",
    customer: "Emma Williams",
    items: 5,
    total: "$245.75",
    status: "delivered",
    time: "25 min ago",
    location: "London - Soho",
  },
  {
    id: "#ORD-2844",
    customer: "James Brown",
    items: 1,
    total: "$45.00",
    status: "pending",
    time: "32 min ago",
    location: "Paris - Le Marais",
  },
  {
    id: "#ORD-2843",
    customer: "Sophie Martin",
    items: 4,
    total: "$198.25",
    status: "preparing",
    time: "45 min ago",
    location: "Sydney - CBD",
  },
];

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
    label: "Pending",
  },
  confirmed: {
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle2,
    label: "Confirmed",
  },
  preparing: {
    color: "bg-purple-100 text-purple-700",
    icon: Package,
    label: "Preparing",
  },
  delivered: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
    label: "Delivered",
  },
  cancelled: {
    color: "bg-red-100 text-red-700",
    icon: XCircle,
    label: "Cancelled",
  },
};

export default function RecentOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    toast.success(`Order ${order.id} selected`);
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="bg-card rounded-xl border border-border shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-primary/20 bg-primary/80 text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              Recent Orders
            </h2>
            <p
              className="text-primary-foreground/80 mt-1"
              style={{ fontSize: "0.875rem" }}
            >
              Real-time order tracking across all locations
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-foreground/60" />
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg focus:bg-primary-foreground/20 focus:outline-none placeholder:text-primary-foreground/60 text-primary-foreground"
              style={{ fontSize: "0.875rem", width: "300px" }}
              placeholder="Search orders..."
              // ... logic giữ nguyên
            />
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th
                className="text-left p-4 text-muted-foreground"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                ORDER ID
              </th>
              <th
                className="text-left p-4 text-muted-foreground"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                CUSTOMER
              </th>
              <th
                className="text-left p-4 text-muted-foreground"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                LOCATION
              </th>
              <th
                className="text-left p-4 text-muted-foreground"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                ITEMS
              </th>
              <th
                className="text-left p-4 text-muted-foreground"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                TOTAL
              </th>
              <th
                className="text-left p-4 text-muted-foreground"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                STATUS
              </th>
              <th
                className="text-left p-4 text-muted-foreground"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                TIME
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order, index) => {
              const StatusIcon = statusConfig[order.status].icon;

              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="border-b border-border hover:bg-muted/20 transition-colors group"
                >
                  <td className="p-4">
                    <span
                      className="text-foreground"
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      {order.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white"
                        style={{ fontSize: "0.75rem", fontWeight: 600 }}
                      >
                        {order.customer.charAt(0)}
                      </div>
                      <span
                        className="text-foreground"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {order.customer}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className="text-muted-foreground"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {order.location}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className="text-foreground"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {order.items} items
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className="text-foreground"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {order.total}
                    </span>
                  </td>
                  <td className="p-4">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig[order.status].color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className="text-muted-foreground"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {order.time}
                    </span>
                  </td>
                  {/* <td className="p-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleOrderClick(order)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </motion.button>
                  </td> */}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
        <div className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)}{" "}
          of {filteredOrders.length} orders
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              currentPage === 1
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-primary text-primary-foreground hover:shadow-lg"
            }`}
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </motion.button>

          <span
            className="px-4 py-2 bg-muted rounded-lg"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            Page {currentPage} of {totalPages || 1}
          </span>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              currentPage >= totalPages
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-primary text-primary-foreground hover:shadow-lg"
            }`}
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
