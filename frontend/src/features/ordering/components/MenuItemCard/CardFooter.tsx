import { motion } from "framer-motion";
import type { MenuItemCardProps } from "./MenuItemCard";
import { Edit, Trash2 } from "lucide-react";
import { ConfirmDeleteModal } from "../../../../components/forms/ordering/ConfirmDeleteModal/ConfirmDeleteModal";
import { useState } from "react";

//Hiển thị giá, danh mục và các nút hành động điều khiển (Edit/Delete).
export const CardFooter = ({
  item,
  onEdit,
  onDelete,
}: Pick<MenuItemCardProps, "item" | "onEdit" | "onDelete">) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  return (
    <div className="mt-auto">
      <div className="flex items-center justify-between mt-3">
        <span
          className="text-accent font-bold text-xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ${item.price}
        </span>
        <span className="px-2 py-1 bg-muted rounded text-muted-foreground font-semibold text-[0.65rem]">
          {item.category}
        </span>
      </div>

      <div className="flex gap-2 mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(item)}
          className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2 font-semibold text-[0.875rem]"
        >
          <Edit className="w-4 h-4" /> Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2 font-semibold text-[0.875rem]"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </motion.button>
      </div>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(item.id, item.name)}
        itemName={item.name}
      />
    </div>
  );
};
