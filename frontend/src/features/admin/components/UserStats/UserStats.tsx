import { motion } from "framer-motion";
import { type User, roleConfig } from "../../types/types";

interface UserStatsProps {
  users: User[];
}

//getStatsByRole: Chỉ lo việc xử lý dữ liệu
const getStatsByRole = (users: User[]) => {
  return Object.entries(roleConfig).map(([role, config]) => ({
    role,
    label: config.label,
    count: users.filter((u) => u.role === role).length,
    color: config.color,
    Icon: config.icon,
  }));
};

//StatCard: Chỉ lo việc hiển thị một ô thống kê.
const StatCard = ({ stat, index }: { stat: any; index: number }) => {
  const { Icon, label, count, color, role } = stat;

  return (
    <motion.div
      key={role}
      whileHover={{ y: -5, transition: { duration: 0.1 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="relative overflow-hidden bg-card/50 backdrop-blur-md rounded-2xl p-5 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div
        className={`absolute -right-2 -top-2 opacity-10 p-4 rounded-full ${color.split(" ")[0]}`}
      >
        <Icon className="w-12 h-12" />
      </div>
      <div className="relative z-10">
        <div
          className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-3 shadow-inner`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <p
          className="text-muted-foreground font-medium uppercase tracking-wider"
          style={{ fontSize: "0.65rem" }}
        >
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-bold tracking-tight">{count}</p>
        </div>
      </div>
    </motion.div>
  );
};

//UserStats: Chỉ đóng vai trò layout (grid) và điều phối dữ liệu.
export const UserStats = ({ users }: UserStatsProps) => {
  const usersByRole = getStatsByRole(users);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {usersByRole.map((stat, index) => (
        <StatCard key={stat.role} stat={stat} index={index} />
      ))}
    </div>
  );
};
