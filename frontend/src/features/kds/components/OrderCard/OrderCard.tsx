import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { type OrderType, type OrderStatus } from "../../types/types";
import { OrderItem } from "../OrderItem/OrderItem";
import { OrderHeader } from "./OrderHeader";
import { OrderPriorityBadge } from "./OrderPriorityBadge";

interface OrderCardProps {
  order: OrderType;
  index: number;
  getTableNumber: (id: string) => string;
  getElapsedTime: (date: Date) => string;
  isNearDeadline: (date: Date) => boolean;
  isOverdue: (date: Date) => boolean;
  currentUser: any;
  isReadOnly: boolean;
  onUpdateStatus: (
    orderId: string,
    itemId: string,
    status: OrderStatus,
  ) => void;
  onAccept: (id: string) => void;
}

const getCardStyles = (
  overdue: boolean,
  nearDeadline: boolean,
  priority: string,
) => {
  if (overdue) return "border-red-500 shadow-lg shadow-red-500/20";
  if (nearDeadline) return "border-orange-400 shadow-lg shadow-orange-400/20";
  if (priority === "urgent")
    return "border-red-400 shadow-lg shadow-red-400/20";
  if (priority === "high")
    return "border-orange-300 shadow-lg shadow-orange-300/20";
  return "border-border";
};

const getHeaderBackground = (overdue: boolean, nearDeadline: boolean) => {
  if (overdue) return "bg-red-100";
  if (nearDeadline) return "bg-orange-100";
  return "bg-gradient-to-r from-primary/10 to-accent/10";
};

//Logic kiểm tra quyền (role) và nút xóa đơn hàng
const OrderAcceptButton = ({
  role,
  onAccept,
}: {
  role?: string;
  onAccept: () => void;
}) => {
  if (role !== "server") return null;
  return (
    <button
      onClick={onAccept}
      className="absolute top-2 right-2 z-10 p-1.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors shadow-md"
      title="Accept Order"
    >
      <Check className="w-4 h-4" />
    </button>
  );
};

//Quản lý layout chính, tính toán các trạng thái thời gian và điều phối dữ liệu vào các component con.
export const OrderCard = ({
  order,
  index,
  getTableNumber,
  getElapsedTime,
  isNearDeadline,
  isOverdue,
  currentUser,
  isReadOnly,
  onUpdateStatus,
  onAccept,
}: OrderCardProps) => {
  const overdue = isOverdue(order.createdAt);
  const nearDeadline = isNearDeadline(order.createdAt);
  const priority = order.priority || "normal";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`relative bg-card rounded-xl border-2 ${getCardStyles(overdue, nearDeadline, priority)} shadow-lg overflow-hidden`}
    >
      <OrderAcceptButton
        role={currentUser?.role}
        onAccept={() => onAccept(order.id)}
      />

      <div
        className={`p-4 ${getHeaderBackground(overdue, nearDeadline)} border-b border-border`}
      >
        <OrderHeader
          tableNumber={getTableNumber(order.tableId)}
          elapsedTime={getElapsedTime(order.createdAt)}
          orderId={order.id}
          overdue={overdue}
          nearDeadline={nearDeadline}
        />
        <OrderPriorityBadge
          priority={priority}
          overdue={overdue}
          nearDeadline={nearDeadline}
        />
      </div>

      <div className="p-4 space-y-3">
        {order.items.map((item) => (
          <OrderItem
            key={item.id}
            item={item}
            orderId={order.id}
            isReadOnly={isReadOnly}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </motion.div>
  );
};
