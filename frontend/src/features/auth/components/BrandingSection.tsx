import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

//Hiển thị thông tin thương hiệu và giới thiệu hệ thống bên trái.
export const BrandingSection = () => (
  <div className="bg-linear-to-br from-primary via-primary/80 to-accent p-12 flex flex-col justify-center text-primary-foreground">
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
          <UtensilsCrossed className="w-10 h-10 text-white" />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "3rem",
            fontWeight: 700,
          }}
        >
          IRMS
        </h1>
      </div>
      <h2 className="mb-4" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
        Integrated Restaurant Management System
      </h2>
      <p
        className="opacity-90 mb-8"
        style={{ fontSize: "0.875rem", lineHeight: 1.7 }}
      >
        Complete solution for digital ordering, kitchen coordination, table
        management, billing, inventory, and analytics - all in one unified
        platform.
      </p>
    </motion.div>
  </div>
);
