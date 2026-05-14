import { motion } from "framer-motion";
import { Edit, Lock, Unlock, Trash2 } from "lucide-react";
import type { UserTableRowProps } from "./UserTableRow";
import { useState } from "react";
import { DeleteUserModal } from "../../../../components/forms/admin/DeleteUserModal";

//Quản lý nhóm các nút hành động (Edit, Toggle, Delete) và logic hiển thị icon Lock/Unlock.
export const UserActions = ({
  user,
  onEdit,
  onToggleStatus,
  onDelete,
}: UserTableRowProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete(user.id);
  };
  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onEdit(user)}
        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        <Edit className="w-4 h-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggleStatus(user.id)}
        className={`p-2 rounded-lg transition-colors ${
          user.status === "active"
            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
        }`}
        title={user.status === "active" ? "Lock User" : "Unlock User"}
      >
        {user.status === "active" ? (
          <Lock className="w-4 h-4" />
        ) : (
          <Unlock className="w-4 h-4" />
        )}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsDeleteModalOpen(true)}
        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        title="Delete User"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
      {/* Confirmation Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        userName={user.name}
      />
    </div>
  );
};
