import { useState, useEffect, useMemo } from "react";
import { useStore } from "../../../store/useStore";
import type { OrderType } from "../types/types";

//Logic nghiệp vụ (Business Logic), truy xuất dữ liệu từ store, xử lý bộ lọc trạm và tính toán thời gian.
export const useKitchenOrders = () => {
  const orders = useStore((state) => state.orders) as OrderType[];
  const tables = useStore((state) => state.tables);
  const currentUser = useStore((state) => state.currentUser);
  const updateOrderItemStatus = useStore(
    (state) => state.updateOrderItemStatus,
  );
  const acceptOrder = (useStore.getState() as any).acceptOrder;

  const [selectedStation, setSelectedStation] = useState("All");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isReadOnly =
    currentUser?.role === "manager" || currentUser?.role === "server";

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

  const isNearDeadline = (createdAt: Date) => {
    const elapsed = Math.floor(
      (currentTime.getTime() - new Date(createdAt).getTime()) / 60000,
    );
    return elapsed >= 20 * 0.8 && elapsed < 20;
  };

  const isOverdue = (createdAt: Date) => {
    const elapsed = Math.floor(
      (currentTime.getTime() - new Date(createdAt).getTime()) / 60000,
    );
    return elapsed >= 20;
  };

  const activeOrders = useMemo(
    () =>
      orders.filter((o) =>
        ["confirmed", "preparing", "ready"].includes(o.status),
      ),
    [orders],
  );

  const filteredOrders = useMemo(() => {
    if (selectedStation === "All") return activeOrders;
    return activeOrders.filter((order) =>
      order.items.some((item) => {
        const itemName = item.menuItemName.toLowerCase();
        const stationMap: Record<string, string[]> = {
          Grill: ["beef", "steak", "duck"],
          Pasta: ["risotto", "pasta"],
          Seafood: ["sea bass", "lobster", "fish"],
          Dessert: ["soufflé", "dessert", "chocolate"],
          Beverage: [
            "wine",
            "coffee",
            "tea",
            "juice",
            "water",
            "beer",
            "latte",
            "cappuccino",
            "espresso",
            "lemonade",
          ],
        };
        return (
          stationMap[selectedStation]?.some((keyword) =>
            itemName.includes(keyword),
          ) ?? false
        );
      }),
    );
  }, [activeOrders, selectedStation]);

  return {
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
  };
};
