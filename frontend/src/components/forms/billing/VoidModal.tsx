import { motion } from "framer-motion";
import { X, Ban } from "lucide-react";
import { type Bill } from "../../../features/billing/types/types";

interface VoidModalProps {
  bill: Bill;
  reason: string;
  onReasonChange: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const VoidModal = ({
  bill,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
}: VoidModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border"
    >
      <div className="p-6 border-b border-border bg-red-500/10">
        <div className="flex items-start justify-between">
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
              }}
            >
              Void Bill
            </h2>
            <p
              className="text-muted-foreground mt-1"
              style={{ fontSize: "0.875rem" }}
            >
              Bill {bill.id}
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
            Reason for Voiding *
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p style={{ fontSize: "0.875rem" }} className="text-red-800">
            🚨 This action is irreversible and will be logged in the audit
            trail.
          </p>
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
            className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-lg"
            style={{ fontWeight: 600 }}
          >
            <Ban className="w-4 h-4 inline mr-2" /> Void Bill
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);
