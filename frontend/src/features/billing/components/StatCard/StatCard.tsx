import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hoverColor: string;
  iconBg: string;
  iconColor: string;
}

export const StatCard = ({
  label,
  value,
  icon: Icon,
  hoverColor,
  iconBg,
  iconColor,
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className={`bg-card rounded-xl p-6 border border-border hover:border-transparent shadow-sm hover:shadow-xl ${hoverColor} cursor-default`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          {label}
        </p>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 700,
          }}
          className="mt-1"
        >
          {value}
        </p>
      </div>
      <div
        className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </motion.div>
);
