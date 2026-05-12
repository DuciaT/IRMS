import { motion } from "framer-motion";
import type { UserTableProps } from "./UserTable";
import { Plus, Search } from "lucide-react";

//Quản lý ô nhập dữ liệu tìm kiếm và nút thêm người dùng.
export const TableSearchBar = ({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  onOpenAddModal,
}: Pick<
  UserTableProps,
  "searchTerm" | "setSearchTerm" | "setCurrentPage" | "onOpenAddModal"
>) => (
  <div className="bg-primary/10 p-6 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <h2
        className="text-2xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        User Management
      </h2>
      <p className="text-muted-foreground text-sm mt-1">
        Manage system users and their roles
      </p>
    </div>
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenAddModal}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
      >
        <Plus className="w-5 h-5" /> Add User
      </motion.button>
    </div>
  </div>
);
