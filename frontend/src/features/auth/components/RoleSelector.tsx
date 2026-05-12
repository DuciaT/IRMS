import { motion } from "framer-motion";
import type { UserRole } from "../types/index";
import { ROLES_CONFIG } from "../../../features/auth/constants/roles";

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
}

export const RoleSelector = ({ selectedRole, onSelect }: RoleSelectorProps) => (
  <div>
    <label
      className="block mb-3"
      style={{ fontSize: "0.875rem", fontWeight: 600 }}
    >
      Select Role
    </label>
    <div className="grid grid-cols-2 gap-3">
      {ROLES_CONFIG.map((role) => (
        <motion.button
          key={role.value}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(role.value)}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedRole === role.value
              ? "border-accent bg-accent/10"
              : "border-border bg-muted/20 hover:border-accent/50"
          }`}
        >
          <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>{role.label}</p>
        </motion.button>
      ))}
    </div>
  </div>
);
