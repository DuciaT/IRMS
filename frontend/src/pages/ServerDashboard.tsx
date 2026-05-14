import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShoppingBag, Table2, Receipt, UtensilsCrossed } from "lucide-react";
import DigitalOrdering from "../features/ordering/components/DigitalOrdering";
import RecentOrders from "../features/ordering/components/RecentOrders";
import KitchenDisplay from "../features/kds/components/KitchenDisplay";
import DashboardLayout from "../common/layouts/DashboardLayout";

type PageView = "orders" | "kitchen" | "history";

export default function ServerDashboard() {
  const { page } = useParams();
  const [currentPage, setCurrentPage] = useState<PageView>(
    (page as PageView) || "orders",
  );

  // Sync currentPage with URL param
  useEffect(() => {
    if (page && page !== currentPage) {
      setCurrentPage(page as PageView);
    }
  }, [page]);

  const menuItems = [
    { id: "orders", label: "Take Orders", icon: ShoppingBag },
    { id: "kitchen", label: "Kitchen Display", icon: UtensilsCrossed },
    // { id: "history", label: "Order History", icon: Receipt },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case "orders":
        return <DigitalOrdering />;
      case "kitchen":
        return <KitchenDisplay />;
      // case "history":
      //   return <RecentOrders />;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    const page = menuItems.find((item) => item.id === currentPage);
    return page?.label || "Take Orders";
  };

  return (
    <DashboardLayout
      title={getPageTitle()}
      subtitle="Manage customer orders and table assignments"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      portalName="Server Portal"
    >
      {renderContent()}
    </DashboardLayout>
  );
}
