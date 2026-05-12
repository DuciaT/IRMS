import { useState } from "react";
import { toast } from "sonner";
import { type User } from "../types/types";

export const useUserManagement = (initialUsers: User[]) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
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
        users.map((u) => (u.id === editingUser.id ? { ...u, ...userForm } : u)),
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

    // Tính toán lại trang hiện tại sau khi xóa
    const remainingFiltered = updatedUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const newTotalPages =
      Math.ceil(remainingFiltered.length / itemsPerPage) || 1;
    if (currentPage > newTotalPages) setCurrentPage(newTotalPages);

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
