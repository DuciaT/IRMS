import { useState, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";
import { type MenuItem, type FormData } from "../types/MMtypes";

export const ITEMS_PER_PAGE = 9;

export function useMenuManagement() {
  const { menuItems, promotions, addMenuItem, updateMenuItem, deleteMenuItem } =
    useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState<FormData>({
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

  const sortedItems = [...menuItems].reverse();
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const currentDisplayItems = sortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (currentPage > 1 && currentDisplayItems.length === 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentDisplayItems.length, currentPage]);

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

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      available: item.available,
      image: item.image || "",
      allergens: item.allergens?.join(", ") || "",
      customizations: item.customizations?.join(", ") || "",
      isCombo: item.isCombo || false,
      comboItems: item.comboItems?.join(", ") || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const menuItem: MenuItem = {
      id: editingItem?.id || `MENU-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      description: formData.description,
      available: formData.available,
      image: formData.image,
      isCombo: formData.isCombo,
      allergens: formData.allergens
        ? formData.allergens.split(",").map((a) => a.trim())
        : undefined,
      customizations: formData.customizations
        ? formData.customizations.split(",").map((c) => c.trim())
        : undefined,
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
    deleteMenuItem(id);
    toast.success(`${name} deleted successfully!`);
  };

  return {
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
  };
}
