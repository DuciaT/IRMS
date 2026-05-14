import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type User } from "../types/types";
import { useUserStore } from "../../../store/useUserStore";

export const useUserManagement = (initialUsers: User[]) => {
  const {
    users,
    addVirtualUser,
    updateVirtualUser,
    setInitialUsers,
    deleteVirtualUser,
    toggleUserStatus,
  } = useUserStore();
  useEffect(() => {
    setInitialUsers(initialUsers);
  }, [initialUsers, setInitialUsers]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "server" as User["role"],
    location: "",
  });

  // Logic Tìm kiếm & Phân trang
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const emptyRows = itemsPerPage - paginatedUsers.length;

  const resetForm = () =>
    setUserForm({
      name: "",
      email: "",
      phone: "",
      role: "server",
      location: "",
    });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      ...userForm,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
    };
    addVirtualUser(userForm.email, {
      password: userForm.password,
      user: newUser,
    });
    setCurrentPage(1);
    toast.success(`User ${newUser.name} added successfully!`);
    setShowUserModal(false);
    resetForm();
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateVirtualUser(editingUser.email, {
        password: userForm.password || undefined,
        user: {
          name: userForm.name,
          role: userForm.role,
          phone: userForm.phone,
          location: userForm.location,
        },
      });
      toast.success(`User ${userForm.name} updated successfully!`);
      setShowUserModal(false);
      setEditingUser(null);
      resetForm();
    }
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId);
    deleteVirtualUser(userId);

    const remainingCount = users.length - 1;
    const newTotalPages = Math.ceil(remainingCount / itemsPerPage) || 1;
    if (currentPage > newTotalPages) setCurrentPage(newTotalPages);

    toast.success(`User ${userToDelete?.name} deleted successfully!`);
  };

  const handleToggleStatus = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    toggleUserStatus(userId);

    const newStatusLabel = user?.status === "active" ? "locked" : "unlocked";
    toast.success(`User ${user?.name} has been ${newStatusLabel}`);
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

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
    resetForm();
  };

  return {
    users,
    filteredUsers,
    paginatedUsers,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    itemsPerPage,
    emptyRows,
    showUserModal,
    editingUser,
    userForm,
    setUserForm,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleToggleStatus,
    openAddModal,
    openEditModal,
    closeUserModal,
  };
};
