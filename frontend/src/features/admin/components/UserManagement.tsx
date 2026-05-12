import { type User } from "../types/types";
import { UserStats } from "./UserStats/UserStats";
import { UserTable } from "./UserTable/UserTable";
import { UserModal } from "../../../components/forms/admin/UserModal";
import { useUserManagement } from "../hooks/useUserManagement";

const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "John Manager",
    email: "manager@irms.com",
    phone: "+1 555-0101",
    role: "manager",
    status: "active",
    location: "New York",
    joinedDate: "2024-01-15",
  },
  {
    id: "USR-002",
    name: "Sarah Server",
    email: "server@irms.com",
    phone: "+1 555-0102",
    role: "server",
    status: "active",
    location: "New York",
    joinedDate: "2024-02-10",
  },
  {
    id: "USR-003",
    name: "Mike Chef",
    email: "chef@irms.com",
    phone: "+1 555-0103",
    role: "chef",
    status: "active",
    location: "New York",
    joinedDate: "2024-01-20",
  },
  {
    id: "USR-004",
    name: "Lisa Cashier",
    email: "cashier@irms.com",
    phone: "+1 555-0104",
    role: "cashier",
    status: "active",
    location: "London",
    joinedDate: "2024-03-05",
  },
  {
    id: "USR-005",
    name: "Tom Host",
    email: "host@irms.com",
    phone: "+1 555-0105",
    role: "server",
    status: "active",
    location: "Tokyo",
    joinedDate: "2024-02-28",
  },
  {
    id: "USR-006",
    name: "Admin User",
    email: "admin@irms.com",
    phone: "+1 555-0100",
    role: "admin",
    status: "active",
    location: "Global",
    joinedDate: "2024-01-01",
  },
];

export default function UserManagement() {
  const {
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
  } = useUserManagement(mockUsers);
  return (
    <div className="space-y-6">
      {/* Component thống kê */}
      <UserStats users={users} />

      {/* Component hiển thị bảng dữ liệu */}
      <UserTable
        filteredUsers={filteredUsers}
        paginatedUsers={paginatedUsers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        emptyRows={emptyRows}
        onOpenAddModal={openAddModal}
        onOpenEditModal={openEditModal}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteUser}
      />
      {showUserModal && (
        <UserModal
          editingUser={editingUser}
          userForm={userForm}
          setUserForm={setUserForm}
          onClose={closeUserModal}
          onSubmit={editingUser ? handleEditUser : handleAddUser}
        />
      )}
    </div>
  );
}
