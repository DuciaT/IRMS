import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {UtensilsCrossed, Package} from "lucide-react";
import KitchenDisplay from "../features/kds/components/KitchenDisplay";
import DashboardLayout from "../common/layouts/DashboardLayout";

type PageView = 'kitchen' | 'inventory';

export default function ChefDashboard() {
  const { page } = useParams();
  const [currentPage, setCurrentPage] = useState<PageView>((page as PageView) || 'kitchen');

  // Sync currentPage with URL param
  useEffect(() => {
    if (page && page !== currentPage) {
      setCurrentPage(page as PageView);
    }
  }, [page]);

  const menuItems = [
    { id: 'kitchen', label: 'Kitchen Orders', icon: UtensilsCrossed },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'kitchen':
        return <KitchenDisplay />;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    const page = menuItems.find(item => item.id === currentPage);
    return page?.label || 'Kitchen Orders';
  };

  return (
    <DashboardLayout
      title={getPageTitle()}
      subtitle="Manage kitchen operations and monitor inventory"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      portalName="Kitchen Portal"
    >
      {renderContent()}
    </DashboardLayout>
  );
}