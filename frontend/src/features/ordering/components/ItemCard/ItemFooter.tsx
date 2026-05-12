import { motion } from "framer-motion";
import type { MenuItemCardProps } from "./ItemCard";
import { Package, Plus } from "lucide-react";

//Hiển thị giá, danh mục và quản lý logic hiển thị nút bấm tương ứng.
export const ItemFooter = ({
  item,
  openComboModal,
  openCustomizationModal,
  addToCart,
}: Omit<MenuItemCardProps, "index" | "promotions">) => {
  const renderActionButton = () => {
    if (item.isCombo) {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openComboModal(item)}
          className="flex-1 py-2 bg-accent text-primary-foreground rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          style={{ fontWeight: 600, fontSize: "0.875rem" }}
        >
          <Package className="w-4 h-4" />
          Select Combo
        </motion.button>
      );
    }

    if (item.customizations && item.customizations.length > 0) {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openCustomizationModal(item)}
          className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          style={{ fontWeight: 600, fontSize: "0.875rem" }}
        >
          <Plus className="w-4 h-4" />
          Customize
        </motion.button>
      );
    }

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => addToCart(item)}
        className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
        style={{ fontWeight: 600, fontSize: "0.875rem" }}
      >
        <Plus className="w-4 h-4" />
        Add to Cart
      </motion.button>
    );
  };

  return (
    <div className="mt-auto">
      <div className="flex items-center justify-between mt-3">
        <span
          className="text-accent"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 700,
          }}
        >
          ${item.price}
        </span>
        <span
          className="px-2 py-1 bg-muted rounded text-muted-foreground"
          style={{ fontSize: "0.65rem", fontWeight: 600 }}
        >
          {item.category}
        </span>
      </div>
      <div className="flex gap-2 mt-3">{renderActionButton()}</div>
    </div>
  );
};
