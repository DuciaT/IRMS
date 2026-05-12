import { motion } from "framer-motion";
import type { Bill } from "../../types/types";
import { RotateCcw, Printer } from "lucide-react";
import { StatusBadge } from "../../../../components/ui/StatusBadge";

//Hiển thị dữ liệu của một hóa đơn đơn lẻ và quản lý logic hiển thị các nút hành động dựa trên trạng thái (paymentStatus).
export const BillTableRow = ({
  bill,
  index,
  onProcess,
  onRefund,
  onPrint,
}: {
  bill: Bill;
  index: number;
  onProcess: (bill: Bill) => void;
  onRefund: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
}) => (
  <motion.tr
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="border-b border-border hover:bg-muted/20 transition-colors"
  >
    <td className="p-4" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
      {bill.id}
    </td>
    <td className="p-4" style={{ fontSize: "0.875rem" }}>
      {bill.customerName || "Guest"}
    </td>
    <td className="p-4">
      <span
        className="px-3 py-1 bg-primary/10 text-primary rounded-full"
        style={{ fontSize: "0.75rem", fontWeight: 600 }}
      >
        {bill.tableId}
      </span>
    </td>
    <td className="p-4 text-muted-foreground" style={{ fontSize: "0.875rem" }}>
      {bill.items.length} items
    </td>
    <td
      className="p-4"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.125rem",
        fontWeight: 700,
      }}
    >
      ${bill.total.toFixed(2)}
    </td>
    <td className="p-4">
      <StatusBadge status={bill.paymentStatus} />
    </td>
    <td className="p-4">
      <div className="flex gap-2">
        {bill.paymentStatus === "pending" ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onProcess(bill)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            Process
          </motion.button>
        ) : bill.paymentStatus === "paid" ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRefund(bill)}
              className="p-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPrint(bill)}
              className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </motion.button>
          </>
        ) : null}
      </div>
    </td>
  </motion.tr>
);
