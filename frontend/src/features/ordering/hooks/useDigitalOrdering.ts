import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useStore } from "../../../store/useStore";
import { type CartItem, type MenuItem } from "../types/DOtypes";

export const useDigitalOrdering = () => {
  const menuItems = useStore((state) => state.menuItems) as MenuItem[];
  const promotions = useStore((state) => state.promotions);
  const tables = useStore((state) => state.tables);
  const addOrder = useStore((state) => state.addOrder);
  const updateTableWithCustomer = useStore(
    (state) => state.updateTableWithCustomer,
  );
  const addBill = useStore((state) => state.addBill);

  // States
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null,
  );
  const [customizations, setCustomizations] = useState<Record<string, string>>(
    {},
  );
  const [showComboModal, setShowComboModal] = useState(false);
  const [selectedComboItem, setSelectedComboItem] = useState<MenuItem | null>(
    null,
  );
  const [comboSelections, setComboSelections] = useState<string[]>([]);

  const itemsPerPage = 9;

  // Derived Data
  const categories = useMemo(
    () => ["All", ...new Set(menuItems.map((item) => item.category))],
    [menuItems],
  );

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory && item.available;
    });
  }, [menuItems, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const paginatedMenu = useMemo(() => {
    const reversedMenu = [...filteredMenu].reverse();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return reversedMenu.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMenu, currentPage]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, cartItem) => {
      const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);
      if (!menuItem) return total;
      let itemPrice = menuItem.price;
      if (menuItem.promotionId) {
        const promo = promotions.find(
          (p) => p.id === menuItem.promotionId && p.active,
        );
        if (promo) {
          if (promo.type === "percentage") itemPrice *= 1 - promo.value / 100;
          else if (promo.type === "fixed")
            itemPrice = Math.max(0, itemPrice - promo.value);
        }
      }
      return total + itemPrice * cartItem.quantity;
    }, 0);
  }, [cart, menuItems, promotions]);

  const availableTables = useMemo(
    () =>
      tables.filter((t) => t.status === "available" || t.status === "occupied"),
    [tables],
  );

  // Handlers
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const openCustomizationModal = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setCustomizations({});
    setShowCustomModal(true);
  };

  const openComboModal = (item: MenuItem) => {
    setSelectedComboItem(item);
    setComboSelections([]);
    setShowComboModal(true);
  };

  const addToCart = (
    item: MenuItem,
    customizationsData?: Record<string, string>,
    comboSelectionsData?: string[],
  ) => {
    const cartItem: CartItem = {
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      notes: "",
      customizations: customizationsData,
      comboSelections: comboSelectionsData,
    };
    setCart([...cart, cartItem]);
    toast.success(`${item.name} added to cart!`);
  };

  const addToCartWithCustomization = () => {
    if (selectedMenuItem) {
      addToCart(selectedMenuItem, customizations);
      setShowCustomModal(false);
      setSelectedMenuItem(null);
      setCustomizations({});
    }
  };

  const addToCartWithCombo = () => {
    if (selectedComboItem) {
      if (comboSelections.length === 0) {
        toast.error("Please select at least one item for the combo");
        return;
      }
      addToCart(selectedComboItem, undefined, comboSelections);
      setShowComboModal(false);
      setSelectedComboItem(null);
      setComboSelections([]);
    }
  };

  const toggleComboSelection = (itemId: string) => {
    setComboSelections((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const updateNotes = (menuItemId: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.menuItemId === menuItemId ? { ...item, notes } : item,
      ),
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => prev.filter((item) => item.menuItemId !== menuItemId));
  };

  const submitOrder = () => {
    if (
      !selectedTable ||
      cart.length === 0 ||
      !customerName ||
      !customerPhone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    const getPriority = () => {
      if (cartTotal > 200) return "urgent" as const;
      if (cartTotal > 100) return "high" as const;
      return "normal" as const;
    };
    const newOrder = {
      id: `ORD-${Date.now()}`,
      tableId: selectedTable,
      items: cart.map((item, idx) => ({
        id: `${Date.now()}-${idx}`,
        menuItemId: item.menuItemId,
        menuItemName: item.name,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes,
        status: "new" as const,
      })),
      status: "confirmed" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      serverId: "current-user",
      totalAmount: cartTotal,
      customerName,
      customerPhone,
      partySize,
      priority: getPriority(),
    };
    addOrder(newOrder);
    updateTableWithCustomer(selectedTable, "occupied", {
      customerName,
      customerPhone,
      partySize,
    });

    const taxRate = 0.1;
    const subtotal = cartTotal;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const newBill = {
      id: `BILL-${Date.now()}`,
      orderId: newOrder.id,
      tableId: selectedTable,
      customerName,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal,
      tax,
      tip: 0,
      total,
      paymentStatus: "pending" as const,
      createdAt: new Date(),
    };
    addBill(newBill);
    setCart([]);
    setSelectedTable(null);
    setCustomerName("");
    setCustomerPhone("");
    setPartySize(2);
    toast.success(
      `Order ${newOrder.id} submitted for ${customerName}! Bill ${newBill.id} created.`,
    );
  };

  return {
    states: {
      searchQuery,
      selectedCategory,
      currentPage,
      totalPages,
      paginatedMenu,
      categories,
      cart,
      customerName,
      customerPhone,
      partySize,
      selectedTable,
      availableTables,
      cartTotal,
      showCustomModal,
      selectedMenuItem,
      customizations,
      showComboModal,
      selectedComboItem,
      comboSelections,
      menuItems,
      promotions,
    },
    actions: {
      handleSearchChange,
      handleCategoryChange,
      setCurrentPage,
      openCustomizationModal,
      openComboModal,
      addToCart,
      updateQuantity,
      updateNotes,
      removeFromCart,
      submitOrder,
      setCustomerName,
      setCustomerPhone,
      setPartySize,
      setSelectedTable,
      setCustomizations,
      setShowCustomModal,
      addToCartWithCustomization,
      toggleComboSelection,
      setShowComboModal,
      addToCartWithCombo,
    },
  };
};
