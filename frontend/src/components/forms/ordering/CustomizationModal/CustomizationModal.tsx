import { motion } from "framer-motion";
import { X, Plus, AlertCircle } from "lucide-react";
import { type MenuItem } from "../../../../features/ordering/types/DOtypes";
import { CustomizationOption } from "./CustomizationOption";

interface CustomizationModalProps {
  selectedMenuItem: MenuItem;
  customizations: Record<string, string>;
  setCustomizations: (val: any) => void;
  setShowCustomModal: (val: boolean) => void;
  addToCartWithCustomization: () => void;
}

//Hiển thị tiêu đề và nút đóng.
const ModalHeader = ({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) => (
  <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
    <div className="flex items-start justify-between">
      <div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          Customize {name}
        </h2>
        <p
          className="text-muted-foreground mt-1"
          style={{ fontSize: "0.875rem" }}
        >
          Select your preferences
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

//Hiển thị cảnh báo dị ứng.
const AllergenWarning = ({ allergens }: { allergens?: string[] }) => {
  if (!allergens || allergens.length === 0) return null;
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
        <div>
          <p
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
            className="text-orange-800"
          >
            Allergen Information
          </p>
          <p className="text-orange-700 mt-1" style={{ fontSize: "0.75rem" }}>
            Contains: {allergens.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

//Quản lý các hành động (Cancel/Add to Cart).
const ModalFooter = ({
  onCancel,
  onAdd,
}: {
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
      className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
      style={{ fontWeight: 600 }}
    >
      <Plus className="w-4 h-4 inline mr-2" />
      Add to Cart
    </motion.button>
  </div>
);

//Làm khung (layout) cho Modal, điều phối việc hiển thị các thành phần con.
export const CustomizationModal = ({
  selectedMenuItem,
  customizations,
  setCustomizations,
  setShowCustomModal,
  addToCartWithCustomization,
}: CustomizationModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-card rounded-xl border border-border shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
    >
      {/* Modal Header */}
      <ModalHeader
        name={selectedMenuItem.name}
        onClose={() => setShowCustomModal(false)}
      />

      {/* Modal Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {selectedMenuItem.customizations?.map((type) => (
          <CustomizationOption
            key={type}
            type={type}
            value={customizations[type]}
            onChange={(val) =>
              setCustomizations({
                ...customizations,
                [type]: val,
              })
            }
          />
        ))}

        {/* Allergen Warning */}
        <AllergenWarning allergens={selectedMenuItem.allergens} />
      </div>

      {/* Modal Footer */}
      <ModalFooter
        onCancel={() => setShowCustomModal(false)}
        onAdd={addToCartWithCustomization}
      />
    </motion.div>
  </div>
);
