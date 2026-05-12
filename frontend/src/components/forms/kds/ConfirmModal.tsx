import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

//Hiển thị lớp nền mờ (backdrop) và bắt sự kiện click bên ngoài để đóng.
const ModalOverlay = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
  />
);

//Hiển thị icon cảnh báo, tiêu đề, mô tả ngắn và nút đóng "X".
const ModalHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
      <CheckCircle2 className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-xl font-bold">Accept Order</h3>
      <p className="text-muted-foreground text-sm">
        Confirm this order to proceed.
      </p>
    </div>
    <button
      onClick={onClose}
      className="ml-auto p-2 hover:bg-muted rounded-full transition-colors"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

//Quản lý các nút bấm xác nhận hoặc hủy bỏ, tách biệt logic xử lý sự kiện khỏi giao diện chính.
const ModalActions = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={onClose}
        className="flex-1 py-2.5 rounded-xl border-2 border-border font-semibold hover:bg-muted transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleConfirm}
        className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
      >
        Accept Order
      </button>
    </div>
  );
};

//Bộ khung (Layout)
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <ModalOverlay onClose={onClose} />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border-2 border-border rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="p-6">
              <ModalHeader onClose={onClose} />

              <p className="text-foreground mb-6">
                Are you sure you want to to accept this order?
              </p>

              <ModalActions onClose={onClose} onConfirm={onConfirm} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
