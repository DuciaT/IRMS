import type { OrderItemType } from "../../types/types";
import type { OrderItemProps } from "./OrderItem";
import { Play, Check, Ban, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

//Logic hiển thị các nút điều hướng trạng thái dựa trên status hiện tại
export const ItemActions = ({
  item,
  orderId,
  onUpdateStatus,
}: {
  item: OrderItemType;
  orderId: string;
  onUpdateStatus: OrderItemProps["onUpdateStatus"];
}) => {
  return (
    <div className="flex gap-2 mt-3">
      {/* Action Buttons */}
      {item.status === "new" && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpdateStatus(orderId, item.id, "cooking")}
          className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-1"
          style={{ fontWeight: 600, fontSize: "0.75rem" }}
        >
          <Play className="w-3 h-3" /> Start
        </motion.button>
      )}

      {item.status === "cooking" && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpdateStatus(orderId, item.id, "ready")}
          className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-1"
          style={{ fontWeight: 600, fontSize: "0.75rem" }}
        >
          <Check className="w-3 h-3" /> Ready
        </motion.button>
      )}

      {(item.status === "new" || item.status === "cooking") && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpdateStatus(orderId, item.id, "cancelled")}
          className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-1"
          style={{ fontWeight: 600, fontSize: "0.75rem" }}
        >
          <Ban className="w-3 h-3" /> Cancel
        </motion.button>
      )}

      {/* Static Status Indicators */}
      {item.status === "ready" && (
        <div
          className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg flex items-center justify-center gap-1"
          style={{ fontWeight: 600, fontSize: "0.75rem" }}
        >
          <CheckCircle2 className="w-3 h-3" /> Ready for Service
        </div>
      )}

      {item.status === "cancelled" && (
        <div
          className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg flex items-center justify-center gap-1"
          style={{ fontWeight: 600, fontSize: "0.75rem" }}
        >
          <XCircle className="w-3 h-3" /> Cancelled
        </div>
      )}
    </div>
  );
};
