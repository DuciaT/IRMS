import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ImageIcon, Check } from "lucide-react";
import { useRef } from "react";
import {
  type MenuItem,
  type FormData,
} from "../../../../features/ordering/types/MMtypes";
import { toast } from "sonner";
import { ComboSelector } from "./ComboSelector";
import {
  CheckboxField,
  InputField,
  SelectField,
  TextAreaField,
} from "../../../ui/FieldWrapper";

interface MenuModalProps {
  show: boolean;
  onClose: () => void;
  editingItem: MenuItem | null;
  formData: FormData;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  categories: string[];
  menuItems: MenuItem[];
}

//Hiển thị tiêu đề và nút đóng.
const ModalHeader = ({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
}) => (
  <div className="p-6 border-b border-border bg-linear-to-r from-primary/10 to-accent/10">
    <div className="flex items-start justify-between">
      <div>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
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

//Hiển thị preview hình ảnh và tương tác với input file.
const ImageUploadField = ({ image, onClick, fileInputRef, onChange }: any) => (
  <div className="col-span-2">
    <label className="block mb-2 text-sm font-semibold">Item Image</label>
    <div
      onClick={onClick}
      className="relative h-40 w-full border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors overflow-hidden bg-muted/30"
    >
      {image ? (
        <>
          <img
            src={image}
            className="w-full h-full object-cover"
            alt="Preview"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Upload className="text-white w-8 h-8" />
          </div>
        </>
      ) : (
        <>
          <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">
            Click to upload image
          </span>
        </>
      )}
    </div>
    <input
      type="file"
      ref={fileInputRef}
      onChange={onChange}
      className="hidden"
      accept="image/*"
    />
  </div>
);

//Quản lý các nút bấm Submit và Cancel ở cuối form.
const FormActions = ({
  onClose,
  editingItem,
}: {
  onClose: () => void;
  editingItem: any;
}) => (
  <div className="flex gap-3 pt-4 border-t border-border">
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClose}
      className="flex-1 py-3 bg-muted text-foreground rounded-lg font-semibold"
    >
      Cancel
    </motion.button>
    <motion.button
      type="submit"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg"
    >
      <Check className="w-4 h-4 inline mr-2" />
      {editingItem ? "Update Item" : "Add Item"}
    </motion.button>
  </div>
);

//"Orchestrator" (người điều phối) quản lý trạng thái hiển thị (AnimatePresence) và bao bọc form.
export default function MenuModal({
  show,
  onClose,
  editingItem,
  formData,
  setFormData,
  handleSubmit,
  categories,
  menuItems,
}: MenuModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card rounded-xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <ModalHeader
              title={editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              subtitle="Fill in the menu item details"
              onClose={onClose}
            />

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <ImageUploadField
                  image={formData.image}
                  onClick={() => fileInputRef.current?.click()}
                  fileInputRef={fileInputRef}
                  onChange={handleImageChange}
                />

                <InputField
                  label="Item Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <SelectField
                  label="Category"
                  required
                  options={categories}
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />

                <InputField
                  label="Price ($)"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                />

                <TextAreaField
                  label="Description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                <InputField
                  label="Allergens (comma-separated)"
                  placeholder="e.g., dairy, gluten, nuts"
                  value={formData.allergens}
                  onChange={(e) =>
                    setFormData({ ...formData, allergens: e.target.value })
                  }
                />

                <InputField
                  label="Customizations (comma-separated)"
                  placeholder="e.g., cooking-level, sauce-type, spice-level"
                  value={formData.customizations}
                  onChange={(e) =>
                    setFormData({ ...formData, customizations: e.target.value })
                  }
                />

                <CheckboxField
                  label="This is a combo item"
                  checked={formData.isCombo}
                  onChange={(e) =>
                    setFormData({ ...formData, isCombo: e.target.checked })
                  }
                />

                {formData.isCombo && (
                  <ComboSelector
                    menuItems={menuItems}
                    editingItem={editingItem}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}

                <CheckboxField
                  label="Available for ordering"
                  checked={formData.available}
                  onChange={(e) =>
                    setFormData({ ...formData, available: e.target.checked })
                  }
                />
              </div>

              <FormActions onClose={onClose} editingItem={editingItem} />
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
