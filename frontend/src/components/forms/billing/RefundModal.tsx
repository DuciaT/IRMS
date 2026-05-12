import { motion } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import { type Bill } from "../../../features/billing/types/types";

interface RefundModalProps {
  bill: Bill;
  reason: string;
  onReasonChange: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

//Hiển thị tiêu đề, thông tin hóa đơn và nút đóng.
const RefundHeader = ({
  bill,
  onClose,
}: {
  bill: Bill;
  onClose: () => void;
}) => (
  <div className="p-6 border-b border-border bg-orange-500/10">
    <div className="flex items-start justify-between">
      <div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          Process Refund
        </h2>
        <p
          className="text-muted-foreground mt-1"
          style={{ fontSize: "0.875rem" }}
        >
          Bill {bill.id} - ${bill.total.toFixed(2)}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);

//Quản lý phần nhập liệu lý do hoàn tiền.
const RefundReasonForm = ({
  reason,
  onReasonChange,
}: {
  reason: string;
  onReasonChange: (val: string) => void;
}) => (
  <div>
    <label
      className="block mb-2"
      style={{ fontSize: "0.875rem", fontWeight: 600 }}
    >
      Reason for Refund *
    </label>
    <textarea
      required
      value={reason}
      onChange={(e) => onReasonChange(e.target.value)}
      rows={4}
      placeholder="Explain why..."
      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none resize-none"
    />
  </div>
);

//Hiển thị thông tin cảnh báo về bảo mật/audit.
const RefundAuditAlert = () => (
  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
    <p style={{ fontSize: "0.875rem" }} className="text-orange-800">
      ⚠️ This action will be logged in the audit trail and requires manager
      approval.
    </p>
  </div>
);

//Quản lý các nút bấm tương tác (Xác nhận/Hủy).
const RefundActions = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <div className="flex gap-3 pt-4">
    <button
      onClick={onClose}
      className="flex-1 py-3 bg-muted text-foreground rounded-lg"
      style={{ fontWeight: 600 }}
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      className="flex-1 py-3 bg-orange-500 text-white rounded-lg"
      style={{ fontWeight: 600 }}
    >
      <RotateCcw className="w-4 h-4 inline mr-2" /> Process Refund
    </button>
  </div>
);

//Quản lý cấu trúc chính, hiệu ứng animation và overlay.
export const RefundModal = ({
  bill,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
}: RefundModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border"
    >
      <RefundHeader bill={bill} onClose={onClose} />
      <div className="p-6 space-y-4">
        <RefundReasonForm reason={reason} onReasonChange={onReasonChange} />

        <RefundAuditAlert />

        <RefundActions onClose={onClose} onConfirm={onConfirm} />
      </div>
    </motion.div>
  </div>
);
