import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  ShoppingBag,
  UtensilsCrossed,
  Receipt,
  Book,
  SquareMenu,
} from "lucide-react";
import RecentOrders from "../features/ordering/components/RecentOrders";
import KitchenDisplay from "../features/kds/components/KitchenDisplay";
import DigitalOrdering from "../features/ordering/components/DigitalOrdering";
import EnhancedBilling from "../features/billing/components/EnhancedBilling";
import MenuManagement from "../features/ordering/components/MenuManagement";
import DashboardLayout from "../common/layouts/DashboardLayout";

type PageView =
  | "dashboard"
  | "orders"
  | "kitchen"
  | "tables"
  | "billing"
  | "inventory"
  | "analytics"
  | "menu"
  | "list";

export default function ManagerDashboard() {
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
    { id: "orders", label: "Digital Ordering", icon: ShoppingBag },
    { id: "kitchen", label: "Kitchen Display", icon: UtensilsCrossed },
    { id: "billing", label: "Billing & Payments", icon: Receipt },
    { id: "menu", label: "Menu Management", icon: SquareMenu },
    // { id: 'list', label: 'Orders History', icon: Book }
  ];

  const renderContent = () => {
    switch (currentPage) {
      case "orders":
        return <DigitalOrdering />;
      case "kitchen":
        return <KitchenDisplay />;
      case "billing":
        return <EnhancedBilling />;
      case "menu":
        return <MenuManagement />;
      // case 'list':
      //   return <RecentOrders />;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    const page = menuItems.find((item) => item.id === currentPage);
    return page?.label || "Dashboard";
  };

  return (
    <DashboardLayout
      title={getPageTitle()}
      subtitle="Comprehensive restaurant management and analytics"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      portalName="Manager Portal"
    >
      {renderContent()}
    </DashboardLayout>
  );
}
