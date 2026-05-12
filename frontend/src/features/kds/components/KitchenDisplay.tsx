import { ChefHat } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { OrderStatus } from "../../../features/kds/types/types";
import { OrderCard } from "../components/OrderCard/OrderCard";
import { ConfirmModal } from "../../../components/forms/kds/ConfirmModal";
import { useKitchenOrders } from "../hooks/useKitchenOrders";
import { KitchenHeader } from "./KitchenHeader/KitchenHeader";

const STATIONS = ["All", "Grill", "Pasta", "Seafood", "Dessert", "Beverage"];

//Thành phần điều phối (Orchestrator) kết nối Hook với các UI components.
export default function KitchenDisplay() {
  const {
    filteredOrders,
    activeOrders,
    selectedStation,
    setSelectedStation,
    currentTime,
    isReadOnly,
    currentUser,
    acceptOrder,
    updateOrderItemStatus,
    getTableNumber,
    getElapsedTime,
    isNearDeadline,
    isOverdue,
  } = useKitchenOrders();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToAccept, setOrderToAccept] = useState<string | null>(null);

  const updateItemStatus = (
    orderId: string,
    itemId: string,
    newStatus: OrderStatus,
  ) => {
    if (isReadOnly) {
      toast.error("You only have permission to view the kitchen display.");
      return;
    }
    updateOrderItemStatus(orderId, itemId, newStatus);
    if (newStatus === "cooking") toast.success("Started cooking!");
    else if (newStatus === "ready") toast.success("Dish is ready to serve!");
    else if (newStatus === "cancelled") toast.error("Order item cancelled");
  };

  // const handleDeleteOrder = (orderId: string) => {
  //   if (window.confirm("Are you sure you want to delete this order?")) {
  //     if (deleteOrder) {
  //       deleteOrder(orderId);
  //       toast.success("Order deleted successfully");
  //     } else {
  //       toast.error("Delete function not implemented in store");
  //     }
  //   }
  // };

  const openAcceptModal = (orderId: string) => {
    setOrderToAccept(orderId);
    setIsModalOpen(true);
  };

  const confirmAccept = () => {
    if (orderToAccept && acceptOrder) {
      acceptOrder(orderToAccept);
      toast.success("Order accepted successfully");
    } else if (!acceptOrder) {
      toast.error("Accept function not implemented in store");
    }
    setOrderToAccept(null);
  };

  return (
    <div className="size-full bg-background flex flex-col">
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAccept}
      />
      <KitchenHeader
        isReadOnly={isReadOnly}
        currentTime={currentTime}
        activeCount={activeOrders.length}
        selectedStation={selectedStation}
        onStationChange={setSelectedStation}
        stations={STATIONS}
      />
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
            {filteredOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                index={index}
                getTableNumber={getTableNumber}
                getElapsedTime={getElapsedTime}
                isNearDeadline={isNearDeadline}
                isOverdue={isOverdue}
                currentUser={currentUser}
                isReadOnly={isReadOnly}
                onUpdateStatus={updateItemStatus}
                onAccept={openAcceptModal}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
