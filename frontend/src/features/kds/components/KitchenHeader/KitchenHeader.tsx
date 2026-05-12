import { motion } from "framer-motion";
import { ChefHat, Eye } from "lucide-react";

interface HeaderProps {
  isReadOnly: boolean;
  currentTime: Date;
  activeCount: number;
  selectedStation: string;
  onStationChange: (s: string) => void;
  stations: string[];
}

//Hiển thị thông tin tiêu đề, trạng thái hệ thống, đồng hồ và bộ lọc trạm.
export const KitchenHeader = ({
  isReadOnly,
  currentTime,
  activeCount,
  selectedStation,
  onStationChange,
  stations,
}: HeaderProps) => (
  <motion.header
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground p-6 border-b-4 border-accent"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <ChefHat className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              Kitchen Display System
            </h1>
            {isReadOnly && (
              <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <Eye className="w-3 h-3" /> View Only
              </span>
            )}
          </div>
          <p className="opacity-90">Real-time order tracking & coordination</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="opacity-90" style={{ fontSize: "0.875rem" }}>
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
          <p style={{ fontSize: "0.75rem" }} className="opacity-80">
            ACTIVE ORDERS
          </p>
          <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{activeCount}</p>
        </div>
      </div>
    </div>

    <div className="flex gap-2 mt-6">
      {stations.map((station) => (
        <motion.button
          key={station}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStationChange(station)}
          className={`px-6 py-2 rounded-lg transition-all ${
            selectedStation === station
              ? "bg-accent text-accent-foreground shadow-lg"
              : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
          }`}
          style={{ fontWeight: 600 }}
        >
          {station}
        </motion.button>
      ))}
    </div>
  </motion.header>
);
