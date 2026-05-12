import { motion } from "framer-motion";
import { type User } from "../../../features/admin/types/types";
import { ModalHeader } from "./UserModal/ModalHeader";
import { ModalActions } from "./UserModal/ModalActions";
import { FormField } from "../../ui/FormInput";

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
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border overflow-hidden"
      >
        <ModalHeader isEditing={isEditing} />

        <form onSubmit={onSubmit} className="p-6 space-y-4">
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
              placeholder="john@irms.com"
            />
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
