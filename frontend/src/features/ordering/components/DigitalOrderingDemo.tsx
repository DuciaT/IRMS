import { motion } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  Search,
  AlertCircle,
  X,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useStore } from "../../../store/useStore";
import { useState } from "react";
import { toast } from "sonner";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
  customizations?: Record<string, string>;
  comboSelections?: string[]; // IDs of selected combo items
}

export default function DigitalOrdering() {
  const menuItems = useStore((state) => state.menuItems);
  const promotions = useStore((state) => state.promotions);
  const tables = useStore((state) => state.tables);
  const addOrder = useStore((state) => state.addOrder);
  const updateTableWithCustomer = useStore(
    (state) => state.updateTableWithCustomer,
  );
  const addBill = useStore((state) => state.addBill);

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Customer info fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [partySize, setPartySize] = useState(2);

  // Customization modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<
    (typeof menuItems)[0] | null
  >(null);
  const [customizations, setCustomizations] = useState<Record<string, string>>(
    {},
  );

  // Combo selection modal
  const [showComboModal, setShowComboModal] = useState(false);
  const [selectedComboItem, setSelectedComboItem] = useState<
    (typeof menuItems)[0] | null
  >(null);
  const [comboSelections, setComboSelections] = useState<string[]>([]);

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredMenu = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const reversedMenu = [...filteredMenu].reverse();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMenu = reversedMenu.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const openCustomizationModal = (item: (typeof menuItems)[0]) => {
    setSelectedMenuItem(item);
    setCustomizations({});
    setShowCustomModal(true);
  };

  const openComboModal = (item: (typeof menuItems)[0]) => {
    setSelectedComboItem(item);
    setComboSelections([]);
    setShowComboModal(true);
  };

  const addToCart = (
    item: (typeof menuItems)[0],
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
    if (comboSelections.includes(itemId)) {
      setComboSelections(comboSelections.filter((id) => id !== itemId));
    } else {
      setComboSelections([...comboSelections, itemId]);
    }
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.menuItemId === menuItemId) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const updateNotes = (menuItemId: string, notes: string) => {
    setCart(
      cart.map((item) =>
        item.menuItemId === menuItemId ? { ...item, notes } : item,
      ),
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(cart.filter((item) => item.menuItemId !== menuItemId));
  };

  // Calculate cart total with promotions
  const calculateCartTotal = () => {
    let total = 0;
    cart.forEach((cartItem) => {
      const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);
      if (menuItem) {
        let itemPrice = menuItem.price;

        // Apply promotion if exists
        if (menuItem.promotionId) {
          const promo = promotions.find(
            (p) => p.id === menuItem.promotionId && p.active,
          );
          if (promo) {
            if (promo.type === "percentage") {
              itemPrice = itemPrice * (1 - promo.value / 100);
            } else if (promo.type === "fixed") {
              itemPrice = Math.max(0, itemPrice - promo.value);
            }
          }
        }

        total += itemPrice * cartItem.quantity;
      }
    });
    return total;
  };

  const cartTotal = calculateCartTotal();

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

    // Calculate priority based on cart size
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
      customerName: customerName,
      customerPhone: customerPhone,
      partySize: partySize,
      priority: getPriority(),
    };

    addOrder(newOrder);
    updateTableWithCustomer(selectedTable, "occupied", {
      customerName: customerName,
      customerPhone: customerPhone,
      partySize: partySize,
    });

    // Create bill automatically
    const taxRate = 0.1; // 10% tax
    const subtotal = cartTotal;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const newBill = {
      id: `BILL-${Date.now()}`,
      orderId: newOrder.id,
      tableId: selectedTable,
      customerName: customerName,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal: subtotal,
      tax: tax,
      tip: 0,
      total: total,
      paymentStatus: "pending" as const,
      createdAt: new Date(),
    };

    addBill(newBill);

    // Reset form
    setCart([]);
    setSelectedTable(null);
    setCustomerName("");
    setCustomerPhone("");
    setPartySize(2);

    toast.success(
      `Order ${newOrder.id} submitted for ${customerName}! Bill ${newBill.id} created.`,
    );
  };

  const availableTables = tables.filter(
    (t) => t.status === "available" || t.status === "occupied",
  );

  return (
    <div className="size-full bg-background flex">
      {/* Menu Section */}
      <div className="w-[73%] flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card border-2 border-border p-6"
        >
          <h1
            className="mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 700,
            }}
          >
            Digital Ordering
          </h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted hover:bg-muted/80"
                }`}
                style={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.header>

        {/* Menu Grid */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginatedMenu.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -4 }}
                className="bg-card rounded-xl border border-border shadow-lg overflow-hidden h-full flex flex-col"
              >
                <div className="h-40 bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
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
                        fontSize: "3rem",
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
                  {item.promotionId &&
                    promotions.find(
                      (p) => p.id === item.promotionId && p.active,
                    ) && (
                      <div
                        className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white rounded"
                        style={{ fontSize: "0.65rem", fontWeight: 600 }}
                      >
                        🎉 PROMO
                      </div>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>
                      {item.name}
                    </h3>
                    {item.isCombo && (
                      <span
                        className="px-2 py-1 bg-accent/20 text-accent rounded-full flex items-center gap-1"
                        style={{ fontSize: "0.625rem", fontWeight: 700 }}
                      >
                        <Package className="w-3 h-3" />
                        COMBO
                      </span>
                    )}
                  </div>
                  <p
                    className="text-muted-foreground mt-1 flex-1"
                    style={{ fontSize: "0.75rem", lineHeight: 1.4 }}
                  >
                    {item.description}
                  </p>

                  {/* Allergens */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      <AlertCircle className="w-3 h-3 text-orange-500" />
                      {item.allergens.map((allergen) => (
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

                  {/* Promotion Info */}
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

                  <div className="flex gap-2 mt-3">
                    {item.isCombo ? (
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
                    ) : item.customizations &&
                      item.customizations.length > 0 ? (
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
                    ) : (
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
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  currentPage === 1
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:shadow-lg"
                }`}
                style={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <motion.button
                      key={page}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {page}
                    </motion.button>
                  ),
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  currentPage === totalPages
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:shadow-lg"
                }`}
                style={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </main>
      </div>

      {/* Cart Sidebar */}
      <motion.aside
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-[27%] bg-card border-2 border-border flex flex-col"
      >
        {/* Cart Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Order Cart</h2>
          </div>

          {/* Customer Info */}
          <div className="space-y-3 mb-4">
            <div>
              <label
                className="block mb-2"
                style={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                Customer Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label
                className="block mb-2"
                style={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                Phone Number *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label
                className="block mb-2"
                style={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                Party Size
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={partySize}
                onChange={(e) => setPartySize(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Table Selection */}
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
              {availableTables.map((table) => (
                <option key={table.id} value={table.id}>
                  Table {table.number} ({table.seats} seats) - {table.status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(100vh-10px)]">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p style={{ fontSize: "0.875rem" }}>Cart is empty</p>
              <p style={{ fontSize: "0.75rem" }}>Add items from the menu</p>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.menuItemId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-muted/20 rounded-lg p-4 border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p style={{ fontWeight: 700 }}>{item.name}</p>
                    <p
                      className="text-accent"
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      ${item.price} each
                    </p>
                    {item.customizations &&
                      Object.keys(item.customizations).length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {Object.entries(item.customizations).map(
                            ([key, value]) => (
                              <p
                                key={key}
                                className="text-muted-foreground"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {key}:{" "}
                                <span className="text-foreground">{value}</span>
                              </p>
                            ),
                          )}
                        </div>
                      )}
                    {item.comboSelections &&
                      item.comboSelections.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          <p
                            className="text-muted-foreground"
                            style={{ fontSize: "0.7rem" }}
                          >
                            <Package className="w-3 h-3 inline mr-1" />
                            Combo includes:
                          </p>
                          {item.comboSelections.map((comboItemId) => {
                            const comboItem = menuItems.find(
                              (mi) => mi.id === comboItemId,
                            );
                            return comboItem ? (
                              <p
                                key={comboItemId}
                                className="text-foreground pl-4"
                                style={{ fontSize: "0.7rem" }}
                              >
                                • {comboItem.name}
                              </p>
                            ) : null;
                          })}
                        </div>
                      )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromCart(item.menuItemId)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

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

                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => updateNotes(item.menuItemId, e.target.value)}
                  placeholder="Special instructions..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-accent focus:outline-none text-sm"
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Cart Footer */}
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={submitOrder}
            disabled={!selectedTable || cart.length === 0}
            className={`w-full py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
              selectedTable && cart.length > 0
                ? "bg-primary text-primary-foreground hover:shadow-lg"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            style={{ fontWeight: 700 }}
          >
            <Send className="w-5 h-5" />
            Send to Kitchen
          </motion.button>
        </div>
      </motion.aside>

      {/* Customization Modal */}
      {showCustomModal && selectedMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-xl border border-border shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
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
                    Customize {selectedMenuItem.name}
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
                  onClick={() => setShowCustomModal(false)}
                  className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedMenuItem.customizations?.map((customizationType) => (
                <div key={customizationType} className="space-y-2">
                  <label
                    className="block"
                    style={{ fontSize: "0.875rem", fontWeight: 600 }}
                  >
                    {customizationType === "cooking-level" && "Cooking Level"}
                    {customizationType === "sauce-type" && "Sauce Type"}
                    {customizationType === "spice-level" && "Spice Level"}
                    {customizationType === "size" && "Size"}
                  </label>
                  <select
                    value={customizations[customizationType] || ""}
                    onChange={(e) =>
                      setCustomizations({
                        ...customizations,
                        [customizationType]: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
                  >
                    <option value="">Select option...</option>
                    {customizationType === "cooking-level" && (
                      <>
                        <option value="rare">Rare</option>
                        <option value="medium-rare">Medium Rare</option>
                        <option value="medium">Medium</option>
                        <option value="medium-well">Medium Well</option>
                        <option value="well-done">Well Done</option>
                      </>
                    )}
                    {customizationType === "sauce-type" && (
                      <>
                        <option value="truffle">Truffle Reduction</option>
                        <option value="pepper">Pepper Sauce</option>
                        <option value="mushroom">Mushroom Sauce</option>
                        <option value="none">No Sauce</option>
                      </>
                    )}
                    {customizationType === "spice-level" && (
                      <>
                        <option value="mild">Mild</option>
                        <option value="medium">Medium</option>
                        <option value="hot">Hot</option>
                        <option value="extra-hot">Extra Hot</option>
                      </>
                    )}
                    {customizationType === "size" && (
                      <>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </>
                    )}
                  </select>
                </div>
              ))}

              {/* Allergen Warning */}
              {selectedMenuItem.allergens &&
                selectedMenuItem.allergens.length > 0 && (
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
                        <p
                          className="text-orange-700 mt-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Contains: {selectedMenuItem.allergens.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-muted/20 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCustomModal(false)}
                className="flex-1 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addToCartWithCustomization}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
                style={{ fontWeight: 600 }}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Combo Selection Modal */}
      {showComboModal && selectedComboItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-xl border border-border shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
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
                      {selectedComboItem.name}
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
                  onClick={() => setShowComboModal(false)}
                  className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Modal Body */}
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

                const isSelected = comboSelections.includes(comboItemId);

                return (
                  <motion.div
                    key={comboItemId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleComboSelection(comboItemId)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10"
                        : "border-border bg-muted/20 hover:border-muted"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                          isSelected
                            ? "border-accent bg-accent"
                            : "border-border bg-background"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-primary-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                          {comboItem.name}
                        </p>
                        <p
                          className="text-muted-foreground mt-0.5"
                          style={{ fontSize: "0.75rem", lineHeight: 1.4 }}
                        >
                          {comboItem.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className="text-accent"
                            style={{ fontSize: "0.875rem", fontWeight: 600 }}
                          >
                            ${comboItem.price}
                          </span>
                          <span
                            className="px-2 py-0.5 bg-muted rounded text-muted-foreground"
                            style={{ fontSize: "0.625rem", fontWeight: 600 }}
                          >
                            {comboItem.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-muted/20 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowComboModal(false)}
                className="flex-1 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addToCartWithCombo}
                className="flex-1 py-3 bg-accent text-primary-foreground rounded-lg hover:shadow-lg transition-all"
                style={{ fontWeight: 600 }}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Add Combo ({comboSelections.length})
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
