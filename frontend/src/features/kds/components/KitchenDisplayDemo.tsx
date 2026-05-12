import { motion } from "framer-motion";
import {
  Clock,
  ChefHat,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  Check,
  Ban,
  Eye,
  Trash2, // Thêm icon thùng rác cho chức năng xóa
} from "lucide-react";
import { useStore } from "../../../store/useStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const stations = ["All", "Grill", "Pasta", "Seafood", "Dessert", "Beverage"];

const statusColors = {
  new: "bg-blue-500",
  cooking: "bg-orange-500",
  ready: "bg-green-500",
  served: "bg-gray-500",
  cancelled: "bg-red-500",
};

const statusLabels = {
  new: "New",
  cooking: "Cooking",
  ready: "Ready to Serve",
  served: "Served",
  cancelled: "Cancelled",
};

export default function KitchenDisplay() {
  const orders = useStore((state) => state.orders);
  const tables = useStore((state) => state.tables);
  const currentUser = useStore((state) => state.currentUser);
  const updateOrderItemStatus = useStore(
    (state) => state.updateOrderItemStatus,
  );
  // Giả định store có hàm deleteOrder hoặc bạn có thể thay thế bằng logic update trạng thái order
  const deleteOrder = (useStore.getState() as any).deleteOrder;

  const [selectedStation, setSelectedStation] = useState("All");
  const [currentTime, setCurrentTime] = useState(new Date());

  const isReadOnly =
    currentUser?.role === "manager" || currentUser?.role === "server";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedTime = (createdAt: Date) => {
    const diff = Math.floor(
      (currentTime.getTime() - new Date(createdAt).getTime()) / 60000,
    );
    return `${diff}m`;
  };

  const getTableNumber = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    return table ? `T${table.number}` : tableId;
  };

  const updateItemStatus = (
    orderId: string,
    itemId: string,
    newStatus: "new" | "cooking" | "ready" | "served" | "cancelled",
  ) => {
    if (isReadOnly) {
      toast.error("You only have permission to view the kitchen display.");
      return;
    }

    updateOrderItemStatus(orderId, itemId, newStatus);

    if (newStatus === "cooking") {
      toast.success("Started cooking!");
    } else if (newStatus === "ready") {
      toast.success("Dish is ready to serve!");
    } else if (newStatus === "cancelled") {
      toast.error("Order item cancelled");
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      if (deleteOrder) {
        deleteOrder(orderId);
        toast.success("Order deleted successfully");
      } else {
        toast.error("Delete function not implemented in store");
      }
    }
  };

  const activeOrders = orders.filter(
    (order) =>
      order.status === "confirmed" ||
      order.status === "preparing" ||
      order.status === "ready",
  );

  const filteredOrders =
    selectedStation === "All"
      ? activeOrders
      : activeOrders.filter((order) =>
          order.items.some((item) => {
            const itemName = item.menuItemName.toLowerCase();
            if (selectedStation === "Grill")
              return (
                itemName.includes("beef") ||
                itemName.includes("steak") ||
                itemName.includes("duck")
              );
            if (selectedStation === "Pasta")
              return itemName.includes("risotto") || itemName.includes("pasta");
            if (selectedStation === "Seafood")
              return (
                itemName.includes("sea bass") ||
                itemName.includes("lobster") ||
                itemName.includes("fish")
              );
            if (selectedStation === "Dessert")
              return (
                itemName.includes("soufflé") ||
                itemName.includes("dessert") ||
                itemName.includes("chocolate")
              );
            if (selectedStation === "Beverage")
              return (
                itemName.includes("wine") ||
                itemName.includes("coffee") ||
                itemName.includes("tea") ||
                itemName.includes("juice") ||
                itemName.includes("water") ||
                itemName.includes("beer") ||
                itemName.includes("latte") ||
                itemName.includes("cappuccino") ||
                itemName.includes("espresso") ||
                itemName.includes("lemonade")
              );
            return false;
          }),
        );

  const isNearDeadline = (createdAt: Date) => {
    const elapsed = Math.floor(
      (currentTime.getTime() - new Date(createdAt).getTime()) / 60000,
    );
    const estimatedTime = 20;
    return elapsed >= estimatedTime * 0.8 && elapsed < estimatedTime;
  };

  const isOverdue = (createdAt: Date) => {
    const elapsed = Math.floor(
      (currentTime.getTime() - new Date(createdAt).getTime()) / 60000,
    );
    const estimatedTime = 20;
    return elapsed >= estimatedTime;
  };

  return (
    <div className="size-full bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground p-6 border-b-4 border-accent"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ChefHat className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: 700,
                  }}
                >
                  Kitchen Display System
                </h1>
                {isReadOnly && (
                  <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <Eye className="w-3 h-3" /> View Only
                  </span>
                )}
              </div>
              <p className="opacity-90">
                Real-time order tracking & coordination
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p style={{ fontSize: "2rem", fontWeight: 700 }}>
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="opacity-90" style={{ fontSize: "0.875rem" }}>
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p style={{ fontSize: "0.75rem" }} className="opacity-80">
                ACTIVE ORDERS
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {activeOrders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {stations.map((station) => (
            <motion.button
              key={station}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStation(station)}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedStation === station
                  ? "bg-accent text-accent-foreground shadow-lg"
                  : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
              }`}
              style={{ fontWeight: 600 }}
            >
              {station}
            </motion.button>
          ))}
        </div>
      </motion.header>

      {/* Orders Grid */}
      <main className="flex-1 overflow-y-auto p-6">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ChefHat className="w-24 h-24 opacity-20 mb-4" />
            <p style={{ fontSize: "1.25rem", fontWeight: 600 }}>
              No active orders
            </p>
            <p style={{ fontSize: "0.875rem" }}>
              Orders will appear here when confirmed
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrders.map((order, index) => {
              const nearDeadline = isNearDeadline(order.createdAt);
              const overdue = isOverdue(order.createdAt);
              const priority = order.priority || "normal";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative bg-card rounded-xl border-2 ${
                    overdue
                      ? "border-red-500 shadow-lg shadow-red-500/20"
                      : nearDeadline
                        ? "border-orange-400 shadow-lg shadow-orange-400/20"
                        : priority === "urgent"
                          ? "border-red-400 shadow-lg shadow-red-400/20"
                          : priority === "high"
                            ? "border-orange-300 shadow-lg shadow-orange-300/20"
                            : "border-border"
                  } shadow-lg overflow-hidden`}
                >
                  {/* Delete Button for Server only */}
                  {currentUser?.role === "server" && (
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Order Header */}
                  <div
                    className={`p-4 ${overdue ? "bg-red-100" : nearDeadline ? "bg-orange-100" : "bg-gradient-to-r from-primary/10 to-accent/10"} border-b border-border`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.25rem",
                            fontWeight: 700,
                          }}
                        >
                          {getTableNumber(order.tableId)}
                        </span>
                        {overdue && (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                        {nearDeadline && !overdue && (
                          <Clock className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 pr-8">
                        {" "}
                        {/* Padding-right to avoid overlap with delete button */}
                        <Clock className="w-4 h-4" />
                        <span style={{ fontWeight: 700 }}>
                          {getElapsedTime(order.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Order #{order.id}
                      </p>
                      {priority === "urgent" && !overdue && (
                        <span
                          className="px-2 py-0.5 bg-red-500 text-white rounded"
                          style={{ fontSize: "0.625rem", fontWeight: 700 }}
                        >
                          URGENT
                        </span>
                      )}
                      {priority === "high" && !overdue && !nearDeadline && (
                        <span
                          className="px-2 py-0.5 bg-orange-500 text-white rounded"
                          style={{ fontSize: "0.625rem", fontWeight: 700 }}
                        >
                          HIGH
                        </span>
                      )}
                    </div>
                    {overdue && (
                      <div
                        className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-center"
                        style={{ fontSize: "0.75rem", fontWeight: 700 }}
                      >
                        ⚠️ OVERDUE - URGENT!
                      </div>
                    )}
                    {nearDeadline && !overdue && (
                      <div
                        className="mt-2 px-2 py-1 bg-orange-500 text-white rounded text-center"
                        style={{ fontSize: "0.75rem", fontWeight: 700 }}
                      >
                        ⏰ NEAR DEADLINE
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-muted/30 rounded-lg p-3 border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: "0.9375rem",
                                }}
                              >
                                {item.quantity}x {item.menuItemName}
                              </span>
                            </div>
                            {item.notes && (
                              <p
                                className="text-muted-foreground"
                                style={{ fontSize: "0.75rem" }}
                              >
                                📝 {item.notes}
                              </p>
                            )}
                          </div>
                          <div
                            className={`px-2 py-1 ${statusColors[item.status]} text-white rounded`}
                            style={{ fontSize: "0.625rem", fontWeight: 700 }}
                          >
                            {statusLabels[item.status]}
                          </div>
                        </div>

                        {!isReadOnly && (
                          <div className="flex gap-2 mt-3">
                            {item.status === "new" && (
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  updateItemStatus(order.id, item.id, "cooking")
                                }
                                className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-1"
                                style={{ fontWeight: 600, fontSize: "0.75rem" }}
                              >
                                <Play className="w-3 h-3" /> Start
                              </motion.button>
                            )}
                            {item.status === "cooking" && (
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  updateItemStatus(order.id, item.id, "ready")
                                }
                                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-1"
                                style={{ fontWeight: 600, fontSize: "0.75rem" }}
                              >
                                <Check className="w-3 h-3" /> Ready
                              </motion.button>
                            )}
                            {(item.status === "new" ||
                              item.status === "cooking") && (
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  updateItemStatus(
                                    order.id,
                                    item.id,
                                    "cancelled",
                                  )
                                }
                                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-1"
                                style={{ fontWeight: 600, fontSize: "0.75rem" }}
                              >
                                <Ban className="w-3 h-3" /> Cancel
                              </motion.button>
                            )}
                            {item.status === "ready" && (
                              <div
                                className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg flex items-center justify-center gap-1"
                                style={{ fontWeight: 600, fontSize: "0.75rem" }}
                              >
                                <CheckCircle2 className="w-3 h-3" /> Ready for
                                Service
                              </div>
                            )}
                            {item.status === "cancelled" && (
                              <div
                                className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg flex items-center justify-center gap-1"
                                style={{ fontWeight: 600, fontSize: "0.75rem" }}
                              >
                                <XCircle className="w-3 h-3" /> Cancelled
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
