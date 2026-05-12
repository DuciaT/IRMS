import { motion } from "framer-motion";

//Quản lý nhóm các nút bấm hành động (Cancel/Submit) và các hiệu ứng animation
export const ModalActions = ({
  isEditing,
  onClose,
}: {
  isEditing: boolean;
  onClose: () => void;
}) => (
  <div className="flex gap-2 pt-4">
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClose}
      className="flex-1 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
      style={{ fontWeight: 600 }}
    >
      Cancel
    </motion.button>
    <motion.button
      type="submit"
      whileTap={{ scale: 0.95 }}
      className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow"
      style={{ fontWeight: 600 }}
    >
      {isEditing ? "Update User" : "Create User"}
    </motion.button>
  </div>
);
