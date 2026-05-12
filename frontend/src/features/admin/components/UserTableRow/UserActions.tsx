import { motion } from "framer-motion";
import { Edit, Lock, Unlock, Trash2 } from "lucide-react";
import type { UserTableRowProps } from "./UserTableRow";

//Quản lý nhóm các nút hành động (Edit, Toggle, Delete) và logic hiển thị icon Lock/Unlock.
export const UserActions = ({
  user,
  onEdit,
  onToggleStatus,
  onDelete,
}: UserTableRowProps) => (
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
      onClick={() => onDelete(user.id)}
      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </motion.button>
  </div>
);
