import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

//Xử lý hiển thị và tương tác của từng nút thanh toán.
export const PaymentMethodButton = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="p-6 bg-muted hover:bg-muted/80 rounded-xl border-2 border-border hover:border-primary transition-all"
  >
    <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
    <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>{label}</p>
  </motion.button>
);
