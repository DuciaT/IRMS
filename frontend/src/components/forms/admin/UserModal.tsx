import { motion } from "framer-motion";
import { type User } from "../../../features/admin/types/types";
import { ModalHeader } from "./UserModal/ModalHeader";
import { ModalActions } from "./UserModal/ModalActions";
import { FormField } from "../../ui/FormInput";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface UserModalProps {
  editingUser: User | null;
  userForm: any;
  setUserForm: (form: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

//Thành phần điều phối (Orchestrator)
export const UserModal = ({
  editingUser,
  userForm,
  setUserForm,
  onClose,
  onSubmit,
}: UserModalProps) => {
  const isEditing = !!editingUser;
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border overflow-hidden flex flex-col max-h-[90vh]"
      >
        <ModalHeader isEditing={isEditing} />

        <form
          onSubmit={onSubmit}
          className="p-6 space-y-4 overflow-y-auto custom-scrollbar"
        >
          <FormField label="Full Name *">
            <input
              type="text"
              required
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
              placeholder="John Doe"
            />
          </FormField>
          <FormField label="Email *">
            <input
              type="email"
              required
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
              placeholder="john@gmail.com"
            />
          </FormField>
          <FormField
            label={isEditing ? "New Password (Optional)" : "Password *"}
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required={!isEditing}
                value={userForm.password || ""}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
                placeholder={
                  isEditing ? "Leave blank to keep old password" : "••••••••"
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none pr-10" // pr-10 để không đè lên icon
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {isEditing && (
              <p className="text-[10px] text-muted-foreground mt-1 px-1">
                Only enter a value if you want to reset their password.
              </p>
            )}
          </FormField>
          <FormField label="Phone *">
            <input
              type="tel"
              required
              value={userForm.phone}
              onChange={(e) =>
                setUserForm({ ...userForm, phone: e.target.value })
              }
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
              placeholder="+1 555-0100"
            />
          </FormField>
          <FormField label="Role *">
            <select
              required
              value={userForm.role}
              onChange={(e) =>
                setUserForm({
                  ...userForm,
                  role: e.target.value as User["role"],
                })
              }
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
            >
              <option value="manager">Manager</option>
              <option value="server">Server</option>
              <option value="chef">Chef</option>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </FormField>
          <FormField label="Location *">
            <input
              type="text"
              required
              value={userForm.location}
              onChange={(e) =>
                setUserForm({ ...userForm, location: e.target.value })
              }
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
              placeholder="New York"
            />
          </FormField>
          <ModalActions isEditing={isEditing} onClose={onClose} />
        </form>
      </motion.div>
    </div>
  );
};
