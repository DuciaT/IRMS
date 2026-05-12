import { motion } from "framer-motion";
import { X } from "lucide-react";

interface SplitBillModalProps {
  splitCount: number;
  splitAmounts: number[];
  totalBill: number;
  onClose: () => void;
  onSplitCountChange: (count: number) => void;
  onAmountChange: (index: number, value: number) => void;
  onConfirm: () => void;
}

export const SplitBillModal = ({
  splitCount,
  splitAmounts,
  totalBill,
  onClose,
  onSplitCountChange,
  onAmountChange,
  onConfirm,
}: SplitBillModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border"
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
              }}
            >
              Split Bill
            </h2>
            <p
              className="text-muted-foreground mt-1"
              style={{ fontSize: "0.875rem" }}
            >
              Divide bill into multiple payments
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
      <div className="p-6 space-y-4">
        <div>
          <label
            className="block mb-2"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            Number of splits
          </label>
          <input
            type="number"
            min="2"
            max="10"
            value={splitCount}
            onChange={(e) => onSplitCountChange(parseInt(e.target.value) || 2)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          {splitAmounts.map((amount, index) => (
            <div key={index}>
              <label
                className="block mb-1"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                Split {index + 1}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) =>
                  onAmountChange(index, parseFloat(e.target.value) || 0)
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
              />
            </div>
          ))}
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span style={{ fontSize: "0.875rem" }}>Total Bill</span>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              ${totalBill.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ fontSize: "0.875rem" }}>Total Split</span>
            <span
              style={{ fontSize: "0.875rem", fontWeight: 600 }}
              className="text-primary"
            >
              ${splitAmounts.reduce((sum, amt) => sum + amt, 0).toFixed(2)}
            </span>
          </div>
        </div>
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
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg"
            style={{ fontWeight: 600 }}
          >
            Confirm Split
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);
