import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import MenuItemCard from "../../../features/ordering/components/MenuItemCard/MenuItemCard";
import MenuModal from "../../../components/forms/ordering/MenuModal/MenuModal";
import MenuPagination from "./MenuPagination/MenuPagination";
import { useMenuManagement } from "../hooks/useMenuManagement";

const CATEGORIES = [
  "Premium Mains",
  "Seafood",
  "Vegetarian",
  "Dessert",
  "Appetizers",
  "Combos",
  "Beverage",
];

//Hiển thị tiêu đề và nút thêm mới
const MenuHeader = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex items-center justify-between">
    <div>
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Menu Management
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Manage menu items, prices, and availability
      </p>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onAdd}
      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg flex items-center gap-2 font-semibold"
    >
      <Plus className="w-5 h-5" /> Add Menu Item
    </motion.button>
  </div>
);

//Container hiển thị danh sách item với hiệu ứng AnimatePresence
const MenuGrid = ({
  items,
  currentPage,
  promotions,
  onEdit,
  onDelete,
}: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[600px] content-start">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 col-span-full"
      >
        {items.map((item: any, index: number) => (
          <MenuItemCard
            key={item.id}
            item={item}
            index={index}
            promotions={promotions}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  </div>
);

export default function MenuManagement() {
  const {
    menuItems,
    promotions,
    currentPage,
    setCurrentPage,
    showModal,
    setShowModal,
    editingItem,
    formData,
    setFormData,
    totalPages,
    currentDisplayItems,
    openAddModal,
    openEditModal,
    handleSubmit,
    handleDelete,
  } = useMenuManagement();

  return (
    <div className="space-y-6">
      <MenuHeader onAdd={openAddModal} />

      <MenuGrid
        items={currentDisplayItems}
        currentPage={currentPage}
        promotions={promotions}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />
      {totalPages > 1 && (
        <MenuPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <MenuModal
        show={showModal}
        onClose={() => setShowModal(false)}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        categories={CATEGORIES}
        menuItems={menuItems}
      />
    </div>
  );
}
