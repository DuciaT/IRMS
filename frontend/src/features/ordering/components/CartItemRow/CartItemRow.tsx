import { motion } from "framer-motion";
import { Trash2, Minus, Plus, Package } from "lucide-react";
import { type CartItem, type MenuItem } from "../../types/DOtypes";

interface CartItemRowProps {
  item: CartItem;
  menuItems: MenuItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateNotes: (id: string, notes: string) => void;
}

//Hiển thị thông tin cơ bản của món ăn (tên, giá) và các tùy chỉnh (customizations).
const CartItemInfo = ({ item }: { item: CartItem }) => (
  <div className="flex-1">
    <p style={{ fontWeight: 700 }}>{item.name}</p>
    <p
      className="text-accent"
      style={{ fontSize: "0.875rem", fontWeight: 600 }}
    >
      ${item.price} each
    </p>
    {item.customizations &&
      Object.entries(item.customizations).map(([key, value]) => (
        <p
          key={key}
          className="text-muted-foreground"
          style={{ fontSize: "0.7rem" }}
        >
          {key}: <span className="text-foreground">{value}</span>
        </p>
      ))}
  </div>
);

//Logic hiển thị danh sách các món trong combo.
const CartItemCombo = ({
  item,
  menuItems,
}: {
  item: CartItem;
  menuItems: MenuItem[];
}) => {
  if (!item.comboSelections || item.comboSelections.length === 0) return null;

  return (
    <div className="mt-1 space-y-0.5">
      <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>
        <Package className="w-3 h-3 inline mr-1" />
        Combo includes:
      </p>
      {item.comboSelections.map((id) => {
        const mi = menuItems.find((m) => m.id === id);
        return mi ? (
          <p
            key={id}
            className="text-foreground pl-4"
            style={{ fontSize: "0.7rem" }}
          >
            • {mi.name}
          </p>
        ) : null;
      })}
    </div>
  );
};

//Bộ điều khiển tăng/giảm số lượng và hiển thị tổng giá.
const CartItemQuantity = ({
  item,
  updateQuantity,
}: {
  item: CartItem;
  updateQuantity: (id: string, delta: number) => void;
}) => (
  <div className="flex items-center gap-3 mb-3">
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => updateQuantity(item.menuItemId, -1)}
      className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center"
    >
      <Minus className="w-4 h-4" />
    </motion.button>
    <span
      style={{
        fontWeight: 700,
        fontSize: "1.125rem",
        minWidth: "2rem",
        textAlign: "center",
      }}
    >
      {item.quantity}
    </span>
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => updateQuantity(item.menuItemId, 1)}
      className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"
    >
      <Plus className="w-4 h-4" />
    </motion.button>
    <span
      className="text-muted-foreground ml-auto"
      style={{ fontSize: "0.875rem" }}
    >
      Total: ${(item.price * item.quantity).toFixed(2)}
    </span>
  </div>
);

//Layout chính và điều phối dữ liệu giữa các thành phần con.
export const CartItemRow = ({
  item,
  menuItems,
  removeFromCart,
  updateQuantity,
  updateNotes,
}: CartItemRowProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-muted/20 rounded-lg p-4 border border-border"
  >
    {/* Header Section: Info & Remove Button */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <CartItemInfo item={item} />
        <CartItemCombo item={item} menuItems={menuItems} />
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => removeFromCart(item.menuItemId)}
        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>

    {/* Controls Section: Quantity & Total */}
    <CartItemQuantity item={item} updateQuantity={updateQuantity} />

    {/* Footer Section: Notes Input */}
    <input
      type="text"
      value={item.notes}
      onChange={(e) => updateNotes(item.menuItemId, e.target.value)}
      placeholder="Special instructions..."
      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-accent focus:outline-none text-sm"
    />
  </motion.div>
);
