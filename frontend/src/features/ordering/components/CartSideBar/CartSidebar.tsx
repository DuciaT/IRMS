import { motion } from "framer-motion";
import { ShoppingCart, Send } from "lucide-react";
import { type CartItem, type MenuItem } from "../../types/DOtypes";
import { CartItemRow } from "../CartItemRow/CartItemRow";
import { CartCustomerForm } from "./CartCustomerForm";

interface CartSidebarProps {
  cart: CartItem[];
  customerName: string;
  setCustomerName: (val: string) => void;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  partySize: number;
  setPartySize: (val: number) => void;
  selectedTable: string | null;
  setSelectedTable: (val: string) => void;
  availableTables: any[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateNotes: (id: string, notes: string) => void;
  cartTotal: number;
  submitOrder: () => void;
  menuItems: MenuItem[];
}

//Hiển thị và quản lý việc chọn bàn.
const CartTableSelector = ({
  selectedTable,
  setSelectedTable,
  availableTables,
}: any) => (
  <div className="mb-10">
    <label
      className="block mb-2"
      style={{ fontSize: "0.875rem", fontWeight: 600 }}
    >
      Select Table *
    </label>
    <select
      value={selectedTable || ""}
      onChange={(e) => setSelectedTable(e.target.value)}
      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
      style={{ fontWeight: 600 }}
    >
      <option value="">Choose a table...</option>
      {availableTables.map((table: any) => (
        <option key={table.id} value={table.id}>
          Table {table.number} ({table.seats} seats) - {table.status}
        </option>
      ))}
    </select>
  </div>
);

//Hiển thị danh sách sản phẩm hoặc trạng thái giỏ hàng trống.
const CartItemList = ({
  cart,
  menuItems,
  removeFromCart,
  updateQuantity,
  updateNotes,
}: any) => (
  <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(100vh-10px)]">
    {cart.length === 0 ? (
      <div className="text-center text-muted-foreground py-12">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p style={{ fontSize: "0.875rem" }}>Cart is empty</p>
        <p style={{ fontSize: "0.75rem" }}>Add items from the menu</p>
      </div>
    ) : (
      cart.map((item: any) => (
        <CartItemRow
          key={item.menuItemId}
          item={item}
          menuItems={menuItems}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          updateNotes={updateNotes}
        />
      ))
    )}
  </div>
);

//Hiển thị tổng tiền và nút gửi đơn hàng (Submit).
const CartSummary = ({ cartTotal, submitOrder, disabled }: any) => (
  <div className="p-6 border-t border-border bg-muted/20 mt-auto">
    <div className="flex items-center justify-between mb-4">
      <span style={{ fontSize: "1.125rem", fontWeight: 600 }}>
        Total Amount
      </span>
      <span
        className="text-accent"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          fontWeight: 700,
        }}
      >
        ${cartTotal.toFixed(2)}
      </span>
    </div>
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={submitOrder}
      disabled={disabled}
      className={`w-full py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
        !disabled
          ? "bg-primary text-primary-foreground hover:shadow-lg"
          : "bg-muted text-muted-foreground cursor-not-allowed"
      }`}
      style={{ fontWeight: 700 }}
    >
      <Send className="w-5 h-5" />
      Send to Kitchen
    </motion.button>
  </div>
);

export const CartSidebar = ({
  cart,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  partySize,
  setPartySize,
  selectedTable,
  setSelectedTable,
  availableTables,
  removeFromCart,
  updateQuantity,
  updateNotes,
  cartTotal,
  submitOrder,
  menuItems,
}: CartSidebarProps) => (
  <motion.aside
    initial={{ x: 400, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    className="w-[27%] bg-card border-2 border-border flex flex-col"
  >
    {/* Header & Form Section */}
    <div className="p-6 border-b border-border">
      <div className="flex items-center gap-3 mb-4">
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Order Cart</h2>
      </div>

      <CartCustomerForm
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        partySize={partySize}
        setPartySize={setPartySize}
      />

      <CartTableSelector
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        availableTables={availableTables}
      />
    </div>

    {/* Items Section */}
    <CartItemList
      cart={cart}
      menuItems={menuItems}
      removeFromCart={removeFromCart}
      updateQuantity={updateQuantity}
      updateNotes={updateNotes}
    />

    {/* Footer Section */}
    <CartSummary
      cartTotal={cartTotal}
      submitOrder={submitOrder}
      disabled={!selectedTable || cart.length === 0}
    />
  </motion.aside>
);
