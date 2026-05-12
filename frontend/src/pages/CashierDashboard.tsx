import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Receipt, ShoppingBag } from "lucide-react";
import EnhancedBilling from "../features/billing/components/EnhancedBilling";
import RecentOrders from "../features/ordering/components/RecentOrders";
import DashboardLayout from "../common/layouts/DashboardLayout";

type PageView = 'billing' | 'orders';

export default function CashierDashboard() {
  const { page } = useParams();
  const [currentPage, setCurrentPage] = useState<PageView>((page as PageView) || 'billing');

  // Sync currentPage with URL param
  useEffect(() => {
    if (page && page !== currentPage) {
      setCurrentPage(page as PageView);
    }
  }, [page]);

  const menuItems = [
    { id: 'billing', label: 'Billing & Payments', icon: Receipt },
    { id: 'orders', label: 'View Orders', icon: ShoppingBag },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'billing':
        return <EnhancedBilling />;
      case 'orders':
        return <RecentOrders />;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    const page = menuItems.find(item => item.id === currentPage);
    return page?.label || 'Billing & Payments';
  };

  return (
    <DashboardLayout
      title={getPageTitle()}
      subtitle="Process payments and manage billing"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      portalName="Cashier Portal"
    >
      {renderContent()}
    </DashboardLayout>
  );
}