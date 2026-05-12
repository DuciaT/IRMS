import { motion } from "framer-motion";
import { useState, useEffect, type ReactNode } from "react";
import { Bell, LogOut, Menu, ChevronLeft, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthService } from "../../features/auth/hooks/useAuthService";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  menuItems: MenuItem[];
  currentPage: string;
  onPageChange: (page: string) => void;
  children: ReactNode;
  portalName: string;
}

export default function DashboardLayout({
  title,
  subtitle,
  menuItems,
  currentPage,
  onPageChange,
  children,
  portalName,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser, logout } = useAuthService();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // 1024px là breakpoint 'lg'
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    // Chạy ngay lần đầu để kiểm tra trạng thái
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePageChange = (page: string) => {
    onPageChange(page);
    // Update URL without reloading
    navigate(`/${currentUser?.role}/${page}`, { replace: true });
  };

  return (
    <div className="size-full flex bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:relative w-72 h-screen bg-card border-r border-border z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                }}
              >
                IRMS
              </h1>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.75rem" }}
              >
                {portalName}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white"
              style={{ fontWeight: 600 }}
            >
              {currentUser?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p
                style={{ fontSize: "0.875rem", fontWeight: 600 }}
                className="truncate"
              >
                {currentUser?.name}
              </p>
              <p
                className="text-muted-foreground truncate"
                style={{ fontSize: "0.75rem" }}
              >
                {currentUser?.role.toUpperCase()}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              Logout
            </span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        {/* <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0 bg-card border-b border-border px-4 lg:px-8 py-4 lg:py-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors lg:hidden"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>

              <div>
                <h1
                  className="hidden lg:block"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                  }}
                >
                  {title} Page
                </h1>
                <h1
                  className="lg:hidden"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                  }}
                >
                  {title} Page
                </h1>
                {subtitle && (
                  <p
                    className="text-muted-foreground hidden lg:block"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </motion.button>
          </div>
        </motion.header> */}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1800px] mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Decorative Gradients */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
