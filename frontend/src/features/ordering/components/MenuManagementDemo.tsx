import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";

export default function MenuManagement() {
  const menuItems = useStore((state) => state.menuItems);
  const promotions = useStore((state) => state.promotions);
  const addMenuItem = useStore((state) => state.addMenuItem);
  const updateMenuItem = useStore((state) => state.updateMenuItem);
  const deleteMenuItem = useStore((state) => state.deleteMenuItem);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  const sortedItems = [...menuItems].reverse();

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDisplayItems = sortedItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (currentPage > 1 && currentDisplayItems.length === 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentDisplayItems, currentPage]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    available: true,
    allergens: "",
    customizations: "",
    isCombo: false,
    comboItems: "",
    image: "", // Bổ sung trường image
  });

  const categories = [
    "Premium Mains",
    "Seafood",
    "Vegetarian",
    "Dessert",
    "Appetizers",
    "Combos",
    "Beverage",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "",
      price: 0,
      description: "",
      available: true,
      allergens: "",
      customizations: "",
      isCombo: false,
      comboItems: "",
      image: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      available: item.available,
      allergens: item.allergens?.join(", ") || "",
      customizations: item.customizations?.join(", ") || "",
      isCombo: item.isCombo || false,
      comboItems: item.comboItems?.join(", ") || "",
      image: item.image || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const menuItem = {
      id: editingItem?.id || `MENU-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      description: formData.description,
      available: formData.available,
      image: formData.image, // Lưu image vào object
      allergens: formData.allergens
        ? formData.allergens.split(",").map((a) => a.trim())
        : undefined,
      customizations: formData.customizations
        ? formData.customizations.split(",").map((c) => c.trim())
        : undefined,
      isCombo: formData.isCombo,
      comboItems: formData.comboItems
        ? formData.comboItems.split(",").map((c) => c.trim())
        : undefined,
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, menuItem);
      toast.success(`${menuItem.name} updated successfully!`);
    } else {
      addMenuItem(menuItem);
      toast.success(`${menuItem.name} added successfully!`);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMenuItem(id);
      toast.success(`${name} deleted successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Menu Management
          </h2>
          <p
            className="text-muted-foreground mt-1"
            style={{ fontSize: "0.875rem" }}
          >
            Manage menu items, prices, and availability
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
          style={{ fontWeight: 600 }}
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </motion.button>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[600px] content-start">
        {/* Sửa lại AnimatePresence: dùng key={currentPage} để Framer Motion nhận diện đổi trang là đổi cả cụm */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 col-span-full"
          >
            {currentDisplayItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05, // Hiệu ứng xuất hiện lần lượt (stagger)
                }}
                className="bg-card rounded-xl border border-border shadow-lg overflow-hidden flex flex-col"
              >
                <div className="h-52 bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2.5rem",
                      }}
                    >
                      🍽️
                    </span>
                  )}

                  {!item.available && (
                    <div
                      className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded"
                      style={{ fontSize: "0.65rem", fontWeight: 600 }}
                    >
                      OUT OF STOCK
                    </div>
                  )}
                  {item.available && (
                    <div
                      className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white rounded"
                      style={{ fontSize: "0.65rem", fontWeight: 600 }}
                    >
                      IN STOCK
                    </div>
                  )}
                  {item.isCombo && (
                    <div
                      className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground rounded"
                      style={{ fontSize: "0.65rem", fontWeight: 600 }}
                    >
                      COMBO
                    </div>
                  )}
                  {item.promotionId &&
                    promotions.find(
                      (p) => p.id === item.promotionId && p.active,
                    ) && (
                      <div
                        className="absolute bottom-2 left-2 px-2 py-1 bg-yellow-500 text-white rounded"
                        style={{ fontSize: "0.65rem", fontWeight: 600 }}
                      >
                        🎉 PROMO
                      </div>
                    )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>
                    {item.name}
                  </h3>
                  <p
                    className="text-muted-foreground mt-1 line-clamp-2"
                    style={{ fontSize: "0.75rem", lineHeight: 1.4 }}
                  >
                    {item.description}
                  </p>

                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      <AlertCircle className="w-3 h-3 text-orange-500" />
                      {item.allergens.map((allergen: string) => (
                        <span
                          key={allergen}
                          className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded"
                          style={{ fontSize: "0.625rem", fontWeight: 600 }}
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto">
                    {item.promotionId &&
                      (() => {
                        const promo = promotions.find(
                          (p) => p.id === item.promotionId && p.active,
                        );
                        if (promo) {
                          return (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                              <p
                                className="text-yellow-800"
                                style={{ fontSize: "0.75rem", fontWeight: 600 }}
                              >
                                {promo.name}:{" "}
                                {promo.type === "percentage"
                                  ? `${promo.value}% OFF`
                                  : `$${promo.value} OFF`}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}

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

                    <div className="flex gap-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEditModal(item)}
                        className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                        style={{ fontWeight: 600, fontSize: "0.875rem" }}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(item.id, item.name)}
                        className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                        style={{ fontWeight: 600, fontSize: "0.875rem" }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-border">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-2 rounded-full hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2 rounded-full hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
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
                      {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                    </h2>
                    <p
                      className="text-muted-foreground mt-1"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Fill in the menu item details
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Image Upload Section */}
                  <div className="col-span-2">
                    <label
                      className="block mb-2"
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      Item Image
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative h-40 w-full border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors overflow-hidden bg-muted/30"
                    >
                      {formData.image ? (
                        <>
                          <img
                            src={formData.image}
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
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      className="block mb-2"
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-2"
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
                    >
                      <option value="">Select category...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block mb-2"
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      Price ($) *
                    </label>
                    <input
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
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      className="block mb-2"
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none resize-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      className="block mb-2"
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      Allergens (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.allergens}
                      onChange={(e) =>
                        setFormData({ ...formData, allergens: e.target.value })
                      }
                      placeholder="e.g., dairy, gluten, nuts"
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      className="block mb-2"
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      Customizations (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.customizations}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customizations: e.target.value,
                        })
                      }
                      placeholder="e.g., cooking-level, sauce-type, spice-level"
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isCombo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isCombo: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-border text-primary focus:ring-accent"
                      />
                      <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                        This is a combo item
                      </span>
                    </label>
                  </div>

                  {formData.isCombo && (
                    <div className="col-span-2">
                      <label
                        className="block mb-2"
                        style={{ fontSize: "0.875rem", fontWeight: 600 }}
                      >
                        Select Combo Items *
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-3 bg-muted border border-border rounded-lg max-h-40 overflow-y-auto">
                        {menuItems
                          .filter(
                            (item) =>
                              !item.isCombo && item.id !== editingItem?.id,
                          ) // Lọc không cho chọn chính nó hoặc combo khác làm item con
                          .map((item) => {
                            const selectedIds = formData.comboItems
                              ? formData.comboItems
                                  .split(",")
                                  .map((id) => id.trim())
                              : [];
                            const isChecked = selectedIds.includes(item.id);

                            return (
                              <label
                                key={item.id}
                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                                  isChecked
                                    ? "bg-primary/10 border-primary/20"
                                    : "hover:bg-background/50"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    let newIds;
                                    if (e.target.checked) {
                                      newIds = [...selectedIds, item.id];
                                    } else {
                                      newIds = selectedIds.filter(
                                        (id) => id !== item.id,
                                      );
                                    }
                                    setFormData({
                                      ...formData,
                                      comboItems: newIds.join(", "),
                                    });
                                  }}
                                  className="w-4 h-4 rounded border-border text-primary focus:ring-accent"
                                />
                                <span className="text-xs truncate font-medium">
                                  {item.name}
                                </span>
                              </label>
                            );
                          })}
                      </div>
                      {/* <p className="text-[10px] text-muted-foreground mt-1 italic">
                        Selected: {formData.comboItems || "None"}
                      </p> */}
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.available}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            available: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-border text-primary focus:ring-accent"
                      />
                      <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                        Available for ordering
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
                    style={{ fontWeight: 600 }}
                  >
                    <Check className="w-4 h-4 inline mr-2" />
                    {editingItem ? "Update Item" : "Add Item"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
