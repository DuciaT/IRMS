import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Building,
  Lock,
  Unlock,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "manager" | "server" | "chef" | "cashier" | "host" | "admin";
  status: "active" | "inactive";
  location: string;
  joinedDate: string;
}

const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "John Manager",
    email: "manager@gmail.com",
    phone: "+1 555-0101",
    role: "manager",
    status: "active",
    location: "New York",
    joinedDate: "2024-01-15",
  },
  {
    id: "USR-002",
    name: "Sarah Server",
    email: "server@gmail.com",
    phone: "+1 555-0102",
    role: "server",
    status: "active",
    location: "New York",
    joinedDate: "2024-02-10",
  },
  {
    id: "USR-003",
    name: "Mike Chef",
    email: "chef@gmail.com",
    phone: "+1 555-0103",
    role: "chef",
    status: "active",
    location: "New York",
    joinedDate: "2024-01-20",
  },
  {
    id: "USR-004",
    name: "Lisa Cashier",
    email: "cashier@gmail.com",
    phone: "+1 555-0104",
    role: "cashier",
    status: "active",
    location: "London",
    joinedDate: "2024-03-05",
  },
  {
    id: "USR-005",
    name: "Tom Host",
    email: "host@gmail.com",
    phone: "+1 555-0105",
    role: "server",
    status: "active",
    location: "Tokyo",
    joinedDate: "2024-02-28",
  },
  {
    id: "USR-006",
    name: "Admin User",
    email: "admin@gmail.com",
    phone: "+1 555-0100",
    role: "admin",
    status: "active",
    location: "Global",
    joinedDate: "2024-01-01",
  },
];

const roleConfig = {
  manager: {
    color: "bg-purple-100 text-purple-700",
    label: "Manager",
    icon: Shield,
  },
  server: { color: "bg-blue-100 text-blue-700", label: "Server", icon: Users },
  chef: { color: "bg-orange-100 text-orange-700", label: "Chef", icon: Users },
  cashier: {
    color: "bg-green-100 text-green-700",
    label: "Cashier",
    icon: Users,
  },
  // host: { color: 'bg-pink-100 text-pink-700', label: 'Host', icon: Users },
  admin: { color: "bg-red-100 text-red-700", label: "Admin", icon: Shield },
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "server" as User["role"],
    location: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Logic lọc và phân trang
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const emptyRows = itemsPerPage - paginatedUsers.length;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: User = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      role: userForm.role,
      status: "active",
      location: userForm.location,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setUsers([newUser, ...users]);
    setCurrentPage(1);
    toast.success(`User ${newUser.name} added successfully!`);
    setShowUserModal(false);
    resetForm();
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: userForm.name,
                email: userForm.email,
                phone: userForm.phone,
                role: userForm.role,
                location: userForm.location,
              }
            : u,
        ),
      );

      toast.success(`User ${userForm.name} updated successfully!`);
      setShowUserModal(false);
      setEditingUser(null);
      resetForm();
    }
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId);
    const updatedUsers = users.filter((u) => u.id !== userId);

    setUsers(updatedUsers);

    const remainingFiltered = updatedUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const newTotalPages =
      Math.ceil(remainingFiltered.length / itemsPerPage) || 1;

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }

    toast.success(`User ${userToDelete?.name} deleted successfully!`);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "active" ? "inactive" : "active";
          toast.success(
            `User ${user.name} has been ${newStatus === "active" ? "unlocked" : "locked"}`,
          );
          return { ...user, status: newStatus };
        }
        return user;
      }),
    );
  };

  const openAddModal = () => {
    setEditingUser(null);
    resetForm();
    setShowUserModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
    });
    setShowUserModal(true);
  };

  const resetForm = () => {
    setUserForm({
      name: "",
      email: "",
      phone: "",
      role: "server",
      location: "",
    });
  };

  const usersByRole = Object.entries(roleConfig).map(([role, config]) => ({
    role,
    label: config.label,
    count: users.filter((u) => u.role === role).length,
    color: config.color,
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {usersByRole.map((stat) => {
          const Icon = roleConfig[stat.role as keyof typeof roleConfig].icon;
          return (
            <motion.div
              key={stat.role}
              whileHover={{ y: -5, transition: { duration: 0.1 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-card/50 backdrop-blur-md rounded-2xl p-5 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              {/* Background Decoration */}
              <div
                className={`absolute -right-2 -top-2 opacity-10 p-4 rounded-full ${stat.color.split(" ")[0]}`}
              >
                <Icon className="w-12 h-12" />
              </div>

              <div className="relative z-10">
                <div
                  className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-3 shadow-inner`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <p
                  className="text-muted-foreground font-medium uppercase tracking-wider"
                  style={{ fontSize: "0.65rem" }}
                >
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.count}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border/60 shadow-xl shadow-black/5 overflow-hidden"
      >
        <div className="bg-primary/10 p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              User Management
            </h2>
            <p
              className="text-muted-foreground mt-1"
              style={{ fontSize: "0.875rem" }}
            >
              Manage system users and their roles
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full max-w-xs pl-9 pr-4 py-1.5 text-sm bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAddModal}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <Plus className="w-5 h-5" />
              Add User
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  User ID
                </th>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Name
                </th>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Contact
                </th>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Role
                </th>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Location
                </th>
                <th
                  className="text-left p-4 w-32"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Status
                </th>
                <th
                  className="text-left p-4 w-28"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="relative">
              <AnimatePresence mode="popLayout">
                {paginatedUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group border-b border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <td
                      className="p-4"
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      {user.id}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white"
                          style={{ fontSize: "0.875rem", fontWeight: 600 }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span style={{ fontSize: "0.75rem" }}>
                            {user.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span style={{ fontSize: "0.75rem" }}>
                            {user.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full ${roleConfig[user.role].color}`}
                        style={{ fontSize: "0.75rem", fontWeight: 600 }}
                      >
                        {roleConfig[user.role].label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span style={{ fontSize: "0.875rem" }}>
                          {user.location}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        style={{ fontSize: "0.75rem", fontWeight: 600 }}
                      >
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditModal(user)}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === "active"
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          }`}
                          title={
                            user.status === "active"
                              ? "Lock User"
                              : "Unlock User"
                          }
                        >
                          {user.status === "active" ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredUsers.length === 0 && (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={7} className="p-0 border-none">
                      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
                        <div className="bg-muted/10 p-6 rounded-full mb-4">
                          <Search className="w-10 h-10 text-muted-foreground/40" />
                        </div>
                        <p className="text-xl font-semibold text-muted-foreground">
                          No users found
                        </p>
                        <p className="text-sm text-muted-foreground/60 pt-1">
                          Try adjusting your search or filters to find what
                          you're looking for.
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
                {filteredUsers.length > 0 &&
                  emptyRows > 0 &&
                  [...Array(emptyRows)].map((_, index) => (
                    <tr
                      key={`empty-${index}`}
                      className="border-b border-border/40 h-[72px]"
                    >
                      <td colSpan={7} className="p-4">
                        &nbsp;
                      </td>
                    </tr>
                  ))}
              </AnimatePresence>
            </tbody>
          </table>
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredUsers.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium text-foreground">
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredUsers.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 rounded-lg hover:bg-card disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-card text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 rounded-lg hover:bg-card disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border overflow-hidden"
          >
            <div className="bg-linear-to-r from-primary to-primary/80 p-6">
              <h2
                className="text-primary-foreground"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                }}
              >
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <p
                className="text-primary-foreground/80 mt-1"
                style={{ fontSize: "0.875rem" }}
              >
                {editingUser
                  ? "Update user information"
                  : "Create a new system user"}
              </p>
            </div>

            <form
              onSubmit={editingUser ? handleEditUser : handleAddUser}
              className="p-6 space-y-4"
            >
              <div>
                <label
                  className="block mb-2"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Full Name *
                </label>
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
              </div>

              <div>
                <label
                  className="block mb-2"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Email *
                </label>
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
              </div>

              <div>
                <label
                  className="block mb-2"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Phone *
                </label>
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
              </div>

              <div>
                <label
                  className="block mb-2"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Role *
                </label>
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
                  {/* <option value="host">Host</option> */}
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Location *
                </label>
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
              </div>

              <div className="flex gap-2 pt-4">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="flex-1 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow"
                  style={{ fontWeight: 600 }}
                >
                  {editingUser ? "Update User" : "Create User"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
