import { motion } from "framer-motion";
import { Package, X } from "lucide-react";
import { type MenuItem } from "../../../../features/ordering/types/DOtypes";
import { ComboItemCard } from "./ComboItemCard";

interface ComboModalProps {
  selectedComboItem: MenuItem;
  menuItems: MenuItem[];
  comboSelections: string[];
  toggleComboSelection: (id: string) => void;
  setShowComboModal: (val: boolean) => void;
  addToCartWithCombo: () => void;
}

//Hiển thị tiêu đề món combo và nút đóng Modal.
const ComboHeader = ({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) => (
  <div className="p-6 border-b border-border bg-gradient-to-r from-accent/10 to-primary/10">
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-accent" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            {name}
          </h2>
        </div>
        <p
          className="text-muted-foreground mt-1"
          style={{ fontSize: "0.875rem" }}
        >
          Select items for your combo
        </p>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg"
      >
        <X className="w-5 h-5" />
      </motion.button>
    </div>
  </div>
);

//Hiển thị các nút hành động (Cancel/Add) và thông tin tóm tắt số lượng đã chọn.
const ComboFooter = ({
  count,
  onCancel,
  onAdd,
}: {
  count: number;
  onCancel: () => void;
  onAdd: () => void;
}) => (
  <div className="p-6 border-t border-border bg-muted/20 flex gap-3">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onCancel}
      className="flex-1 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
      style={{ fontWeight: 600 }}
    >
      Cancel
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onAdd}
      className="flex-1 py-3 bg-accent text-primary-foreground rounded-lg hover:shadow-lg transition-all"
      style={{ fontWeight: 600 }}
    >
      <Package className="w-4 h-4 inline mr-2" />
      Add Combo ({count})
    </motion.button>
  </div>
);

export const ComboModal = ({
  selectedComboItem,
  menuItems,
  comboSelections,
  toggleComboSelection,
  setShowComboModal,
  addToCartWithCombo,
}: ComboModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-card rounded-xl border border-border shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
    >
      <ComboHeader
        name={selectedComboItem.name}
        onClose={() => setShowComboModal(false)}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        <p
          className="text-muted-foreground mb-4"
          style={{ fontSize: "0.75rem" }}
        >
          Selected: {comboSelections.length} /{" "}
          {selectedComboItem.comboItems?.length || 0}
        </p>

        {selectedComboItem.comboItems?.map((comboItemId) => {
          const comboItem = menuItems.find((mi) => mi.id === comboItemId);
          if (!comboItem) return null;

          return (
            <ComboItemCard
              key={comboItemId}
              item={comboItem}
              isSelected={comboSelections.includes(comboItemId)}
              onToggle={() => toggleComboSelection(comboItemId)}
            />
          );
        })}
      </div>

      <ComboFooter
        count={comboSelections.length}
        onCancel={() => setShowComboModal(false)}
        onAdd={addToCartWithCombo}
      />
    </motion.div>
  </div>
);
