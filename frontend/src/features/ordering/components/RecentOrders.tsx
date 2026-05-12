import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, Package } from "lucide-react";
import { useMemo, useState } from "react";
import { type Order, type StatusConfig } from "../types/ROtypes";
import { OrderHeader } from "./OrderHeader/OrderHeader";
import { OrderRow } from "./OrderRow/OrderRow";
import { OrderPagination } from "./OrderPagination/OrderPagination";

const ORDERS_DATA: Order[] = [
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

const STATUS_MAP: StatusConfig = {
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

const TABLE_COLUMNS = [
  "ORDER ID",
  "CUSTOMER",
  "LOCATION",
  "ITEMS",
  "TOTAL",
  "STATUS",
  "TIME",
];

//Hiển thị tiêu đề bảng
const OrderTableHeader = ({ columns }: { columns: string[] }) => (
  <thead>
    <tr className="border-b border-border bg-muted/20">
      {columns.map((head) => (
        <th
          key={head}
          className="text-left p-4 text-muted-foreground"
          style={{ fontSize: "0.75rem", fontWeight: 600 }}
        >
          {head}
        </th>
      ))}
      <th className="p-4"></th>
    </tr>
  </thead>
);

export default function RecentOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredOrders = useMemo(() => {
    return ORDERS_DATA.filter(
      (order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.location.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-card rounded-xl border border-border shadow-lg overflow-hidden"
    >
      {/* Header chứa công cụ tìm kiếm */}
      <OrderHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <OrderTableHeader columns={TABLE_COLUMNS} />

          <tbody>
            {paginatedOrders.map((order, index) => (
              <OrderRow
                key={order.id}
                order={order}
                index={index}
                statusConfig={STATUS_MAP}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer chứa phân trang */}
      <OrderPagination
        startIndex={startIndex}
        endIndex={endIndex}
        totalFiltered={filteredOrders.length}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </motion.div>
  );
}
