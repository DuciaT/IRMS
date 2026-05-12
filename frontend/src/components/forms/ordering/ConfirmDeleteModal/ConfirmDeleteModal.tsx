import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

//Hiển thị biểu tượng cảnh báo với style riêng biệt.
const ModalIcon = () => (
  <div className="p-3 bg-destructive/10 rounded-full text-destructive">
    <AlertTriangle className="w-6 h-6" />
  </div>
);

//Hiển thị tiêu đề và thông điệp xác nhận
const ModalContent = ({ itemName }: { itemName: string }) => (
  <>
    <div className="flex items-center gap-4 mb-4">
      <ModalIcon />
      <h3 className="text-xl font-bold">Confirm Delete?</h3>
    </div>
    <p className="text-muted-foreground mb-6">
      Are you sure you want to delete{" "}
      <span className="font-semibold text-foreground">"{itemName}"</span>? This
      action cannot be undone.
    </p>
  </>
);

//Quản lý các nút bấm điều hướng (Hủy/Xóa).
const ModalActionButtons = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <div className="flex gap-3">
    <button
      onClick={onClose}
      className="flex-1 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
    >
      Cancel
    </button>
    <button
      onClick={() => {
        onConfirm();
        onClose();
      }}
      className="flex-1 py-2.5 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
    >
      Delete Now
    </button>
  </div>
);

//Component chính, quản lý trạng thái hiển thị và layout tổng thể.
export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: ConfirmDeleteModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-background w-full max-w-md rounded-xl shadow-2xl p-6 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Body */}
            <ModalContent itemName={itemName} />

            {/* Footer Actions */}
            <ModalActionButtons onClose={onClose} onConfirm={onConfirm} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
