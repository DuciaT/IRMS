import { motion } from "framer-motion";
import { X, DollarSign, CreditCard, Send } from "lucide-react";
import { type Bill } from "../../../../features/billing/types/types";
import { PaymentMethodButton } from "../../../ui/PaymentMethodButton";
import { BillDetails } from "./BillDetails";

interface PaymentModalProps {
  selectedBill: Bill;
  total: number;
  onClose: () => void;
  onProcess: (method: "cash" | "card" | "online") => void;
}

//Hiển thị tiêu đề và nút đóng (UI Header).
const PaymentHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
    <div className="flex items-center justify-between">
      <h2
        className="text-primary-foreground"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          fontWeight: 600,
        }}
      >
        Process Payment
      </h2>
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);

//Render danh sách các phương thức thanh toán.
const PaymentMethodSelector = ({
  onProcess,
}: {
  onProcess: (method: "cash" | "card" | "online") => void;
}) => {
  const methods = [
    { id: "cash" as const, icon: DollarSign, label: "Cash" },
    { id: "card" as const, icon: CreditCard, label: "Card" },
    { id: "online" as const, icon: Send, label: "E-Wallet" },
  ];

  return (
    <div>
      <p style={{ fontSize: "0.875rem", fontWeight: 600 }} className="mb-3">
        Select Payment Method
      </p>
      <div className="grid grid-cols-3 gap-4">
        {methods.map((method) => (
          <PaymentMethodButton
            key={method.id}
            icon={method.icon}
            label={method.label}
            onClick={() => onProcess(method.id)}
          />
        ))}
      </div>
    </div>
  );
};

//"Orchestrator" quản lý layout chính, overlay và hiệu ứng xuất hiện.
export const PaymentModal = ({
  selectedBill,
  total,
  onClose,
  onProcess,
}: PaymentModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full border border-border overflow-hidden max-h-[90vh] overflow-y-auto"
    >
      <PaymentHeader onClose={onClose} />
      <div className="p-6 space-y-6">
        <BillDetails selectedBill={selectedBill} total={total} />
        <PaymentMethodSelector onProcess={onProcess} />
      </div>
    </motion.div>
  </div>
);
