// import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { useStore } from "../store/useStore";
import { Users } from "lucide-react";
// import Analytics from "../components/Analytics";
// import InventoryManagement from "../components/InventoryManagement";
import UserManagement from "../features/admin/components/UserManagement";
// import SystemSettings from "../components/SystemSettings";
// import SecurityLogs from "../components/SecurityLogs";
// import MenuManagement from "../components/MenuManagement";
// import PromotionManagement from "../components/PromotionManagement";
import DashboardLayout from "../common/layouts/DashboardLayout";

type PageView =
  | "users"
  | "analytics"
  | "inventory"
  | "settings"
  | "security"
  | "menu"
  | "promotions";

export default function AdminDashboard() {
  const { page } = useParams();
  const [currentPage, setCurrentPage] = useState<PageView>(
    (page as PageView) || "users",
  );

  // Sync currentPage with URL param
  useEffect(() => {
    if (page && page !== currentPage) {
      setCurrentPage(page as PageView);
    }
  }, [page]);

  const menuItems = [{ id: "users", label: "User Management", icon: Users }];

  //   const menuItems = [
  //     { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  //     { id: 'users', label: 'User Management', icon: Users },
  //     { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
  //     { id: 'promotions', label: 'Promotions', icon: Tag },
  //     { id: 'inventory', label: 'Inventory Control', icon: Package },
  //     { id: 'settings', label: 'System Settings', icon: Settings },
  //     { id: 'security', label: 'Security & Logs', icon: Shield },
  //   ];

  const renderContent = () => {
    switch (currentPage) {
      //   case 'analytics':
      //     return <Analytics />;
      case "users":
        return <UserManagement />;
      //   case 'menu':
      //     return <MenuManagement />;
      //   case 'promotions':
      //     return <PromotionManagement />;
      //   case 'inventory':
      //     return <InventoryManagement />;
      //   case 'settings':
      //     return <SystemSettings />;
      //   case 'security':
      //     return <SecurityLogs />;
      //   default:
      //     return <Analytics />;
    }
  };

  const getPageTitle = () => {
    const page = menuItems.find((item) => item.id === currentPage);
    return page?.label || "Analytics & Reports";
  };

  return (
    <DashboardLayout
      title={getPageTitle()}
      subtitle="System administration and configuration"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      portalName="Admin Portal"
    >
      {renderContent()}
    </DashboardLayout>
  );
}
